"use client";

import Link from 'next/link';
import { ShoppingBag, ArrowRight, Zap, Target, ShieldCheck } from 'lucide-react';

export default function Hero() {
    return (
        <section className="bg-black pt-28 pb-16 border-b border-white/5">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    {/* Left Column: Direct Action */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-white">Live Collection: Series 01</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold tracking-tighter leading-[0.9] text-white">
                            ENGINEERED <br /> FOR FUNCTION.
                        </h1>

                        <p className="max-w-xl text-lg text-white/40 font-medium leading-normal">
                            High-performance apparel designed for the modern metropolitan environment.
                            100% functional, zero filler.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href="/shop"
                                className="px-8 py-4 bg-white text-black text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-3"
                            >
                                Shop Collection <ArrowRight size={14} />
                            </Link>
                            <Link
                                href="/collections"
                                className="px-8 py-4 border border-white/10 text-white text-[11px] font-black uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Browse Series
                            </Link>
                        </div>
                    </div>

                    {/* Right Column: Key Metrics/Features (Functional Grid) */}
                    <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: <Zap size={18} />, title: "Snappy UX", desc: "Optimized for speed" },
                            { icon: <Target size={18} />, title: "Precision", desc: "Exact fit specs" },
                            { icon: <ShieldCheck size={18} />, title: "Verified", desc: "Authenticity guaranteed" },
                            { icon: <ShoppingBag size={18} />, title: "Express", desc: "Global shipping" }
                        ].map((item, i) => (
                            <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-sm space-y-3">
                                <div className="text-white/40">{item.icon}</div>
                                <div>
                                    <h3 className="text-[11px] font-bold uppercase text-white tracking-wider">{item.title}</h3>
                                    <p className="text-[10px] text-white/20 font-medium uppercase tracking-tighter">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
