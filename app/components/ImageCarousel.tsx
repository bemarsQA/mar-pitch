import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { PlaceholderBox } from "./PlaceholderBox";

export type CarouselImage = {
  src?: string | StaticImageData;
  alt: string;
  placeholderLabel?: string;
};

export function ImageCarousel({
  images,
  heightClassName = "h-[40vh] md:h-[50vh]",
}: {
  images: CarouselImage[];
  /** Tailwind height classes for the carousel track. */
  heightClassName?: string;
}) {
  return (
    <motion.section
      className="relative w-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.3, once: true }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-14">
        <div
          className={[
            "deck-scroll -mx-6 overflow-x-auto px-6 md:-mx-10 md:px-10",
            "snap-x snap-mandatory",
          ].join(" ")}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
          }}
        >
          <div
            className={["flex gap-4 md:gap-6", heightClassName].join(" ")}
            style={{ paddingBottom: 12 }}
          >
            {images.map((img, idx) => (
              <motion.div
                key={`${img.alt}-${idx}`}
                className="relative w-[86vw] flex-none snap-center overflow-hidden rounded-2xl md:w-[70vw]"
                style={{ border: "1px solid var(--border)" }}
                initial={{ scale: 1.05 }}
                whileInView={{ scale: 1 }}
                viewport={{ amount: 0.6, once: true }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
              >
                {img.src ? (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 768px) 70vw, 86vw"
                    className="object-cover"
                    priority={idx === 0}
                  />
                ) : (
                  <PlaceholderBox
                    label={img.placeholderLabel ?? `Missing image: ${img.alt}`}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div
          className="mt-4 text-[10px] uppercase tracking-[0.24em]"
          style={{ color: "var(--muted)" }}
        >
          Drag / scroll
        </div>
      </div>
    </motion.section>
  );
}

