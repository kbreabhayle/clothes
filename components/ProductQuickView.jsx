"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, ChevronLeft, ChevronRight, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

export default function ProductQuickView({ product, onClose }) {
    const { addToCart } = useCart();
    const { showToast } = useToast();
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Combine main image and gallery images
    const allImages = [product.image_url || product.image, ...(product.images || [])].filter(Boolean).slice(0, 5);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addToCart(product);
        }
        showToast(`Added ${quantity} ${product.name} to vault`, 'success');
        onClose();
    };

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-background/90 backdrop-blur-xl"
                onClick={onClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="max-w-6xl w-full max-h-[90vh] overflow-hidden bg-background border border-foreground/10 rounded-none shadow-luxury relative z-[101] grid grid-cols-1 lg:grid-cols-2"
            >
                {/* Image Gallery Section */}
                <div className="relative bg-secondary/30 aspect-square lg:aspect-auto lg:h-full border-b lg:border-r lg:border-b-0 border-foreground/5 flex flex-col overflow-hidden">
                    <div className="flex-1 relative w-full h-full group">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImageIndex}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="absolute inset-0 w-full h-full"
                            >
                                <img
                                    src={allImages[activeImageIndex]}
                                    className="w-full h-full object-cover"
                                    alt={product.name}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation Arrows */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1)); }}
                                    className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-background/50 backdrop-blur-md border border-foreground/10 rounded-full text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-background z-10"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1)); }}
                                    className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-background/50 backdrop-blur-md border border-foreground/10 rounded-full text-foreground opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all hover:bg-background z-10"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="p-6 flex gap-3 overflow-x-auto no-scrollbar justify-center">
                        {allImages.map((img, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveImageIndex(idx)}
                                className={`w-16 h-16 flex-shrink-0 border transition-all duration-300 rounded-sm overflow-hidden ${activeImageIndex === idx ? 'border-foreground' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}
                            >
                                <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} loading="lazy" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 md:p-12 lg:p-16 overflow-y-auto no-scrollbar flex flex-col justify-center">
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-foreground/40">{product.category?.name || product.category}</span>
                                <span className="text-xl font-black text-foreground">${product.price}</span>
                            </div>
                            <h2 className="text-2xl md:text-5xl font-heading font-black tracking-tighter uppercase leading-none mb-4 md:mb-6">
                                {product.name}
                            </h2>
                            <div className="h-px w-20 bg-foreground/10 mb-6 md:mb-8" />
                            <p className="text-[11px] md:text-xs leading-relaxed text-foreground/60 tracking-wide uppercase font-medium max-w-md">
                                {product.description || "The embodiment of functional modernism. Crafted with precision for the discerning individual who demands both aesthetic excellence and utility."}
                            </p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="space-y-10 pt-4">
                            <div className="space-y-4">
                                <label className="text-[9px] font-black tracking-widest text-foreground/30 uppercase">Selection Volume</label>
                                <div className="flex items-center gap-6">
                                    <div className="flex bg-foreground/5 items-center rounded-sm">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="p-4 hover:text-foreground text-foreground/40 transition-colors"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-12 text-center text-[11px] font-black font-mono">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="p-4 hover:text-foreground text-foreground/40 transition-colors"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                    <p className="text-[8px] font-bold text-green-500/60 uppercase tracking-widest">In Stock / Ready for Transmission</p>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-foreground text-background py-5 md:py-6 text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-foreground/90 transition-all duration-700 active:scale-[0.98] shadow-luxury flex items-center justify-center gap-4 group"
                            >
                                <ShoppingBag size={14} className="group-hover:translate-x-1 transition-transform" />
                                Integrate into Vault
                            </button>
                        </div>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 p-3 bg-background/50 backdrop-blur-md rounded-full text-foreground/40 hover:text-foreground transition-all z-[102]"
                >
                    <X size={20} />
                </button>
            </motion.div>
        </div>,
        document.body
    );
}
