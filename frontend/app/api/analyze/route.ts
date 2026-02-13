import { NextRequest, NextResponse } from "next/server";
import { getModel, cleanJsonResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const resumeFile = formData.get("resume") as File | null;
        const jobDescription = formData.get("job_description") as string | null;

        if (!resumeFile || !jobDescription) {
            return NextResponse.json(
                { error: "Resume file and job description are required." },
                { status: 400 }
            );
        }

        if (!resumeFile.name.endsWith(".pdf")) {
            return NextResponse.json(
                { error: "Only PDF files are supported." },
                { status: 400 }
            );
        }

        // Read PDF as base64 for Gemini's multimodal input
        const arrayBuffer = await resumeFile.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");

        // Use Gemini to both read and analyze the PDF directly
        const model = getModel();

        const prompt = `You are an expert resume analyzer and ATS (Applicant Tracking System) specialist. Analyze the attached PDF resume against the job description comprehensively.

Job Description:
${jobDescription}

Provide the output in VALID JSON format (no markdown):
{
  "ats_score": <number 0-100, overall ATS compatibility>,
  "keyword_score": <number 0-100, how well keywords match>,
  "format_score": <number 0-100, formatting and structure quality>,
  "experience_score": <number 0-100, experience alignment>,
  "skills_score": <number 0-100, skills match percentage>,
  "missing_keywords": [<list of important missing keywords as strings>],
  "section_feedback": {
    "summary": "<feedback on summary/objective section>",
    "experience": "<feedback on experience section>",
    "skills": "<feedback on skills section>",
    "education": "<feedback on education section>"
  },
  "recommendations": [
    {
      "priority": "<high|medium|low>",
      "title": "<short recommendation title>",
      "description": "<actionable recommendation description>"
    }
  ],
  "summary_feedback": "<overall 2-3 sentence summary of the resume quality>",
  "extracted_resume_text": "<full text content extracted from the PDF resume>"
}`;

        const response = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "application/pdf",
                    data: base64,
                },
            },
        ]);

        const text = response.response.text();
        const cleaned = cleanJsonResponse(text);
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed);
    } catch (error: unknown) {
        console.error("Analysis error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
