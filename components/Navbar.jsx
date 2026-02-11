"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, Search, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { onAuthStateChange, signOut } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
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
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 bg-black border-b border-white/10",
                    isScrolled ? "py-3" : "py-4"
                )}
            >
                <div className="max-w-[1440px] mx-auto flex items-center gap-12">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-lg font-bold tracking-tighter uppercase text-white">
                            StyleVault
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-bold tracking-wider uppercase text-white/50 hover:text-white transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md hidden md:block">
                        <div className="relative group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-white transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                className="w-full bg-white/5 border border-white/5 px-10 py-2.5 text-[11px] text-white placeholder:text-white/20 focus:outline-none focus:border-white/20 transition-all"
                            />
                        </div>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-6 ml-auto">
                        {user ? (
                            <>
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                                    title="Order History"
                                >
                                    <Package size={18} strokeWidth={1.5} />
                                    <span className="text-[10px] font-bold uppercase hidden xl:block">Orders</span>
                                </Link>

                                <div className="relative group/user">
                                    <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors">
                                        <User size={18} strokeWidth={1.5} />
                                        <span className="text-[10px] font-bold uppercase hidden xl:block">Account</span>
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-[#111111] border border-white/10 p-4 shadow-2xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-[60]">
                                        <p className="text-[9px] font-bold text-white/40 uppercase mb-3 px-2">Signed in as</p>
                                        <p className="text-[10px] font-medium text-white truncate mb-4 px-2">{user.email}</p>
                                        <div className="h-[1px] bg-white/5 mb-3" />
                                        <Link href="/orders" className="block w-full text-left p-2 text-[10px] font-bold uppercase text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                                            Orders
                                        </Link>
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full text-left p-2 text-[10px] font-bold uppercase text-red-500/60 hover:text-red-500 hover:bg-red-500/5 transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsAuthModalOpen(true)}
                                className="text-[10px] font-bold tracking-widest uppercase text-white/50 hover:text-white transition-colors"
                            >
                                Sign In
                            </button>
                        )}

                        <button
                            onClick={handleCartClick}
                            className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                        >
                            <div className="relative">
                                <ShoppingBag size={18} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-white text-black text-[8px] flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold uppercase hidden xl:block">Cart</span>
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
