"use client";

import { useState, useEffect, FormEvent } from "react";

export default function AdmissionsPage() {
    const [schoolName, setSchoolName] = useState("St. Mary's Secondary School - Manja");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [applicationNumber, setApplicationNumber] = useState("");

    // Application Form State
    const [formData, setFormData] = useState({
        studentName: "",
        gender: "Male",
        dob: "",
        applyingClass: "Senior 1 (O-Level)",
        parentName: "",
        parentPhone: "",
        parentEmail: "",
        previousSchool: "",
        pleResults: "",
    });

    useEffect(() => {
        const savedSettings = localStorage.getItem("sm_settings");
        if (savedSettings) {
            const parsed = JSON.parse(savedSettings);
            if (parsed.schoolName) setSchoolName(parsed.schoolName);
        }
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage("");

        try {
            const res = await fetch("/api/admissions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setApplicationNumber(data.applicationNumber || "");
                setSubmitted(true);
                // Reset form fields
                setFormData({
                    studentName: "",
                    gender: "Male",
                    dob: "",
                    applyingClass: "Senior 1 (O-Level)",
                    parentName: "",
                    parentPhone: "",
                    parentEmail: "",
                    previousSchool: "",
                    pleResults: "",
                });

                // Hide success alert after 8 seconds
                setTimeout(() => setSubmitted(false), 8000);
            } else {
                setErrorMessage(data.message || "Something went wrong while sending your application. Please try again.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Network error. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-amber-100">

            {/* 1. DARK NAVY HERO HEADER */}
            <section className="bg-[#0b1b4f] text-white pt-12 pb-24 px-4 text-center relative">
                <div className="max-w-4xl mx-auto space-y-5">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white">
                        Online Application
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 font-serif">
                        Apply to Join {schoolName}
                    </p>

                    {/* Vacancies Open Banner */}
                    <div className="inline-flex items-center gap-3 bg-[#142666] border border-blue-400/30 text-slate-200 px-6 py-2.5 rounded-full text-xs md:text-sm shadow-inner">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        <span>
                            <strong className="font-semibold text-white">Vacancies Open</strong> — We are currently accepting applications for the next intake.
                        </span>
                    </div>
                </div>
            </section>

            {/* 2. THREE PROCESS CARDS */}
            <section className="max-w-5xl mx-auto px-4 -mt-12 relative z-20 mb-14 grid md:grid-cols-3 gap-6">
                <div className="bg-white p-7 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
                    <div className="w-13 h-13 bg-[#0b1b4f] text-white rounded-2xl flex items-center justify-center mb-4 text-xl shadow-md">
                        ✍️
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">1. Submit Application</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Complete the online form below with accurate student and guardian details.
                    </p>
                </div>

                <div className="bg-white p-7 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
                    <div className="w-13 h-13 bg-[#0b1b4f] text-white rounded-2xl flex items-center justify-center mb-4 text-xl shadow-md">
                        📋
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">2. Assessment & Review</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Our Admissions Office reviews submitted grades, results, and student history.
                    </p>
                </div>

                <div className="bg-white p-7 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-slate-100 text-center flex flex-col items-center">
                    <div className="w-13 h-13 bg-[#0b1b4f] text-white rounded-2xl flex items-center justify-center mb-4 text-xl shadow-md">
                        🔔
                    </div>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mb-2">3. Admission & Reporting</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Successful applicants receive official admission letters and guidelines for reporting.
                    </p>
                </div>
            </section>

            {/* 3. ONLINE APPLICATION FORM */}
            <section className="max-w-4xl mx-auto px-4 mb-16">
                <div className="bg-white p-8 md:p-12 rounded-3xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] border border-slate-200">

                    <div className="border-b border-slate-100 pb-6 mb-8 text-center">
                        <h2 className="text-3xl font-serif font-bold text-[#0b1b4f]">
                            Student Admission Application Form
                        </h2>
                        <p className="text-xs md:text-sm text-slate-500 mt-2">
                            Please fill in all required fields below to send your application directly to our admissions team email.
                        </p>
                    </div>

                    {/* Success Banner */}
                    {submitted && (
                        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-400 text-emerald-900 rounded-2xl text-sm font-semibold text-center shadow-sm">
                            <p>🎉 Application submitted successfully!</p>
                            {applicationNumber && (
                                <p className="mt-2">
                                    Your application reference is{" "}
                                    <span className="font-extrabold text-[#0b1b4f]">
                                        {applicationNumber}
                                    </span>
                                </p>
                            )}
                            <p className="mt-2 font-normal">
                                Please keep this reference number. Our Admissions Office will contact you via phone or email.
                            </p>
                        </div>
                    )}

                    {/* Error Banner */}
                    {errorMessage && (
                        <div className="mb-8 p-5 bg-rose-50 border border-rose-400 text-rose-900 rounded-2xl text-sm font-semibold text-center shadow-sm">
                            ⚠️ {errorMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Section 1: Student Information */}
                        <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0b1b4f] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0b1b4f] flex items-center justify-center text-xs font-bold">1</span>
                                Student Personal Details
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Full Name of Student *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mukasa Ivan"
                                        value={formData.studentName}
                                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Gender *</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Date of Birth</label>
                                    <input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Class Applying For *</label>
                                    <select
                                        value={formData.applyingClass}
                                        onChange={(e) => setFormData({ ...formData, applyingClass: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    >
                                        <option>Senior 1 (O-Level)</option>
                                        <option>Senior 2 (O-Level)</option>
                                        <option>Senior 3 (O-Level)</option>
                                        <option>Senior 4 (O-Level)</option>
                                        <option>Senior 5 (A-Level Arts/Sciences)</option>
                                        <option>Senior 6 (A-Level Arts/Sciences)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Academic History */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0b1b4f] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0b1b4f] flex items-center justify-center text-xs font-bold">2</span>
                                Academic History & Results
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Former School Attended *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. St. Peter's Primary School"
                                        value={formData.previousSchool}
                                        onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">PLE / UCE Aggregate Score</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 8 Aggregates (Division 1)"
                                        value={formData.pleResults}
                                        onChange={(e) => setFormData({ ...formData, pleResults: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Parent Details */}
                        <div className="pt-4 border-t border-slate-100">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-[#0b1b4f] mb-4 flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-blue-100 text-[#0b1b4f] flex items-center justify-center text-xs font-bold">3</span>
                                Parent / Guardian Contact Information
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Parent/Guardian Name *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Mr. Kato Joseph"
                                        value={formData.parentName}
                                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Phone Number *</label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="+256 700 000 000"
                                        value={formData.parentPhone}
                                        onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="parent@example.com"
                                        value={formData.parentEmail}
                                        onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0b1b4f] focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full bg-[#0b1b4f] hover:bg-[#142666] text-white font-bold py-4 px-8 rounded-2xl transition shadow-lg text-base flex items-center justify-center gap-3 ${isSubmitting ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        <span>Submitting Application...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Submit Application Form</span>
                                        <span>➔</span>
                                    </>
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </section>

            {/* 4. DOCUMENTS CHECKLIST SECTION */}
            <section className="max-w-4xl mx-auto px-4 pb-20 space-y-8">

                {/* Highlight Box */}
                <div className="bg-[#f2fafb] border-2 border-[#5ce1e6] rounded-3xl p-8 md:p-10 shadow-sm">
                    <h2 className="text-2xl font-serif font-bold text-[#0b1b4f] text-center mb-8">
                        Documents to Prepare & Bring During Admission
                    </h2>

                    <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-xs md:text-sm text-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Birth certificate (copy)</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Most recent end-of-term/PLE/UCE results</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Two passport-size photos</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Testimonial from previous school</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Filled application form</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center shrink-0">✓</div>
                            <span>Medical form (provided after acceptance)</span>
                        </div>
                    </div>
                </div>

                {/* Printable Download Checklist */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-[#0b1b4f] text-white rounded-2xl flex items-center justify-center text-xl shrink-0 shadow-sm">
                            📄
                        </div>
                        <div>
                            <h4 className="font-serif font-bold text-slate-900 text-lg">Requirements Checklist (PDF)</h4>
                            <p className="text-xs text-slate-500 mt-1">Download and print the required document list for physical submission.</p>
                        </div>
                    </div>

                    <button disabled className="bg-[#0b1b4f] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-3 opacity-90 cursor-not-allowed shrink-0">
                        <span>📥 Coming soon</span>
                    </button>
                </div>

            </section>

        </div>
    );
}