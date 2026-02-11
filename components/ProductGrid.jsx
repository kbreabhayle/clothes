"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getProducts } from '../lib/products';
import ProductCard from './ProductCard';

function ProductGridContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get('category')?.toLowerCase() || 'all';

    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (initialCategory !== 'all') {
            setActiveCategory(initialCategory);
        }
    }, [initialCategory]);

    useEffect(() => {
        async function load() {
            const data = await getProducts();
            setAllProducts(data);
            setLoading(false);
        }
        load();
    }, []);

    const categories = ['all', 'men', 'women', 'accessories'];

    const filteredProducts = activeCategory === 'all'
        ? allProducts
        : allProducts.filter(p => {
            const cat = p.category?.toLowerCase();
            return cat === activeCategory.toLowerCase();
        });

    return (
        <section className="py-32 bg-background" id="shop">
            <div className="container-custom">
                <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-12">
                    <div className="max-w-xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-[10px] font-thin tracking-[0.3em] uppercase text-white/40 mb-6"
                        >
                            Curated Selection
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                            className="text-5xl md:text-7xl font-heading font-thin tracking-[-0.02em] leading-[0.9] text-white"
                        >
                            MOTION <br />
                            <span className="font-black italic">COLLECTION</span>
                        </motion.h2>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-3">
                        {categories.map((cat, idx) => (
                            <motion.button
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[9px] font-black tracking-[0.3em] uppercase px-8 py-4 rounded-smooth transition-all duration-700 ${activeCategory === cat
                                    ? 'bg-white text-black'
                                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                {cat}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                    {loading ? (
                        [1, 2, 3, 4].map(n => (
                            <div key={n} className="aspect-[4/5] bg-white/[0.03] rounded-smooth" />
                        ))
                    ) : (
                        <AnimatePresence mode='popLayout'>
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function ProductGrid() {
    return (
        <Suspense fallback={
            <section className="py-32 bg-background">
                <div className="container-custom">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="aspect-[4/5] bg-white/[0.03] rounded-smooth" />
                        ))}
                    </div>
                </div>
            </section>
        }>
            <ProductGridContent />
        </Suspense>
    );
}
