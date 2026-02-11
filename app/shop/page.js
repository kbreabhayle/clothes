import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function ShopPage() {
    return (
        <main className="min-h-screen pt-24">
            <Navbar />
            <div className="container-custom py-12">
                <h1 className="text-xl font-bold tracking-tight text-white mb-6 uppercase">Shop All</h1>
                <ProductGrid />
            </div>
            <Footer />
        </main>
    );
}
