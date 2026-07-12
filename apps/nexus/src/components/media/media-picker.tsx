"use client";

import Image from "next/image";
import {
  Check,
  ImageIcon,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type MediaPickerItem = {
  id: string;
  originalName: string;
  url: string;
  altText: string | null;
  category: string;
  createdAtLabel: string;
};

type MediaPickerProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  media: MediaPickerItem[];
  description?: string;
  required?: boolean;
};

function formatCategory(category: string) {
  return category
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function MediaPicker({
  label,
  value,
  onChange,
  media,
  description,
  required = false,
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const selectedMedia = useMemo(() => {
    return media.find((item) => item.url === value) ?? null;
  }, [media, value]);

  const categoryOptions = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(media.map((item) => item.category)),
    );

    return [
      {
        label: "Semua Kategori",
        value: "ALL",
      },
      ...uniqueCategories.map((category) => ({
        label: formatCategory(category),
        value: category,
      })),
    ];
  }, [media]);

  const filteredMedia = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    return media.filter((item) => {
      const matchesCategory =
        selectedCategory === "ALL" || item.category === selectedCategory;

      const matchesKeyword =
        !keyword ||
        item.originalName.toLowerCase().includes(keyword) ||
        item.url.toLowerCase().includes(keyword) ||
        item.altText?.toLowerCase().includes(keyword);

      return matchesCategory && matchesKeyword;
    });
  }, [media, searchKeyword, selectedCategory]);

  function handleSelect(item: MediaPickerItem) {
    onChange(item.url);
    setIsOpen(false);
  }

  function handleClear() {
    onChange("");
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">
        {label}
        {required ? <span className="text-primary"> *</span> : null}
      </label>

      {description ? (
        <p className="text-xs leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}

      {value ? (
        <div className="overflow-hidden rounded-2xl border bg-background">
          <div className="relative aspect-video bg-muted">
            {selectedMedia ? (
              <Image
                src={selectedMedia.url}
                alt={selectedMedia.altText ?? selectedMedia.originalName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Media URL terpilih
              </div>
            )}
          </div>

          <div className="space-y-3 p-4">
            <div>
              <p className="line-clamp-1 font-bold">
                {selectedMedia?.originalName ?? "Media terpilih"}
              </p>
              <p className="mt-1 break-all text-xs text-muted-foreground">
                {value}
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(true)}
              >
                <ImageIcon className="size-4" />
                Ganti Media
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleClear}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                Hapus Pilihan
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed bg-background px-5 py-8 text-center transition hover:bg-muted/50"
        >
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ImageIcon className="size-6" />
          </div>

          <p className="font-black tracking-tight">Pilih Media</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Ambil gambar dari Media Library Nexus.
          </p>
        </button>
      )}

      {isOpen ? (
        <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/55 px-4 py-6">
          <div className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border bg-card shadow-xl">
            <div className="flex shrink-0 items-start justify-between gap-4 border-b p-5">
              <div>
                <h2 className="text-lg font-black tracking-tight">
                  Pilih Media
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pilih gambar dari Media Library untuk digunakan sebagai cover.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-xl border p-2 text-muted-foreground transition hover:text-foreground"
                aria-label="Tutup media picker"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="shrink-0 space-y-3 border-b p-5">
              <div className="grid gap-3 md:grid-cols-[1fr_240px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={searchKeyword}
                    onChange={(event) => setSearchKeyword(event.target.value)}
                    placeholder="Cari nama file, alt text, atau URL..."
                    className="h-10 w-full rounded-xl border border-input bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(event) => setSelectedCategory(event.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                >
                  {categoryOptions.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {filteredMedia.length ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredMedia.map((item) => {
                    const active = item.url === value;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={cn(
                          "overflow-hidden rounded-2xl border bg-background text-left transition hover:border-primary",
                          active && "border-primary ring-2 ring-primary/20",
                        )}
                      >
                        <div className="relative aspect-video bg-muted">
                          <Image
                            src={item.url}
                            alt={item.altText ?? item.originalName}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover"
                          />

                          {active ? (
                            <div className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                              <Check className="size-4" />
                            </div>
                          ) : null}
                        </div>

                        <div className="space-y-2 p-3">
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {formatCategory(item.category)}
                            </span>
                          </div>

                          <p className="line-clamp-1 font-bold">
                            {item.originalName}
                          </p>

                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {item.url}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {item.createdAtLabel}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed p-8 text-center">
                  <p className="font-black tracking-tight">
                    Media tidak ditemukan
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Coba ubah keyword pencarian atau kategori.
                  </p>
                </div>
              )}
            </div>

            <div className="flex shrink-0 justify-end border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}