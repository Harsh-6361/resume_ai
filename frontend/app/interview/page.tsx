"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mic, MicOff, Volume2, StopCircle, Loader2, Send, ChevronRight,
    ArrowLeft, MessageSquare, Sparkles, Brain, Code, Users, BookOpen,
    Timer, BarChart3, Trophy, Target, RefreshCw
} from "lucide-react";
import { useResume } from "@/context/ResumeContext";
import { startInterview, evaluateAnswer } from "@/utils/api";
import Link from "next/link";

/* eslint-disable @typescript-eslint/no-explicit-any */

/* ---------- DATA ---------- */

const interviewModes = [
    {
        id: "pronunciation",
        title: "Pronunciation",
        desc: "Practice reading technical terms and phrases aloud. Get scored on clarity and accuracy.",
        icon: Volume2,
        color: "#3b82f6",
        badgeClass: "badge-blue",
    },
    {
        id: "communication",
        title: "Communication",
        desc: "Behavioral questions using STAR method. Practice storytelling and structured responses.",
        icon: Users,
        color: "#8b5cf6",
        badgeClass: "badge-purple",
    },
    {
        id: "problem_solving",
        title: "Problem Solving",
        desc: "Algorithm and coding challenges. Explain your approach and write pseudocode solutions.",
        icon: Code,
        color: "#10b981",
        badgeClass: "badge-emerald",
    },
    {
        id: "discussion",
        title: "Discussion",
        desc: "System design and technical discussions. Demonstrate depth of knowledge and trade-off analysis.",
        icon: BookOpen,
        color: "#f59e0b",
        badgeClass: "badge-amber",
    },
];

const DEMO_RESUME = `Experience:
- Software Engineer at Tech Corp (2020-Present): Built web applications using React, Node.js, and Python. Led migration to microservices architecture.
- Junior Developer at StartUp Inc (2018-2020): Developed REST APIs, managed PostgreSQL databases.

Skills: Python, JavaScript, TypeScript, React, Node.js, FastAPI, PostgreSQL, MongoDB, Docker, AWS, Git.
Education: B.S. in Computer Science, State University (2018).`;

const DEMO_JD = `Senior Software Engineer

We are seeking a Senior Software Engineer to join our platform team.
Requirements:
- 3+ years experience in full-stack development
- Expertise in React, Node.js, TypeScript
- Experience with distributed systems and microservices
- Strong leadership and communication skills`;

/* ---------- MAIN COMPONENT ---------- */

export default function InterviewPage() {
    // State
    const [mode, setMode] = useState<string | null>(null);
    const [resumeInput, setResumeInput] = useState("");
    const [jdInput, setJdInput] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [evaluation, setEvaluation] = useState<any>(null);
    const [sessionResults, setSessionResults] = useState<any[]>([]);
    const [showSummary, setShowSummary] = useState(false);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    // Voice
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const recognitionRef = useRef<any>(null);

    const { resumeText, jobDescription } = useResume();

    // Pre-fill from context
    useEffect(() => {
        if (resumeText) setResumeInput(resumeText);
        if (jobDescription) setJdInput(jobDescription);
    }, [resumeText, jobDescription]);

    // Speech recognition setup
    useEffect(() => {
        if (typeof window !== "undefined" && (window as any).webkitSpeechRecognition) {
            recognitionRef.current = new (window as any).webkitSpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = "";
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setUserAnswer((prev) => prev + " " + finalTranscript);
                }
            };
            recognitionRef.current.onerror = () => setIsListening(false);
        }
    }, []);

    // Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive) {
            interval = setInterval(() => setTimeElapsed((t) => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive]);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            recognitionRef.current?.start();
            setIsListening(true);
        }
    };

    const speakText = (text: string) => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
    };

    const handleStartSession = async () => {
        if (!resumeInput || !jdInput || !mode) return;
        setIsGenerating(true);
        try {
            const data = await startInterview(resumeInput, jdInput, mode);
            setQuestions(data.questions || []);
            setCurrentIdx(0);
            setTimerActive(true);
            setTimeElapsed(0);
            // Auto-speak first question
            if (data.questions?.length > 0) {
                setTimeout(() => speakText(data.questions[0].text || data.questions[0]), 500);
            }
        } catch (error) {
            alert("Failed to generate questions. Please try again.");
            console.error(error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSubmitAnswer = async () => {
        if (!userAnswer.trim()) return;
        setIsEvaluating(true);
        try {
            const q = questions[currentIdx];
            const questionText = q.text || q;
            const data = await evaluateAnswer(questionText, userAnswer, mode || "communication");
            setEvaluation(data);
            setSessionResults((prev) => [...prev, { question: questionText, answer: userAnswer, eval: data }]);
            setTimerActive(false);
        } catch (error) {
            alert("Failed to evaluate answer. Please try again.");
            console.error(error);
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleNext = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        if (currentIdx >= questions.length - 1) {
            setShowSummary(true);
            return;
        }
        setCurrentIdx((prev) => prev + 1);
        setUserAnswer("");
        setEvaluation(null);
        setTimerActive(true);
        setTimeElapsed(0);
        setTimeout(() => {
            const q = questions[currentIdx + 1];
            speakText(q.text || q);
        }, 500);
    };

    const handleRestart = () => {
        setMode(null);
        setQuestions([]);
        setCurrentIdx(0);
        setUserAnswer("");
        setEvaluation(null);
        setSessionResults([]);
        setShowSummary(false);
        setTimerActive(false);
        setTimeElapsed(0);
        window.speechSynthesis.cancel();
    };

    const avgScore = sessionResults.length > 0
        ? Math.round(sessionResults.reduce((sum, r) => sum + (r.eval?.overall_score || 0), 0) / sessionResults.length)
        : 0;

    /* ---------- RENDER: SESSION SUMMARY ---------- */

    if (showSummary) {
        return (
            <div className="mesh-bg min-h-screen">
                <div className="container-main py-8 max-w-3xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <div className="text-center mb-8">
                            <Trophy className="w-12 h-12 mx-auto mb-4" style={{ color: '#f59e0b' }} />
                            <h1 className="text-3xl font-bold text-white">Interview Complete!</h1>
                            <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                                Here{"'"}s your performance summary for this session.
                            </p>
                        </div>

                        {/* Overall Score */}
                        <div className="glass-card-static p-8 text-center mb-6">
                            <p className="text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Overall Score</p>
                            <p className="text-6xl font-black" style={{ color: avgScore >= 7 ? '#10b981' : avgScore >= 5 ? '#f59e0b' : '#f43f5e' }}>
                                {avgScore}/10
                            </p>
                            <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                                Based on {sessionResults.length} questions in {mode?.replace("_", " ")} mode
                            </p>
                        </div>

                        {/* Per Question Breakdown */}
                        <div className="space-y-4 mb-8">
                            {sessionResults.map((r, i) => (
                                <div key={i} className="glass-card-static p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="badge badge-blue text-xs">Question {i + 1}</span>
                                        <div
                                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                                            style={{ background: (r.eval?.overall_score || 0) >= 7 ? '#10b981' : (r.eval?.overall_score || 0) >= 5 ? '#f59e0b' : '#f43f5e' }}
                                        >
                                            {r.eval?.overall_score || 0}
                                        </div>
                                    </div>
                                    <p className="text-sm font-medium text-white mb-2">{r.question}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{r.eval?.feedback}</p>
                                </div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button onClick={handleRestart} className="btn-primary justify-center">
                                <RefreshCw className="w-4 h-4" /> New Session
                            </button>
                            <Link href="/resume" className="btn-secondary justify-center">
                                <BarChart3 className="w-4 h-4" /> Analyze Resume
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    /* ---------- RENDER: MODE SELECT ---------- */

    if (!mode) {
        return (
            <div className="mesh-bg min-h-screen">
                <div className="container-main py-8">
                    <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <span className="badge badge-emerald mb-3">
                            <Sparkles className="w-3 h-3 mr-1" /> AI Interview Coach
                        </span>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white">Choose Interview Mode</h1>
                        <p className="mt-2" style={{ color: 'var(--text-secondary)' }}>
                            Select the type of interview practice you want to focus on.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                        {interviewModes.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.button
                                    key={m.id}
                                    onClick={() => setMode(m.id)}
                                    className="glass-card p-6 text-left cursor-pointer group"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                                        background: `${m.color}20`,
                                        border: `1px solid ${m.color}30`,
                                    }}>
                                        <Icon className="w-6 h-6" style={{ color: m.color }} />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">{m.title}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    /* ---------- RENDER: SETUP ---------- */

    if (questions.length === 0) {
        const modeData = interviewModes.find((m) => m.id === mode)!;
        const ModeIcon = modeData.icon;

        return (
            <div className="mesh-bg min-h-screen">
                <div className="container-main py-8 max-w-2xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <button onClick={() => setMode(null)} className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                            <ArrowLeft className="w-4 h-4" /> Back to modes
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${modeData.color}20`, border: `1px solid ${modeData.color}30` }}>
                                <ModeIcon className="w-5 h-5" style={{ color: modeData.color }} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{modeData.title} Interview</h1>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{modeData.desc}</p>
                            </div>
                        </div>

                        <div className="glass-card-static p-6 space-y-5">
                            {!resumeText && (
                                <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
                                    <p className="text-sm" style={{ color: '#fbbf24' }}>
                                        <span className="font-semibold">Tip:</span> Analyze your resume first for best results.{" "}
                                        <Link href="/resume" className="underline">Go to Analyzer</Link>
                                    </p>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Resume Text</label>
                                <textarea rows={6} value={resumeInput} onChange={(e) => setResumeInput(e.target.value)}
                                    placeholder="Paste your resume content..." className="input-glass text-sm resize-none" />
                                <div className="mt-1 text-right">
                                    <button type="button" onClick={() => setResumeInput(DEMO_RESUME)} className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                                        Use Sample
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Job Description</label>
                                <textarea rows={6} value={jdInput} onChange={(e) => setJdInput(e.target.value)}
                                    placeholder="Paste the job description..." className="input-glass text-sm resize-none" />
                                <div className="mt-1 text-right">
                                    <button type="button" onClick={() => setJdInput(DEMO_JD)} className="text-xs" style={{ color: 'var(--accent-blue)' }}>
                                        Use Sample
                                    </button>
                                </div>
                            </div>

                            <button onClick={handleStartSession} disabled={isGenerating || !resumeInput || !jdInput}
                                className="btn-primary w-full justify-center" style={{ padding: '14px' }}
                            >
                                {isGenerating ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Generating Questions...</>
                                ) : (
                                    <><Sparkles className="w-5 h-5" /> Start Interview</>
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    /* ---------- RENDER: INTERVIEW FLOW ---------- */

    const currentQuestion = questions[currentIdx];
    const questionText = currentQuestion?.text || currentQuestion;
    const modeData = interviewModes.find((m) => m.id === mode)!;

    return (
        <div className="mesh-bg min-h-screen">
            <div className="container-main py-8 max-w-2xl">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    {/* Top Bar */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <span className={`badge ${modeData.badgeClass}`}>{modeData.title}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                Q {currentIdx + 1} / {questions.length}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-sm" style={{ color: timerActive ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
                                <Timer className="w-4 h-4" />
                                {formatTime(timeElapsed)}
                            </div>
                            <button onClick={handleRestart} className="text-xs px-3 py-1 rounded-lg" style={{ color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                End
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${((currentIdx + (evaluation ? 1 : 0)) / questions.length) * 100}%`, background: modeData.color }}
                        />
                    </div>

                    {/* Question Card */}
                    <div className="glass-card-static p-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                                {currentQuestion?.difficulty && (
                                    <span className="badge badge-blue text-xs mr-2">{currentQuestion.difficulty}</span>
                                )}
                                Question {currentIdx + 1}
                            </span>
                            <button
                                onClick={() => speakText(questionText)}
                                className="p-2 rounded-full transition-colors"
                                style={{
                                    background: isSpeaking ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.05)',
                                    color: isSpeaking ? '#fb7185' : 'var(--text-secondary)',
                                }}
                            >
                                {isSpeaking ? <StopCircle className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            </button>
                        </div>
                        <h2 className="text-lg font-semibold text-white leading-relaxed">{questionText}</h2>

                        {/* Context/Hint */}
                        {currentQuestion?.context && (
                            <p className="mt-3 text-sm italic" style={{ color: 'var(--text-muted)' }}>
                                Context: {currentQuestion.context}
                            </p>
                        )}
                        {currentQuestion?.hint && (
                            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
                                💡 Hint: {currentQuestion.hint}
                            </p>
                        )}
                    </div>

                    {/* Answer Area */}
                    <div className="glass-card-static p-6">
                        <label className="block text-xs font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Your Answer</label>
                        <div className="relative">
                            <textarea
                                rows={mode === "problem_solving" ? 10 : 6}
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder={mode === "pronunciation" ? "Click the mic and read the text aloud..." : "Type or speak your answer here..."}
                                className="input-glass text-sm resize-none pr-12"
                                style={mode === "problem_solving" ? { fontFamily: 'monospace' } : {}}
                                disabled={!!evaluation}
                            />
                            <button
                                onClick={toggleListening}
                                className="absolute bottom-3 right-3 p-2 rounded-full transition-all"
                                style={{
                                    background: isListening ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)',
                                    color: isListening ? '#fb7185' : 'var(--text-muted)',
                                }}
                            >
                                {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
                            </button>
                        </div>

                        {isListening && (
                            <div className="mt-2 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-xs" style={{ color: '#fb7185' }}>Listening...</span>
                            </div>
                        )}

                        {!evaluation ? (
                            <button
                                onClick={handleSubmitAnswer}
                                disabled={isEvaluating || !userAnswer.trim()}
                                className="btn-primary w-full justify-center mt-4"
                                style={{ padding: '14px' }}
                            >
                                {isEvaluating ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Evaluating...</>
                                ) : (
                                    <><Send className="w-5 h-5" /> Submit Answer</>
                                )}
                            </button>
                        ) : (
                            /* Feedback */
                            <motion.div className="mt-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div
                                            className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white"
                                            style={{ background: (evaluation.overall_score || 0) >= 7 ? '#10b981' : (evaluation.overall_score || 0) >= 5 ? '#f59e0b' : '#f43f5e' }}
                                        >
                                            {evaluation.overall_score || evaluation.score || 0}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-white">AI Feedback</h3>
                                            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                                                Score: {evaluation.overall_score || evaluation.score || 0}/10
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{evaluation.feedback}</p>

                                    {/* Sub-scores */}
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        {Object.entries(evaluation)
                                            .filter(([key]) => key.endsWith("_score") && key !== "overall_score")
                                            .slice(0, 3)
                                            .map(([key, value]) => (
                                                <div key={key} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)' }}>
                                                    <p className="text-lg font-bold text-white">{value as number}</p>
                                                    <p className="text-xs capitalize" style={{ color: 'var(--text-muted)' }}>
                                                        {key.replace("_score", "").replace("_", " ")}
                                                    </p>
                                                </div>
                                            ))}
                                    </div>

                                    {/* Suggested Answer */}
                                    {evaluation.suggested_answer && (
                                        <div className="p-4 rounded-lg" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                                            <h4 className="flex items-center gap-2 text-xs font-semibold mb-2" style={{ color: 'var(--accent-blue)' }}>
                                                <MessageSquare className="w-3 h-3" /> Suggested Answer
                                            </h4>
                                            <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>
                                                &ldquo;{evaluation.suggested_answer}&rdquo;
                                            </p>
                                        </div>
                                    )}

                                    <button onClick={handleNext} className="btn-primary w-full justify-center mt-5" style={{ padding: '14px' }}>
                                        {currentIdx >= questions.length - 1 ? (
                                            <><Trophy className="w-5 h-5" /> View Summary</>
                                        ) : (
                                            <><ChevronRight className="w-5 h-5" /> Next Question</>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
