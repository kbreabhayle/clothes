import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Collections from "@/components/Collections";

export default function CollectionsPage() {
    return (
        <main className="min-h-screen pt-24 bg-background">
            <Navbar />
            <div className="container-custom py-12">
                <h1 className="text-xl font-bold tracking-wider uppercase text-white mb-4">Collections</h1>
                <p className="text-[10px] text-white/30 tracking-widest uppercase mb-12 max-w-xl">
                    Explore our curated edits designed to inspire the modern wardrobe.
                </p>
            </div>
            <Collections />
            <Footer />
        </main>
    );
}
