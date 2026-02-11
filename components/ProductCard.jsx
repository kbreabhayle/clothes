import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';

export default function ProductCard({ product }) {
    const { addToCart } = useCart();
    const { showToast } = useToast();

    const handleAction = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            window.dispatchEvent(new CustomEvent('open-auth-modal'));
        } else {
            addToCart(product);
            showToast(`Added ${product.name} to vault`, 'success');
        }
    };

    return (
        <div className="bg-secondary border border-foreground/5 transition-all duration-200">
            {/* Image Container */}
            <div className="relative aspect-[4/5] bg-secondary/50">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                />
            </div>

            {/* Product Content */}
            <div className="p-4 space-y-3">
                <div className="space-y-1">
                    <h3 className="text-[11px] font-bold tracking-tight uppercase text-foreground truncate block">
                        {product.name}
                    </h3>
                    <div className="flex justify-between items-center">
                        <p className="text-[9px] font-bold text-foreground/30 uppercase tracking-wider">
                            {product.category}
                        </p>
                        <span className="text-[11px] font-bold text-foreground">
                            ${product.price}
                        </span>
                    </div>
                </div>

                <button
                    onClick={handleAction}
                    className="w-full bg-foreground text-background py-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/90 transition-all active:scale-[0.98]"
                >
                    Add to Bag
                </button>
            </div>
        </div>
    );
}
