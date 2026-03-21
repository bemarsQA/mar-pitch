import * as React from "react";

export function PlaceholderBox({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={[
        "relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl",
        className ?? "",
      ].join(" ")}
      style={{
        border: "1px solid var(--border)",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--bg-alt) 70%, transparent), color-mix(in srgb, var(--bg) 88%, transparent))",
      }}
    >
      <div
        className="px-6 text-center text-[10px] uppercase tracking-[0.24em]"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.22]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(55% 55% at 50% 45%, black 30%, transparent 70%)",
        }}
        aria-hidden
      />
    </div>
  );
}

