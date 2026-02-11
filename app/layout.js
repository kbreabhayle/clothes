import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "StyleVault — Premium Fashion Destination",
  description: "Discover curated collections of premium clothing. Timeless elegance meets contemporary design.",
  keywords: "fashion, clothing, premium, style, online shopping, luxury",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${outfit.variable} ${inter.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
