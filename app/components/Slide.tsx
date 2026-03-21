"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { SlideLayout } from "./SlideLayout";

export type SlideModel = {
  id: string;
  kicker: string;
  title: string;
  body?: string;
  bullets?: string[];
  metrics?: Array<{ label: string; value: string; note?: string }>;
};

function Hairline() {
  return (
    <div
      className="h-px w-full"
      style={{ background: "var(--border)" }}
      aria-hidden
    />
  );
}

export function Slide({ slide, index }: { slide: SlideModel; index: number }) {
  return (
    <SlideLayout id={slide.id} mode="grid" snapAlign="start">
      <motion.div
        className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10 md:px-10 md:py-14"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ amount: 0.6, once: false }}
        transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
      >
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
              style={{
                border: "1px solid var(--border)",
                color: "var(--muted)",
                background: "color-mix(in srgb, var(--bg-alt) 75%, transparent)",
              }}
            >
              {slide.kicker}
            </span>
            <span
              className="font-mono text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--muted)" }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <span
              className="text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--muted)" }}
            >
              Scroll
            </span>
            <span
              className="inline-block h-[2px] w-8"
              style={{ background: "var(--border)" }}
              aria-hidden
            />
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: "var(--accent)" }}
              aria-hidden
            />
          </div>
        </header>

        <div className="mt-8 grid flex-1 grid-cols-1 items-start gap-10 md:mt-12 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-7">
            <motion.h1
              className="deck-headline"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.7 }}
              transition={{ delay: 0.05, duration: 0.4 }}
            >
              {slide.title}
            </motion.h1>

            {slide.body ? (
              <p
                className="deck-body clamp-2 mt-6 max-w-xl text-base leading-relaxed md:text-[15px]"
              >
                {slide.body}
              </p>
            ) : null}

            {slide.bullets?.length ? (
              <ul className="mt-7 space-y-3">
                {slide.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-[7px] inline-block h-2 w-2 rounded-full"
                      style={{ background: "var(--accent)" }}
                    />
                    <span className="text-sm md:text-[13px]">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <aside className="md:col-span-5">
            <div
              className="rounded-2xl p-5 md:p-6"
              style={{
                border: "1px solid var(--border)",
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--bg-alt) 84%, transparent), color-mix(in srgb, var(--bg) 92%, transparent))",
              }}
            >
              <div className="flex items-center justify-between gap-4">
                <span
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  Snapshot
                </span>
                <span
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  {slide.id}
                </span>
              </div>
              <div className="mt-4">
                <Hairline />
              </div>

              {slide.metrics?.length ? (
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {slide.metrics.map((m) => (
                    <div key={m.label} className="min-w-0">
                      <div
                        className="text-[10px] uppercase tracking-[0.22em]"
                        style={{ color: "var(--muted)" }}
                      >
                        {m.label}
                      </div>
                      <div className="mt-1 text-xl font-[650] tracking-tight">
                        {m.value}
                      </div>
                      {m.note ? (
                        <div
                          className="mt-1 text-xs"
                          style={{ color: "var(--muted)" }}
                        >
                          {m.note}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5">
                  <div className="text-sm font-[650]">Add your content</div>
                  <div className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
                    Replace slide copy + metrics in `app/page.tsx`.
                  </div>
                </div>
              )}

              <div className="mt-6">
                <Hairline />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {["B/W base", "Red accent", "Scroll snap", "Motion"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                      background: "color-mix(in srgb, var(--bg) 86%, transparent)",
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-10 flex items-center justify-between gap-6 md:mt-12">
          <span
            className="text-[10px] uppercase tracking-[0.24em]"
            style={{ color: "var(--muted)" }}
          >
            mars-pitch
          </span>
          <span
            className="text-[10px] uppercase tracking-[0.24em]"
            style={{ color: "var(--muted)" }}
          >
            {new Date().getFullYear()}
          </span>
        </footer>
      </motion.div>
    </SlideLayout>
  );
}

