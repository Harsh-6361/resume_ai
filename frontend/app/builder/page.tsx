"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
    FileText, Plus, Trash2, Download, Eye, User, Briefcase,
    GraduationCap, Code, FolderOpen, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";

/* ---------- TYPES ---------- */

interface PersonalInfo {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    portfolio: string;
    summary: string;
}

interface Experience {
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
}

interface Education {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa: string;
}

interface Project {
    id: string;
    name: string;
    description: string;
    technologies: string;
    link: string;
}

/* ---------- HELPERS ---------- */

const uid = () => Math.random().toString(36).slice(2, 9);

const emptyExperience = (): Experience => ({
    id: uid(), company: "", role: "", startDate: "", endDate: "", current: false, description: "",
});

const emptyEducation = (): Education => ({
    id: uid(), institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "",
});

const emptyProject = (): Project => ({
    id: uid(), name: "", description: "", technologies: "", link: "",
});

/* ---------- SECTION WRAPPER ---------- */

function Section({ title, icon: Icon, children, defaultOpen = true }: {
    title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="glass-card-static overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 text-left"
                style={{ borderBottom: open ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
            >
                <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                    <span className="font-semibold text-white">{title}</span>
                </div>
                {open ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> : <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />}
            </button>
            {open && <div className="p-5 space-y-4">{children}</div>}
        </div>
    );
}

function InputField({ label, value, onChange, placeholder, type = "text" }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string;
}) {
    return (
        <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="input-glass text-sm"
            />
        </div>
    );
}

function TextAreaField({ label, value, onChange, placeholder, rows = 3 }: {
    label: string; value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
    return (
        <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>{label}</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="input-glass text-sm resize-none"
            />
        </div>
    );
}

/* ---------- RESUME PREVIEW ---------- */

function ResumePreview({ personal, experiences, educations, skills, projects }: {
    personal: PersonalInfo; experiences: Experience[]; educations: Education[];
    skills: string; projects: Project[];
}) {
    return (
        <div
            id="resume-preview"
            className="bg-white text-gray-900 p-8 rounded-xl shadow-lg"
            style={{ fontFamily: "'Inter', sans-serif", minHeight: '700px', fontSize: '13px', lineHeight: '1.5' }}
        >
            {/* Header */}
            <div className="text-center pb-4 mb-4" style={{ borderBottom: '2px solid #1e40af' }}>
                <h1 className="text-2xl font-bold text-gray-900" style={{ letterSpacing: '-0.02em' }}>
                    {personal.fullName || "Your Name"}
                </h1>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-2 text-xs text-gray-600">
                    {personal.email && <span>{personal.email}</span>}
                    {personal.phone && <span>{personal.phone}</span>}
                    {personal.location && <span>{personal.location}</span>}
                    {personal.linkedin && <span>{personal.linkedin}</span>}
                    {personal.portfolio && <span>{personal.portfolio}</span>}
                </div>
            </div>

            {/* Summary */}
            {personal.summary && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">Professional Summary</h2>
                    <p className="text-gray-700 text-xs">{personal.summary}</p>
                </div>
            )}

            {/* Experience */}
            {experiences.some(e => e.company) && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Experience</h2>
                    {experiences.filter(e => e.company).map((exp) => (
                        <div key={exp.id} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{exp.role}</p>
                                    <p className="text-gray-600 text-xs">{exp.company}</p>
                                </div>
                                <p className="text-xs text-gray-500 flex-shrink-0 ml-4">
                                    {exp.startDate} — {exp.current ? "Present" : exp.endDate}
                                </p>
                            </div>
                            {exp.description && (
                                <ul className="mt-1 text-xs text-gray-700 list-disc list-inside space-y-0.5">
                                    {exp.description.split("\n").filter(Boolean).map((line, i) => (
                                        <li key={i}>{line.replace(/^[-•]\s*/, "")}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {educations.some(e => e.institution) && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Education</h2>
                    {educations.filter(e => e.institution).map((edu) => (
                        <div key={edu.id} className="mb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-sm text-gray-900">{edu.degree} in {edu.field}</p>
                                    <p className="text-gray-600 text-xs">{edu.institution}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</p>
                                </div>
                                <p className="text-xs text-gray-500 flex-shrink-0 ml-4">
                                    {edu.startDate} — {edu.endDate}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-1">Skills</h2>
                    <div className="flex flex-wrap gap-1.5">
                        {skills.split(",").map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded text-xs font-medium">
                                {s.trim()}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects.some(p => p.name) && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-blue-800 mb-2">Projects</h2>
                    {projects.filter(p => p.name).map((proj) => (
                        <div key={proj.id} className="mb-2">
                            <p className="font-bold text-sm text-gray-900">
                                {proj.name}
                                {proj.link && (
                                    <span className="ml-2 text-xs text-blue-600 font-normal">{proj.link}</span>
                                )}
                            </p>
                            {proj.description && <p className="text-xs text-gray-700">{proj.description}</p>}
                            {proj.technologies && (
                                <p className="text-xs text-gray-500 mt-0.5">Tech: {proj.technologies}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

/* ---------- MAIN PAGE ---------- */

export default function BuilderPage() {
    const [personal, setPersonal] = useState<PersonalInfo>({
        fullName: "", email: "", phone: "", location: "", linkedin: "", portfolio: "", summary: "",
    });
    const [experiences, setExperiences] = useState<Experience[]>([emptyExperience()]);
    const [educations, setEducations] = useState<Education[]>([emptyEducation()]);
    const [skills, setSkills] = useState("");
    const [projects, setProjects] = useState<Project[]>([emptyProject()]);
    const [isExporting, setIsExporting] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);

    const updatePersonal = (field: keyof PersonalInfo, value: string) => {
        setPersonal((p) => ({ ...p, [field]: value }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
        setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
    };

    const updateProject = (id: string, field: keyof Project, value: string) => {
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const html2canvas = (await import("html2canvas")).default;
            const { jsPDF } = await import("jspdf");
            const element = document.getElementById("resume-preview");
            if (!element) return;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${personal.fullName || "resume"}.pdf`);
        } catch (error) {
            console.error("PDF export error:", error);
            alert("Failed to export PDF. Please try again.");
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="mesh-bg min-h-screen">
            <div className="container-main py-8">
                {/* Header */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <span className="badge badge-blue mb-3">
                        <Sparkles className="w-3 h-3 mr-1" /> Resume Builder
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Build Your Professional Resume</h1>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Fill in the sections below and see your resume come to life in real-time.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: Form */}
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        {/* Personal Info */}
                        <Section title="Personal Information" icon={User}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <InputField label="Full Name" value={personal.fullName} onChange={(v) => updatePersonal("fullName", v)} placeholder="John Doe" />
                                <InputField label="Email" value={personal.email} onChange={(v) => updatePersonal("email", v)} placeholder="john@email.com" type="email" />
                                <InputField label="Phone" value={personal.phone} onChange={(v) => updatePersonal("phone", v)} placeholder="+1 234 567 890" />
                                <InputField label="Location" value={personal.location} onChange={(v) => updatePersonal("location", v)} placeholder="San Francisco, CA" />
                                <InputField label="LinkedIn" value={personal.linkedin} onChange={(v) => updatePersonal("linkedin", v)} placeholder="linkedin.com/in/johndoe" />
                                <InputField label="Portfolio" value={personal.portfolio} onChange={(v) => updatePersonal("portfolio", v)} placeholder="johndoe.dev" />
                            </div>
                            <TextAreaField label="Professional Summary" value={personal.summary} onChange={(v) => updatePersonal("summary", v)} placeholder="Experienced software engineer with 5+ years..." rows={3} />
                        </Section>

                        {/* Experience */}
                        <Section title="Experience" icon={Briefcase}>
                            {experiences.map((exp, i) => (
                                <div key={exp.id} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Experience #{i + 1}</span>
                                        {experiences.length > 1 && (
                                            <button onClick={() => setExperiences((prev) => prev.filter((e) => e.id !== exp.id))} className="text-red-400 hover:text-red-300">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField label="Company" value={exp.company} onChange={(v) => updateExperience(exp.id, "company", v)} placeholder="Google" />
                                        <InputField label="Role" value={exp.role} onChange={(v) => updateExperience(exp.id, "role", v)} placeholder="Software Engineer" />
                                        <InputField label="Start Date" value={exp.startDate} onChange={(v) => updateExperience(exp.id, "startDate", v)} placeholder="Jan 2022" />
                                        <div className="flex items-end gap-3">
                                            <div className="flex-1">
                                                <InputField label="End Date" value={exp.endDate} onChange={(v) => updateExperience(exp.id, "endDate", v)} placeholder="Present" />
                                            </div>
                                            <label className="flex items-center gap-1.5 text-xs mb-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                                                <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(exp.id, "current", e.target.checked)} className="rounded" />
                                                Current
                                            </label>
                                        </div>
                                    </div>
                                    <TextAreaField label="Description (use bullet points)" value={exp.description} onChange={(v) => updateExperience(exp.id, "description", v)} placeholder="- Built scalable microservices&#10;- Led team of 5 engineers" rows={4} />
                                </div>
                            ))}
                            <button onClick={() => setExperiences((prev) => [...prev, emptyExperience()])}
                                className="flex items-center gap-2 text-sm font-medium w-full justify-center py-2.5 rounded-xl transition-all"
                                style={{ color: 'var(--accent-blue)', border: '1px dashed rgba(59,130,246,0.3)', background: 'rgba(59,130,246,0.05)' }}
                            >
                                <Plus className="w-4 h-4" /> Add Experience
                            </button>
                        </Section>

                        {/* Education */}
                        <Section title="Education" icon={GraduationCap} defaultOpen={false}>
                            {educations.map((edu, i) => (
                                <div key={edu.id} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Education #{i + 1}</span>
                                        {educations.length > 1 && (
                                            <button onClick={() => setEducations((prev) => prev.filter((e) => e.id !== edu.id))} className="text-red-400 hover:text-red-300">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField label="Institution" value={edu.institution} onChange={(v) => updateEducation(edu.id, "institution", v)} placeholder="MIT" />
                                        <InputField label="Degree" value={edu.degree} onChange={(v) => updateEducation(edu.id, "degree", v)} placeholder="B.S." />
                                        <InputField label="Field of Study" value={edu.field} onChange={(v) => updateEducation(edu.id, "field", v)} placeholder="Computer Science" />
                                        <InputField label="GPA (optional)" value={edu.gpa} onChange={(v) => updateEducation(edu.id, "gpa", v)} placeholder="3.8/4.0" />
                                        <InputField label="Start Date" value={edu.startDate} onChange={(v) => updateEducation(edu.id, "startDate", v)} placeholder="Aug 2018" />
                                        <InputField label="End Date" value={edu.endDate} onChange={(v) => updateEducation(edu.id, "endDate", v)} placeholder="May 2022" />
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => setEducations((prev) => [...prev, emptyEducation()])}
                                className="flex items-center gap-2 text-sm font-medium w-full justify-center py-2.5 rounded-xl transition-all"
                                style={{ color: 'var(--accent-emerald)', border: '1px dashed rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.05)' }}
                            >
                                <Plus className="w-4 h-4" /> Add Education
                            </button>
                        </Section>

                        {/* Skills */}
                        <Section title="Skills" icon={Code} defaultOpen={false}>
                            <TextAreaField
                                label="Skills (comma separated)"
                                value={skills}
                                onChange={setSkills}
                                placeholder="JavaScript, React, Python, Node.js, SQL, Git, Docker"
                                rows={3}
                            />
                        </Section>

                        {/* Projects */}
                        <Section title="Projects" icon={FolderOpen} defaultOpen={false}>
                            {projects.map((proj, i) => (
                                <div key={proj.id} className="p-4 rounded-xl space-y-3" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Project #{i + 1}</span>
                                        {projects.length > 1 && (
                                            <button onClick={() => setProjects((prev) => prev.filter((p) => p.id !== proj.id))} className="text-red-400 hover:text-red-300">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <InputField label="Project Name" value={proj.name} onChange={(v) => updateProject(proj.id, "name", v)} placeholder="E-Commerce Platform" />
                                        <InputField label="Link" value={proj.link} onChange={(v) => updateProject(proj.id, "link", v)} placeholder="github.com/user/project" />
                                    </div>
                                    <TextAreaField label="Description" value={proj.description} onChange={(v) => updateProject(proj.id, "description", v)} placeholder="Built a full-stack e-commerce platform..." rows={2} />
                                    <InputField label="Technologies Used" value={proj.technologies} onChange={(v) => updateProject(proj.id, "technologies", v)} placeholder="React, Node.js, MongoDB" />
                                </div>
                            ))}
                            <button onClick={() => setProjects((prev) => [...prev, emptyProject()])}
                                className="flex items-center gap-2 text-sm font-medium w-full justify-center py-2.5 rounded-xl transition-all"
                                style={{ color: 'var(--accent-purple)', border: '1px dashed rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.05)' }}
                            >
                                <Plus className="w-4 h-4" /> Add Project
                            </button>
                        </Section>
                    </motion.div>

                    {/* RIGHT: Preview */}
                    <motion.div
                        className="lg:sticky lg:top-24 lg:self-start"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Eye className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                                <span className="font-semibold text-white">Live Preview</span>
                            </div>
                            <button
                                onClick={handleExportPDF}
                                disabled={isExporting}
                                className="btn-primary text-sm"
                                style={{ padding: '8px 20px', fontSize: '0.8rem' }}
                            >
                                <Download className="w-4 h-4" />
                                {isExporting ? "Exporting..." : "Export PDF"}
                            </button>
                        </div>

                        <div ref={previewRef} className="overflow-auto rounded-xl" style={{ maxHeight: 'calc(100vh - 140px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <ResumePreview
                                personal={personal}
                                experiences={experiences}
                                educations={educations}
                                skills={skills}
                                projects={projects}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
