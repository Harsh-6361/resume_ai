"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FileText, Brain, Mic, LayoutDashboard, Menu, X, Sparkles } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/builder", label: "Builder", icon: FileText },
    { href: "/resume", label: "Analyzer", icon: Brain },
    { href: "/interview", label: "Interview", icon: Mic },
];

export default function Navbar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50" style={{
            background: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
            <div className="container-main flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                        background: 'var(--gradient-primary)',
                    }}>
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white tracking-tight">
                        Resume<span className="gradient-text">AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    color: isActive ? '#fff' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = '#fff';
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.color = 'var(--text-secondary)';
                                        e.currentTarget.style.background = 'transparent';
                                    }
                                }}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* CTA */}
                <div className="hidden md:flex items-center gap-3">
                    <Link href="/builder" className="btn-primary text-sm" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                        Get Started Free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 rounded-lg"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileOpen && (
                <div className="md:hidden px-4 pb-4 space-y-1" style={{
                    background: 'rgba(10, 10, 15, 0.95)',
                    backdropFilter: 'blur(20px)',
                }}>
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all"
                                style={{
                                    color: isActive ? '#fff' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                                }}
                                onClick={() => setMobileOpen(false)}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </Link>
                        );
                    })}
                    <div className="pt-3">
                        <Link href="/builder" className="btn-primary w-full justify-center text-sm" onClick={() => setMobileOpen(false)}>
                            Get Started Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
