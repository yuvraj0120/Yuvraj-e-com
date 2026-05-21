/** Build alternate Picsum views from a single product image URL (same seed, different size/fx). */
export type ProductGallerySlide = {
  thumbSrc: string
  mainSrc: string
}

export function buildProductGallerySlides(
  imageUrl: string,
  galleryImageUrls: string[] = []
): ProductGallerySlide[] {
  const provided = [imageUrl, ...galleryImageUrls]
    .map((x) => x.trim())
    .filter(Boolean)
  const uniqueProvided = Array.from(new Set(provided))
  if (uniqueProvided.length > 1) {
    return uniqueProvided.slice(0, 4).map((src) => ({
      thumbSrc: src,
      mainSrc: src,
    }))
  }

  const m = imageUrl.match(
    /^(https:\/\/picsum\.photos\/seed\/[^/]+)\/(\d+)\/(\d+)(\?[^#]*)?(#.*)?$/i
  )
  if (!m) {
    return [
      { thumbSrc: imageUrl, mainSrc: imageUrl },
      { thumbSrc: imageUrl, mainSrc: imageUrl },
      { thumbSrc: imageUrl, mainSrc: imageUrl },
    ]
  }

  const [, basePath, , , query = "", hash = ""] = m
  const q = query || ""
  const h = hash || ""

  const dim = (path: string, w: number, hgt: number) =>
    `${path}/${w}/${hgt}${q}${h}`

  const base = `${basePath}`
  return [
    { thumbSrc: dim(base, 88, 88), mainSrc: dim(base, 720, 720) },
    {
      thumbSrc: `${dim(base, 88, 88)}${q ? "&" : "?"}blur=2`,
      mainSrc: `${dim(base, 720, 720)}${q ? "&" : "?"}blur=2`,
    },
    {
      thumbSrc: `${dim(base, 88, 88)}${q ? "&" : "?"}grayscale`,
      mainSrc: `${dim(base, 720, 720)}${q ? "&" : "?"}grayscale`,
    },
  ]
}
