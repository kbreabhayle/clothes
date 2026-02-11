import Link from 'next/link';
import { Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-background pt-24 pb-12 border-t border-foreground/5">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                    {/* Brand Info */}
                    <div className="col-span-1 lg:col-span-1">
                        <h3 className="text-xl font-heading font-light tracking-[0.3em] uppercase mb-10 text-foreground">
                            StyleVault
                        </h3>
                        <p className="text-[10px] text-foreground/30 tracking-widest leading-loose uppercase mb-10">
                            Redefining the digital frontier of luxury fashion through cinematic experience.
                        </p>
                        <div className="flex gap-6">
                            {['IG', 'TW', 'FB'].map(social => (
                                <Link key={social} href="#" className="text-[10px] font-black text-foreground/20 transition-colors">
                                    {social}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-[11px] font-black tracking-[0.3em] uppercase mb-10 text-foreground">Vault</h4>
                        <ul className="flex flex-col gap-5">
                            {['New Arrivals', 'Men', 'Women', 'Accessories'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-foreground/30 tracking-[0.2em] uppercase transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[11px] font-black tracking-[0.3em] uppercase mb-10 text-foreground">Atelier</h4>
                        <ul className="flex flex-col gap-5">
                            {['Our Story', 'Careers', 'Sustainability', 'Contact'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-[10px] text-foreground/30 tracking-[0.2em] uppercase transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="text-[11px] font-black tracking-[0.3em] uppercase mb-10 text-foreground">Stay Informed</h4>
                        <p className="text-[10px] text-foreground/30 mb-8 uppercase tracking-widest">
                            Join the luxury circle.
                        </p>
                        <form className="flex border-b border-foreground/10 py-4 focus-within:border-foreground transition-all duration-700">
                            <input
                                type="email"
                                placeholder="EMAIL ADDRESS"
                                className="bg-transparent border-none outline-none text-[10px] tracking-widest w-full font-bold uppercase text-foreground placeholder:text-foreground/10"
                            />
                            <button type="submit" className="ml-4 transition-all duration-500 text-foreground">
                                <ArrowRight size={16} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-foreground/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[9px] font-bold tracking-[0.3em] text-foreground/15 uppercase">
                        © 2026 STYLEVAULT ATELIER. ALL RIGHTS RESERVED.
                    </p>
                    <div className="flex gap-12">
                        <Link href="#" className="text-[9px] font-bold tracking-[0.3em] text-foreground/15 uppercase transition-colors">
                            Privacy
                        </Link>
                        <Link href="#" className="text-[9px] font-bold tracking-[0.3em] text-foreground/15 uppercase transition-colors">
                            Terms
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
