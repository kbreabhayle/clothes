"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { showToast } = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { error: authError } = mode === 'login'
                ? await signIn(email, password)
                : await signUp(email, password);

            if (authError) throw authError;

            showToast(mode === 'login' ? 'Signed in successfully' : 'Account created', 'success');
            onClose();
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Static Backdrop */}
                        <div
                            onClick={onClose}
                            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="relative w-full max-w-sm bg-background border border-foreground/10 p-8 shadow-2xl rounded-sm"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 text-foreground/40 hover:text-foreground transition-colors"
                            >
                                <X size={18} />
                            </button>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold tracking-tight uppercase text-foreground">
                                    {mode === 'login' ? 'SIGN IN' : 'REGISTER'}
                                </h2>
                                <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest mt-1">
                                    StyleVault Account access
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-foreground/40">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value.toLowerCase())}
                                            className="w-full bg-foreground/5 border border-foreground/10 p-3 text-[12px] outline-none focus:border-foreground transition-all text-foreground"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase text-foreground/40">Password</label>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full bg-foreground/5 border border-foreground/10 p-3 text-[12px] outline-none focus:border-foreground transition-all text-foreground"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-foreground text-background py-4 text-[11px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 rounded-sm"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={14} /> : (
                                        mode === 'login' ? 'CONTINUE' : 'CREATE ACCOUNT'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-foreground/5 text-center">
                                <button
                                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                    className="text-[10px] font-bold uppercase text-foreground/40 hover:text-foreground transition-colors"
                                >
                                    {mode === 'login' ? "New client? Create account" : "Already registered? Sign in"}
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}

            </AnimatePresence>
        </div>
    );
}
