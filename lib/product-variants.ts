/** Stored in Prisma `Product.colorVariants` JSON. */
export type StoredProductVariant = {
  label: string
  images: string[]
}

export const MAX_PRODUCT_VARIANTS = 4
export const IMAGES_PER_VARIANT_OR_PRODUCT = 4

export function parseStoredVariants(raw: unknown): StoredProductVariant[] {
  if (!Array.isArray(raw)) return []
  const out: StoredProductVariant[] = []
  for (const item of raw.slice(0, MAX_PRODUCT_VARIANTS)) {
    if (item == null || typeof item !== "object") continue
    const o = item as Record<string, unknown>
    if (Array.isArray(o.images)) {
      const label = String(o.label ?? o.color ?? "").trim()
      const images = o.images
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter(Boolean)
        .slice(0, IMAGES_PER_VARIANT_OR_PRODUCT)
      if (label && images.length) {
        out.push({ label, images })
      }
      continue
    }
    const legacyLabel = String(o.color ?? o.label ?? "").trim()
    const legacyUrl = typeof o.imageUrl === "string" ? o.imageUrl.trim() : ""
    if (legacyLabel && legacyUrl) {
      out.push({ label: legacyLabel, images: [legacyUrl] })
    }
  }
  return out
}

export type ShopColorVariant = {
  color: string
  imageUrl: string
  galleryImageUrls: string[]
}

export function toShopColorVariants(
  parsed: StoredProductVariant[]
): ShopColorVariant[] {
  return parsed.map((v) => {
    const uniq = Array.from(new Set(v.images.map((x) => x.trim()).filter(Boolean)))
    const four = uniq.slice(0, IMAGES_PER_VARIANT_OR_PRODUCT)
    const main = four[0] ?? ""
    return {
      color: v.label,
      imageUrl: main,
      galleryImageUrls: four.slice(1),
    }
  })
}

export function padImageTuple(urls: string[]): [string, string, string, string] {
  const u = urls
    .map((x) => x.trim())
    .filter(Boolean)
    .slice(0, IMAGES_PER_VARIANT_OR_PRODUCT)
  return [u[0] ?? "", u[1] ?? "", u[2] ?? "", u[3] ?? ""]
}

export function tupleToFilledList(t: [string, string, string, string]) {
  return t.map((s) => s.trim()).filter(Boolean)
}
