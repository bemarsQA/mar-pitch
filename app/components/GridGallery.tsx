import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { PlaceholderBox } from "./PlaceholderBox";

export type GalleryImage = {
  src?: string | StaticImageData;
  alt: string;
  placeholderLabel?: string;
};

export function GridGallery({
  images,
  variant = "2x2",
  gapClassName = "gap-3 md:gap-4",
}: {
  images: GalleryImage[];
  variant?: "2x2" | "3x2";
  gapClassName?: string;
}) {
  const gridClass =
    variant === "3x2"
      ? "grid-cols-2 md:grid-cols-3"
      : "grid-cols-2 md:grid-cols-2";

  return (
    <motion.section
      className="relative w-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.25, once: true }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div className={`grid ${gridClass} ${gapClassName}`}>
          {images.map((img, idx) => (
            <motion.div
              key={`${img.alt}-${idx}`}
              className="group relative overflow-hidden rounded-2xl"
              style={{ border: "1px solid var(--border)" }}
              initial={{ scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ amount: 0.6, once: true }}
              transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <div className="relative aspect-[4/3]">
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes={
                      variant === "3x2"
                        ? "(min-width: 768px) 33vw, 50vw"
                        : "(min-width: 768px) 50vw, 50vw"
                    }
                    className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
                    priority={idx < 2}
                  />
                ) : (
                  <PlaceholderBox
                    label={img.placeholderLabel ?? `Missing image: ${img.alt}`}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

