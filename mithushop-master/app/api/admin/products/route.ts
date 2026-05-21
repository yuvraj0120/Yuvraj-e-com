import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"
import {
  MAX_PRODUCT_VARIANTS,
  parseStoredVariants,
  padImageTuple,
  tupleToFilledList,
  type StoredProductVariant,
} from "@/lib/product-variants"

export const runtime = "nodejs"

type VariantPayload = {
  label: string
  imageUrls: string[]
}

type ProductPayload = {
  id?: string
  name: string
  sku?: string
  categoryId: string
  brand?: string
  stock: number
  mrp: number
  salePrice: number
  shortDescription: string
  hasVariants?: boolean
  /** Four image URLs when product has no variants */
  imageUrls?: string[]
  /** Up to four variants; each has up to four images */
  variants?: VariantPayload[]
  visibility?: "Public" | "Hidden"
  status: "Published" | "Draft" | "Out of stock"
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

function skuBase(input: string) {
  const clean = input
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
  return clean || "PRD"
}

async function buildUniqueSku(nameOrSku: string, ignoreId?: string) {
  const base = skuBase(nameOrSku)
  const attempts = [base, `${base}-${Date.now()}`]

  for (const attempt of attempts) {
    const existing = await prisma.product.findUnique({
      where: { sku: attempt },
      select: { id: true },
    })
    if (!existing || existing.id === ignoreId) return attempt
  }

  let suffix = 1
  while (suffix < 10000) {
    const candidate = `${base}-${suffix}`
    const existing = await prisma.product.findUnique({
      where: { sku: candidate },
      select: { id: true },
    })
    if (!existing || existing.id === ignoreId) return candidate
    suffix += 1
  }
  return `${base}-${Date.now()}`
}

const FALLBACK_IMAGE = "https://picsum.photos/seed/default-product/400/400"

function normalizeVariantPayloads(
  variants: VariantPayload[] | undefined
): StoredProductVariant[] {
  const list = (variants ?? []).slice(0, MAX_PRODUCT_VARIANTS)
  const out: StoredProductVariant[] = []
  for (const v of list) {
    const label = v.label?.trim() ?? ""
    const images = tupleToFilledList(padImageTuple(v.imageUrls ?? []))
    if (label && images.length) {
      out.push({ label, images })
    }
  }
  return out
}

function persistImages(
  hasVariants: boolean,
  storedVariants: StoredProductVariant[],
  baseImageUrls: string[]
): {
  imageUrl: string
  galleryImageUrls: string[]
  colorVariants: StoredProductVariant[] | null
} {
  if (hasVariants && storedVariants.length > 0) {
    const firstImgs = storedVariants[0]!.images
    const main = firstImgs[0] || FALLBACK_IMAGE
    const gallery = [...firstImgs].slice(0, 4)
    return {
      imageUrl: main,
      galleryImageUrls: gallery.length ? gallery : [main],
      colorVariants: storedVariants,
    }
  }

  const four = tupleToFilledList(padImageTuple(baseImageUrls))
  const imgs = four.length ? four : [FALLBACK_IMAGE]
  const main = imgs[0] || FALLBACK_IMAGE
  return {
    imageUrl: main,
    galleryImageUrls: imgs,
    colorVariants: null,
  }
}

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: { select: { id: true, name: true } } },
  })

  return NextResponse.json(
    products.map((p) => {
      const parsed = parseStoredVariants(p.colorVariants)
      const hasVariants = parsed.length > 0
      const g = Array.isArray(p.galleryImageUrls)
        ? p.galleryImageUrls.map((x) => String(x).trim()).filter(Boolean)
        : []

      const imageUrls = padImageTuple(
        hasVariants && parsed[0]
          ? parsed[0].images
          : g.length
            ? g
            : [p.imageUrl]
      )

      const variants = parsed.map((v) => ({
        label: v.label,
        imageUrls: padImageTuple(v.images),
      }))

      return {
        id: p.id,
        name: p.title,
        sku: p.sku,
        categoryId: p.category.id,
        category: p.category.name,
        brand: p.brand ?? "",
        hasVariants,
        imageUrls,
        variants,
        stock: p.stockCount,
        mrp: p.originalPrice,
        salePrice: p.discountPrice,
        status:
          p.status === "PUBLISHED"
            ? p.stockCount > 0
              ? "Published"
              : "Out of stock"
            : "Draft",
        visibility: p.status === "PUBLISHED" ? "Public" : "Hidden",
        shortDescription: p.description,
        tags: [],
      }
    })
  )
}

export async function POST(req: Request) {
  const body = (await req.json()) as ProductPayload

  if (!body.name?.trim() || !body.categoryId?.trim()) {
    return NextResponse.json(
      { error: "Name and category are required." },
      { status: 400 }
    )
  }

  const category = await prisma.category.findUnique({
    where: { id: body.categoryId },
    select: { id: true },
  })
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 400 })
  }

  const hasVariants = Boolean(body.hasVariants)
  const storedVariants = normalizeVariantPayloads(body.variants)
  if (hasVariants && storedVariants.length === 0) {
    return NextResponse.json(
      { error: "Add at least one variant with a label and image." },
      { status: 400 }
    )
  }
  if (!hasVariants) {
    const base = tupleToFilledList(padImageTuple(body.imageUrls ?? []))
    if (base.length === 0) {
      return NextResponse.json(
        { error: "Add at least one product image." },
        { status: 400 }
      )
    }
  }

  const { imageUrl, galleryImageUrls, colorVariants } = persistImages(
    hasVariants,
    storedVariants,
    tupleToFilledList(padImageTuple(body.imageUrls ?? []))
  )

  const baseSlug = slugify(body.name)
  const slug = `${baseSlug}-${Date.now()}`
  const sku = await buildUniqueSku(body.sku?.trim() || body.name)

  const created = await prisma.product.create({
    data: {
      title: body.name.trim(),
      sku,
      slug,
      brand: body.brand?.trim() || null,
      description: body.shortDescription?.trim() || body.name.trim(),
      imageUrl,
      galleryImageUrls,
      colorVariants: colorVariants ?? [],
      originalPrice: Number(body.mrp) || 0,
      discountPrice: Number(body.salePrice) || 0,
      stockCount:
        body.status === "Out of stock" ? 0 : Math.max(0, Number(body.stock) || 0),
      status: body.status === "Published" ? "PUBLISHED" : "DRAFT",
      categoryId: body.categoryId,
    },
  })

  return NextResponse.json({ id: created.id }, { status: 201 })
}

export async function PATCH(req: Request) {
  const body = (await req.json()) as ProductPayload

  if (!body.id || !body.name?.trim() || !body.categoryId?.trim()) {
    return NextResponse.json(
      { error: "Id, name and category are required." },
      { status: 400 }
    )
  }

  const existing = await prisma.product.findUnique({
    where: { id: body.id },
    select: { id: true, sku: true },
  })
  if (!existing) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 })
  }

  const category = await prisma.category.findUnique({
    where: { id: body.categoryId },
    select: { id: true },
  })
  if (!category) {
    return NextResponse.json({ error: "Category not found." }, { status: 400 })
  }

  const hasVariants = Boolean(body.hasVariants)
  const storedVariants = normalizeVariantPayloads(body.variants)
  if (hasVariants && storedVariants.length === 0) {
    return NextResponse.json(
      { error: "Add at least one variant with a label and image." },
      { status: 400 }
    )
  }
  if (!hasVariants) {
    const base = tupleToFilledList(padImageTuple(body.imageUrls ?? []))
    if (base.length === 0) {
      return NextResponse.json(
        { error: "Add at least one product image." },
        { status: 400 }
      )
    }
  }

  const { imageUrl, galleryImageUrls, colorVariants } = persistImages(
    hasVariants,
    storedVariants,
    tupleToFilledList(padImageTuple(body.imageUrls ?? []))
  )

  const sku = await buildUniqueSku(
    body.sku?.trim() || existing.sku || body.name,
    body.id
  )

  await prisma.product.update({
    where: { id: body.id },
    data: {
      title: body.name.trim(),
      sku,
      brand: body.brand?.trim() || null,
      description: body.shortDescription?.trim() || body.name.trim(),
      imageUrl,
      galleryImageUrls,
      colorVariants: colorVariants ?? [],
      originalPrice: Number(body.mrp) || 0,
      discountPrice: Number(body.salePrice) || 0,
      stockCount:
        body.status === "Out of stock" ? 0 : Math.max(0, Number(body.stock) || 0),
      status: body.status === "Published" ? "PUBLISHED" : "DRAFT",
      categoryId: body.categoryId,
    },
  })

  return NextResponse.json({ ok: true })
}
