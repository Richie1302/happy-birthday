import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Heart, X, Play, Volume2, VolumeX } from "lucide-react";
import { Tilt3D } from "@/components/Tilt3D";

import hero from "@/assets/hero.jpg";
import hero2 from "@/assets/hero2.jpg";
import hero3 from "@/assets/hero3.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.png";
import g4 from "@/assets/g4.jpg";
import g5 from "@/assets/g5.jpg";
import g6 from "@/assets/g6.jpg";
import v1 from "@/assets/v1.mp4";
import v2 from "@/assets/v2.mp4";
import v3 from "@/assets/v3.mp4";
import lateNightWalk from "@/assets/late_night_walk.png";
import longPhoneCall from "@/assets/long_phone_call.png";
import firstHello from "@/assets/first_hello.png";

export const Route = createFileRoute("/")({
  component: BirthdayPage,
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: hero, fetchPriority: "high" },
    ],
  }),
});

const NAME = "Temi";
const VIEW_ONCE = { once: true, amount: 0.2 } as const;
const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- HERO ---------- */
const heroSlides = [hero, hero2, hero3];

function Hero() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 160]);
  const scale = useTransform(scrollY, [0, 600], [1, reduce ? 1 : 1.1]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const words = `Happy Birthday ${NAME}`.split(" ");

  const container: Variants = {
    hidden: {},
    show: { transition: { delayChildren: 0.5, staggerChildren: 0.045 } },
  };
  const letter: Variants = {
    hidden: { opacity: 0, y: 40, rotateX: -60, z: -40 },
    show: { opacity: 1, y: 0, rotateX: 0, z: 0, transition: { duration: 0.7, ease: EASE } },
  };

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <m.div
        style={{ y, scale, willChange: "transform" }}
        className="absolute inset-0"
      >
        <AnimatePresence mode="sync">
          <m.img
            key={currentSlide}
            src={heroSlides[currentSlide]}
            alt={NAME}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      </m.div>

      <m.div
        style={{ opacity }}
        className="relative z-10 flex h-full flex-col items-center justify-end px-6 pb-24 text-center"
      >
        <m.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.9 }}
          className="script text-2xl text-cream/90 md:text-3xl"
        >
          for the loveliest one —
        </m.p>

        <m.h1
          variants={container}
          initial="hidden"
          animate="show"
          style={{ perspective: 800, transformStyle: "preserve-3d" }}
          className="mt-4 flex flex-wrap justify-center gap-x-3 text-4xl leading-[1.05] text-cream sm:text-6xl md:text-8xl"
        >
          {words.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word.split("").map((ch, charIdx) => (
                <m.span
                  key={charIdx}
                  variants={letter}
                  className="inline-block"
                >
                  {ch}
                </m.span>
              ))}
            </span>
          ))}
        </m.h1>

        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <span className="h-16 w-px bg-cream/50" />
          <span className="text-xs tracking-[0.4em] text-cream/70 uppercase">Scroll</span>
        </m.div>
      </m.div>
    </section>
  );
}

/* ---------- HEART RAIN ANIMATION ---------- */
function HeartRain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const hearts: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      rotation: number;
      rotationSpeed: number;
      drift: number;
    }> = [];

    const createHeart = () => {
      return {
        x: Math.random() * width,
        y: -20,
        size: 6 + Math.random() * 10,
        speed: 0.8 + Math.random() * 1.5,
        opacity: 0.15 + Math.random() * 0.45,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.015,
        drift: (Math.random() - 0.5) * 0.4,
      };
    };

    for (let i = 0; i < 25; i++) {
      hearts.push({
        ...createHeart(),
        y: Math.random() * height,
      });
    }

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rotation: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, -topCurveHeight, -size, topCurveHeight / 3, 0, size);
      ctx.bezierCurveTo(size, topCurveHeight / 3, size / 2, -topCurveHeight, 0, topCurveHeight);
      ctx.closePath();
      ctx.fillStyle = `rgba(225, 93, 133, ${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const update = () => {
      ctx.clearRect(0, 0, width, height);

      if (hearts.length < 40 && Math.random() < 0.08) {
        hearts.push(createHeart());
      }

      for (let i = hearts.length - 1; i >= 0; i--) {
        const h = hearts[i];
        h.y += h.speed;
        h.x += h.drift;
        h.rotation += h.rotationSpeed;

        drawHeart(ctx, h.x, h.y, h.size, h.opacity, h.rotation);

        if (h.y > height + 20 || h.x < -20 || h.x > width + 20) {
          hearts[i] = createHeart();
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-40 h-full w-full" />;
}

/* ---------- BACKGROUND MUSIC PLAYER ---------- */
function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const startAudioOnInteraction = () => {
      if (!audioRef.current) return;
      audioRef.current.play()
        .then(() => {
          setPlaying(true);
          // Remove listener once successful
          document.removeEventListener("click", startAudioOnInteraction);
          document.removeEventListener("touchstart", startAudioOnInteraction);
        })
        .catch(e => {
          console.log("Autoplay still blocked:", e.message);
        });
    };

    document.addEventListener("click", startAudioOnInteraction);
    document.addEventListener("touchstart", startAudioOnInteraction);

    return () => {
      document.removeEventListener("click", startAudioOnInteraction);
      document.removeEventListener("touchstart", startAudioOnInteraction);
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setPlaying(true);
        })
        .catch(e => {
          console.error("Audio failed to play", e);
        });
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/bg_music.mp3"
        loop
        preload="auto"
      />
      <button
        onClick={toggle}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-card/90 shadow-lg border border-gold/30 text-rose backdrop-blur-md transition hover:scale-110 hover:border-rose/50"
        aria-label="Toggle music"
      >
        {playing ? (
          <Volume2 className="h-6 w-6 animate-pulse" />
        ) : (
          <VolumeX className="h-6 w-6 text-rose/60" />
        )}
      </button>
    </>
  );
}

/* ---------- ENVELOPE FOR LETTER ---------- */
function Envelope({ isOpen, onOpen, children }: { isOpen: boolean; onOpen: () => void; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-[400px]">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <m.div
            key="closed-envelope"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={onOpen}
            className="group relative cursor-pointer overflow-hidden rounded-2xl bg-card border border-gold/40 p-12 text-center transition hover:border-rose/60 md:p-16 max-w-md w-full"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose/10 text-rose shadow-inner transition group-hover:scale-110">
              <Heart className="h-10 w-10 fill-rose text-rose animate-pulse" strokeWidth={1} />
            </div>
            <h3 className="script mt-8 text-3xl text-rose">For Temi</h3>
            <p className="mt-4 font-display text-sm tracking-widest text-ink/60 uppercase">Click to open letter</p>
          </m.div>
        ) : (
          <m.div
            key="open-letter"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="w-full"
          >
            {children}
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- reusable fade-up ---------- */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* ---------- LETTER ---------- */
function Letter() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      className="relative px-6 py-32 md:py-44 [content-visibility:auto] [contain-intrinsic-size:1px_900px]"
      style={{ background: "var(--gradient-soft)" }}
    >
      <div className="mx-auto max-w-2xl">
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW_ONCE} className="text-center">
          <p className="script text-4xl text-rose md:text-5xl">A letter for you</p>
          <div className="mx-auto mt-4 h-px w-24 bg-gold" />
        </m.div>

        <m.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={VIEW_ONCE}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="mt-14"
        >
        <Envelope isOpen={isOpen} onOpen={() => setIsOpen(true)}>
          <Tilt3D max={6} scale={1.01} shine>
          <article
            className="rounded-2xl bg-card/80 p-8 backdrop-blur-sm md:p-14"
            style={{ boxShadow: "var(--shadow-soft)" }}
          >
            <p className="script mb-6 text-3xl text-rose">My dearest Temi,</p>
            <div className="space-y-5 font-display text-lg leading-relaxed text-ink/90 md:text-xl">
              <p>
                There are days I catch myself smiling for no reason, and I realize the reason is always you.
                You are the softest thought in a loud world — my morning, my quiet, my favorite kind of noise.
              </p>
              <p>
                Watching you grow, dream, and shine has been the greatest privilege of my life. You carry a
                light most people only spend their lives searching for, and somehow you share it with me
                every single day.
              </p>
              <p>
                Today the world gets to celebrate what I already know — that you being born was the best
                thing that ever happened to it, and to me.
              </p>
              <p className="script pt-4 text-3xl text-rose">Forever yours,</p>
            </div>
          </article>
          </Tilt3D>
        </Envelope>
        </m.div>
      </div>
    </section>
  );
}

/* ---------- GALLERY ---------- */
const gallery = [
  { src: g1, alt: "Peonies with gold ribbon", span: "md:row-span-2" },
  { src: g2, alt: "Hands at sunset", span: "" },
  { src: g3, alt: "Birthday cake", span: "" },
  { src: g4, alt: "Dancing under string lights", span: "md:row-span-2" },
  { src: g5, alt: "Handwritten letter", span: "" },
  { src: g6, alt: "Champagne toast", span: "" },
];

function Gallery() {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <section className="relative px-6 py-24 md:py-32 [content-visibility:auto] [contain-intrinsic-size:1px_1200px]">
      <div className="mx-auto max-w-6xl">
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW_ONCE} className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] text-rose uppercase">Frame by frame</p>
          <h2 className="mt-3 text-4xl md:text-6xl">Little pieces of us</h2>
        </m.div>

        <div className="grid auto-rows-[220px] grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
          {gallery.map((img, i) => (
            <m.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={VIEW_ONCE}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
              className={img.span}
            >
              <Tilt3D max={14} scale={1.04} shine className="h-full w-full">
                <button
                  onClick={() => setOpen(i)}
                  className="group relative block h-full w-full overflow-hidden rounded-xl"
                  style={{ boxShadow: "var(--shadow-soft)" }}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </button>
              </Tilt3D>
            </m.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open !== null && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setOpen(null)}
              className="absolute top-6 right-6 rounded-full bg-cream/10 p-3 text-cream transition hover:bg-cream/20"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <m.img
              key={open}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              src={gallery[open].src}
              alt={gallery[open].alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] rounded-lg object-contain"
            />
          </m.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- VIDEOS ---------- */
const videos = [
  {
    src: v1,
    poster: g1,
    caption: "The way petals fall — soft, endless, like every reason I love you.",
  },
  {
    src: v2,
    poster: g2,
    caption: "Every sunset is a reminder that even endings can be beautiful with you.",
  },
  {
    src: v3,
    poster: g4,
    caption: "This — this is what our love looks like from the inside.",
  },
];

function VideoCard({ v, i }: { v: (typeof videos)[number]; i: number }) {
  const [playing, setPlaying] = useState(false);
  return (
    <m.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={VIEW_ONCE}
      transition={{ duration: 0.7, delay: i * 0.08, ease: EASE }}
      className="group"
    >
      <Tilt3D max={10} scale={1.02} shine>
      <div className="relative aspect-video overflow-hidden rounded-2xl" style={{ boxShadow: "var(--shadow-soft)" }}>
        <video
          src={v.src}
          poster={v.poster}
          controls={playing}
          playsInline
          preload="none"
          className="h-full w-full object-cover"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        {!playing && (
          <button
            onClick={(e) => {
              const vid = e.currentTarget.previousSibling as HTMLVideoElement;
              vid.play();
            }}
            className="absolute inset-0 flex items-center justify-center bg-ink/20 transition hover:bg-ink/10"
            aria-label="Play video"
          >
            <span className="grid h-20 w-20 place-items-center rounded-full bg-cream/95 text-rose shadow-2xl transition group-hover:scale-110">
              <Play className="ml-1 h-8 w-8 fill-current" />
            </span>
          </button>
        )}
      </div>
      </Tilt3D>
      <p className="script mt-5 text-center text-2xl text-rose">{v.caption}</p>
    </m.div>
  );
}

function Videos() {
  return (
    <section
      className="relative px-6 py-24 md:py-32 [content-visibility:auto] [contain-intrinsic-size:1px_900px]"
      style={{ background: "linear-gradient(180deg, var(--cream) 0%, oklch(0.95 0.03 25) 100%)" }}
    >
      <div className="mx-auto max-w-6xl">
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW_ONCE} className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] text-rose uppercase">Moving pictures</p>
          <h2 className="mt-3 text-4xl md:text-6xl">Moments, in motion</h2>
        </m.div>

        <div className="grid gap-14 md:grid-cols-3 md:gap-8">
          {videos.map((v, i) => (
            <VideoCard key={i} v={v} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- THINGS I LOVE ---------- */
const loves = [
  "The way you laugh with your whole face.",
  "How you turn ordinary mornings into small ceremonies.",
  "Your fierce, protective kindness for the people you love.",
  "The little hum you make when you're deep in thought.",
  "How safe the world feels when your hand is in mine.",
  "Your stubborn, beautiful hope — even on the hard days.",
  "The way you say my name like it's a favorite word.",
  "That you chose me. And keep choosing me.",
];

function ThingsILove() {
  const listContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const listItem: Variants = {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
  };

  return (
    <section className="relative px-6 py-24 md:py-32 [content-visibility:auto] [contain-intrinsic-size:1px_1000px]">
      <div className="mx-auto max-w-3xl">
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW_ONCE} className="mb-16 text-center">
          <p className="text-xs tracking-[0.4em] text-rose uppercase">A short, incomplete list</p>
          <h2 className="mt-3 text-4xl md:text-6xl">Things I love about you</h2>
        </m.div>

        <m.ol
          variants={listContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="space-y-8"
        >
          {loves.map((line, i) => (
            <m.li
              key={i}
              variants={listItem}
              className="flex items-baseline gap-6 border-b border-border/60 pb-6"
            >
              <span className="font-display text-3xl text-gold md:text-4xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-display text-xl leading-snug text-ink/90 md:text-2xl">
                {line}
              </span>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  );
}

/* ---------- TIMELINE ---------- */
const timeline = [
  { img: firstHello, date: "The first hello", caption: "A nervous laugh, a spark, and the exact moment my life quietly reorganized itself around you." },
  { img: lateNightWalk, date: "A late-night walk", caption: "Strolling under the quiet stars, sharing stories we'd never told anyone else, and wishing the night would never end." },
  { img: longPhoneCall, date: "Long calls", caption: "Hours melting away into minutes, talking about everything and nothing at all, just to hear your voice." },
];

function Timeline() {
  return (
    <section
      className="relative px-6 py-24 md:py-32 [content-visibility:auto] [contain-intrinsic-size:1px_1400px]"
      style={{ background: "var(--gradient-soft)" }}
    >
      <div className="mx-auto max-w-5xl">
        <m.div variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEW_ONCE} className="mb-20 text-center">
          <p className="text-xs tracking-[0.4em] text-rose uppercase">Us, so far</p>
          <h2 className="mt-3 text-4xl md:text-6xl">A timeline of small forevers</h2>
        </m.div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-4 w-px bg-gradient-to-b from-transparent via-gold to-transparent md:left-1/2" />

          <div className="space-y-16 md:space-y-24">
            {timeline.map((mo, i) => {
              const flip = i % 2 === 1;
              return (
                <m.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={VIEW_ONCE}
                  transition={{ duration: 0.8, ease: EASE }}
                  className={`relative grid grid-cols-[minmax(0,1fr)] items-center gap-6 pl-12 md:grid-cols-2 md:gap-12 md:pl-0 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="absolute top-6 left-2 h-4 w-4 rounded-full bg-rose ring-4 ring-cream md:left-1/2 md:-translate-x-1/2" />

                  <div className={flip ? "md:pl-8" : "md:pr-8"}>
                    <Tilt3D max={12} scale={1.03} shine>
                      <img
                        src={mo.img}
                        alt={mo.date}
                        loading="lazy"
                        decoding="async"
                        className="aspect-[4/3] w-full rounded-2xl object-cover"
                        style={{ boxShadow: "var(--shadow-soft)" }}
                      />
                    </Tilt3D>
                  </div>
                  <div className={flip ? "md:pr-8 md:text-right" : "md:pl-8"}>
                    <p className="script text-3xl text-rose md:text-4xl">{mo.date}</p>
                    <p className="mt-3 font-display text-lg text-ink/85 md:text-xl">{mo.caption}</p>
                  </div>
                </m.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- CLOSING + HEARTS ---------- */
function FloatingHearts() {
  const reduce = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    setCount(isMobile || isCoarse ? 10 : 22);
  }, [reduce]);

  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: Math.random() * 100,
        size: 12 + Math.random() * 20,
        duration: 9 + Math.random() * 9,
        delay: Math.random() * 12,
        opacity: 0.35 + Math.random() * 0.45,
        key: i,
      })),
    [count],
  );

  if (count === 0) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {hearts.map((h) => (
        <span
          key={h.key}
          className="heart"
          style={{
            left: `${h.left}%`,
            animationDuration: `${h.duration}s`,
            animationDelay: `${h.delay}s`,
            opacity: h.opacity,
          }}
        >
          <Heart style={{ width: h.size, height: h.size }} fill="currentColor" strokeWidth={0} />
        </span>
      ))}
    </div>
  );
}

function Closing() {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 md:py-44"
      style={{ background: "linear-gradient(180deg, oklch(0.95 0.03 25) 0%, oklch(0.9 0.05 20) 100%)" }}
    >
      <FloatingHearts />

      <m.div
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={VIEW_ONCE}
        transition={{ duration: 1, ease: EASE }}
        className="relative z-10 mx-auto max-w-2xl text-center"
      >
        <p className="text-xs tracking-[0.4em] text-rose uppercase">A birthday blessing</p>
        <h2 className="mt-4 text-5xl leading-tight md:text-7xl">
          <span className="text-gradient-gold">May this year love you back.</span>
        </h2>

        <div className="mx-auto mt-10 max-w-xl space-y-5 font-display text-lg text-ink/85 md:text-xl">
          <p>
            May your days be gentle and your nights be quiet.
            May every prayer you've whispered find its way home to you.
          </p>
          <p>
            May you be surrounded — always — by people who see you the way I do,
            and may you be reminded, in a thousand small ways, that you are deeply,
            wildly, forever loved.
          </p>
          <p className="script pt-4 text-4xl text-rose md:text-5xl">
            Happy Birthday, {NAME}.
          </p>
        </div>

        <div className="mt-14 flex items-center justify-center gap-3 text-rose">
          <span className="h-px w-12 bg-rose/40" />
          <Heart className="h-4 w-4 fill-current" />
          <span className="h-px w-12 bg-rose/40" />
        </div>
      </m.div>
    </section>
  );
}

/* ---------- PAGE ---------- */
function BirthdayPage() {
  return (
    <LazyMotion features={domAnimation} strict>
      <main className="min-h-screen bg-background text-foreground">
        <HeartRain />
        <MusicPlayer />
        <Hero />
        <Letter />
        <Gallery />
        <Videos />
        <ThingsILove />
        <Timeline />
        <Closing />
      </main>
    </LazyMotion>
  );
}
