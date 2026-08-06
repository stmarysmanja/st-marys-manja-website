import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { isAdminRequest, unauthorizedResponse } from "@/lib/admin-auth";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return unauthorizedResponse();
  }

  try {
    const applications = await prisma.admissionApplication.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("GET admissions error:", error);

    return NextResponse.json(
      { message: "Unable to load admission applications." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const requiredFields = [
      "studentName",
      "gender",
      "applyingClass",
      "parentName",
      "parentPhone",
      "previousSchool",
    ];

    for (const field of requiredFields) {
      if (!String(body[field] ?? "").trim()) {
        return NextResponse.json(
          { message: "Please complete all required fields." },
          { status: 400 }
        );
      }
    }

    const temporaryReference = `TEMP-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

    const application = await prisma.admissionApplication.create({
      data: {
        applicationNumber: temporaryReference,
        studentName: String(body.studentName).trim(),
        gender: String(body.gender).trim(),
        dob: body.dob ? String(body.dob) : null,
        applyingClass: String(body.applyingClass).trim(),
        parentName: String(body.parentName).trim(),
        parentPhone: String(body.parentPhone).trim(),
        parentEmail: body.parentEmail
          ? String(body.parentEmail).trim()
          : null,
        previousSchool: String(body.previousSchool).trim(),
        pleResults: body.pleResults
          ? String(body.pleResults).trim()
          : null,
        status: "New",
      },
    });

    const year = new Date().getFullYear();
    const applicationNumber = `SMM-${year}-${String(application.id).padStart(
      4,
      "0"
    )}`;

    const savedApplication = await prisma.admissionApplication.update({
      where: { id: application.id },
      data: { applicationNumber },
    });

    let emailSent = false;

    const resendKey = process.env.RESEND_API_KEY;
    const admissionsEmail = process.env.ADMISSIONS_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Admissions <onboarding@resend.dev>";

    if (resendKey && admissionsEmail) {
      try {
        const resend = new Resend(resendKey);

        const safe = {
          applicationNumber: escapeHtml(applicationNumber),
          studentName: escapeHtml(savedApplication.studentName),
          gender: escapeHtml(savedApplication.gender),
          dob: escapeHtml(savedApplication.dob || "Not provided"),
          applyingClass: escapeHtml(savedApplication.applyingClass),
          previousSchool: escapeHtml(savedApplication.previousSchool),
          pleResults: escapeHtml(
            savedApplication.pleResults || "Not provided"
          ),
          parentName: escapeHtml(savedApplication.parentName),
          parentPhone: escapeHtml(savedApplication.parentPhone),
          parentEmail: escapeHtml(
            savedApplication.parentEmail || "Not provided"
          ),
        };

        await resend.emails.send({
          from: fromEmail,
          to: admissionsEmail,
          subject: `New Admission Application: ${applicationNumber}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#0f172a">
              <h1 style="color:#0b1b4f">New Admission Application</h1>
              <p><strong>Application number:</strong> ${safe.applicationNumber}</p>
              <hr />
              <h2>Student details</h2>
              <p><strong>Name:</strong> ${safe.studentName}</p>
              <p><strong>Gender:</strong> ${safe.gender}</p>
              <p><strong>Date of birth:</strong> ${safe.dob}</p>
              <p><strong>Class applying for:</strong> ${safe.applyingClass}</p>
              <p><strong>Previous school:</strong> ${safe.previousSchool}</p>
              <p><strong>PLE / UCE results:</strong> ${safe.pleResults}</p>
              <hr />
              <h2>Parent / Guardian</h2>
              <p><strong>Name:</strong> ${safe.parentName}</p>
              <p><strong>Phone:</strong> ${safe.parentPhone}</p>
              <p><strong>Email:</strong> ${safe.parentEmail}</p>
              <p style="margin-top:28px">Open the private admin portal to review this application.</p>
            </div>
          `,
        });

        if (savedApplication.parentEmail) {
          await resend.emails.send({
            from: fromEmail,
            to: savedApplication.parentEmail,
            subject: `Application received: ${applicationNumber}`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#0f172a">
                <h1 style="color:#0b1b4f">Application Received</h1>
                <p>Dear ${escapeHtml(savedApplication.parentName)},</p>
                <p>We have received the application for <strong>${escapeHtml(
                  savedApplication.studentName
                )}</strong>.</p>
                <p>Your application reference is:</p>
                <p style="font-size:22px;font-weight:bold;color:#0b1b4f">${escapeHtml(
                  applicationNumber
                )}</p>
                <p>Please keep this number for future communication with the school.</p>
              </div>
            `,
          });
        }

        emailSent = true;
      } catch (emailError) {
        console.error("Admission email error:", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application submitted successfully.",
        applicationNumber,
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST admissions error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to submit the application.",
      },
      { status: 500 }
    );
  }
}
