"use client";

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

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/90 z-[100] cursor-pointer"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-black border-l border-white/10 z-[101] flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-bold uppercase text-white">Your Cart</h2>
                                <span className="text-[11px] font-bold text-white/30">({cartCount} ITEMS)</span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-2 opacity-20">
                                    <ShoppingBag size={24} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-4 group pb-6 border-b border-white/5 last:border-0">
                                        <div className="relative w-20 aspect-[3/4] bg-white/5 flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col py-0.5">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[11px] font-bold uppercase text-white truncate max-w-[180px]">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[11px] font-bold text-white">${item.price}</p>
                                            </div>
                                            <p className="text-[10px] font-bold uppercase text-white/20 mb-auto">
                                                {item.category}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-white/10 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1 px-2 text-white/30 hover:text-white transition-colors border-r border-white/10"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-8 text-center text-[10px] font-bold text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1 px-2 text-white/30 hover:text-white transition-colors border-l border-white/10"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-[10px] font-bold uppercase text-red-500/40 hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 bg-black space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <p className="text-[11px] font-bold uppercase text-white/40">Total Amount</p>
                                    <p className="text-xl font-bold text-white">${cartTotal}</p>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full bg-white text-black py-4 text-center text-[11px] font-black uppercase tracking-widest hover:bg-white/90 transition-all active:scale-[0.99]"
                                >
                                    Proceed to Checkout
                                </Link>
                                <p className="text-[9px] text-center text-white/20 uppercase font-bold">
                                    Shipping calculated at next step
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
