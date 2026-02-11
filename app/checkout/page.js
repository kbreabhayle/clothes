"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, CreditCard, Truck, User, ShoppingBag, ShieldAlert } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChange } from '@/lib/supabase';

export default function CheckoutPage() {
    const [step, setStep] = useState(1);
    const [user, setUser] = useState(undefined); // undefined = loading
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (user === undefined) return <div className="min-h-screen bg-black" />; // Loading state

    if (user === null) {
        return (
            <main className="min-h-screen pt-24 bg-background flex items-center justify-center p-8">
                <Navbar />
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mx-auto text-white/40">
                        <ShieldAlert size={28} strokeWidth={1} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-thin tracking-tighter text-white mb-4 uppercase">Identity Required</h1>
                        <p className="text-[10px] text-white/30 tracking-widest uppercase leading-loose">
                            You must initialize your client profile to access the secure acquisition portal.
                        </p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                        className="w-full bg-white text-black py-5 text-[9px] font-black tracking-[0.4em] uppercase hover:tracking-[0.6em] transition-all duration-700"
                    >
                        Sign In / Register
                    </button>
                    <Link href="/shop" className="block text-[8px] font-bold text-white/20 uppercase tracking-[0.3em] hover:text-white transition-colors">
                        Return to Gallery
                    </Link>
                </div>
            </main>
        );
    }

    const nextStep = async () => {
        if (step === 3) {
            setIsProcessing(true);
            try {
                // Simulate Secure Transmission
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        customer: { name: 'VALUED CLIENT' }, // In real app, from state
                        items: [{ id: 1, name: 'MIDNIGHT VELVET BLAZER', price: 1450, qty: 1 }],
                        pricing: { total: 1450 }
                    })
                });

                if (response.ok) {
                    setStep(4);
                }
            } catch (error) {
                console.error("Transmission Error", error);
            } finally {
                setIsProcessing(false);
            }
        } else {
            setStep(s => Math.min(s + 1, 4));
        }
    };
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <main className="min-h-screen pt-24 bg-background">
            <Navbar />
            <section className="container-custom py-24">
                <div className="max-w-5xl mx-auto">
                    {/* Cinematic Header */}
                    <div className="mb-20">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/30 mb-4 block"
                        >
                            Checkout Protocol
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            className="text-5xl md:text-7xl font-heading font-thin tracking-tighter text-white"
                        >
                            SECURE <span className="font-black italic">ACQUISITION</span>
                        </motion.h1>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-24 relative">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-white/5 -translate-y-1/2 z-0" />
                        {steps.map((s, i) => (
                            <div key={s} className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: step > i + 1 ? "#ffffff" : step === i + 1 ? "rgba(255,255,255,0.05)" : "transparent",
                                        borderColor: step >= i + 1 ? "#ffffff" : "rgba(255,255,255,0.1)"
                                    }}
                                    className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors duration-700"
                                >
                                    {step > i + 1 ? (
                                        <Check size={16} className="text-black" />
                                    ) : (
                                        <span className={`text-[10px] font-black ${step === i + 1 ? 'text-white' : 'text-white/20'}`}>
                                            {i + 1}
                                        </span>
                                    )}
                                </motion.div>
                                <span className={`text-[8px] font-black tracking-[0.3em] uppercase mt-5 transition-colors duration-700 ${step === i + 1 ? 'text-white' : 'text-white/20'
                                    }`}>
                                    {s}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-10"
                                    >
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-white/50 border-b border-white/5 pb-6">Vault Review</h2>
                                        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-smooth flex gap-8 group hover:border-white/20 transition-all duration-700">
                                            <div className="w-24 h-32 bg-secondary relative overflow-hidden rounded-sm">
                                                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Midnight Velvet Blazer</h3>
                                                <p className="text-[10px] text-white/30 tracking-widest mt-2 uppercase">Edition: Bespoke / Size: M</p>
                                                <div className="mt-8 flex justify-between items-end">
                                                    <p className="text-sm font-black text-white">$1,450.00</p>
                                                    <span className="text-[8px] font-black tracking-[0.2em] text-white/20 uppercase">Qty: 01</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-12"
                                    >
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-white/50 border-b border-white/5 pb-6">Distribution Protocol</h2>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">Given Name</label>
                                                <input placeholder="ENTRY DATA..." className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-widest outline-none focus:border-white transition-all text-white uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">Surname</label>
                                                <input placeholder="ENTRY DATA..." className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-widest outline-none focus:border-white transition-all text-white uppercase" />
                                            </div>
                                            <div className="col-span-2 space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">Global Address</label>
                                                <input placeholder="RESIDENCE / ATELIER..." className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-widest outline-none focus:border-white transition-all text-white uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">City</label>
                                                <input placeholder="LOCATION..." className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-widest outline-none focus:border-white transition-all text-white uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">Postal Index</label>
                                                <input placeholder="ZONE CODE..." className="w-full bg-transparent border-b border-white/10 py-4 text-[10px] tracking-widest outline-none focus:border-white transition-all text-white uppercase" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        className="space-y-12"
                                    >
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-white/50 border-b border-white/5 pb-6">Payment Intelligence</h2>
                                        <div className="bg-white/5 p-10 rounded-smooth border border-white/10 flex items-center gap-8 relative overflow-hidden group">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 0.05 }}
                                                className="absolute -right-10 -top-10 text-white"
                                            >
                                                <CreditCard size={180} />
                                            </motion.div>
                                            <CreditCard size={28} strokeWidth={1} className="text-white" />
                                            <div className="relative z-10">
                                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white mb-2">Encrypted Transmission</h3>
                                                <p className="text-[9px] text-white/30 tracking-widest uppercase">Verified Secure Gate — SSL 256-Bit</p>
                                            </div>
                                            <div className="ml-auto w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            </div>
                                        </div>
                                        <div className="space-y-3 mt-10">
                                            <label className="text-[9px] font-black tracking-widest text-white/20 uppercase">Card Matrix</label>
                                            <input placeholder="XXXX XXXX XXXX XXXX" className="w-full bg-transparent border-b border-white/10 py-4 text-[11px] tracking-[0.4em] outline-none focus:border-white transition-all text-white" />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 4 && (
                                    <motion.div
                                        key="step4"
                                        initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                                        className="text-center py-20"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1.2 }}
                                            transition={{ type: "spring", damping: 10 }}
                                            className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-12"
                                        >
                                            <Check size={40} strokeWidth={3} />
                                        </motion.div>
                                        <h2 className="text-5xl md:text-7xl font-heading font-thin tracking-tighter text-white mb-6 uppercase">
                                            VAULT <span className="font-black italic">CONFIRMED</span>
                                        </h2>
                                        <p className="text-white/30 text-[10px] tracking-[0.2em] font-medium uppercase max-w-sm mx-auto leading-loose">
                                            Order #SV-2026-X99 has been initialized.
                                            Accessing distribution link via secure protocol.
                                        </p>
                                        <div className="mt-16">
                                            <Link href="/shop" className="text-[9px] font-black tracking-[0.4em] uppercase text-white hover:tracking-[0.6em] transition-all duration-700 border-b border-white/10 pb-2">
                                                Return to Gallery
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {step < 4 && (
                                <div className="mt-24 flex justify-between">
                                    <button
                                        onClick={prevStep}
                                        className={`flex items-center gap-4 text-[9px] font-black tracking-[0.3em] uppercase text-white/30 hover:text-white transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        <ArrowLeft size={14} /> Intelligence
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={isProcessing}
                                        className="group bg-white text-black px-12 py-5 text-[9px] font-black tracking-[0.3em] uppercase flex items-center gap-4 hover:tracking-[0.4em] transition-all duration-700 disabled:opacity-50"
                                    >
                                        {isProcessing ? 'Initializing...' : step === 3 ? 'Execute Protocol' : 'Process Continuity'} <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white/[0.01] backdrop-blur-3xl p-12 rounded-smooth border border-white/5 h-fit sticky top-32"
                        >
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 border-b border-white/5 pb-5 text-white/50">Summary Analysis</h3>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-white/30">
                                    <span>Valuation</span>
                                    <span>$1,450.00</span>
                                </div>
                                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-white/30">
                                    <span>Logistics</span>
                                    <span className="text-white font-black italic">Complimentary</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-heading border-t border-white/10 pt-6">
                                <span className="uppercase text-[9px] font-black tracking-[0.3em] text-white/50">Cumulative</span>
                                <span className="text-2xl font-black text-white">$1,450.00</span>
                            </div>

                            <div className="mt-12 flex items-center gap-4 opacity-20 grayscale">
                                <div className="p-2 border border-white/10 rounded-sm">
                                    <CreditCard size={18} />
                                </div>
                                <div className="flex-1 h-[1px] bg-white/10" />
                                <div className="p-2 border border-white/10 rounded-sm">
                                    <Truck size={18} />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
