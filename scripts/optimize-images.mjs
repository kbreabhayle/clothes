import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const products = [
    {
        id: 1,
        name: "Midnight Velvet Blazer",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1000&h=1200&fit=crop"
    },
    {
        id: 2,
        name: "Silk Flow Dress",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=1000&h=1200&fit=crop"
    },
    {
        id: 3,
        name: "Urban Edge Denim",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=1000&h=1200&fit=crop"
    },
    {
        id: 4,
        name: "Cashmere Cloud Sweater",
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&h=1200&fit=crop"
    },
    {
        id: 5,
        name: "Leather Chronos Watch",
        image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=1000&h=1200&fit=crop"
    },
    {
        id: 6,
        name: "Classic White Tee",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=1000&h=1200&fit=crop"
    },
    {
        id: 7,
        name: "Noir Evening Gown",
        image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=1000&h=1200&fit=crop"
    },
    {
        id: 8,
        name: "Aviator Sunglasses",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1000&h=1200&fit=crop"
    },
    {
        id: 9,
        name: "Tailored Chinos",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=1000&h=1200&fit=crop"
    },
    {
        id: 10,
        name: "Bohemian Maxi Skirt",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=1000&h=1200&fit=crop"
    },
    {
        id: 11,
        name: "Milano Leather Bag",
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1000&h=1200&fit=crop"
    },
    {
        id: 12,
        name: "Performance Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1000&h=1200&fit=crop"
    }
];

const DOWNLOAD_DIR = path.join(process.cwd(), 'public', 'images', 'products');

if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

async function downloadAndOptimize() {
    console.log('--- Starting Image Optimization (90% Quality Target) ---');

    for (const product of products) {
        const fileName = `${product.name.toLowerCase().replace(/\s+/g, '-')}.webp`;
        const filePath = path.join(DOWNLOAD_DIR, fileName);

        console.log(`Processing: ${product.name}...`);

        try {
            const response = await fetch(product.image);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            await sharp(buffer)
                .webp({ quality: 90 })
                .toFile(filePath);

            console.log(`Done: ${fileName}`);
        } catch (error) {
            console.error(`Error processing ${product.name}:`, error.message);
        }
    }

    console.log('--- Optimization Complete ---');
}

downloadAndOptimize();
