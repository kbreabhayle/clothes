"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { signIn, signUp } from '@/lib/supabase';

export default function AuthModal({ isOpen, onClose }) {
    const [mode, setMode] = useState('login'); // 'login' or 'signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: authError } = mode === 'login'
                ? await signIn(email, password)
                : await signUp(email, password);

            if (authError) throw authError;

            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-md bg-[#080808] border border-white/5 p-12 rounded-smooth shadow-2xl"
            >
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="mb-12">
                    <h2 className="text-[10px] font-black tracking-[0.5em] uppercase text-white mb-3">
                        {mode === 'login' ? 'Welcome Back' : 'Create Identity'}
                    </h2>
                    <p className="text-[8px] font-bold tracking-[0.2em] text-white/20 uppercase">
                        ATELIER ACCESS PROTOCOL
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                <Mail size={10} /> Email Segment
                            </label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="CLIENT@ATELIER.XYZ"
                                className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-sm text-[11px] tracking-widest outline-none focus:border-white transition-all text-white placeholder:text-white/5"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black tracking-widest text-white/30 uppercase flex items-center gap-2">
                                <Lock size={10} /> Cryptographic Pass
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-white/5 border border-white/10 py-4 px-6 rounded-sm text-[11px] tracking-widest outline-none focus:border-white transition-all text-white placeholder:text-white/5"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-[8px] font-black text-red-500 tracking-widest uppercase">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black py-5 text-[9px] font-black tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:tracking-[0.6em] transition-all duration-700 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" size={14} /> : (
                            <>
                                {mode === 'login' ? 'Initialize Session' : 'Register Identity'}
                                <ArrowRight size={14} strokeWidth={3} />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-12 pt-12 border-t border-white/5 text-center">
                    <button
                        onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                        className="text-[9px] font-black tracking-[0.2em] uppercase text-white/30 hover:text-white transition-colors"
                    >
                        {mode === 'login' ? "Don't have an ID? Register" : "Already registered? Sign In"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
