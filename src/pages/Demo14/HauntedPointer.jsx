import { useEffect, useRef } from "react";

const sparks = Array.from({ length: 12 }, (_, i) => i);
export default function HauntedPointer({ cinematic }) {
  const ref = useRef(null);
  useEffect(() => {
    const node = ref.current;
    const core = node.querySelector(".haunt-pointer-core");
    const particles = [...node.querySelectorAll(".haunt-pointer-spark")];
    const seal = node.querySelector(".haunt-pointer-sigil");
    const media = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0,
      index = 0,
      lastSpark = 0,
      position = null;
    const hide = () => {
      cancelAnimationFrame(frame);
      node.style.opacity = "0";
      position = null;
      node
        .getAnimations({ subtree: true })
        .forEach((animation) => animation.cancel());
    };
    const allowed = (event) =>
      media.matches &&
      !cinematic &&
      event.pointerType !== "touch" &&
      !event.target.closest("input, textarea, select");
    const emit = (x, y, burst = false) => {
      const particle = particles[index++ % particles.length];
      particle.getAnimations().forEach((animation) => animation.cancel());
      const angle = Math.random() * Math.PI * 2;
      const distance = burst
        ? 35 + Math.random() * 65
        : 12 + Math.random() * 22;
      particle.animate(
        [
          {
            transform: `translate(${x}px,${y}px) scale(${burst ? 1.4 : 1})`,
            opacity: 0.85,
          },
          {
            transform: `translate(${x + Math.cos(angle) * distance}px,${y + (burst ? Math.sin(angle) * distance : -distance)}px) scale(0)`,
            opacity: 0,
          },
        ],
        { duration: burst ? 850 : 700, easing: "ease-out" },
      );
    };
    const move = (event) => {
      if (!allowed(event)) {
        hide();
        return;
      }
      position = {
        clientX: event.clientX,
        clientY: event.clientY,
        pointerType: event.pointerType,
      };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        core.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
        node.style.opacity = "1";
        node.classList.toggle(
          "is-inviting",
          Boolean(event.target.closest("button, a, label")),
        );
        if (performance.now() - lastSpark > 70) {
          emit(event.clientX, event.clientY);
          lastSpark = performance.now();
        }
      });
    };
    const scroll = () => {
      if (!position) return;
      const target = document.elementFromPoint(
        position.clientX,
        position.clientY,
      );
      if (target) move({ ...position, target });
    };
    const press = (event) => {
      if (!allowed(event)) return;
      node.style.opacity = "1";
      core.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      seal.getAnimations().forEach((animation) => animation.cancel());
      seal.animate(
        [
          { transform: "scale(.45) rotate(-35deg)", opacity: 1 },
          { transform: "scale(2.1) rotate(35deg)", opacity: 0 },
        ],
        { duration: 750, easing: "ease-out" },
      );
      for (let i = 0; i < 6; i++) emit(event.clientX, event.clientY, true);
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", press, { passive: true });
    window.addEventListener("blur", hide);
    window.addEventListener("scroll", scroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", hide);
    media.addEventListener("change", hide);
    hide();
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", press);
      window.removeEventListener("blur", hide);
      window.removeEventListener("scroll", scroll);
      document.documentElement.removeEventListener("pointerleave", hide);
      media.removeEventListener("change", hide);
    };
  }, [cinematic]);
  return (
    <div ref={ref} className="haunt-pointer" aria-hidden="true">
      <div className="haunt-pointer-core">
        <svg className="haunt-pointer-pumpkin" viewBox="0 0 48 48" fill="none">
          <path d="M24 12c-2-5 1-8 5-9l2 4c-4 0-5 2-5 5" fill="#8d9c61" />
          <path
            d="M24 13C7 6 0 23 7 35c4 7 11 8 17 6 6 2 13 1 17-6 7-12 0-29-17-22Z"
            fill="#d77825"
            stroke="#f1ab54"
            strokeWidth="1.2"
          />
          <path
            d="M21 14c-8 5-10 19-3 26m9-26c8 5 10 19 3 26M24 14v27"
            stroke="#9d481d"
            strokeWidth="1.4"
          />
          <path
            className="haunt-pumpkin-eyes"
            d="m13 21 8 5-9 1Zm22 0-8 5 9 1Z"
          />
          <path
            className="haunt-pumpkin-mouth"
            d="m13 31 6 2 2-3 3 4 3-4 2 3 6-2c-4 9-18 9-22 0Z"
          />
        </svg>
        <svg className="haunt-pointer-sigil" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="32" />
          <circle cx="40" cy="40" r="25" strokeDasharray="16 5 2 5" />
          <path d="m40 12 24 42H16ZM40 2v9m0 58v9M2 40h9m58 0h9M17 17l6 6m34 34 6 6M17 63l6-6m34-34 6-6" />
        </svg>
      </div>
      {sparks.map((i) => (
        <i key={i} className="haunt-pointer-spark" />
      ))}
    </div>
  );
}
