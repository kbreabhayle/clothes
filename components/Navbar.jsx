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
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun, Sparkles } from 'lucide-react';
import AuthModal from './AuthModal';
import CartDrawer from './CartDrawer';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function Navbar() {
    const { cartCount, setIsCartOpen } = useCart();
    const { theme, toggleTheme } = useTheme();
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

    const getThemeIcon = () => {
        switch (theme) {
            case 'light': return <Sun size={18} strokeWidth={1.5} />;
            case 'midnight': return <Sparkles size={18} strokeWidth={1.5} />;
            default: return <Moon size={18} strokeWidth={1.5} />;
        }
    };

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
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background border-b border-foreground/5 shadow-sm",
                    isScrolled ? "py-3 shadow-xl backdrop-blur-xl bg-background/80" : "py-4"
                )}
            >
                <div className="max-w-[1440px] mx-auto px-6 md:px-6 flex items-center gap-6 md:gap-12">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-lg font-bold tracking-tighter uppercase text-foreground">
                            StyleVault
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[11px] font-bold tracking-wider uppercase text-foreground/50 hover:text-foreground transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Theme Toggle & Search */}
                    <div className="flex-1 max-w-lg hidden md:flex items-center gap-4">
                        <div className="relative group flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/20 group-focus-within:text-foreground transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search collection..."
                                className="w-full bg-foreground/5 border border-foreground/5 px-10 py-2.5 text-[11px] text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-foreground/20 transition-all font-medium"
                            />
                        </div>

                        <button
                            onClick={toggleTheme}
                            className="p-2.5 bg-foreground/5 border border-foreground/5 hover:border-foreground/20 text-foreground/50 hover:text-foreground transition-all rounded-sm flex items-center justify-center"
                            title={`Switch Theme (Current: ${theme})`}
                        >
                            {getThemeIcon()}
                        </button>
                    </div>

                    {/* User Actions */}
                    <div className="flex items-center gap-4 md:gap-6 ml-auto">
                        <div className="hidden md:flex items-center gap-6">
                            {user ? (
                                <>
                                    <Link
                                        href="/orders"
                                        className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors"
                                        title="Order History"
                                    >
                                        <Package size={18} strokeWidth={1.5} />
                                        <span className="text-[10px] font-bold uppercase hidden xl:block">Orders</span>
                                    </Link>

                                    <div className="relative group/user">
                                        <button className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors">
                                            <User size={18} strokeWidth={1.5} />
                                            <span className="text-[10px] font-bold uppercase hidden xl:block">Account</span>
                                        </button>

                                        <div className="absolute right-0 mt-2 w-48 bg-background border border-foreground/10 p-4 shadow-2xl opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 z-[60] rounded-sm">
                                            <p className="text-[9px] font-bold text-foreground/40 uppercase mb-3 px-2">Signed in as</p>
                                            <p className="text-[10px] font-medium text-foreground truncate mb-4 px-2">{user.email}</p>
                                            <div className="h-[1px] bg-foreground/5 mb-3" />
                                            <Link href="/orders" className="block w-full text-left p-2 text-[10px] font-bold uppercase text-foreground/60 hover:text-foreground hover:bg-foreground/5 transition-colors">
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
                                    className="text-[10px] font-bold tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>

                        {user && (
                            <Link
                                href="/orders"
                                className="md:hidden flex items-center text-foreground/50 hover:text-foreground transition-colors"
                                title="Order History"
                            >
                                <Package size={18} strokeWidth={1.5} />
                            </Link>
                        )}

                        <button
                            onClick={handleCartClick}
                            className="flex items-center gap-2 text-foreground/50 hover:text-foreground transition-colors"
                        >
                            <div className="relative">
                                <ShoppingBag size={18} strokeWidth={1.5} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-accent text-background text-[8px] flex items-center justify-center font-bold font-mono">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[10px] font-bold uppercase hidden xl:block">Cart</span>
                        </button>

                        {/* Mobile Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-foreground/50 hover:text-foreground transition-colors focus:outline-none"
                            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
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
                            className="lg:hidden bg-background border-t border-foreground/5 overflow-hidden"
                        >
                            <div className="flex flex-col gap-8 p-10 max-h-[80vh] overflow-y-auto scrollbar-hide">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className="text-2xl font-bold tracking-tighter uppercase text-foreground hover:italic transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}

                                <div className="h-[1px] bg-foreground/5 my-4" />

                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-foreground/30">Theme Protocol</span>
                                    <button
                                        onClick={toggleTheme}
                                        className="p-3 bg-foreground/5 border border-foreground/5 rounded-full text-foreground hover:border-foreground/20 transition-all"
                                    >
                                        {getThemeIcon()}
                                    </button>
                                </div>

                                {user && (
                                    <Link
                                        href="/orders"
                                        className="text-2xl font-bold tracking-tighter uppercase text-foreground hover:italic transition-all"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Order History
                                    </Link>
                                )}

                                {user ? (
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-[10px] font-bold uppercase tracking-widest text-red-500/60 mt-4 text-left"
                                    >
                                        Terminate Session
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsAuthModalOpen(true);
                                            setIsMenuOpen(false);
                                        }}
                                        className="text-[10px] font-bold uppercase tracking-widest text-accent mt-4 text-left"
                                    >
                                        Access Vault
                                    </button>
                                )}
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
