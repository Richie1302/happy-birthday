import { useEffect, useRef, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt in deg
  scale?: number; // hover scale
  scrollTilt?: boolean; // enable subtle scroll-driven tilt (mobile-friendly)
  shine?: boolean;
};

/**
 * 3D tilt wrapper.
 * - Desktop / fine pointer: pointermove parallax + shine.
 * - Mobile / coarse pointer: subtle scroll-driven tilt as element moves through viewport.
 * Both are GPU-only (transform + opacity), respect prefers-reduced-motion, and clean up.
 */
export function Tilt3D({
  children,
  className = "",
  max = 12,
  scale = 1.03,
  scrollTilt = true,
  shine = true,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;

    // ---- desktop: pointer tilt ----
    if (!coarse) {
      let raf = 0;
      const onMove = (e: PointerEvent) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (0.5 - py) * max;
        const ry = (px - 0.5) * max;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`;
          if (shineRef.current) {
            shineRef.current.style.setProperty("--shine-opacity", "0.35");
            shineRef.current.style.setProperty(
              "--shine-angle",
              `${Math.atan2(py - 0.5, px - 0.5) * (180 / Math.PI) + 90}deg`,
            );
          }
        });
      };
      const reset = () => {
        cancelAnimationFrame(raf);
        inner.style.transform = "";
        if (shineRef.current) shineRef.current.style.setProperty("--shine-opacity", "0");
      };
      wrap.addEventListener("pointermove", onMove);
      wrap.addEventListener("pointerleave", reset);
      return () => {
        cancelAnimationFrame(raf);
        wrap.removeEventListener("pointermove", onMove);
        wrap.removeEventListener("pointerleave", reset);
      };
    }

    // ---- mobile: scroll-driven subtle tilt ----
    if (!scrollTilt) return;
    let raf = 0;
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = wrap.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // progress: 0 when element enters bottom, 1 when leaves top. Center ~0.5.
      const center = r.top + r.height / 2;
      const p = Math.max(0, Math.min(1, 1 - center / vh));
      // Map 0..1 -> tilt from +max*0.5 through 0 to -max*0.5
      const rx = (0.5 - p) * max * 0.9;
      const ry = Math.sin(p * Math.PI * 2) * max * 0.25;
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, max, scale, scrollTilt]);

  return (
    <div ref={wrapRef} className={`perspective-1000 ${className}`}>
      <div ref={innerRef} className="tilt-3d relative h-full w-full">
        {children}
        {shine && <span ref={shineRef} className="tilt-3d-shine" aria-hidden />}
      </div>
    </div>
  );
}
