"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

import type {
  AdminProductRecord,
  ProductVariantForm,
} from "@/app/admin/dashboard/products/_components/products-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import { Textarea } from "@/components/ui/textarea"
import { MAX_PRODUCT_VARIANTS } from "@/lib/product-variants"

const EMPTY_FOUR: [string, string, string, string] = ["", "", "", ""]

function looksLikeHttpUrl(s: string) {
  const t = s.trim()
  if (!t) return false
  try {
    const u = new URL(t)
    return u.protocol === "http:" || u.protocol === "https:"
  } catch {
    return false
  }
}

function ImageUrlField({
  id,
  label,
  value,
  onChange,
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
}) {
  const trimmed = value.trim()
  const showPreview = looksLikeHttpUrl(trimmed)

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label} URL</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://..."
        required={required}
      />
      {showPreview ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-muted/50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-pasted URLs */}
          <img
            src={trimmed}
            alt=""
            className="mx-auto max-h-40 w-full object-contain"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        </div>
      ) : null}
    </div>
  )
}

function emptyVariant(): ProductVariantForm {
  return { label: "", imageUrls: [...EMPTY_FOUR] }
}

const adminNewProductDraft: AdminProductRecord = {
  name: "",
  sku: "",
  categoryId: "",
  category: "",
  brand: "",
  hasVariants: false,
  imageUrls: [...EMPTY_FOUR],
  variants: [emptyVariant()],
  stock: 0,
  mrp: 0,
  salePrice: 0,
  status: "Draft",
  visibility: "Hidden",
  shortDescription: "",
  tags: [],
}

export function ProductForm({
  onSaveProduct,
  initialProduct,
  submitLabel = "Add Product",
  onSubmitted,
  categories,
}: {
  onSaveProduct: (product: AdminProductRecord) => void
  initialProduct?: AdminProductRecord
  submitLabel?: string
  onSubmitted?: () => void
  categories: { id: string; name: string }[]
}) {
  const [draft, setDraft] = useState<AdminProductRecord>(
    initialProduct ?? adminNewProductDraft
  )
  const [tagsInput, setTagsInput] = useState("")

  useEffect(() => {
    if (initialProduct) {
      setDraft({
        ...initialProduct,
        variants:
          initialProduct.variants.length > 0
            ? initialProduct.variants
            : [emptyVariant()],
      })
      setTagsInput(initialProduct.tags.join(", "))
      return
    }
    setDraft({
      ...adminNewProductDraft,
      categoryId: categories[0]?.id ?? "",
    })
    setTagsInput("")
  }, [initialProduct, categories])

  function update<K extends keyof AdminProductRecord>(
    key: K,
    value: AdminProductRecord[K]
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }))
  }

  function setImageUrl(i: number, v: string) {
    setDraft((prev) => {
      const next = [...prev.imageUrls] as [string, string, string, string]
      next[i] = v
      return { ...prev, imageUrls: next }
    })
  }

  function setVariantLabel(index: number, label: string) {
    setDraft((prev) => {
      const variants = [...prev.variants]
      const row = variants[index]
      if (!row) return prev
      variants[index] = { ...row, label }
      return { ...prev, variants }
    })
  }

  function setVariantImage(vIndex: number, imgIndex: number, v: string) {
    setDraft((prev) => {
      const variants = [...prev.variants]
      const row = variants[vIndex]
      if (!row) return prev
      const imgs = [...row.imageUrls] as [string, string, string, string]
      imgs[imgIndex] = v
      variants[vIndex] = { ...row, imageUrls: imgs }
      return { ...prev, variants }
    })
  }

  function addVariant() {
    setDraft((prev) => {
      if (prev.variants.length >= MAX_PRODUCT_VARIANTS) return prev
      return { ...prev, variants: [...prev.variants, emptyVariant()] }
    })
  }

  function removeVariant(index: number) {
    setDraft((prev) => {
      if (prev.variants.length <= 1) {
        return { ...prev, variants: [emptyVariant()] }
      }
      const variants = prev.variants.filter((_, i) => i !== index)
      return { ...prev, variants }
    })
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!draft.name.trim()) return
    if (!draft.categoryId) return

    const tags = tagsInput
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)

    const variants = draft.hasVariants
      ? draft.variants
          .map((v) => ({
            label: v.label.trim(),
            imageUrls: [...v.imageUrls] as [string, string, string, string],
          }))
          .filter((v) => v.label && v.imageUrls.some((u) => u.trim()))
      : []

    const category = categories.find((c) => c.id === draft.categoryId)

    onSaveProduct({
      ...draft,
      name: draft.name.trim(),
      sku: (draft.sku ?? "").trim(),
      brand: draft.brand.trim(),
      shortDescription: draft.shortDescription.trim(),
      category: category?.name ?? draft.category,
      hasVariants: draft.hasVariants,
      imageUrls: [...draft.imageUrls],
      variants,
      tags,
    })

    if (!initialProduct) {
      setDraft({
        ...adminNewProductDraft,
        categoryId: categories[0]?.id ?? "",
      })
      setTagsInput("")
    }
    onSubmitted?.()
  }

  const categoryDisabled = categories.length === 0

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border bg-card p-4 text-card-foreground"
    >
      <h2 className="text-lg font-semibold">Product details</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Choose category from the list you manage under Categories. Up to four
        product images without variants, or up to four variants with four images
        each.
      </p>

      {categoryDisabled ? (
        <p className="mt-3 rounded-lg border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          Create a category first in{" "}
          <Link href="/admin/dashboard/categories" className="font-semibold underline">
            Categories
          </Link>
          .
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="product-name">Product name</Label>
          <Input
            id="product-name"
            value={draft.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="iPhone 16 Pro Max"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="product-category">Category</Label>
          <NativeSelect
            id="product-category"
            value={draft.categoryId}
            onChange={(e) => update("categoryId", e.target.value)}
            className="w-full"
            disabled={categoryDisabled}
            required
          >
            <NativeSelectOption value="" disabled>
              Select category
            </NativeSelectOption>
            {categories.map((c) => (
              <NativeSelectOption key={c.id} value={c.id}>
                {c.name}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-brand">Brand</Label>
          <Input
            id="product-brand"
            value={draft.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="Apple"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-mrp">MRP</Label>
          <Input
            id="product-mrp"
            type="number"
            min={0}
            value={draft.mrp}
            onChange={(e) => update("mrp", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-sale-price">Sale price</Label>
          <Input
            id="product-sale-price"
            type="number"
            min={0}
            value={draft.salePrice}
            onChange={(e) => update("salePrice", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-stock">Stock</Label>
          <Input
            id="product-stock"
            type="number"
            min={0}
            value={draft.stock}
            onChange={(e) => update("stock", Number(e.target.value))}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-status">Status</Label>
          <NativeSelect
            id="product-status"
            value={draft.status}
            onChange={(e) =>
              update("status", e.target.value as AdminProductRecord["status"])
            }
            className="w-full"
          >
            <NativeSelectOption value="Draft">Draft</NativeSelectOption>
            <NativeSelectOption value="Published">Published</NativeSelectOption>
            <NativeSelectOption value="Out of stock">
              Out of stock
            </NativeSelectOption>
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="product-visibility">Visibility</Label>
          <NativeSelect
            id="product-visibility"
            value={draft.visibility}
            onChange={(e) =>
              update(
                "visibility",
                e.target.value as AdminProductRecord["visibility"]
              )
            }
            className="w-full"
          >
            <NativeSelectOption value="Public">Public</NativeSelectOption>
            <NativeSelectOption value="Hidden">Hidden</NativeSelectOption>
          </NativeSelect>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
        <Checkbox
          id="product-has-variants"
          checked={draft.hasVariants}
          onCheckedChange={(c) => update("hasVariants", c === true)}
        />
        <Label htmlFor="product-has-variants" className="cursor-pointer font-normal">
          This product has variants (e.g. colors) — up to four, four images each
        </Label>
      </div>

      <div className="mt-6 space-y-4 rounded-xl border bg-muted/20 p-4 sm:p-5">
        {!draft.hasVariants ? (
          <>
            <h3 className="text-sm font-semibold text-foreground">
              Product images (up to 4)
            </h3>
            <p className="text-xs text-muted-foreground">
              Paste image URLs. A preview appears below each field when the URL
              loads.
            </p>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {[0, 1, 2, 3].map((i) => (
                <ImageUrlField
                  key={i}
                  id={`img-${i}`}
                  label={`Image ${i + 1}`}
                  value={draft.imageUrls[i] ?? ""}
                  onChange={(v) => setImageUrl(i, v)}
                  required={i === 0}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-semibold text-foreground">
              Variants (max {MAX_PRODUCT_VARIANTS})
            </h3>
            <div className="mt-4 space-y-8">
              {draft.variants.map((v, vi) => (
                <div
                  key={vi}
                  className="space-y-4 rounded-lg border bg-background/80 p-4"
                >
                  <div className="flex flex-wrap items-end gap-3">
                    <div className="min-w-[10rem] flex-1 space-y-2">
                      <Label htmlFor={`var-label-${vi}`}>Variant label</Label>
                      <Input
                        id={`var-label-${vi}`}
                        value={v.label}
                        onChange={(e) => setVariantLabel(vi, e.target.value)}
                        placeholder="Black, 128GB, …"
                      />
                    </div>
                    {draft.variants.length > 1 ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeVariant(vi)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2">
                    {[0, 1, 2, 3].map((ii) => (
                      <ImageUrlField
                        key={ii}
                        id={`var-${vi}-img-${ii}`}
                        label={`Image ${ii + 1}`}
                        value={v.imageUrls[ii] ?? ""}
                        onChange={(val) => setVariantImage(vi, ii, val)}
                        required={vi === 0 && ii === 0}
                      />
                    ))}
                  </div>
                </div>
              ))}
              {draft.variants.length < MAX_PRODUCT_VARIANTS ? (
                <Button type="button" variant="secondary" onClick={addVariant}>
                  Add variant
                </Button>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="product-description">Short description</Label>
        <Textarea
          id="product-description"
          value={draft.shortDescription}
          onChange={(e) => update("shortDescription", e.target.value)}
          placeholder="Key details for listing and product page."
          className="min-h-24"
        />
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="product-tags">Tags (comma separated)</Label>
        <Input
          id="product-tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="5g, flagship, camera"
        />
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="submit" disabled={categoryDisabled}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
