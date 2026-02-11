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
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCartOpen(false)}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-[#080808] border-l border-white/5 z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={20} strokeWidth={1} className="text-white/40" />
                                <h2 className="text-xs font-black tracking-[0.4em] uppercase text-white">Your Collection</h2>
                                <span className="text-[10px] font-bold text-white/20">({cartCount})</span>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 text-white/30 hover:text-white transition-colors"
                            >
                                <X size={20} strokeWidth={1} />
                            </button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
                                    <ShoppingBag size={32} strokeWidth={1} />
                                    <p className="text-[9px] font-black tracking-widest uppercase">The Vault is Empty</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.id} className="flex gap-6 group">
                                        <div className="relative w-24 aspect-[3/4] bg-white/5 rounded-sm overflow-hidden flex-shrink-0">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover opacity-80"
                                            />
                                        </div>
                                        <div className="flex-1 flex flex-col py-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="text-[10px] font-black tracking-widest uppercase text-white truncate max-w-[150px]">
                                                    {item.name}
                                                </h3>
                                                <p className="text-[10px] font-black text-white">${item.price}</p>
                                            </div>
                                            <p className="text-[8px] font-bold tracking-widest uppercase text-white/20 mb-auto">
                                                {item.category}
                                            </p>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center border border-white/10 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="p-1.5 text-white/30 hover:text-white transition-colors"
                                                    >
                                                        <Minus size={10} />
                                                    </button>
                                                    <span className="w-8 text-center text-[9px] font-black text-white">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="p-1.5 text-white/30 hover:text-white transition-colors"
                                                    >
                                                        <Plus size={10} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 text-red-500/30 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={12} strokeWidth={2} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {cart.length > 0 && (
                            <div className="p-8 border-t border-white/5 bg-black/40 space-y-6">
                                <div className="flex justify-between items-end">
                                    <p className="text-[9px] font-black tracking-[0.3em] uppercase text-white/30">Subtotal Value</p>
                                    <p className="text-2xl font-heading font-thin text-white tracking-tighter">${cartTotal}</p>
                                </div>
                                <Link
                                    href="/checkout"
                                    onClick={() => setIsCartOpen(false)}
                                    className="block w-full bg-white text-black py-5 text-center text-[9px] font-black tracking-[0.4em] uppercase hover:tracking-[0.6em] transition-all duration-700"
                                >
                                    Initialize Acquisition
                                </Link>
                                <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.2em]">
                                    Complimentary Express Shipping Included
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
