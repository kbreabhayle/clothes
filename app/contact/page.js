"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
    return (
        <main className="min-h-screen pt-24 bg-background">
            <Navbar />
            <section className="container-custom py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
                    <div>
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-10 block"
                        >
                            Global Concierge
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, filter: "blur(10px)", y: 30 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                            className="text-7xl md:text-9xl font-heading font-thin tracking-tighter leading-[0.85] mb-20 text-white"
                        >
                            LET'S <br /> <span className="font-black italic">CONNECT</span>
                        </motion.h1>
                        <div className="space-y-16">
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 text-white/40">Inquiries</h4>
                                <p className="text-[14px] uppercase tracking-[0.2em] text-white">atelier@stylevault.luxury</p>
                            </motion.div>
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase mb-4 text-white/40">Presence</h4>
                                <p className="text-[14px] uppercase tracking-[0.2em] text-white">
                                    Studio VII, Mayfair<br />
                                    London, United Kingdom
                                </p>
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="bg-white/[0.02] backdrop-blur-3xl p-16 rounded-smooth border border-white/5"
                    >
                        <form className="space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest uppercase text-white/30">Registry Name</label>
                                    <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-white transition-all text-white text-[11px] uppercase tracking-widest" />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[9px] font-black tracking-widest uppercase text-white/30">Email Protocol</label>
                                    <input type="email" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-white transition-all text-white text-[11px] uppercase tracking-widest" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black tracking-widest uppercase text-white/30">Subject Material</label>
                                <input type="text" className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-white transition-all text-white text-[11px] uppercase tracking-widest" />
                            </div>
                            <div className="space-y-4">
                                <label className="text-[9px] font-black tracking-widest uppercase text-white/30">Message Transcription</label>
                                <textarea rows={4} className="w-full bg-transparent border-b border-white/10 py-4 outline-none focus:border-white transition-all resize-none text-white text-[11px] uppercase tracking-widest" />
                            </div>
                            <button className="w-full group relative bg-white text-black py-6 text-[10px] font-black tracking-[0.4em] uppercase flex items-center justify-center gap-6 overflow-hidden transition-all hover:tracking-[0.6em]">
                                <span className="relative z-10 flex items-center gap-4">Initialize Dispatch <Send size={14} strokeWidth={3} /></span>
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
