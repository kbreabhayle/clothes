import { Shield, Truck, RotateCcw, Award } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: "Global Shipping",
        description: "Premium delivery to over 50 countries worldwide."
    },
    {
        icon: RotateCcw,
        title: "Easy Returns",
        description: "Complimentary return service within 30 days."
    },
    {
        icon: Shield,
        title: "Secure Payment",
        description: "Encrypted transactions for absolute peace of mind."
    },
    {
        icon: Award,
        title: "Premium Quality",
        description: "Finest materials sourced from global artisans."
    }
];

export default function Features() {
    return (
        <section className="py-20 bg-secondary border-y border-black/5">
            <div className="container-custom">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center group">
                            <div className="w-12 h-12 flex items-center justify-center bg-white border border-black/5 mb-6 group-hover:border-black transition-colors duration-300">
                                <feature.icon size={20} strokeWidth={1} />
                            </div>
                            <h4 className="text-[10px] font-bold tracking-[0.3em] uppercase mb-4">
                                {feature.title}
                            </h4>
                            <p className="text-xs text-text-muted max-w-[200px] leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
