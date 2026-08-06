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
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("GET contact messages error:", error);

    return NextResponse.json(
      { message: "Unable to load contact messages." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (
      !String(body.name || "").trim() ||
      !String(body.email || "").trim() ||
      !String(body.subject || "").trim() ||
      !String(body.message || "").trim()
    ) {
      return NextResponse.json(
        { message: "Please complete all required fields." },
        { status: 400 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: {
        name: String(body.name).trim(),
        email: String(body.email).trim(),
        phone: body.phone ? String(body.phone).trim() : null,
        subject: String(body.subject).trim(),
        message: String(body.message).trim(),
        status: "New",
      },
    });

    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL || "Website <onboarding@resend.dev>";

    let emailSent = false;

    if (resendKey && contactEmail) {
      try {
        const resend = new Resend(resendKey);

        await resend.emails.send({
          from: fromEmail,
          to: contactEmail,
          replyTo: saved.email,
          subject: `Website Contact: ${saved.subject}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#0f172a">
              <h1 style="color:#0b1b4f">New Website Contact Message</h1>
              <p><strong>Name:</strong> ${escapeHtml(saved.name)}</p>
              <p><strong>Email:</strong> ${escapeHtml(saved.email)}</p>
              <p><strong>Phone:</strong> ${escapeHtml(saved.phone || "Not provided")}</p>
              <p><strong>Subject:</strong> ${escapeHtml(saved.subject)}</p>
              <hr />
              <p style="white-space:pre-wrap">${escapeHtml(saved.message)}</p>
            </div>
          `,
        });

        emailSent = true;
      } catch (emailError) {
        console.error("Contact email error:", emailError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully.",
        emailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST contact message error:", error);

    return NextResponse.json(
      { message: "Unable to send your message." },
      { status: 500 }
    );
  }
}
