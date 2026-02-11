"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background pt-24">
            <Navbar />
            <section className="container-custom py-16 md:py-32">
                <div className="max-w-4xl">
                    <motion.span
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-foreground/30 mb-6 md:mb-8 block"
                    >
                        Foundation & Philosophy
                    </motion.span>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-10 md:mb-16 uppercase">
                        The Art of Atelier
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="space-y-8 text-[12px] uppercase tracking-[0.2em] text-foreground/40 leading-loose"
                        >
                            <p>
                                StyleVault exists at the intersection of digital precision and
                                high-fashion legacy. We curate not just garments, but motion.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="space-y-8 text-[12px] uppercase tracking-[0.2em] text-foreground/40 leading-loose"
                        >
                            <p>
                                Every silhouette in our vault is a testament to the "Less is More"
                                mantra, refined through hundreds of hours of cinematic research.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
