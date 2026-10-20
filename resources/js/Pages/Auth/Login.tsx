import React, { useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { Coffee, Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, ArrowLeft } from "lucide-react";

interface Props {
    status?: string;
}

export default function Login({ status }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: true,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post("/login", {
            onFinish: () => reset("password"),
        });
    };

    const handleFillDemo = () => {
        setData({
            email: "barista@whiskandbrew.com",
            password: "password123",
            remember: true,
        });
    };

    return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Back to Storefront Link */}
                <div className="mb-6 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-[#78716C] hover:text-[#1C1917] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span>Return to Storefront</span>
                    </Link>
                    <span className="text-xs px-3 py-1 rounded-full bg-[#E6ECE8] text-[#3A4D40] font-medium flex items-center gap-1.5 border border-[#6B7F69]/30">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Staff Portal
                    </span>
                </div>

                {/* Main Card */}
                <div className="bg-white border border-stone-200/80 rounded-3xl p-8 sm:p-10 shadow-xl shadow-stone-200/40 relative overflow-hidden">
                    {/* Subtle Top Accent Ribbon */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6B7F69] via-[#8C5A3C] to-[#3A4D40]" />

                    {/* Logo & Heading */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E6ECE8] text-[#3A4D40] border border-[#6B7F69]/20 mb-3 shadow-sm">
                            <Coffee className="w-7 h-7" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.04em] text-[#1C1917]">
                            whisk
                            <span className="font-serif font-normal italic text-[#8C5A3C]">
                                _brew
                            </span>
                        </h1>
                        <p className="text-sm text-[#78716C] mt-1 font-serif italic">
                            Barista Kitchen & Order Operations
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-3.5 rounded-2xl bg-[#E6ECE8] border border-[#6B7F69]/40 text-[#3A4D40] text-xs">
                            {status}
                        </div>
                    )}

                    {/* One-Click Demo Helper */}
                    <div className="mb-6 p-4 rounded-2xl bg-[#F7F4EF] border border-stone-200 flex items-center justify-between gap-3">
                        <div className="text-xs">
                            <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#8C5A3C]" />
                                <span>Demo Barista Credentials</span>
                            </div>
                            <div className="text-[#78716C] text-[11px] font-mono mt-0.5">
                                barista@whiskandbrew.com
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={handleFillDemo}
                            className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#E6ECE8] border border-stone-200 text-[#3A4D40] text-xs font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                        >
                            Auto Fill
                        </button>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Input */}
                        <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C] mb-1.5">
                                Staff Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A8A29E]">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    autoComplete="username"
                                    placeholder="barista@whiskandbrew.com"
                                    className={`w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border ${
                                        errors.email
                                            ? "border-rose-400 focus:ring-rose-200"
                                            : "border-stone-200 focus:border-[#3A4D40] focus:ring-[#3A4D40]/20"
                                    } rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:ring-2 transition-all`}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Input */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#78716C]">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A8A29E]">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    placeholder="••••••••••••"
                                    className={`w-full pl-10 pr-10 py-2.5 bg-[#FAF8F5] border ${
                                        errors.password
                                            ? "border-rose-400 focus:ring-rose-200"
                                            : "border-stone-200 focus:border-[#3A4D40] focus:ring-[#3A4D40]/20"
                                    } rounded-xl text-sm text-[#1C1917] placeholder-stone-400 focus:outline-none focus:ring-2 transition-all`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
                                    tabIndex={-1}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-rose-600 font-medium">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me */}
                        <div className="flex items-center justify-between text-xs text-[#78716C] pt-1">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData("remember", e.target.checked)}
                                    className="w-4 h-4 rounded border-stone-300 text-[#3A4D40] focus:ring-[#3A4D40]/30"
                                />
                                <span>Remember my session</span>
                            </label>
                            <span className="text-[#A8A29E] text-[11px]">Protected Area</span>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 px-4 rounded-full bg-[#3A4D40] hover:bg-[#2C3B31] text-white font-medium text-sm shadow-md shadow-[#3A4D40]/20 flex items-center justify-center gap-2 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                        >
                            {processing ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span>Enter Kitchen Console</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom Assurance */}
                    <div className="mt-8 pt-6 border-t border-stone-200/80 text-center text-xs text-[#A8A29E]">
                        <p>Whisk & Brew • Internal Kitchen System</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
