"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText, Brain, Mic, ArrowRight, CheckCircle, Star, Zap,
  Shield, Globe, Users, BarChart3, Target, ChevronRight,
  Sparkles, Award, TrendingUp, BookOpen, MessageSquare
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

/* ---------- DATA ---------- */

const features = [
  {
    icon: FileText,
    title: "Resume Builder",
    desc: "Craft professional, ATS-optimized resumes with our intuitive builder. Choose templates, add sections, and export to PDF instantly.",
    badge: "Builder",
    badgeClass: "badge-blue",
    color: "#3b82f6",
    href: "/builder",
  },
  {
    icon: Brain,
    title: "AI Resume Analyzer",
    desc: "Get multi-metric scoring — ATS compatibility, keyword match, formatting, and experience alignment. Plus actionable AI recommendations.",
    badge: "Analyzer",
    badgeClass: "badge-purple",
    color: "#8b5cf6",
    href: "/resume",
  },
  {
    icon: Mic,
    title: "Mock Interview Coach",
    desc: "Practice pronunciation, communication, problem-solving, and technical discussions with AI. Get real-time voice feedback and scoring.",
    badge: "Interview",
    badgeClass: "badge-emerald",
    color: "#10b981",
    href: "/interview",
  },
];

const howItWorks = [
  { step: "01", title: "Build Your Resume", desc: "Use our AI-powered builder to create a polished, professional resume in minutes.", icon: FileText },
  { step: "02", title: "Analyze & Optimize", desc: "Get instant ATS scoring, keyword gap analysis, and tailored improvement recommendations.", icon: BarChart3 },
  { step: "03", title: "Practice Interviews", desc: "Run mock interviews with AI across 4 modes — pronunciation, communication, problem-solving, and discussion.", icon: Mic },
  { step: "04", title: "Land Your Dream Job", desc: "Walk into interviews fully prepared with confidence and a perfectly optimized resume.", icon: Award },
];

const stats = [
  { value: "50K+", label: "Resumes Analyzed" },
  { value: "95%", label: "ATS Pass Rate" },
  { value: "10K+", label: "Mock Interviews" },
  { value: "120+", label: "Countries" },
];

const audiences = [
  { icon: BookOpen, title: "Students & Graduates", desc: "Build your first professional resume and practice for campus placements and internships." },
  { icon: TrendingUp, title: "Career Switchers", desc: "Optimize your resume for a new industry and prepare for domain-specific interview questions." },
  { icon: Globe, title: "International Applicants", desc: "Ensure your resume meets global ATS standards and practice pronunciation for foreign markets." },
  { icon: Users, title: "Job Seekers", desc: "Maximize your match score for every application and go into interviews fully prepared." },
];

const pricing = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "Perfect for getting started",
    features: ["Resume Builder (1 template)", "3 Resume Analyses / day", "5 Interview Questions / session", "Basic ATS Score", "PDF Export"],
    cta: "Get Started Free",
    popular: false,
    color: "#3b82f6",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/month",
    desc: "For serious job seekers",
    features: ["All Free features", "Unlimited Analyses", "All 3 Premium Templates", "Advanced Multi-Metric Scoring", "Unlimited Mock Interviews", "Voice Pronunciation Scoring", "AI Recommendation Engine", "Session Performance Reports", "Priority Support"],
    cta: "Upgrade to Pro",
    popular: true,
    color: "#8b5cf6",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For universities & organizations",
    features: ["Everything in Pro", "Bulk User Management", "Custom Branding", "Analytics Dashboard", "API Access", "Dedicated Account Manager", "SSO Integration"],
    cta: "Contact Sales",
    popular: false,
    color: "#10b981",
  },
];

const testimonials = [
  { name: "Sarah J.", role: "Software Engineer at Google", quote: "ResumeAI helped me optimize my resume and practice system design interviews. I landed my dream role!", stars: 5 },
  { name: "Arjun P.", role: "Data Scientist", quote: "The ATS scoring pinpointed exact keywords I was missing. My callback rate went from 5% to 40%.", stars: 5 },
  { name: "Emily C.", role: "Product Manager", quote: "The mock interview coach is incredible. Practicing pronunciation and STAR responses made me so confident.", stars: 5 },
];

const faqs = [
  { q: "Is ResumeAI really free?", a: "Yes! Our core features — resume builder, basic analysis, and interview practice — are completely free. Pro unlocks unlimited access and advanced features." },
  { q: "What file formats are supported?", a: "Upload resumes in PDF format for analysis. The builder exports to PDF with multiple professional templates." },
  { q: "How accurate is the AI feedback?", a: "We use Google's Gemini 1.5 AI model, which provides highly accurate, context-aware feedback tailored to your specific resume and target role." },
  { q: "Does it work for non-tech roles?", a: "Absolutely. ResumeAI works for all industries — marketing, finance, healthcare, education, and more. The AI adapts to any job description." },
  { q: "Is my data secure?", a: "Yes. Your resume data is processed in real-time and never stored on our servers. We take privacy seriously." },
];

/* ---------- COMPONENT ---------- */

export default function LandingPage() {
  return (
    <div className="mesh-bg">

      {/* ===== HERO ===== */}
      <section className="section relative overflow-hidden" style={{ paddingTop: '80px', paddingBottom: '60px' }}>
        {/* Decorative orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.3), transparent)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3), transparent)' }} />

        <div className="container-main relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <span className="badge badge-blue">
                <Sparkles className="w-3 h-3 mr-1" /> AI-Powered Career Platform
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
            >
              Build. Analyze.
              <br />
              <span className="gradient-text-hero">Interview. Succeed.</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl max-w-2xl mx-auto mb-10"
              style={{ color: 'var(--text-secondary)' }}
            >
              The all-in-one AI platform that helps you craft ATS-winning resumes,
              get detailed scoring insights, and ace mock interviews — for free.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/builder" className="btn-primary text-base" style={{ padding: '14px 36px' }}>
                Start Building Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="#features" className="btn-secondary text-base" style={{ padding: '14px 36px' }}>
                See How It Works
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              variants={fadeInUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-8"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4" /> No Sign-up Required
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" /> Instant Results
              </span>
              <span className="flex items-center gap-2 text-sm">
                <Globe className="w-4 h-4" /> Used in 120+ Countries
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-3xl sm:text-4xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="section">
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-purple mb-4">
              <Zap className="w-3 h-3 mr-1" /> Core Features
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Everything You Need to Land the Job</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Three powerful tools, one platform. Build, optimize, and practice — all powered by advanced AI.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                >
                  <Link href={f.href}>
                    <div className="glass-card p-8 h-full cursor-pointer group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5" style={{
                        background: `${f.color}20`,
                        border: `1px solid ${f.color}30`,
                      }}>
                        <Icon className="w-6 h-6" style={{ color: f.color }} />
                      </div>
                      <span className={`badge ${f.badgeClass} mb-3`}>{f.badge}</span>
                      <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold transition-all group-hover:gap-3" style={{ color: f.color }}>
                        Try Now <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-emerald mb-4">
              <Target className="w-3 h-3 mr-1" /> Simple Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">How It Works</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              From resume creation to interview mastery in four simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  className="glass-card-static p-6 text-center relative"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                    background: 'var(--gradient-primary)',
                  }}>
                    <span className="text-xl font-bold text-white">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHO IT'S FOR ===== */}
      <section className="section">
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-amber mb-4">
              <Users className="w-3 h-3 mr-1" /> Target Audience
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Built For Everyone</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Whether you{"'"}re a fresh graduate or a seasoned professional, ResumeAI adapts to your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((a, i) => {
              const Icon = a.icon;
              return (
                <motion.div
                  key={i}
                  className="glass-card p-6 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{
                    background: 'rgba(245,158,11,0.15)',
                    border: '1px solid rgba(245,158,11,0.2)',
                  }}>
                    <Icon className="w-5 h-5" style={{ color: '#f59e0b' }} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{a.title}</h3>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{a.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-blue mb-4">
              <BarChart3 className="w-3 h-3 mr-1" /> Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Simple, Transparent Pricing</h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Start free. Upgrade when you need more power. No hidden fees.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricing.map((plan, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="badge badge-purple">
                      <Star className="w-3 h-3 mr-1" /> Most Popular
                    </span>
                  </div>
                )}
                <div
                  className="glass-card p-8 h-full flex flex-col"
                  style={plan.popular ? {
                    border: `1px solid ${plan.color}40`,
                    boxShadow: `0 0 40px ${plan.color}10`,
                  } : {}}
                >
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{plan.desc}</p>

                  <div className="mt-6 mb-6">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: plan.color }} />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="mt-8 w-full py-3 rounded-xl font-semibold text-sm transition-all"
                    style={plan.popular ? {
                      background: `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
                      color: 'white',
                    } : {
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section">
        <div className="container-main">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-rose mb-4">
              <MessageSquare className="w-3 h-3 mr-1" /> Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-4">Loved by Job Seekers Worldwide</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                className="glass-card-static p-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: '#f59e0b' }} />
                  ))}
                </div>
                <p className="text-sm italic mb-6" style={{ color: 'var(--text-secondary)' }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container-main max-w-3xl">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="glass-card-static p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <h3 className="text-base font-bold text-white mb-2">{faq.q}</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="section">
        <div className="container-main">
          <motion.div
            className="glass-card-static p-12 sm:p-16 text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #10b981)',
            }} />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Supercharge Your Career?
              </h2>
              <p className="text-lg mb-8 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
                Join thousands of job seekers who{"'"}ve landed their dream roles with ResumeAI. Start for free today.
              </p>
              <Link href="/builder" className="btn-primary text-base" style={{ padding: '16px 40px' }}>
                Get Started — It{"'"}s Free <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Resume<span className="gradient-text">AI</span></span>
              </div>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                AI-powered career platform helping job seekers worldwide build, analyze, and practice for success.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2">
                {["Resume Builder", "Resume Analyzer", "Interview Coach", "Pricing"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2">
                {["Blog", "Career Tips", "ATS Guide", "FAQ"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                  <li key={item}>
                    <Link href="#" className="text-sm transition-colors" style={{ color: 'var(--text-muted)' }}>
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 text-center text-sm" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} ResumeAI. All rights reserved. Built with ❤️ for job seekers worldwide.
          </div>
        </div>
      </footer>
    </div>
  );
}
