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
        <section className="py-20 bg-background" id="shop">
            <div className="container-custom">
                <div className="flex flex-col lg:flex-row justify-between items-baseline mb-12 gap-8">
                    <div>
                        <h2 className="text-lg font-bold tracking-tight text-foreground mb-1">
                            Collection Series 01
                        </h2>
                        <p className="text-[11px] font-bold text-foreground/30 uppercase tracking-widest">
                            {filteredProducts.length} Results Found
                        </p>
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`text-[10px] font-bold tracking-wider uppercase px-6 py-2 border transition-all ${activeCategory === cat
                                    ? 'bg-foreground text-background border-foreground'
                                    : 'bg-transparent text-foreground/40 border-foreground/10 hover:border-foreground/30 hover:text-foreground'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-x-8 md:gap-y-12">
                    {loading ? (
                        [1, 2, 3, 4, 5].map(n => (
                            <div key={n} className="aspect-[4/5] bg-white/[0.02]" />
                        ))
                    ) : (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
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
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-x-8 md:gap-y-12">
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
