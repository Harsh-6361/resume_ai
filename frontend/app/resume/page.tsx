"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight,
    Brain, Target, Sparkles, ChevronDown, ChevronUp, AlertTriangle, Lightbulb
} from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { analyzeResume } from "@/utils/api";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

const DEMO_JD = `Software Engineer - Full Stack

We are looking for a Full Stack Software Engineer to join our team.

Responsibilities:
- Design and develop scalable web applications
- Write clean, maintainable code in React and Node.js
- Collaborate with cross-functional teams
- Implement RESTful APIs and microservices
- Participate in code reviews and technical discussions

Requirements:
- 2+ years of experience in full-stack development
- Proficiency in JavaScript/TypeScript, React, and Node.js
- Experience with databases (PostgreSQL, MongoDB)
- Familiarity with cloud services (AWS/GCP)
- Strong problem-solving and communication skills`;

/* ---------- RADAR CHART ---------- */

function RadarChart({ scores }: { scores: { label: string; value: number; color: string }[] }) {
    const cx = 150, cy = 150, r = 100;
    const n = scores.length;
    const angleStep = (2 * Math.PI) / n;

    const getPoint = (value: number, index: number) => {
        const angle = angleStep * index - Math.PI / 2;
        const ratio = value / 100;
        return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
    };

    const gridLevels = [25, 50, 75, 100];

    return (
        <svg viewBox="0 0 300 300" className="w-full max-w-xs mx-auto">
            {/* Grid lines */}
            {gridLevels.map((level) => (
                <polygon
                    key={level}
                    points={scores.map((_, i) => {
                        const p = getPoint(level, i);
                        return `${p.x},${p.y}`;
                    }).join(" ")}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="1"
                />
            ))}

            {/* Axis lines */}
            {scores.map((_, i) => {
                const p = getPoint(100, i);
                return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
            })}

            {/* Data polygon */}
            <polygon
                points={scores.map((s, i) => {
                    const p = getPoint(s.value, i);
                    return `${p.x},${p.y}`;
                }).join(" ")}
                fill="rgba(59,130,246,0.15)"
                stroke="#3b82f6"
                strokeWidth="2"
            />

            {/* Data points & labels */}
            {scores.map((s, i) => {
                const p = getPoint(s.value, i);
                const lp = getPoint(120, i);
                return (
                    <g key={i}>
                        <circle cx={p.x} cy={p.y} r="4" fill={s.color} />
                        <text x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle" fill={s.color} fontSize="10" fontWeight="600">
                            {s.label}
                        </text>
                        <text x={lp.x} y={lp.y + 14} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.5)" fontSize="9">
                            {s.value}%
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}

/* ---------- SCORE GAUGE ---------- */

function ScoreGauge({ score, label, color, size = 80 }: { score: number; label: string; color: string; size?: number }) {
    const r = (size - 10) / 2;
    const circumference = 2 * Math.PI * r;
    const dash = (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-2">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle
                    cx={size / 2} cy={size / 2} r={r}
                    fill="none" stroke={color} strokeWidth="6"
                    strokeDasharray={`${dash} ${circumference}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="text-center -mt-14">
                <p className="text-xl font-bold text-white">{score}</p>
            </div>
            <p className="text-xs font-medium mt-3" style={{ color: 'var(--text-muted)' }}>{label}</p>
        </div>
    );
}

/* ---------- MAIN PAGE ---------- */

export default function AnalyzerPage() {
    const { setResumeText, jobDescription, setJobDescription, setAnalysisResults } = useResume();
    const [file, setFile] = useState<File | null>(null);
    const [jd, setJd] = useState(jobDescription || "");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !jd) {
            setError("Please upload a resume and provide a job description.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const data = await analyzeResume(file, jd);
            setResult(data);
            setAnalysisResults(data);
            setJobDescription(jd);
            if (data.extracted_resume_text) setResumeText(data.extracted_resume_text);
        } catch (err: any) {
            setError(err.message || "Analysis failed");
        } finally {
            setIsLoading(false);
        }
    };

    const radarScores = result ? [
        { label: "ATS", value: result.ats_score || 0, color: "#3b82f6" },
        { label: "Keywords", value: result.keyword_score || 0, color: "#8b5cf6" },
        { label: "Format", value: result.format_score || 0, color: "#10b981" },
        { label: "Experience", value: result.experience_score || 0, color: "#f59e0b" },
        { label: "Skills", value: result.skills_score || 0, color: "#f43f5e" },
    ] : [];

    const getScoreColor = (score: number) => {
        if (score >= 80) return "#10b981";
        if (score >= 60) return "#f59e0b";
        return "#f43f5e";
    };

    const getPriorityColor = (priority: string) => {
        if (priority === "high") return { bg: 'rgba(244,63,94,0.15)', text: '#fb7185', border: 'rgba(244,63,94,0.2)' };
        if (priority === "medium") return { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24', border: 'rgba(245,158,11,0.2)' };
        return { bg: 'rgba(16,185,129,0.15)', text: '#34d399', border: 'rgba(16,185,129,0.2)' };
    };

    return (
        <div className="mesh-bg min-h-screen">
            <div className="container-main py-8">
                {/* Header */}
                <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="badge badge-purple mb-3">
                        <Brain className="w-3 h-3 mr-1" /> AI Analyzer
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white">Resume AI Analyzer</h1>
                    <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                        Upload your resume and get comprehensive AI-powered analysis with detailed scoring.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* LEFT: Upload Form */}
                    <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                        <div className="glass-card-static p-6 sm:p-8">
                            <h2 className="flex items-center gap-2 text-xl font-semibold text-white mb-6">
                                <FileText className="w-5 h-5" style={{ color: 'var(--accent-blue)' }} />
                                Upload & Analyze
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* File Upload */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Resume (PDF)</label>
                                    <div
                                        className="relative flex flex-col items-center rounded-xl p-6 transition-all cursor-pointer"
                                        style={{
                                            border: '2px dashed rgba(59,130,246,0.2)',
                                            background: file ? 'rgba(59,130,246,0.05)' : 'rgba(255,255,255,0.02)',
                                        }}
                                    >
                                        <input type="file" accept=".pdf" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        <Upload className="mb-2 w-8 h-8" style={{ color: file ? 'var(--accent-blue)' : 'var(--text-muted)' }} />
                                        <p className="text-sm" style={{ color: file ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                                            {file ? file.name : "Click or drag PDF here"}
                                        </p>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Job Description</label>
                                    <textarea
                                        rows={8}
                                        value={jd}
                                        onChange={(e) => setJd(e.target.value)}
                                        placeholder="Paste the job description here..."
                                        className="input-glass text-sm resize-none"
                                    />
                                    <div className="mt-2 text-right">
                                        <button type="button" onClick={() => setJd(DEMO_JD)} className="text-xs font-medium" style={{ color: 'var(--accent-blue)' }}>
                                            Use Sample JD
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 rounded-xl p-3" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)' }}>
                                        <AlertCircle className="w-4 h-4" style={{ color: '#fb7185' }} />
                                        <span className="text-sm" style={{ color: '#fb7185' }}>{error}</span>
                                    </div>
                                )}

                                <button type="submit" disabled={isLoading} className="btn-primary w-full justify-center" style={{ padding: '14px 32px' }}>
                                    {isLoading ? (
                                        <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</>
                                    ) : (
                                        <><Sparkles className="w-5 h-5" /> Analyze Resume</>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>

                    {/* RIGHT: Results */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                        {result ? (
                            <div className="space-y-6 animate-fade-in-up">
                                {/* Overall ATS Score */}
                                <div className="glass-card-static p-6 sm:p-8 text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20" style={{ background: getScoreColor(result.ats_score) }} />
                                    <h2 className="text-lg font-semibold text-white mb-4">Overall ATS Score</h2>
                                    <div className="relative inline-block">
                                        <svg width="160" height="160" className="-rotate-90">
                                            <circle cx="80" cy="80" r="65" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                            <circle
                                                cx="80" cy="80" r="65"
                                                fill="none" stroke={getScoreColor(result.ats_score)} strokeWidth="10"
                                                strokeDasharray={`${(result.ats_score / 100) * 408.4} 408.4`}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-4xl font-black text-white">{result.ats_score}</span>
                                        </div>
                                    </div>
                                    <p className="text-sm mt-3" style={{ color: 'var(--text-secondary)' }}>{result.summary_feedback}</p>

                                    <Link href="/interview" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-all" style={{ color: 'var(--accent-blue)' }}>
                                        Practice Interview <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Sub Scores */}
                                <div className="glass-card-static p-6">
                                    <h3 className="text-base font-semibold text-white mb-6">Score Breakdown</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        <ScoreGauge score={result.keyword_score || 0} label="Keywords" color="#8b5cf6" />
                                        <ScoreGauge score={result.format_score || 0} label="Format" color="#10b981" />
                                        <ScoreGauge score={result.experience_score || 0} label="Experience" color="#f59e0b" />
                                        <ScoreGauge score={result.skills_score || 0} label="Skills" color="#f43f5e" />
                                    </div>
                                </div>

                                {/* Radar Chart */}
                                <div className="glass-card-static p-6">
                                    <h3 className="text-base font-semibold text-white mb-4">Performance Radar</h3>
                                    <RadarChart scores={radarScores} />
                                </div>

                                {/* Missing Keywords */}
                                {result.missing_keywords?.length > 0 && (
                                    <div className="glass-card-static p-6">
                                        <h3 className="flex items-center gap-2 text-base font-semibold text-white mb-4">
                                            <AlertTriangle className="w-4 h-4" style={{ color: '#fbbf24' }} />
                                            Missing Keywords
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {result.missing_keywords.map((kw: string, i: number) => (
                                                <span key={i} className="badge badge-rose">{kw}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* AI Recommendations */}
                                {result.recommendations?.length > 0 && (
                                    <div className="glass-card-static p-6">
                                        <h3 className="flex items-center gap-2 text-base font-semibold text-white mb-4">
                                            <Lightbulb className="w-4 h-4" style={{ color: '#fbbf24' }} />
                                            AI Recommendations
                                        </h3>
                                        <div className="space-y-3">
                                            {result.recommendations.map((rec: any, i: number) => {
                                                const pc = getPriorityColor(rec.priority);
                                                return (
                                                    <div key={i} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="badge text-xs" style={{ background: pc.bg, color: pc.text, border: `1px solid ${pc.border}` }}>
                                                                {rec.priority}
                                                            </span>
                                                            <span className="text-sm font-semibold text-white">{rec.title}</span>
                                                        </div>
                                                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{rec.description}</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Section Feedback */}
                                {result.section_feedback && (
                                    <div className="glass-card-static p-6">
                                        <h3 className="text-base font-semibold text-white mb-4">Section-by-Section Feedback</h3>
                                        <div className="space-y-2">
                                            {Object.entries(result.section_feedback).map(([key, value]) => (
                                                <div key={key} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.05)' }}>
                                                    <button
                                                        className="w-full flex items-center justify-between p-4 text-left transition-all"
                                                        style={{ background: expandedSection === key ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)' }}
                                                        onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                                                    >
                                                        <span className="text-sm font-medium text-white capitalize">{key}</span>
                                                        {expandedSection === key ?
                                                            <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-muted)' }} /> :
                                                            <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-muted)' }} />
                                                        }
                                                    </button>
                                                    {expandedSection === key && (
                                                        <div className="px-4 pb-4">
                                                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{value as string}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden lg:flex h-full flex-col items-center justify-center glass-card-static p-12 text-center">
                                <Brain className="w-16 h-16 mb-4 opacity-20" style={{ color: 'var(--text-muted)' }} />
                                <p className="text-lg font-medium" style={{ color: 'var(--text-muted)' }}>Results will appear here</p>
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Upload a resume and job description to start analysis.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
