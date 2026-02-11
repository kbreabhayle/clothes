"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const collections = [
    {
        title: "Men's Edit",
        subtitle: "Timeless Tailoring",
        image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&h=1000&fit=crop",
        href: "/shop?category=Men"
    },
    {
        title: "Women's Edit",
        subtitle: "Graceful Audacity",
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&h=1000&fit=crop",
        href: "/shop?category=Women"
    },
    {
        title: "Essentials",
        subtitle: "Modern Basics",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&h=1000&fit=crop",
        href: "/shop?category=Accessories"
    }
];

export default function Collections() {
    return (
        <section className="py-20 md:py-32 bg-background border-t border-foreground/5">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {collections.map((item, idx) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, scale: 1.1 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                            className="group relative aspect-[3/4] overflow-hidden rounded-smooth bg-secondary"
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-cover opacity-80"
                            />

                            <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end bg-gradient-to-t from-background/90 via-background/20 to-transparent">
                                <motion.span
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (idx * 0.2) + 0.5 }}
                                    className="text-foreground/40 text-[8px] md:text-[9px] font-bold tracking-[0.4em] uppercase mb-2 md:mb-3"
                                >
                                    {item.subtitle}
                                </motion.span>
                                <motion.h3
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (idx * 0.2) + 0.7 }}
                                    className="text-foreground text-xl md:text-2xl font-bold tracking-tight uppercase mb-6 md:mb-8"
                                >
                                    {item.title}
                                </motion.h3>
                                <Link
                                    href={item.href}
                                    className="w-fit bg-accent text-background text-[8px] md:text-[9px] font-black tracking-[0.3em] uppercase px-8 md:px-10 py-3 md:py-4 transition-all duration-700 hover:tracking-[0.4em]"
                                >
                                    Catalogue
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>

    );
}
