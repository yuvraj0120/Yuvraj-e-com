import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

const PRODUCT_BLUEPRINTS = [
  ["Mobiles", "5G Smartphone Pro"],
  ["Mobiles", "Budget Android Phone"],
  ["Mobiles", "Camera Phone Max"],
  ["Mobiles", "Gaming Mobile X"],
  ["Accessories", "Fast Charger 65W"],
  ["Accessories", "Power Bank 20000mAh"],
  ["Accessories", "USB-C Cable Braided"],
  ["Accessories", "Tempered Glass 2-Pack"],
  ["Audio", "TWS Earbuds Pro"],
  ["Audio", "Over-Ear Headphones"],
  ["Audio", "Portable Bluetooth Speaker"],
  ["Audio", "ANC Earbuds Lite"],
  ["Wearables", "Smartwatch Fitness"],
  ["Wearables", "Fitness Band Color"],
  ["Wearables", "Sports Watch Waterproof"],
  ["Wearables", "Smart Ring Tracker"],
  ["Smart Home", "WiFi Security Camera"],
  ["Smart Home", "Smart Bulb RGB"],
  ["Smart Home", "Video Doorbell"],
  ["Smart Home", "Air Purifier Compact"],
  ["Mobiles", "Foldable Display Phone"],
  ["Mobiles", "Rugged Outdoor Phone"],
  ["Mobiles", "Compact Mini Phone"],
  ["Mobiles", "Flagship Clone Series"],
  ["Accessories", "Wireless Charging Pad"],
  ["Accessories", "Car Phone Mount"],
  ["Accessories", "Bluetooth Remote Shutter"],
  ["Accessories", "Phone Case Clear"],
  ["Audio", "Neckband Earphones"],
  ["Audio", "Gaming Headset RGB"],
  ["Audio", "Soundbar Mini"],
  ["Audio", "Wired Earphones Bass"],
  ["Wearables", "Kids GPS Watch"],
  ["Wearables", "Luxury Style Watch"],
  ["Wearables", "Smartwatch AMOLED"],
  ["Wearables", "Health Monitor Band"],
  ["Smart Home", "4K Android Projector"],
  ["Smart Home", "Robot Vacuum Mini"],
  ["Smart Home", "Smart Plug WiFi"],
  ["Smart Home", "Home Hub Speaker"],
]

const seedProducts = PRODUCT_BLUEPRINTS.map(([category, title], index) => {
  const n = index + 1
  const originalPrice = 1500 + n * 777
  const discountPercent = 10 + (n % 25)
  const discountPrice = Math.round((originalPrice * (100 - discountPercent)) / 100)
  return {
    sku: `MMC-${String(n).padStart(4, "0")}`,
    title,
    slug: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${n}`,
    category,
    description: `${title} from ${category} category with reliable quality and value.`,
    imageUrl: `https://picsum.photos/seed/mmc-${n}/400/400`,
    galleryImageUrls: [
      `https://picsum.photos/seed/mmc-${n}/400/400`,
      `https://picsum.photos/seed/mmc-${n}-a/400/400`,
      `https://picsum.photos/seed/mmc-${n}-b/400/400`,
      `https://picsum.photos/seed/mmc-${n}-c/400/400`,
    ],
    colorVariants:
      n % 5 === 0
        ? [
            {
              label: "Black",
              images: [
                `https://picsum.photos/seed/mmc-${n}-black/400/400`,
                `https://picsum.photos/seed/mmc-${n}-black-a/400/400`,
                `https://picsum.photos/seed/mmc-${n}-black-b/400/400`,
                `https://picsum.photos/seed/mmc-${n}-black-c/400/400`,
              ],
            },
            {
              label: "Blue",
              images: [
                `https://picsum.photos/seed/mmc-${n}-blue/400/400`,
                `https://picsum.photos/seed/mmc-${n}-blue-a/400/400`,
                `https://picsum.photos/seed/mmc-${n}-blue-b/400/400`,
                `https://picsum.photos/seed/mmc-${n}-blue-c/400/400`,
              ],
            },
          ]
        : [],
    brand:
      category === "Mobiles"
        ? "Mithu"
        : category === "Accessories"
          ? "PowerTek"
          : category === "Audio"
            ? "SoundMax"
            : category === "Wearables"
              ? "FitPulse"
              : "SmartNest",
    originalPrice,
    discountPrice,
    discountPercent,
    isFeatured: n % 7 === 0,
    isNew: n % 5 === 0,
    isRecommended: n % 3 === 0,
    showStockUrgency: n % 6 === 0,
    stockCount: 4 + (n % 20),
    popularityScore: 1000 - n * 11,
    averageRating: Number((3.8 + (n % 12) * 0.1).toFixed(1)),
    newnessRank: 100 + n,
  }
})

async function main() {
  const categories = ["Mobiles", "Accessories", "Audio", "Wearables", "Smart Home"]
  for (const name of categories) {
    const slug = name.toLowerCase().replace(/\s+/g, "-")
    await prisma.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    })
  }

  for (const p of seedProducts) {
    const categorySlug = p.category.toLowerCase().replace(/\s+/g, "-")
    const category = await prisma.category.findUniqueOrThrow({
      where: { slug: categorySlug },
    })

    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        brand: p.brand,
        imageUrl: p.imageUrl,
        galleryImageUrls: p.galleryImageUrls,
        colorVariants: p.colorVariants,
        originalPrice: p.originalPrice,
        discountPrice: p.discountPrice,
        discountPercent: p.discountPercent,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isRecommended: p.isRecommended,
        showStockUrgency: p.showStockUrgency,
        stockCount: p.stockCount,
        popularityScore: p.popularityScore,
        averageRating: p.averageRating,
        newnessRank: p.newnessRank,
        status: "PUBLISHED",
        categoryId: category.id,
      },
      create: {
        sku: p.sku,
        title: p.title,
        slug: p.slug,
        description: p.description,
        brand: p.brand,
        imageUrl: p.imageUrl,
        galleryImageUrls: p.galleryImageUrls,
        colorVariants: p.colorVariants,
        originalPrice: p.originalPrice,
        discountPrice: p.discountPrice,
        discountPercent: p.discountPercent,
        isFeatured: p.isFeatured,
        isNew: p.isNew,
        isRecommended: p.isRecommended,
        showStockUrgency: p.showStockUrgency,
        stockCount: p.stockCount,
        popularityScore: p.popularityScore,
        averageRating: p.averageRating,
        newnessRank: p.newnessRank,
        status: "PUBLISHED",
        categoryId: category.id,
      },
    })
  }

  const adminEmail = "ram@gmail.com"
  const passwordHash = await bcrypt.hash("ram@123", 12)
  await prisma.user.upsert({
    where: { id: "69d60158883a576a8348f80c" },
    update: {
      email: adminEmail,
      name: "Ram",
      role: "ADMIN",
      passwordHash,
    },
    create: {
      id: "69d60158883a576a8348f80c",
      email: adminEmail,
      name: "Ram",
      role: "ADMIN",
      passwordHash,
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
