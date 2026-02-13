import { NextRequest, NextResponse } from "next/server";
import { getModel, cleanJsonResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { resume_text, job_description, mode } = body;

        if (!resume_text || !job_description || !mode) {
            return NextResponse.json(
                { error: "resume_text, job_description, and mode are required." },
                { status: 400 }
            );
        }

        const validModes = ["pronunciation", "communication", "problem_solving", "discussion"];
        if (!validModes.includes(mode)) {
            return NextResponse.json(
                { error: `Invalid mode. Must be one of: ${validModes.join(", ")}` },
                { status: 400 }
            );
        }

        const model = getModel();

        const modePrompts: Record<string, string> = {
            pronunciation: `Generate 5 technical pronunciation challenges for an interview. These should be technical terms, phrases, and sentences that the candidate would encounter in their role. Each should test different technical vocabulary.

Return VALID JSON:
{
  "questions": [
    {
      "type": "pronunciation",
      "text": "<technical term or phrase to pronounce>",
      "context": "<a sentence using this term in context>",
      "difficulty": "<easy|medium|hard>"
    }
  ]
}`,
            communication: `Generate 5 behavioral and communication interview questions using the STAR method framework. Include a mix of teamwork, leadership, conflict resolution, and adaptability questions.

Return VALID JSON:
{
  "questions": [
    {
      "type": "communication",
      "text": "<behavioral interview question>",
      "hint": "<brief hint about what the interviewer is looking for>",
      "difficulty": "<easy|medium|hard>"
    }
  ]
}`,
            problem_solving: `Generate 5 technical problem-solving interview questions. Include algorithm challenges, coding problems, and logical thinking questions appropriate for the role.

Return VALID JSON:
{
  "questions": [
    {
      "type": "problem_solving",
      "text": "<problem statement>",
      "hint": "<hint about approach>",
      "expected_concepts": ["<key concept 1>", "<key concept 2>"],
      "difficulty": "<easy|medium|hard>"
    }
  ]
}`,
            discussion: `Generate 5 technical discussion / system design interview questions. Include architecture decisions, trade-offs, and open-ended technical discussions.

Return VALID JSON:
{
  "questions": [
    {
      "type": "discussion",
      "text": "<discussion question or scenario>",
      "key_points": ["<point to cover 1>", "<point to cover 2>"],
      "difficulty": "<easy|medium|hard>"
    }
  ]
}`,
        };

        const prompt = `You are an expert interview coach. Based on this resume and job description, create tailored interview questions.

Resume: ${resume_text}
Job Description: ${job_description}

${modePrompts[mode]}`;

        const response = await model.generateContent(prompt);
        const text = response.response.text();
        const cleaned = cleanJsonResponse(text);
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed);
    } catch (error: unknown) {
        console.error("Interview start error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
