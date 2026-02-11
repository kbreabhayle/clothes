"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CartDrawer() {
    const {
        cart,
        isCartOpen,
        setIsCartOpen,
        removeFromCart,
        updateQuantity,
        cartTotal,
        cartCount
    } = useCart();

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isCartOpen]);

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] cursor-pointer"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-foreground/10 z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-foreground/10 flex items-center justify-between">
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 -ml-2 text-foreground/40 hover:text-foreground transition-colors"
                                aria-label="Close cart"
                            >
                                <X size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold uppercase text-foreground">Vault Contents</h2>
                                <span className="text-[11px] font-bold text-foreground/30">({cartCount})</span>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20 text-foreground">
                                    <ShoppingBag size={24} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group pb-6 border-b border-foreground/5 last:border-0">
                                        <div className="relative w-24 aspect-[3/4] bg-foreground/5 flex-shrink-0 rounded-sm overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-[12px] font-black uppercase text-foreground leading-tight truncate flex-1">
                                                    {item.name}
                                                </h3>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 text-foreground/20 hover:text-red-500 transition-colors ml-4"
                                                    aria-label="Remove item"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase text-foreground/30 mb-auto">
                                                {item.category}
                                            </p>

                                            <div className="flex items-center justify-between mt-6">
                                                <div className="flex items-center border border-foreground/10 rounded-full overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1.5 px-3 text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-8 text-center text-[11px] font-bold text-foreground">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1.5 px-3 text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <p className="text-[13px] font-black text-foreground tracking-tighter">${item.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-8 border-t border-foreground/10 bg-background space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/30">Total Value</p>
                                    <p className="text-3xl font-black text-foreground tracking-tighter leading-none">${cartTotal}</p>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full bg-foreground text-background py-5 text-center text-[10px] font-black uppercase tracking-[0.4em] hover:bg-foreground/90 transition-all active:scale-[0.98] rounded-sm"
                                >
                                    Proceed to Settlement
                                </Link>
                                <p className="text-[9px] text-center text-foreground/20 uppercase font-black tracking-widest">
                                    Secure Transaction Protocol
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
