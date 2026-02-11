"use client";

import { useState, useEffect } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, CreditCard, Truck, User, ShoppingBag, ShieldAlert, Upload, Zap, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { onAuthStateChange, supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function CheckoutPage() {
    const steps = ["REVIEW", "DATA", "PAYMENT", "CONFIRM"];
    const [step, setStep] = useState(1);
    const [user, setUser] = useState(undefined); // undefined = loading
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('CBE'); // CBE or TELEBIRR
    const [paymentProof, setPaymentProof] = useState(null);
    const [orderRef, setOrderRef] = useState('');
    const { showToast } = useToast();
    const { cart, cartTotal, clearCart } = useCart();

    useEffect(() => {
        const { data: { subscription } } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
        return () => subscription.unsubscribe();
    }, []);

    if (user === undefined) return <div className="min-h-screen bg-background" />; // Loading state

    if (user === null) {
        return (
            <main className="min-h-screen pt-24 bg-background flex items-center justify-center p-8">
                <Navbar />
                <div className="max-w-md w-full text-center space-y-8">
                    <div className="w-16 h-16 bg-foreground/5 border border-foreground/10 rounded-full flex items-center justify-center mx-auto text-foreground/40">
                        <ShieldAlert size={28} strokeWidth={1} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-thin tracking-tighter text-foreground mb-4 uppercase">Identity Required</h1>
                        <p className="text-[10px] text-foreground/30 tracking-widest uppercase leading-loose">
                            You must initialize your client profile to access the secure acquisition portal.
                        </p>
                    </div>
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal'))}
                        className="w-full bg-foreground text-background py-5 text-[9px] font-black tracking-[0.4em] uppercase hover:tracking-[0.6em] transition-all duration-700"
                    >
                        Sign In / Register
                    </button>
                    <Link href="/shop" className="block text-[8px] font-bold text-foreground/20 uppercase tracking-[0.3em] hover:text-foreground transition-colors">
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
                let proofUrl = null;

                if (paymentProof) {
                    const fileName = `proof-${Date.now()}-${paymentProof.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
                    const { error: uploadError } = await supabase.storage
                        .from('payment-proofs')
                        .upload(fileName, paymentProof);

                    if (uploadError) throw uploadError;

                    const { data: { publicUrl } } = supabase.storage
                        .from('payment-proofs')
                        .getPublicUrl(fileName);

                    proofUrl = publicUrl;
                }

                // Construct Order Payload
                const orderPayload = {
                    customer_details: {
                        name: user?.email || 'VALUED CLIENT',
                        email: user?.email,
                        payment_method: paymentMethod,
                        payment_proof_name: paymentProof?.name || 'Manual Upload',
                        payment_proof_url: proofUrl
                    },
                    items: cart.map(item => ({ id: item.id, name: item.name, price: item.price, qty: item.quantity, image_url: item.image_url })),
                    pricing: { total: cartTotal }
                };

                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderPayload)
                });

                const result = await response.json();

                if (response.ok) {
                    setOrderRef(result.order_number || '');
                    clearCart();
                    showToast('Secure Connection Established', 'success');
                    setStep(4);
                } else {
                    throw new Error(result.error || 'Protocol Failed');
                }
            } catch (error) {
                console.error("Transmission Error", error);
                showToast(error.message, 'error');
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
            <section className="container-custom py-12 md:py-24">
                <div className="max-w-5xl mx-auto">
                    {/* Cinematic Header */}
                    <div className="mb-12 md:mb-20">
                        <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase text-foreground/30 mb-3 md:mb-4 block"
                        >
                            Checkout Protocol
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                            className="text-2xl sm:text-5xl md:text-7xl font-heading font-thin tracking-tighter text-foreground leading-[1.1]"
                        >

                            SECURE <span className="font-black italic">ACQUISITION</span>
                        </motion.h1>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex justify-between mb-16 md:mb-24 relative px-2 md:px-0">
                        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-foreground/5 -translate-y-1/2 z-0" />
                        {steps.map((s, i) => (
                            <div key={s} className="relative z-10 flex flex-col items-center">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        backgroundColor: step > i + 1 ? "var(--foreground)" : step === i + 1 ? "var(--secondary)" : "transparent",
                                        borderColor: step >= i + 1 ? "var(--foreground)" : "var(--foreground-muted, rgba(128,128,128,0.2))"
                                    }}
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border transition-colors duration-700"
                                >
                                    {step > i + 1 ? (
                                        <Check size={14} className="text-background" />
                                    ) : (
                                        <span className={`text-[9px] md:text-[10px] font-black ${step === i + 1 ? 'text-foreground' : 'text-foreground/20'}`}>
                                            {i + 1}
                                        </span>
                                    )}
                                </motion.div>
                                <span className={`text-[7px] md:text-[8px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mt-4 md:mt-5 transition-colors duration-700 ${step === i + 1 ? 'text-foreground' : 'text-foreground/20'
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
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-foreground/50 border-b border-foreground/5 pb-6">Vault Review</h2>
                                        {cart.length === 0 ? (
                                            <div className="text-center py-16 text-foreground/20 text-[10px] tracking-widest uppercase">Your vault is empty</div>
                                        ) : cart.map(item => (
                                            <div key={item.id} className="bg-foreground/[0.02] border border-foreground/5 p-8 rounded-smooth flex gap-8 group hover:border-foreground/20 transition-all duration-700">
                                                <div className="w-24 h-32 bg-secondary relative overflow-hidden rounded-sm">
                                                    {item.image_url && <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="96px" />}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground">{item.name}</h3>
                                                    <p className="text-[10px] text-foreground/30 tracking-widest mt-2 uppercase">{item.description?.slice(0, 40) || 'StyleVault Exclusive'}</p>
                                                    <div className="mt-8 flex justify-between items-end">
                                                        <p className="text-sm font-black text-foreground">${item.price?.toLocaleString()}</p>
                                                        <span className="text-[8px] font-black tracking-[0.2em] text-foreground/20 uppercase">Qty: {String(item.quantity).padStart(2, '0')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
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
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-foreground/50 border-b border-foreground/5 pb-6">Distribution Protocol</h2>
                                        <div className="grid grid-cols-2 gap-10">
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-foreground/20 uppercase">Given Name</label>
                                                <input placeholder="ENTRY DATA..." className="w-full bg-transparent border-b border-foreground/10 py-4 text-[10px] tracking-widest outline-none focus:border-foreground transition-all text-foreground uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-foreground/20 uppercase">Surname</label>
                                                <input placeholder="ENTRY DATA..." className="w-full bg-transparent border-b border-foreground/10 py-4 text-[10px] tracking-widest outline-none focus:border-foreground transition-all text-foreground uppercase" />
                                            </div>
                                            <div className="col-span-2 space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-foreground/20 uppercase">Global Address</label>
                                                <input placeholder="RESIDENCE / ATELIER..." className="w-full bg-transparent border-b border-foreground/10 py-4 text-[10px] tracking-widest outline-none focus:border-foreground transition-all text-foreground uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-foreground/20 uppercase">City</label>
                                                <input placeholder="LOCATION..." className="w-full bg-transparent border-b border-foreground/10 py-4 text-[10px] tracking-widest outline-none focus:border-foreground transition-all text-foreground uppercase" />
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[9px] font-black tracking-widest text-foreground/20 uppercase">Postal Index</label>
                                                <input placeholder="ZONE CODE..." className="w-full bg-transparent border-b border-foreground/10 py-4 text-[10px] tracking-widest outline-none focus:border-foreground transition-all text-foreground uppercase" />
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
                                        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-foreground/50 border-b border-foreground/5 pb-6">Payment Intelligence</h2>

                                        {/* Payment Method Selector */}
                                        <div className="grid grid-cols-2 gap-4">
                                            {['CBE', 'TELEBIRR'].map((method) => (
                                                <button
                                                    key={method}
                                                    onClick={() => setPaymentMethod(method)}
                                                    className={`py-6 border rounded-sm text-[10px] font-black tracking-[0.2em] transition-all duration-300 ${paymentMethod === method
                                                        ? 'bg-foreground text-background border-foreground'
                                                        : 'bg-transparent text-foreground/40 border-foreground/10 hover:border-foreground/30 hover:text-foreground'
                                                        }`}
                                                >
                                                    {method === 'CBE' ? 'COMMERCIAL BANK' : 'TELEBIRR WALLET'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Payment Details */}
                                        <div className="bg-foreground/[0.02] border border-foreground/5 p-8 rounded-sm space-y-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="p-3 bg-foreground/5 rounded-full text-foreground">
                                                    {paymentMethod === 'CBE' ? <CreditCard size={20} /> : <Zap size={20} />}
                                                </div>
                                                <div>
                                                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
                                                        {paymentMethod === 'CBE' ? 'CBE Transfer Details' : 'Telebirr Merchant Info'}
                                                    </h3>
                                                    <p className="text-[9px] text-foreground/30 tracking-widest uppercase mt-1">
                                                        {paymentMethod === 'CBE' ? 'Direct Bank Deposit / Mobile Transfer' : 'Scan or Enter Mobile Number'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center p-4 bg-secondary/30 border border-foreground/10 rounded-sm">
                                                    <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                                                        {paymentMethod === 'CBE' ? 'Account Number' : 'Merchant ID'}
                                                    </span>
                                                    <span className="text-[11px] font-mono text-foreground tracking-wider">
                                                        {paymentMethod === 'CBE' ? '1000123456789' : '556677'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center p-4 bg-secondary/30 border border-foreground/10 rounded-sm">
                                                    <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest">
                                                        {paymentMethod === 'CBE' ? 'Account Name' : 'Merchant Name'}
                                                    </span>
                                                    <span className="text-[11px] font-bold text-foreground tracking-widest uppercase">
                                                        StyleVault Official
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-foreground/5">
                                                <p className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest mb-4">
                                                    Proof of Transaction
                                                </p>
                                                <label className="flex flex-col items-center justify-center w-full h-32 border border-dashed border-foreground/20 rounded-sm cursor-pointer hover:border-foreground/40 hover:bg-foreground/[0.02] transition-all group">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        {paymentProof ? (
                                                            <div className="flex items-center gap-3 text-green-500">
                                                                <Check size={24} />
                                                                <p className="text-[10px] font-bold tracking-widest uppercase">{paymentProof.name}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <Upload size={24} className="text-foreground/20 mb-3 group-hover:text-foreground transition-colors" />
                                                                <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-widest">Upload Screenshot</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        accept="image/*"
                                                        onChange={(e) => setPaymentProof(e.target.files[0])}
                                                    />
                                                </label>
                                            </div>
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
                                            className="w-24 h-24 bg-foreground/10 text-foreground rounded-full flex items-center justify-center mx-auto mb-12 border border-foreground/20"
                                        >
                                            <ShieldCheck size={40} strokeWidth={1.5} />
                                        </motion.div>
                                        <h2 className="text-5xl md:text-6xl font-heading font-thin tracking-tighter text-foreground mb-6 uppercase">
                                            VERIFICATION <br /><span className="font-black italic">PENDING</span>
                                        </h2>
                                        <p className="text-foreground/30 text-[10px] tracking-[0.2em] font-medium uppercase max-w-sm mx-auto leading-loose">
                                            Payment proof received. Protocol awaiting administrative confirmation.
                                            <br />
                                            Reference: {orderRef || 'Processing...'}
                                        </p>
                                        <div className="mt-16">
                                            <Link href="/shop" className="text-[9px] font-black tracking-[0.4em] uppercase text-foreground hover:tracking-[0.6em] transition-all duration-700 border-b border-foreground/10 pb-2">
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
                                        className={`flex items-center gap-4 text-[9px] font-black tracking-[0.3em] uppercase text-foreground/30 hover:text-foreground transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                    >
                                        <ArrowLeft size={14} /> Intelligence
                                    </button>
                                    <button
                                        onClick={nextStep}
                                        disabled={isProcessing || (step === 3 && !paymentProof)}
                                        className="group bg-foreground text-background px-12 py-5 text-[9px] font-black tracking-[0.3em] uppercase flex items-center gap-4 hover:tracking-[0.4em] transition-all duration-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isProcessing ? 'Verifying...' : step === 3 ? 'Submit Proof' : 'Process Continuity'} <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Summary */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-foreground/[0.01] backdrop-blur-3xl p-12 rounded-smooth border border-foreground/5 h-fit sticky top-32"
                        >
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase mb-10 border-b border-foreground/5 pb-5 text-foreground/50">Summary Analysis</h3>
                            <div className="space-y-6 mb-10">
                                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-foreground/30">
                                    <span>Valuation</span>
                                    <span>${cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-foreground/30">
                                    <span>Items</span>
                                    <span>{cart.reduce((a, i) => a + i.quantity, 0)}</span>
                                </div>
                                <div className="flex justify-between text-[10px] tracking-[0.2em] uppercase text-foreground/30">
                                    <span>Logistics</span>
                                    <span className="text-foreground font-black italic">Complimentary</span>
                                </div>
                            </div>
                            <div className="flex justify-between font-heading border-t border-foreground/10 pt-6">
                                <span className="uppercase text-[9px] font-black tracking-[0.3em] text-foreground/50">Cumulative</span>
                                <span className="text-2xl font-black text-foreground">${cartTotal.toLocaleString()}</span>
                            </div>

                            <div className="mt-12 flex items-center gap-4 opacity-20 grayscale">
                                <div className="p-2 border border-foreground/10 rounded-sm">
                                    <CreditCard size={18} />
                                </div>
                                <div className="flex-1 h-[1px] bg-foreground/10" />
                                <div className="p-2 border border-foreground/10 rounded-sm">
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
