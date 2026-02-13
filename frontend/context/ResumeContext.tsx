"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AnalysisResult {
    ats_score: number;
    keyword_score: number;
    format_score: number;
    experience_score: number;
    skills_score: number;
    missing_keywords: string[];
    section_feedback: {
        summary: string;
        experience: string;
        skills: string;
        education: string;
    };
    recommendations: {
        priority: string;
        title: string;
        description: string;
    }[];
    summary_feedback: string;
    extracted_resume_text?: string;
}

interface ResumeContextType {
    resumeText: string;
    setResumeText: (text: string) => void;
    jobDescription: string;
    setJobDescription: (text: string) => void;
    analysisResults: AnalysisResult | null;
    setAnalysisResults: (results: AnalysisResult | null) => void;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
    const [resumeText, setResumeText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

    return (
        <ResumeContext.Provider
            value={{
                resumeText,
                setResumeText,
                jobDescription,
                setJobDescription,
                analysisResults,
                setAnalysisResults,
            }}
        >
            {children}
        </ResumeContext.Provider>
    );
}

export function useResume() {
    const context = useContext(ResumeContext);
    if (context === undefined) {
        throw new Error("useResume must be used within a ResumeProvider");
    }
    return context;
}
