"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const handleAction = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new CustomEvent('open-auth-modal'));
        } else {
            addToCart(product);
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="group relative bg-[#080808] rounded-smooth border border-white/5 transition-all duration-700 overflow-hidden"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-black">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />

                {/* Always Visible Actions */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex items-center justify-end">
                    <button
                        onClick={handleAction}
                        className="p-4 bg-white text-black hover:bg-white/90 transition-colors rounded-full shadow-xl"
                    >
                        <ShoppingBag size={14} strokeWidth={3} />
                    </button>
                </div>
            </div>

            {/* Product Content */}
            <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-medium tracking-[0.2em] uppercase text-white/30">
                        {product.category}
                    </span>
                    <span className="text-xs font-black font-heading text-white">
                        ${product.price}
                    </span>
                </div>
                <h3 className="text-[11px] font-black tracking-[0.1em] uppercase text-white">
                    {product.name}
                </h3>
            </div>
        </motion.div>
    );
}
