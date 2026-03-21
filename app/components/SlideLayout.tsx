"use client";

import * as React from "react";

export type SlideLayoutMode = "flex-center" | "grid";
export type SlideTheme = "dark" | "light";

export function SlideLayout({
  id,
  snapAlign = "start",
  mode = "grid",
  theme,
  className,
  children,
}: {
  id?: string;
  snapAlign?: "start" | "center" | "end";
  mode?: SlideLayoutMode;
  theme?: SlideTheme;
  className?: string;
  children: React.ReactNode;
}) {
  const layoutClass =
    mode === "flex-center"
      ? "flex items-center justify-center"
      : "grid items-stretch";

  const snapClass =
    snapAlign === "center"
      ? "snap-center"
      : snapAlign === "end"
        ? "snap-end"
        : "snap-start";

  return (
    <section
      id={id}
      data-theme={theme}
      className={[
        "relative h-screen w-full",
        snapClass,
        layoutClass,
        className ?? "",
      ].join(" ")}
      style={{ scrollMarginTop: 24 }}
    >
      {children}
    </section>
  );
}

