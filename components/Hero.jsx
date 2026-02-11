"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-24 overflow-hidden bg-background">
            {/* Ambient Background Aura */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.15, scale: 1 }}
                    transition={{ duration: 3, ease: "easeOut" }}
                    className="absolute -top-[20%] -left-[10%] w-[120%] h-[140%] bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1)_0%,_transparent_50%)]"
                />
            </div>

            <div className="container-custom relative z-10 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, letterSpacing: "1em" }}
                    animate={{ opacity: 1, letterSpacing: "0.4em" }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                    className="text-[10px] font-light uppercase text-white/40 mb-10"
                >
                    Est. MMXXVI — Global Luxury
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, filter: "blur(20px)", y: 50 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-7xl md:text-9xl font-heading font-thin tracking-[-0.04em] leading-[0.85] mb-12 text-white"
                >
                    THE ART <br />
                    <span className="font-black italic">OF MOTION</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="max-w-xl text-md text-white/30 font-light tracking-wide mb-16 leading-relaxed"
                >
                    A new dimension of fashion discovery where digital precision meets
                    unrivaled cinematic elegance.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-6"
                >
                    <button className="group relative px-12 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700">
                        <span className="relative z-10 flex items-center gap-3">
                            Discover Catalog <ArrowRight size={14} strokeWidth={3} />
                        </span>
                    </button>
                    <button className="px-12 py-5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-700 backdrop-blur-sm">
                        Our Vision
                    </button>
                </motion.div>
            </div>

            {/* Decorative Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.1 }}
                transition={{ duration: 2, delay: 1.5 }}
                className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-gradient-to-b from-transparent via-white to-transparent"
            />
        </section>
    );
}
