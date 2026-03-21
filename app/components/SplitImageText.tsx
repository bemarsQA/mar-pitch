import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { PlaceholderBox } from "./PlaceholderBox";

export function SplitImageText({
  image,
  text,
  imageWidth = 0.6,
  flip = false,
}: {
  image: {
    src?: string | StaticImageData;
    alt: string;
    priority?: boolean;
    sizes?: string;
    placeholderLabel?: string;
  };
  text: React.ReactNode;
  /** 0.5 → 0.7 */
  imageWidth?: number;
  /** Put image on right (desktop). */
  flip?: boolean;
}) {
  const w = Math.max(0.5, Math.min(imageWidth, 0.7));
  const cols = Math.round(w * 12); // 6..8
  const imgCols = Math.max(6, Math.min(cols, 8));
  const textCols = 12 - imgCols;

  return (
    <motion.section
      className="relative w-full"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.35, once: true }}
      transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div className="mx-auto w-full max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-10">
          <motion.div
            className={[
              "relative overflow-hidden rounded-2xl",
              `md:col-span-${imgCols}`,
              flip ? "md:order-2" : "md:order-1",
            ].join(" ")}
            style={{ border: "1px solid var(--border)" }}
            initial={{ scale: 1.05 }}
            whileInView={{ scale: 1 }}
            viewport={{ amount: 0.5, once: true }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <div className="relative aspect-[16/11] md:aspect-[16/10]">
              {image.src ? (
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  priority={image.priority}
                  sizes={image.sizes ?? "(min-width: 768px) 60vw, 100vw"}
                  className="object-cover"
                />
              ) : (
                <PlaceholderBox
                  label={image.placeholderLabel ?? `Missing image: ${image.alt}`}
                />
              )}
            </div>
          </motion.div>

          <div
            className={[
              "flex flex-col justify-center",
              `md:col-span-${textCols}`,
              flip ? "md:order-1" : "md:order-2",
            ].join(" ")}
          >
            {text}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

