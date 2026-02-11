"use client";

import { useState } from 'react';
import { Shield, Lock, ArrowRight, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function AdminLogin({ onLogin }) {
    const { theme } = useTheme();
    const [passphrase, setPassphrase] = useState('');
    const [error, setError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // In real app, this would be an API call to verify JWT
        if (passphrase === 'ATELIER2026') {
            onLogin(true);
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-8 transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-secondary border border-foreground/10 p-12 rounded-smooth backdrop-blur-3xl"
            >
                <div className="flex justify-center mb-10">
                    <div className="w-16 h-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-luxury">
                        <Shield size={24} strokeWidth={3} />
                    </div>
                </div>

                <h1 className="text-center text-[10px] font-black tracking-[0.5em] uppercase text-foreground mb-2">Secure Access</h1>
                <p className="text-center text-[8px] font-bold tracking-[0.2em] text-foreground/20 uppercase mb-12">Authorized Personnel Only</p>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase flex items-center gap-2">
                            <Lock size={10} /> Digital Passphrase
                        </label>
                        <input
                            type="password"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            placeholder="••••••••••••"
                            className={`w-full bg-foreground/5 border ${error ? 'border-red-500/50' : 'border-foreground/10'} py-4 px-6 rounded-sm text-[11px] tracking-[0.5em] outline-none focus:border-accent transition-all text-foreground`}
                        />
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[8px] font-black text-red-500 tracking-widest uppercase"
                            >
                                Authentication Void
                            </motion.p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-foreground text-background py-5 text-[9px] font-black tracking-[0.4em] uppercase flex items-center justify-center gap-4 hover:tracking-[0.6em] transition-all duration-700"
                    >
                        Initialize Session <ArrowRight size={14} strokeWidth={3} />
                    </button>

                    <div className="mt-8 pt-8 border-t border-foreground/5 flex items-center justify-center gap-4 opacity-20 grayscale">
                        <div className="w-2 h-2 rounded-full bg-foreground" />
                        <div className="w-2 h-2 rounded-full bg-foreground" />
                        <div className="w-2 h-2 rounded-full bg-foreground" />
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
