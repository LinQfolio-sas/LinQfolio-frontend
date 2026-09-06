"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The ghost is pixel-aligned with the source at progress 0 and with the
// destination at progress 1, so the opacity handoff at each end can be a
// hard cut instead of a cross-fade — swapping between two identical,
// perfectly overlapping frames reads as zero visual change, not a dissolve.
const EPSILON = 0.0005;

const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

// The features phone drifts under a live `rotate` transform on its parent
// (.phoneCol) that keeps changing as the section scrolls, so the flight
// has to match whatever angle is live at each frame, not a hardcoded one.
// Works for both matrix() and matrix3d() — the first two components (a, b)
// carry the rotation/scale part in either form.
function getRotationDegrees(el: HTMLElement): number {
  const transform = getComputedStyle(el).transform;
  if (!transform || transform === "none") return 0;
  const match = transform.match(/matrix(?:3d)?\(([^)]+)\)/);
  if (!match) return 0;
  const [a, b] = match[1].split(",").map((v) => parseFloat(v));
  return Math.atan2(b, a) * (180 / Math.PI);
}

/**
 * Flies the hero phone across the hero/features boundary as the user
 * scrolls, using a cloned "ghost" positioned via live FLIP math so it is
 * never off by a frame relative to either section's real layout. The
 * source (hero) and destination (features) phones stay mounted in place
 * and just cross-fade with the ghost at the ends of the scrub range.
 */
export default function PhoneFlight() {
  useEffect(() => {
    const fromEl = document.querySelector<HTMLElement>('[data-phone-flight="from"]');
    const toEl = document.querySelector<HTMLElement>('[data-phone-flight="to"]');
    const stageEl = document.querySelector<HTMLElement>("[data-phone-stage]");

    if (!fromEl || !toEl || !stageEl) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      gsap.set(toEl, { opacity: 1 });
      return;
    }

    // The hero phone plays a one-shot CSS entrance animation (`.reveal`,
    // fill: both) on load. A fill:both animation keeps holding its end
    // value and overrides inline styles set later via GSAP, whether it's
    // mid-flight or already finished — waiting for `animationend` is
    // racy (a fast scroll can reach the flight before it fires), so drop
    // the `animation` property outright the first time we actually need
    // to take opacity control, i.e. the first update past progress 0.
    let releasedFromAnimation = false;
    const releaseFromAnimation = () => {
      if (releasedFromAnimation) return;
      releasedFromAnimation = true;
      fromEl.style.animation = "none";
    };

    const ghost = fromEl.cloneNode(true) as HTMLElement;
    ghost.removeAttribute("data-phone-flight");
    ghost.removeAttribute("id");
    ghost.setAttribute("aria-hidden", "true");
    ghost.style.animation = "none";
    ghost.style.position = "fixed";
    ghost.style.top = "0";
    ghost.style.left = "0";
    ghost.style.margin = "0";
    ghost.style.zIndex = "60";
    ghost.style.pointerEvents = "none";
    ghost.style.willChange = "transform, width, height";
    ghost.style.opacity = "0";
    document.body.appendChild(ghost);

    gsap.set(toEl, { opacity: 0 });

    const syncGhost = (progress: number) => {
      const fromRect = fromEl.getBoundingClientRect();
      const fromCenterX = fromRect.left + fromRect.width / 2;
      const fromCenterY = fromRect.top + fromRect.height / 2;

      // toEl's own bounding rect is the *rotated* box (its parent carries
      // the live drift rotation) — its center is still accurate (rotation
      // pivots on the center), but its width/height are the rotated AABB,
      // not the phone's true size, so read those from offsetWidth/Height
      // instead (layout-box size, unaffected by ancestor transforms).
      const toRect = toEl.getBoundingClientRect();
      const toCenterX = toRect.left + toRect.width / 2;
      const toCenterY = toRect.top + toRect.height / 2;
      const toWidth = toEl.offsetWidth;
      const toRotate = toEl.parentElement ? getRotationDegrees(toEl.parentElement) : 0;

      const centerX = lerp(fromCenterX, toCenterX, progress);
      const centerY = lerp(fromCenterY, toCenterY, progress);
      const scale = lerp(1, toWidth / fromRect.width, progress);
      const rotate = lerp(0, toRotate, progress);

      const atStart = progress <= EPSILON;
      const atEnd = progress >= 1 - EPSILON;

      if (!atStart) releaseFromAnimation();

      gsap.set(ghost, {
        width: fromRect.width,
        height: fromRect.height,
        x: centerX - fromRect.width / 2,
        y: centerY - fromRect.height / 2,
        scale,
        rotate,
        transformOrigin: "50% 50%",
        opacity: atStart || atEnd ? 0 : 1,
      });
      gsap.set(fromEl, { opacity: atStart ? 1 : 0 });
      gsap.set(toEl, { opacity: atEnd ? 1 : 0 });
    };

    const trigger = ScrollTrigger.create({
      trigger: stageEl,
      start: "top 85%",
      end: "top top",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => syncGhost(self.progress),
    });

    syncGhost(trigger.progress);

    const handleRefresh = () => syncGhost(trigger.progress);
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    return () => {
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      trigger.kill();
      ghost.remove();
      gsap.set(fromEl, { clearProps: "opacity" });
      gsap.set(toEl, { clearProps: "opacity" });
    };
  }, []);

  return null;
}
