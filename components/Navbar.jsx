"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { onAuthStateChange, signOut } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);

        const { data: { subscription } } = onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        const handleAuthRequest = () => setIsAuthModalOpen(true);
        window.addEventListener('open-auth-modal', handleAuthRequest);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('open-auth-modal', handleAuthRequest);
            subscription.unsubscribe();
        };
    }, []);

    const navLinks = [
        { name: 'Shop', href: '/shop' },
        { name: 'Collections', href: '/collections' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    const handleCartClick = () => {
        if (!user) {
            setIsAuthModalOpen(true);
        } else {
            setIsCartOpen(true);
        }
    };

    return (
        <>
            <nav
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 md:px-12 py-8",
                    isScrolled ? "bg-black/40 backdrop-blur-2xl border-b border-white/5 py-5" : "bg-transparent"
                )}
            >
                <div className="max-w-[1440px] mx-auto flex items-center justify-between">
                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white/70 hover:text-white transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} strokeWidth={1} /> : <Menu size={24} strokeWidth={1} />}
                    </button>

                    {/* Logo */}
                    <Link href="/" className="group flex items-center gap-1 text-white">
                        <span className="text-xl font-heading font-light tracking-[0.3em] uppercase transition-all duration-700">
                            StyleVault
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-12">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[10px] font-black tracking-[0.25em] uppercase text-white/40 hover:text-white transition-all duration-500"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-8">
                        {user ? (
                            <div className="relative group">
                                <button
                                    className="p-2 text-white/50 hover:text-white transition-all duration-500 rounded-full hover:bg-white/5"
                                >
                                    <User size={20} strokeWidth={1} />
                                </button>

                                {/* Profile Dropdown */}
                                <div className="absolute right-0 mt-2 w-64 bg-[#080808] border border-white/5 p-6 rounded-smooth shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 z-[60]">
                                    <div className="mb-6">
                                        <p className="text-[10px] font-black tracking-widest text-white/20 uppercase mb-1">Identity</p>
                                        <p className="text-[11px] font-medium text-white break-all">{user.email}</p>
                                    </div>
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <Link href="/orders" className="block text-[9px] font-black tracking-widest uppercase text-white/40 hover:text-white transition-colors">
                                            My Manifests
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left text-[9px] font-black tracking-widest uppercase text-red-500/60 hover:text-red-500 transition-colors"
                                        >
                                            Terminate Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-[9px] font-black tracking-widest uppercase text-white/30 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        )}

                        <button
                            onClick={handleCartClick}
                            className="relative p-2 text-white/50 hover:text-white transition-all duration-500"
                        >
                            <ShoppingBag size={20} strokeWidth={1} />
                            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-black text-[8px] flex items-center justify-center font-black">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-b border-black/5 overflow-hidden"
                        >
                            <div className="flex flex-col gap-6 p-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-lg font-medium tracking-widest uppercase text-black"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
            <CartDrawer />
        </>
    );
}
