"use client";

import Image from "next/image";
import { useState } from "react";

type Img = { id: number; url: string };

export function VehicleImageGallery({ images, title }: { images: Img[]; title: string }) {
  const [idx, setIdx] = useState(0);
  const main = images[idx] ?? images[0];
  if (!main) {
    return (
      <div className="relative aspect-[16/10] w-full rounded-xl bg-[#f5f5f5]">
        <Image src="/placeholder-car.svg" alt={title} fill className="object-contain p-8" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f5f5f5]">
        <Image
          src={main.url}
          alt={title}
          fill
          className="object-contain"
          priority
          sizes="(max-width:1024px) 100vw, 66vw"
        />
        <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
          {idx + 1} / {images.length}
        </span>
      </div>
      {images.length > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((im, i) => (
            <button
              key={im.id}
              type="button"
              onClick={() => setIdx(i)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border-2 ${
                i === idx ? "border-[#0c47a5]" : "border-transparent"
              }`}
            >
              <Image src={im.url} alt="" fill className="object-cover" sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
