import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Collections from "@/components/Collections";

export default function CollectionsPage() {
    return (
        <main className="min-h-screen pt-24 bg-white">
            <Navbar />
            <div className="container-custom py-12">
                <h1 className="text-4xl font-heading font-black tracking-tight mb-8">COLLECTIONS</h1>
                <p className="text-text-muted mb-12 max-w-xl underline-offset-4 decoration-1">
                    Explore our curated edits designed to inspire the modern wardrobe.
                </p>
            </div>
            <Collections />
            <Footer />
        </main>
    );
}
