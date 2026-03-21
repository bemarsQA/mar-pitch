import * as React from "react";
import Image, { type StaticImageData } from "next/image";
import { motion } from "framer-motion";
import { PlaceholderBox } from "./PlaceholderBox";

export type FullBleedImageTextPlacement = "center" | "bottom-left";

export function FullBleedImage({
  src,
  alt,
  priority,
  sizes = "100vw",
  overlayOpacity = 0,
  textPlacement = "center",
  text,
  children,
  placeholderLabel,
  fillMode = "screen",
  objectFit = "cover",
}: {
  src?: string | StaticImageData;
  alt: string;
  priority?: boolean;
  sizes?: string;
  /** 0.0 → 0.4 */
  overlayOpacity?: number;
  textPlacement?: FullBleedImageTextPlacement;
  /** Simple text overlay (optional). */
  text?: {
    kicker?: string;
    title?: string;
    body?: string;
  };
  /** Custom overlay content (optional). */
  children?: React.ReactNode;
  placeholderLabel?: string;
  /** "screen" = full viewport hero, "container" = fill parent height */
  fillMode?: "screen" | "container";
  /** How the image fits in the box. */
  objectFit?: "cover" | "contain";
}) {
  const clampedOverlay = Math.max(0, Math.min(overlayOpacity, 0.4));

  const placementClass =
    textPlacement === "bottom-left"
      ? "items-end justify-start pb-10 md:pb-14"
      : "items-center justify-center";

  const rootHeightClass =
    fillMode === "container" ? "relative h-full w-full overflow-hidden" : "relative h-screen w-full overflow-hidden";

  return (
    <section className={rootHeightClass}>
      {src ? (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={objectFit === "contain" ? "object-contain" : "object-cover"}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0">
          <PlaceholderBox label={placeholderLabel ?? `Missing image: ${alt}`} />
        </div>
      )}

      {clampedOverlay > 0 ? (
        <div
          className="absolute inset-0"
          style={{ background: `rgba(0,0,0,${clampedOverlay})` }}
          aria-hidden
        />
      ) : null}

      <motion.div
        className={`absolute inset-0 flex ${placementClass}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <div className="mx-auto w-full max-w-6xl px-6 md:px-10">
          {children ? (
            children
          ) : text ? (
            <div className={textPlacement === "bottom-left" ? "max-w-2xl" : ""}>
              {text.kicker ? (
                <div
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  {text.kicker}
                </div>
              ) : null}
              {text.title ? (
                <div className="mt-3 text-4xl font-[650] uppercase leading-[0.95] tracking-[0.08em] md:text-6xl">
                  {text.title}
                </div>
              ) : null}
              {text.body ? (
                <div
                  className="mt-5 max-w-xl text-base leading-relaxed md:text-[15px]"
                  style={{ color: "var(--muted)" }}
                >
                  {text.body}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </motion.div>
    </section>
  );
}

