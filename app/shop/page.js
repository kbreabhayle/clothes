import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Footer from "@/components/Footer";

export default function ShopPage() {
    return (
        <main className="min-h-screen pt-24">
            <Navbar />
            <div className="container-custom py-12">
                <h1 className="text-4xl font-heading font-black tracking-tight mb-8">SHOP ALL</h1>
                <ProductGrid />
            </div>
            <Footer />
        </main>
    );
}
