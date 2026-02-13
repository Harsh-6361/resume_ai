import { NextRequest, NextResponse } from "next/server";
import { getModel, cleanJsonResponse } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { question, user_answer, mode } = body;

        if (!question || !user_answer) {
            return NextResponse.json(
                { error: "question and user_answer are required." },
                { status: 400 }
            );
        }

        const model = getModel();

        let evaluationPrompt = "";

        if (mode === "pronunciation") {
            evaluationPrompt = `You are evaluating a pronunciation/speaking exercise. The candidate was asked to read/pronounce the following:

Target Text: ${question}
What the candidate said (transcribed): ${user_answer}

Evaluate their pronunciation accuracy and clarity. Return VALID JSON:
{
  "pronunciation_score": <number 1-10>,
  "clarity_score": <number 1-10>,
  "content_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "feedback": "<specific feedback on pronunciation>",
  "suggested_improvement": "<how to improve pronunciation>"
}`;
        } else if (mode === "problem_solving") {
            evaluationPrompt = `You are evaluating a technical problem-solving answer.

Question: ${question}
Candidate's Answer: ${user_answer}

Evaluate their technical accuracy, approach, and problem-solving methodology. Return VALID JSON:
{
  "technical_score": <number 1-10>,
  "approach_score": <number 1-10>,
  "completeness_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "feedback": "<detailed feedback>",
  "suggested_answer": "<optimal approach/solution>"
}`;
        } else if (mode === "discussion") {
            evaluationPrompt = `You are evaluating a technical discussion/system design answer.

Question: ${question}
Candidate's Answer: ${user_answer}

Evaluate their depth of knowledge, ability to discuss trade-offs, and overall communication. Return VALID JSON:
{
  "depth_score": <number 1-10>,
  "communication_score": <number 1-10>,
  "coverage_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "feedback": "<detailed feedback>",
  "key_points_missed": ["<missed point 1>", "<missed point 2>"],
  "suggested_answer": "<comprehensive answer covering key points>"
}`;
        } else {
            // communication / default
            evaluationPrompt = `You are evaluating a behavioral/communication interview answer.

Question: ${question}
Candidate's Answer: ${user_answer}

Evaluate using the STAR method (Situation, Task, Action, Result). Return VALID JSON:
{
  "structure_score": <number 1-10, how well they used STAR method>,
  "relevance_score": <number 1-10>,
  "clarity_score": <number 1-10>,
  "overall_score": <number 1-10>,
  "feedback": "<concise actionable feedback>",
  "suggested_answer": "<improved STAR method answer>"
}`;
        }

        const response = await model.generateContent(evaluationPrompt);
        const text = response.response.text();
        const cleaned = cleanJsonResponse(text);
        const parsed = JSON.parse(cleaned);

        return NextResponse.json(parsed);
    } catch (error: unknown) {
        console.error("Evaluate error:", error);
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
