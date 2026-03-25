 "use client";

import * as React from "react";
import Image from "next/image";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import { FullBleedImage } from "./components/FullBleedImage";
import { ImageCarousel } from "./components/ImageCarousel";
import { SplitImageText } from "./components/SplitImageText";

type Language = "en" | "jp";

type NarrativeSection = {
  id: string;
  label: string;
  /** Optional scene title like "SCENE 1 — DIY / CRAFT" */
  title?: { en: string; jp: string };
  en: Array<{ type: "line" | "bullet"; text: string }>;
  jp: Array<{ type: "line" | "bullet"; text: string }>;
  collaborator?: {
    variant: "primary" | "optional";
    groupTitle?: { en: string; jp: string };
    handle: string;
    instagramUrl: string;
    location: { en: string; jp: string };
    role: { en: string; jp: string };
    why: { en: string; jp: string };
    commercial: { en: string; jp: string };
    photo: { en: string; jp: string };
    heroImage: { filename: string; aspect: "4:5" | "16:9" | string };
    /** Approximate follower count (update manually — not available without IG API). Shown on hero when `instagramUrl` is set. Omit or set to null to hide. */
    instagramFollowers?: number | null;
    /** If set, an * appears after the count with this text in a hover/focus popover. */
    instagramFollowersFootnote?: string;
    /** Minimal status for primary collaborators (e.g. confirmed shoot). */
    confirmed?: boolean;
    /** Thin editorial line above the block (e.g. first slide in a section). */
    sectionBanner?: { en: string; jp: string };
  };
  media?: {
    type: "fullBleed" | "carousel" | "split";
    image?: { src?: string; alt: string; objectFit?: "cover" | "contain" };
    carousel?: Array<{ src?: string; alt: string }>;
    split?: { image?: { src?: string; alt: string } };
  };
};

/** Rotten-Tomatoes-style ease-out count-up when the hero enters view. */
function FollowerBadgeOverlay({
  count,
  lang,
  followersFootnote,
}: {
  count: number;
  lang: Language;
  followersFootnote?: string;
}) {
  const wrapRef = React.useRef<HTMLDivElement>(null);
  /* Observe full hero area — a tiny badge alone often misses IntersectionObserver thresholds. */
  const inView = useInView(wrapRef, { once: true, amount: 0.22 });
  const mv = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  useMotionValueEvent(mv, "change", (v) => setDisplay(Math.round(v)));

  React.useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, count, {
      duration: 2.35,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => ctrl.stop();
  }, [inView, count, mv]);

  const platform = lang === "jp" ? "インスタグラム" : "Instagram";
  const label = lang === "jp" ? "フォロワー" : "Followers";

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 z-10">
      <div className="absolute left-0 top-0 max-w-[min(100%,14rem)] px-3 pt-3 md:max-w-[16rem] md:px-4 md:pt-4">
        <div
          className="pointer-events-none rounded-lg px-2.5 py-2 shadow-sm md:px-3 md:py-2.5"
          style={{
            background: "color-mix(in srgb, var(--bg) 78%, transparent)",
            border: "1px solid color-mix(in srgb, var(--border) 85%, transparent)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
          }}
        >
          <div
            className="text-[8px] font-semibold uppercase tracking-[0.32em]"
            style={{ color: "var(--muted)" }}
          >
            {platform}
          </div>
          <div className="mt-0.5 text-[9px] uppercase tracking-[0.22em]" style={{ color: "var(--muted)" }}>
            {label}
          </div>
          <div className="mt-1 font-mono text-[1.35rem] font-semibold leading-none tabular-nums tracking-tight md:text-2xl">
            {followersFootnote ? (
              <span
                className="group relative pointer-events-auto inline-flex cursor-help flex-wrap items-baseline gap-0"
                tabIndex={0}
                aria-label={followersFootnote}
              >
                <span style={{ color: "var(--text)" }}>
                  {display.toLocaleString(lang === "jp" ? "ja-JP" : "en-US")}
                </span>
                <span
                  className="ml-0.5 text-base font-semibold md:text-lg"
                  style={{ color: "var(--muted)" }}
                  aria-hidden
                >
                  *
                </span>
                <span
                  role="tooltip"
                  className="pointer-events-none absolute left-0 top-full z-20 mt-1.5 w-max max-w-[min(18rem,calc(100vw-2rem))] rounded-md px-2.5 py-2 text-left text-[11px] font-sans font-normal normal-case leading-snug tracking-normal opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
                  style={{
                    background: "var(--bg-alt)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  {followersFootnote}
                </span>
              </span>
            ) : (
              <span style={{ color: "var(--text)" }}>
                {display.toLocaleString(lang === "jp" ? "ja-JP" : "en-US")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RollingChevrons({ mirror }: { mirror?: boolean }) {
  return (
    <span className={`inline-flex gap-px ${mirror ? "scale-x-[-1]" : ""}`} aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="text-[11px] font-light leading-none text-white"
          animate={{ opacity: [0.35, 1, 0.35], y: [0, -2, 0] }}
          transition={{
            repeat: Infinity,
            duration: 1.6,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        >
          ›
        </motion.span>
      ))}
    </span>
  );
}

/** Red corner ribbon on confirmed primary collaborator heroes (sits above image, not clipped). */
function ConfirmedHeroRibbon({ lang }: { lang: Language }) {
  const label = lang === "jp" ? "確定" : "CONFIRMED";
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        type: "tween",
        duration: 1.35,
        delay: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="pointer-events-none absolute right-0 top-0 z-[25]"
    >
      <div
        className="flex items-center gap-1.5 rounded-bl-xl px-2.5 py-1.5 md:gap-2 md:px-3 md:py-2"
        style={{
          background: "linear-gradient(135deg, var(--accent) 0%, #b91c1c 100%)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.3)",
        }}
      >
        <RollingChevrons />
        <span className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white md:text-[10px]">
          {label}
        </span>
        <RollingChevrons mirror />
      </div>
    </motion.div>
  );
}

const narrative: NarrativeSection[] = [
  {
    id: "introduction",
    label: "INTRODUCTION",
    en: [
      { type: "line", text: "Cultural impact doesn’t come from scale." },
      { type: "line", text: "It comes from connection." },
    ],
    jp: [
      { type: "line", text: "カルチャーの影響力は、規模では生まれない。" },
      { type: "line", text: "つながりから生まれる。" },
    ],
    media: {
      type: "fullBleed",
      image: {
        src: "/images/introduction_hero.jpeg",
        alt: "Introduction hero",
        objectFit: "cover",
      },
    },
  },
  {
    id: "core-idea",
    label: "CORE IDEA",
    en: [
      { type: "line", text: "Working lean changes the focus." },
      { type: "line", text: "It brings us closer to what matters." },
      { type: "line", text: "" },
      {
        type: "line",
        text: "This project is built around strengthening the relationship between the audience and the brand.",
      },
      { type: "line", text: "" },
      {
        type: "line",
        text: "Rather than prioritizing reach, the focus is on cultural relevance — choosing people, places, and moments that already carry meaning within their respective scenes.",
      },
      { type: "line", text: "" },
      { type: "line", text: "Across Japan, youth culture exists in small, distinct pockets." },
      { type: "line", text: "Different spaces, different contexts, but shared sensibilities." },
      { type: "line", text: "" },
      {
        type: "line",
        text: "By documenting these pockets, we create something specific yet widely recognizable.",
      },
      { type: "line", text: "People don’t need to be part of a scene to see themselves in it." },
      { type: "line", text: "" },
      {
        type: "line",
        text: "Through this, Nothing becomes associated not just with individuals,",
      },
      {
        type: "line",
        text: "but with the environments, behaviors, and values that define these cultures.",
      },
    ],
    media: {
      type: "fullBleed",
      image: {
        src: "/images/core_idea_hero.jpg.jpeg",
        alt: "Core idea hero",
        objectFit: "cover",
      },
    },
    jp: [
      { type: "line", text: "リーンにすることで焦点が変わる。" },
      { type: "line", text: "本当に大切なものへ、より近づく。" },
      { type: "line", text: "" },
      {
        type: "line",
        text: "このプロジェクトは、観客とブランドの関係性を強めることを軸にしている。",
      },
      { type: "line", text: "" },
      {
        type: "line",
        text: "リーチよりもカルチャーとの関連性を重視し、すでに意味を持つ人・場所・瞬間を選ぶ。",
      },
      { type: "line", text: "" },
      {
        type: "line",
        text: "日本では、ユースカルチャーは小さな拠点として点在している。",
      },
      { type: "line", text: "場所も文脈も違う。けれど感性は共通している。" },
      { type: "line", text: "" },
      {
        type: "line",
        text: "それらの拠点を記録することで、特定的でありながら広く伝わるものをつくる。",
      },
      { type: "line", text: "シーンの当事者でなくても、自分自身を重ねて見つけられる。" },
      { type: "line", text: "" },
      { type: "line", text: "このプロセスを通して、Nothingは個人だけでなく、" },
      {
        type: "line",
        text: "このカルチャーを形づくる環境・振る舞い・価値観とも結びついていく。",
      },
    ],
  },
  {
    id: "execution",
    label: "EXECUTION",
    en: [
      { type: "line", text: "The structure is built around a small group of collaborators." },
      { type: "line", text: "" },
      {
        type: "line",
        text: "Each shoot is developed around a real person and their environment,",
      },
      { type: "line", text: "producing both video and still outputs." },
      { type: "line", text: "" },
      { type: "line", text: "From this:" },
      { type: "bullet", text: "Individual video moments" },
      { type: "bullet", text: "Individual photo assets" },
      { type: "bullet", text: "One connected film" },
      { type: "line", text: "" },
      { type: "line", text: "Each piece stands on its own," },
      { type: "line", text: "while contributing to a broader narrative." },
    ],
    media: {
      type: "fullBleed",
      image: {
        src: "/images/execution_hero.jpg",
        alt: "Execution hero",
        objectFit: "contain",
      },
    },
    jp: [
      { type: "line", text: "この構成は、少人数のコラボレーターを軸に成り立っている。" },
      { type: "line", text: "" },
      { type: "line", text: "それぞれの撮影は、実在する人物とその環境を起点に組み立てられ、" },
      { type: "line", text: "映像とスチルの両方を生み出す。" },
      { type: "line", text: "" },
      { type: "line", text: "ここから：" },
      { type: "bullet", text: "個別のビデオモーメント" },
      { type: "bullet", text: "個別のフォトアセット" },
      { type: "bullet", text: "つながったひとつの映像" },
      { type: "line", text: "" },
      { type: "line", text: "それぞれが単体で成立しながら、" },
      { type: "line", text: "より大きな物語へと合流する。" },
    ],
  },
  {
    id: "collab-1",
    label: "COLLABORATORS",
    en: [],
    jp: [],
    collaborator: {
      variant: "primary",
      handle: "@ii_ten_ten",
      instagramUrl: "https://www.instagram.com/ii_ten_ten/",
      location: { en: "Osaka", jp: "大阪" },
      role: { en: "DIY artist / crochet brand", jp: "DIYアーティスト / クロシェブランド" },
      why: {
        en: "A small-scale creator within Kansai’s independent craft scene. DIY remains a core form of youth expression in Japan.",
        jp: "関西のインディペンデントなクラフトシーンで活動。DIYは今もユースカルチャーに根付く表現のひとつ。",
      },
      commercial: {
        en: "Sewing inside the space.\nFocused, working by hand.\n\nMusic through the headphones.\nSubtle movement with the rhythm.",
        jp: "空間の中で縫い物をする。\n手元に集中し、作業を進める。\n\nヘッドホンから音楽。\nリズムに合わせてわずかに体が動く。",
      },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "被写体と環境、プロダクトが日常の空間に自然に馴染む様子を写した一連の画像。",
      },
      heroImage: { filename: "tenten_hero.jpg.jpg", aspect: "4:5" },
      instagramFollowers: 2015,
      instagramFollowersFootnote: "Brand owner's follower count.",
      confirmed: true,
    },
  },
  {
    id: "collab-2",
    label: "COLLABORATORS",
    en: [],
    jp: [],
    collaborator: {
      variant: "primary",
      groupTitle: {
        en: "COLLABORATORS / POSSIBLE SHOOTS",
        jp: "コラボレーター / 可能性のある撮影",
      },
      handle: "@tk10.poscakun",
      instagramUrl: "https://www.instagram.com/tk10.poscakun/",
      location: { en: "Kameoka, Kyoto", jp: "亀岡、京都" },
      role: {
        en: "Graffiti / posca artist · skater",
        jp: "グラフィティ／ポスカアーティスト・スケーター",
      },
      why: {
        en: "A multidisciplinary artist working across graffiti, illustration, and skate culture.\nRepresents a raw, street-level perspective within Japanese youth culture.",
        jp: "グラフィティ、ポスカ、スケートを横断して活動するアーティスト。\nストリートに根ざしたユースカルチャーの視点を体現する存在。",
      },
      commercial: {
        en: "Drawing or painting with posca markers.\nListening to music while.\nSkate part optional.",
        jp: "ポスカで描く、またはペイントする。\n音楽を聴きながら作業する。\nスケートパート（オプション）",
      },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "人物・空間・プロダクトの関係性を捉え、自然にその環境や日常に溶け込む様子を写した複数のイメージ。",
      },
      heroImage: { filename: "taketo_hero.jpg", aspect: "4:5" },
      instagramFollowers: 48400,
      confirmed: true,
    },
  },
  {
    id: "collab-3",
    label: "COLLABORATORS",
    en: [],
    jp: [],
    collaborator: {
      variant: "primary",
      groupTitle: {
        en: "COLLABORATORS / POSSIBLE SHOOTS",
        jp: "コラボレーター / 可能性のある撮影",
      },
      handle: "@exo0.13",
      instagramUrl: "https://www.instagram.com/exo0.13/",
      location: { en: "Tokyo", jp: "東京" },
      role: { en: "Tattoo artist / studio", jp: "タトゥーアーティスト / スタジオ" },
      why: {
        en: "Tattoo culture reflects long-term identity. Ideas developed slowly, then carried forward.",
        jp: "タトゥーは、長く残る自己表現。時間をかけて形になる。",
      },
      commercial: {
        en: "Sewing inside the space.\nFocused, working by hand.\n\nMusic through the headphones.\nSubtle movement with the rhythm.",
        jp: "空間の中で縫い物をする。\n手元に集中し、作業を進める。\n\nヘッドホンから音楽。\nリズムに合わせてわずかに体が動く。",
      },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "被写体と環境、プロダクトが日常の空間に自然に馴染む様子を写した一連の画像。",
      },
      heroImage: { filename: "exo013_hero.jpg", aspect: "4:5" },
      instagramFollowers: 33000,
      confirmed: true,
    },
  },
  {
    id: "collab-4",
    label: "COLLABORATORS",
    en: [],
    jp: [],
    collaborator: {
      variant: "primary",
      groupTitle: {
        en: "COLLABORATORS / POSSIBLE SHOOTS",
        jp: "コラボレーター / 可能性のある撮影",
      },
      handle: "@m_i_t_a_m_e",
      instagramUrl: "https://www.instagram.com/m_i_t_a_m_e/",
      location: { en: "Tokyo (Shinjuku)", jp: "東京（新宿）" },
      role: {
        en: "Independent select shop",
        jp: "インディペンデントセレクトショップ",
      },
      why: {
        en: "A space where DIY sensibility meets curation. Experimental, personal, and self-defined.",
        jp: "DIY的な感覚とキュレーションが交差する空間。個人性の強いスタイルが生まれる場所。",
      },
      commercial: {
        en: "Sewing inside the space.\nFocused, working by hand.\n\nMusic through the headphones.\nSubtle movement with the rhythm.",
        jp: "空間の中で縫い物をする。\n手元に集中し、作業を進める。\n\nヘッドホンから音楽。\nリズムに合わせてわずかに体が動く。",
      },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "被写体と環境、プロダクトが日常の空間に自然に馴染む様子を写した一連の画像。",
      },
      heroImage: { filename: "mitame_hero.jpg", aspect: "4:5" },
      instagramFollowers: 5908,
    },
  },
  {
    id: "talk-5",
    label: "OPTIONAL",
    en: [],
    jp: [],
    collaborator: {
      variant: "optional",
      groupTitle: { en: "OPTIONAL / IN TALKS", jp: "オプショナル / 検討中" },
      handle: "@tbd",
      instagramUrl: "TBD",
      location: { en: "Osaka", jp: "大阪" },
      role: {
        en: "Additional collaborators currently in conversation. A flexible layer of the project, allowing for expansion across different scenes and perspectives.",
        jp: "現在調整中のコラボレーター。プロジェクトを拡張し、異なる視点やシーンへ広げていくための柔軟なレイヤー。",
      },
      why: { en: "", jp: "" },
      commercial: { en: "", jp: "" },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "",
      },
      heroImage: { filename: "skate_hero.jpg", aspect: "16:9" },
    },
  },
  {
    id: "talk-coil",
    label: "OPTIONAL",
    en: [],
    jp: [],
    collaborator: {
      variant: "optional",
      groupTitle: { en: "OPTIONAL / IN TALKS", jp: "オプショナル / 検討中" },
      handle: "@coilvintage",
      instagramUrl: "https://www.instagram.com/coilvintage/",
      location: { en: "Kyoto", jp: "京都" },
      role: { en: "", jp: "" },
      why: { en: "", jp: "" },
      commercial: { en: "", jp: "" },
      photo: { en: "", jp: "" },
      heroImage: { filename: "coil_hero.png", aspect: "4:5" },
      instagramFollowers: 4925,
    },
  },
  {
    id: "talk-6",
    label: "OPTIONAL",
    en: [],
    jp: [],
    collaborator: {
      variant: "optional",
      handle: "@cfnmalikk",
      instagramUrl: "https://www.instagram.com/cfnmalikk/",
      location: { en: "", jp: "" },
      role: { en: "", jp: "" },
      why: { en: "", jp: "" },
      commercial: { en: "", jp: "" },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "",
      },
      heroImage: { filename: "cfnmalikk_hero.jpg", aspect: "4:5" },
      instagramFollowers: 23300,
    },
  },
  {
    id: "talk-7",
    label: "OPTIONAL",
    en: [],
    jp: [],
    collaborator: {
      variant: "optional",
      handle: "@xxi_emi",
      instagramUrl: "https://www.instagram.com/xxi_emi",
      location: { en: "", jp: "" },
      role: { en: "", jp: "" },
      why: { en: "", jp: "" },
      commercial: { en: "", jp: "" },
      photo: {
        en: "A series of images capturing the subject, their environment, and how the product naturally integrates into their space and routine.",
        jp: "",
      },
      heroImage: { filename: "xxi_emi_hero.jpg", aspect: "4:5" },
      instagramFollowers: 11100,
    },
  },
  {
    id: "talk-8",
    label: "OPTIONAL",
    en: [],
    jp: [],
    collaborator: {
      variant: "optional",
      handle: "@abeliaedowardgoucha",
      instagramUrl: "https://www.instagram.com/abeliaedowardgoucha",
      location: { en: "", jp: "" },
      role: { en: "", jp: "" },
      why: { en: "", jp: "" },
      commercial: { en: "", jp: "" },
      photo: { en: "", jp: "" },
      heroImage: { filename: "abeliaedowardgoucha_hero.jpg", aspect: "4:5" },
      instagramFollowers: 13400,
    },
  },
  {
    id: "production",
    label: "PRODUCTION",
    en: [
      { type: "line", text: "Small crews." },
      { type: "line", text: "Real people." },
      { type: "line", text: "Real environments." },
      { type: "line", text: "" },
      { type: "line", text: "Everything is built to feel natural and unforced." },
    ],
    jp: [
      { type: "line", text: "少人数のチーム。" },
      { type: "line", text: "リアルな人。" },
      { type: "line", text: "リアルな場所。" },
      { type: "line", text: "" },
      { type: "line", text: "すべてを自然な状態で成立させる。" },
    ],
  },
  {
    id: "conclusion",
    label: "CONCLUSION",
    en: [{ type: "line", text: "People connect with what feels real." }],
    jp: [{ type: "line", text: "人は、リアルなものに共感する。" }],
  },
];

function Toggle({
  lang,
  setLang,
}: {
  lang: Language;
  setLang: (l: Language) => void;
}) {
  return (
    <div className="pointer-events-auto fixed right-4 top-4 z-50 flex items-center gap-1">
      {(["en", "jp"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          className="px-2 py-1 text-[10px] uppercase tracking-[0.24em]"
          style={{
            color: lang === l ? "var(--text)" : "var(--muted)",
            border:
              lang === l ? "1px solid var(--border)" : "1px solid transparent",
            background:
              lang === l
                ? "color-mix(in srgb, var(--bg-alt) 80%, transparent)"
                : "transparent",
          }}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

const navSections = [
  { id: "introduction", label: "INTRO" },
  { id: "core-idea", label: "CORE" },
  { id: "execution", label: "EXEC" },
  { id: "collab-1", label: "COLLAB" },
  { id: "talk-5", label: "TALKS" },
  { id: "production", label: "PROD" },
  { id: "conclusion", label: "END" },
] as const;

function Lines({
  items,
  compact = false,
}: {
  items: Array<{ type: "line" | "bullet"; text: string }>;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "space-y-1.5 md:space-y-2" : "space-y-2 md:space-y-2.5"}>
      {items.map((it, idx) => {
        if (it.text === "") return <div key={idx} className="h-3" />;

        const isLabel =
          it.type === "line" &&
          [
            "Commercial:",
            "Photo Carousel:",
            "From this:",
            "映像：",
            "写真：",
            "ここから生まれるアウトプットは：",
          ].includes(it.text);

        const isFocus =
          it.type === "line" &&
          (it.text.startsWith("Focus") || it.text.startsWith("フォーカス"));

        if (it.type === "bullet") {
          return (
            <div key={idx} className="flex gap-3">
              <div
                className="mt-[7px] h-2 w-2 flex-none rounded-full"
                style={{ background: "var(--accent)" }}
                aria-hidden
              />
              <div
                className={
                  compact
                    ? "text-[12px] leading-snug md:text-[13px] md:leading-snug"
                    : "text-[13px] leading-snug md:text-sm md:leading-snug"
                }
              >
                {it.text}
              </div>
            </div>
          );
        }

        if (isLabel) {
          return (
            <div
              key={idx}
              className="mt-4 text-xs font-semibold uppercase tracking-[0.28em]"
              style={{ color: "var(--text)" }}
            >
              {it.text.replace("：", ":")}
            </div>
          );
        }

        if (isFocus) {
          return (
            <div
              key={idx}
              className={
                compact
                  ? "text-[12px] leading-snug md:text-[13px] md:leading-snug"
                  : "text-[13px] leading-snug md:text-sm md:leading-snug"
              }
              style={{ color: "var(--muted)" }}
            >
              {it.text}
            </div>
          );
        }

        return (
          <div
            key={idx}
            className={
              compact
                ? "text-[12px] leading-snug md:text-[13px] md:leading-snug"
                : "text-[13px] leading-snug md:text-sm md:leading-snug"
            }
          >
            {it.text}
          </div>
        );
      })}
    </div>
  );
}

function Section({
  lang,
  section,
  nextSectionId,
}: {
  lang: Language;
  section: NarrativeSection;
  nextSectionId?: string;
}) {
  const slideRootRef = React.useRef<HTMLElement | null>(null);
  const [scrollIndicator, setScrollIndicator] = React.useState<{
    canScroll: boolean;
    showTop: boolean;
    showBottom: boolean;
  }>({ canScroll: false, showTop: false, showBottom: false });

  React.useEffect(() => {
    if (!section.collaborator) return;

    const el = slideRootRef.current;
    if (!el) return;

    let raf = 0;

    const update = () => {
      const canScroll = el.scrollHeight - el.clientHeight > 8;
      if (!canScroll) {
        setScrollIndicator({ canScroll: false, showTop: false, showBottom: false });
        return;
      }

      const showTop = el.scrollTop > 8;
      const showBottom = el.scrollTop + el.clientHeight < el.scrollHeight - 8;
      setScrollIndicator({ canScroll, showTop, showBottom });
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(update);
    };

    update();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", update);
    };
  }, [section.id, section.collaborator]);

  if (section.collaborator) {
    const isMitame = section.collaborator.handle === "@m_i_t_a_m_e";
    const isWideHandle =
      section.collaborator.handle === "@m_i_t_a_m_e" || section.collaborator.handle === "@tk10.poscakun";
    const roleText = lang === "jp" ? section.collaborator.role.jp : section.collaborator.role.en;
    const isTbd = section.collaborator.instagramUrl === "TBD";

    return (
      <section
        id={section.id}
        ref={slideRootRef}
        className="relative flex h-full min-w-full snap-start items-start md:items-center overflow-x-hidden overflow-y-auto overscroll-contain md:overflow-y-visible md:overscroll-y-auto"
      >
        <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-12 md:gap-6 md:px-8">
          <div
            className={[
              "md:col-span-6 flex h-auto md:h-full flex-col py-4 md:py-6",
              section.collaborator.variant === "optional" ? "opacity-75" : "opacity-100",
            ].join(" ")}
          >
            {section.collaborator.sectionBanner ? (
              <div
                className="mb-3 border-t border-[var(--border)] pt-3 text-[10px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "var(--muted)" }}
              >
                {lang === "jp"
                  ? section.collaborator.sectionBanner.jp
                  : section.collaborator.sectionBanner.en}
              </div>
            ) : null}

            <div className="mb-3 flex flex-col gap-1.5">
              {section.collaborator.groupTitle ? (
                <div className="text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: "var(--muted)" }}>
                  {lang === "jp"
                    ? section.collaborator.groupTitle.jp
                    : section.collaborator.groupTitle.en}
                </div>
              ) : null}

              <a
                href={isTbd && nextSectionId ? `#${nextSectionId}` : section.collaborator.instagramUrl !== "TBD" ? section.collaborator.instagramUrl : undefined}
                target="_blank"
                rel="noreferrer"
                className="group relative block"
                style={{ color: "var(--text)" }}
                aria-label={`Instagram ${section.collaborator.handle}`}
                onClick={(e) => {
                  if (isTbd) {
                    e.preventDefault();
                    if (!nextSectionId) return;
                    const el = document.getElementById(nextSectionId);
                    el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
                  }
                }}
              >
                <motion.span
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                  className={[
                    "inline-block",
                    isWideHandle ? "whitespace-nowrap max-w-none break-normal" : "max-w-[12rem] whitespace-normal break-all",
                    "leading-[1.0] font-semibold tracking-[-0.02em]",
                    "underline decoration-transparent underline-offset-4 transition-[transform,opacity,decoration-color] duration-200",
                    "group-hover:decoration-[var(--accent)]/70 group-hover:translate-x-[1px] group-focus:decoration-[var(--accent)]/70",
                    section.collaborator.variant === "optional"
                      ? "text-[22px]"
                      : isMitame
                        ? "text-[26px]"
                        : "text-[28px]",
                  ].join(" ")}
                >
                  {section.collaborator.handle}
                </motion.span>

                <span
                  className={[
                    "ml-3 inline-block align-middle text-[10px]",
                    "font-mono tracking-[0.18em] uppercase",
                    "text-[var(--muted)] opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                  ].join(" ")}
                  aria-hidden
                >
                  ↗
                </span>
              </a>

              {section.collaborator.variant === "primary" ? (
                <div
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  {lang === "jp"
                    ? section.collaborator.location.jp
                    : section.collaborator.location.en}
                </div>
              ) : null}

              {roleText.trim() ? (
                <div
                  className="text-[14px] font-semibold leading-relaxed md:text-[15px] md:leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {roleText}
                </div>
              ) : null}
            </div>

            <div
              className="flex-1 overflow-y-visible pr-3"
              style={{ scrollbarWidth: "thin", minHeight: 0 }}
            >
              {section.collaborator.variant === "primary" ? (
                <div
                  className="text-[14px] leading-relaxed md:text-[15px] md:leading-relaxed"
                  style={{ color: "var(--muted)" }}
                >
                  {lang === "jp"
                    ? section.collaborator.why.jp
                    : section.collaborator.why.en}
                </div>
              ) : null}

              {section.collaborator.variant === "primary" ? (
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: "var(--text)" }}>
                      {lang === "jp" ? "映像：" : "Commercial:"}
                    </div>
                    <div
                      className="mt-2 whitespace-pre-line text-[14px] leading-relaxed md:text-[15px] md:leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {lang === "jp"
                        ? section.collaborator.commercial.jp
                        : section.collaborator.commercial.en}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-[0.24em] font-semibold" style={{ color: "var(--text)" }}>
                      {lang === "jp" ? "写真：" : "Photo:"}
                    </div>
                    <div
                      className="mt-2 clamp-2 whitespace-pre-line text-[14px] leading-relaxed md:text-[15px] md:leading-relaxed"
                      style={{ color: "var(--muted)" }}
                    >
                      {lang === "jp"
                        ? section.collaborator.photo.jp
                        : section.collaborator.photo.en}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="md:col-span-6 flex h-auto md:h-full items-start md:items-center justify-center">
            {(() => {
              const heroPath = `/images/${section.collaborator?.heroImage.filename ?? ""}`;
              const heroAspect = section.collaborator.heroImage.aspect;

              const cssAspect =
                heroAspect.includes(":")
                  ? heroAspect.replace(":", " / ")
                  : heroAspect;

              const imageHref =
                section.collaborator.instagramUrl && section.collaborator.instagramUrl !== "TBD"
                  ? section.collaborator.instagramUrl
                  : undefined;

              const alt =
                section.collaborator.variant === "optional"
                  ? `Optional hero ${section.collaborator.handle}`
                  : `Hero ${section.collaborator.handle}`;

              const followers = section.collaborator.instagramFollowers;
              const showFollowerBadge =
                Boolean(imageHref) && typeof followers === "number" && followers >= 0;

              return (
                <div className="w-full overflow-x-hidden">
                  {imageHref ? (
                    <a href={imageHref} target="_blank" rel="noreferrer" className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 18, scale: 1.03 }}
                        whileInView={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ y: -6, scale: 1.015 }}
                        whileTap={{ scale: 0.99 }}
                        viewport={{ once: true, amount: 0.28 }}
                        transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9 }}
                        className="relative rounded-2xl"
                        style={{ aspectRatio: cssAspect, border: "1px solid var(--border)" }}
                      >
                        <div className="absolute inset-0 overflow-hidden rounded-2xl">
                          <Image
                            src={heroPath}
                            alt={alt}
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                            priority
                          />
                        </div>
                        {section.collaborator.variant === "primary" && section.collaborator.confirmed ? (
                          <ConfirmedHeroRibbon lang={lang} />
                        ) : null}
                        {showFollowerBadge && typeof followers === "number" ? (
                          <FollowerBadgeOverlay
                            count={followers}
                            lang={lang}
                            followersFootnote={section.collaborator.instagramFollowersFootnote}
                          />
                        ) : null}
                      </motion.div>
                    </a>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 18, scale: 1.03 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      whileHover={{ y: -6, scale: 1.015 }}
                      whileTap={{ scale: 0.99 }}
                      viewport={{ once: true, amount: 0.28 }}
                      transition={{ type: "spring", stiffness: 110, damping: 18, mass: 0.9 }}
                      className="relative rounded-2xl"
                      style={{ aspectRatio: cssAspect, border: "1px solid var(--border)" }}
                    >
                      <div className="absolute inset-0 overflow-hidden rounded-2xl">
                        <Image
                          src={heroPath}
                          alt={alt}
                          fill
                          sizes="(min-width: 768px) 50vw, 100vw"
                          className="object-cover"
                          priority
                        />
                      </div>
                      {section.collaborator.variant === "primary" && section.collaborator.confirmed ? (
                        <ConfirmedHeroRibbon lang={lang} />
                      ) : null}
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        {scrollIndicator.canScroll ? (
          <>
            {scrollIndicator.showTop ? (
              <div className="md:hidden pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 transition-opacity duration-200">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-alt)_75%,transparent)] opacity-80"
                  style={{ color: "var(--muted)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                </div>
              </div>
            ) : null}

            {scrollIndicator.showBottom ? (
              <div className="md:hidden pointer-events-none absolute left-1/2 bottom-12 -translate-x-1/2 transition-opacity duration-200">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--bg-alt)_75%,transparent)] opacity-80"
                  style={{ color: "var(--muted)" }}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            ) : null}
          </>
        ) : null}
      </section>
    );
  }

  const body = lang === "jp" ? section.jp : section.en;
  const title = section.title ? (lang === "jp" ? section.title.jp : section.title.en) : undefined;
  const isScene = section.id.startsWith("scene-");

  return (
    <section
      id={section.id}
      className="flex h-full min-w-full snap-start items-start md:items-center overflow-x-hidden overflow-y-auto overscroll-contain md:overflow-y-visible md:overscroll-y-auto"
    >
      <div className="mx-auto grid h-full w-full max-w-6xl grid-cols-1 gap-4 px-4 md:grid-cols-12 md:gap-6 md:px-8">
        <div className="md:col-span-6 flex h-full flex-col py-4 md:py-6">
          <div className="mb-3 flex flex-col gap-1.5">
            <div
              className="text-[10px] uppercase tracking-[0.24em]"
              style={{ color: "var(--muted)" }}
            >
              {section.label}
            </div>
            {title ? (
              <div
                className="text-[10px] uppercase tracking-[0.24em]"
                style={{ color: "var(--muted)" }}
              >
                {title}
              </div>
            ) : null}
          </div>
          {body.length ? (
            <div
              className="flex-1 overflow-x-hidden overflow-y-auto pr-3"
              style={{ scrollbarWidth: "thin", minHeight: 0 }}
            >
              <div
                className={
                  isScene
                    ? "text-2xl font-semibold uppercase leading-tight tracking-[0.12em] md:text-3xl"
                    : "deck-headline"
                }
              >
                {body[0]?.text ?? ""}
              </div>
              <div className="mt-4" style={{ color: "var(--muted)" }}>
                <Lines items={body.slice(1)} compact={isScene} />
              </div>
            </div>
          ) : null}
        </div>

        <div className="md:col-span-6 flex h-full items-center justify-center">
          {section.media?.type === "split" ? (
            <SplitImageText
              image={{
                src: section.media.split?.image?.src,
                alt: section.media.split?.image?.alt ?? `${section.id} image`,
                placeholderLabel: `Missing image: ${section.id}`,
              }}
              imageWidth={0.62}
              text={<div />}
            />
          ) : section.media?.type === "carousel" ? (
            <div className="w-full">
              <ImageCarousel images={section.media.carousel ?? []} />
            </div>
          ) : section.media?.type === "fullBleed" ? (
            <div
              className={
                section.id === "execution"
                  ? "relative w-full overflow-hidden rounded-2xl"
                  : "relative h-[60vh] w-full overflow-hidden rounded-2xl"
              }
              style={{
                border: "1px solid var(--border)",
                aspectRatio: section.id === "execution" ? "4 / 3" : undefined,
              }}
            >
              <FullBleedImage
                src={section.media.image?.src}
                alt={section.media.image?.alt ?? `${section.id} image`}
                overlayOpacity={0.0}
                textPlacement="center"
                placeholderLabel={`Missing image: ${section.id}`}
                fillMode="container"
                objectFit={section.media.image?.objectFit ?? "cover"}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function subscribeDeckNarrowViewport(cb: () => void) {
  const mq = window.matchMedia("(max-width: 767px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function getDeckNarrowViewport(): boolean {
  return window.matchMedia("(max-width: 767px)").matches;
}

function DeckArrowNav({
  scrollerId,
  lang,
}: {
  scrollerId: string;
  lang: Language;
}) {
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(true);
  const isNarrow = React.useSyncExternalStore(
    subscribeDeckNarrowViewport,
    getDeckNarrowViewport,
    () => false,
  );

  const syncEdges = React.useCallback(() => {
    const root = document.getElementById(scrollerId);
    if (!root) return;
    const { scrollLeft, scrollWidth, clientWidth } = root;
    const max = scrollWidth - clientWidth;
    setCanPrev(scrollLeft > 12);
    setCanNext(scrollLeft < max - 12);
  }, [scrollerId]);

  React.useEffect(() => {
    const root = document.getElementById(scrollerId);
    if (!root) return;
    syncEdges();
    root.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      root.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [scrollerId, syncEdges]);

  const step = React.useCallback(
    (dir: -1 | 1) => {
      const root = document.getElementById(scrollerId);
      if (!root) return;
      const w = root.clientWidth;
      root.scrollBy({ left: dir * w, behavior: "smooth" });
    },
    [scrollerId],
  );

  const prevLabel = lang === "jp" ? "前のスライド" : "Previous slide";
  const nextLabel = lang === "jp" ? "次のスライド" : "Next slide";

  const btnClass =
    "touch-manipulation pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full transition-[transform,opacity] duration-200 active:scale-95 enabled:hover:scale-105 enabled:hover:opacity-100 md:h-12 md:w-12";

  const btnSurface = (active: boolean): React.CSSProperties => ({
    background: "color-mix(in srgb, var(--bg) 52%, transparent)",
    border: "1px solid color-mix(in srgb, var(--border) 50%, transparent)",
    color: "var(--text)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    boxShadow: "0 2px 12px color-mix(in srgb, var(--bg) 40%, transparent)",
    opacity: active ? (isNarrow ? 0.55 : 0.4) : isNarrow ? 0.2 : 0.14,
  });

  const railTop = "calc(50% + 28px)";
  const leftRail: React.CSSProperties = {
    top: railTop,
    paddingLeft: "max(0.5rem, env(safe-area-inset-left))",
  };
  const rightRail: React.CSSProperties = {
    top: railTop,
    paddingRight: "max(0.5rem, env(safe-area-inset-right))",
  };

  return (
    <>
      <div
        className="pointer-events-none fixed left-0 top-1/2 z-30 -translate-y-1/2"
        style={leftRail}
      >
        <button
          type="button"
          onClick={() => step(-1)}
          disabled={!canPrev}
          aria-label={prevLabel}
          className={btnClass}
          style={btnSurface(canPrev)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[1.15rem] w-[1.15rem] md:h-5 md:w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
      <div
        className="pointer-events-none fixed right-0 top-1/2 z-30 -translate-y-1/2"
        style={rightRail}
      >
        <button
          type="button"
          onClick={() => step(1)}
          disabled={!canNext}
          aria-label={nextLabel}
          className={btnClass}
          style={btnSurface(canNext)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-[1.15rem] w-[1.15rem] md:h-5 md:w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </>
  );
}

function ProgressDotBar({
  slideIds,
  scrollerId,
}: {
  slideIds: string[];
  scrollerId: string;
}) {
  const [active, setActive] = React.useState(slideIds[0] ?? "");

  React.useEffect(() => {
    const root = document.getElementById(scrollerId);
    if (!root) return;

    const els = slideIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        const nextId = visible[0]?.target?.id;
        if (nextId) setActive(nextId);
      },
      { root, threshold: [0.55, 0.7] },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scrollerId, slideIds]);

  return (
    <div className="pointer-events-auto fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2">
      {slideIds.map((id) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              const el = document.getElementById(id);
              el?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            }}
            aria-label={`Go to ${id}`}
            className="h-3 w-3 rounded-full transition-[transform,background-color,box-shadow] duration-200"
            style={{
              background: isActive ? "var(--accent)" : "var(--border)",
              boxShadow: isActive ? "0 0 0 4px var(--accent-soft)" : "none",
              transform: isActive ? "scale(1.05)" : "scale(1)",
            }}
          />
        );
      })}
    </div>
  );
}

export default function Page() {
  const [lang, setLang] = React.useState<Language>("en");

  return (
    <div className="relative h-screen">
      <header
        className="sticky top-0 z-40"
        style={{
          background: "color-mix(in srgb, var(--bg) 88%, transparent)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]"
              style={{
                border: "1px solid var(--border)",
                background: "var(--accent-soft)",
                color: "var(--text)",
              }}
            >
              mars-pitch
            </span>
            <nav className="hidden items-center gap-3 md:flex">
              {navSections.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="text-[10px] uppercase tracking-[0.24em]"
                  style={{ color: "var(--muted)" }}
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Toggle lang={lang} setLang={setLang} />
            </div>
          </div>
        </div>
      </header>

      <main
        id="story"
        className="deck-scroll flex h-[calc(100vh-57px)] snap-x snap-mandatory overflow-x-auto overflow-y-hidden"
      >
        {narrative.map((s, idx) => (
          <Section key={s.id} lang={lang} section={s} nextSectionId={narrative[idx + 1]?.id} />
        ))}
      </main>

      <DeckArrowNav scrollerId="story" lang={lang} />

      <ProgressDotBar
        slideIds={narrative.map((s) => s.id)}
        scrollerId="story"
      />
    </div>
  );
}


