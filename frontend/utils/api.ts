const API_BASE = "/api";

export async function analyzeResume(file: File, jobDescription: string) {
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    const response = await fetch(`${API_BASE}/analyze`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
    }

    return response.json();
}

export async function startInterview(
    resumeText: string,
    jobDescription: string,
    mode: string
) {
    const response = await fetch(`${API_BASE}/interview/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
            mode,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to start interview");
    }

    return response.json();
}

export async function evaluateAnswer(
    question: string,
    userAnswer: string,
    mode: string
) {
    const response = await fetch(`${API_BASE}/interview/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            question,
            user_answer: userAnswer,
            mode,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to evaluate answer");
    }

    return response.json();
}
