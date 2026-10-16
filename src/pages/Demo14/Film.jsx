import { useEffect, useRef, useState } from "react";
import { asset } from "./content";

export default function Film({
  src,
  poster,
  sound,
  loop = false,
  background = false,
  onDone,
  onNearEnd,
  reduced,
}) {
  const ref = useRef(null);
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    if (status !== "loading") return;
    const timer = setTimeout(() => setStatus("slow"), 7000);
    return () => clearTimeout(timer);
  }, [status]);
  useEffect(() => {
    const video = ref.current;
    video.volume = 0.65;
    if (reduced && background) return;
    let active = true;
    const start = () => {
      if (!video.ended)
        video.play()?.catch(() => {
          if (active) setStatus("blocked");
        });
    };
    start();
    const visibility = () => {
      if (document.hidden) video.pause();
      else start();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      active = false;
      video.pause();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [src, reduced, loop, background]);
  return (
    <>
      <video
        ref={ref}
        className="haunt-media"
        src={asset(src)}
        poster={poster}
        muted={!sound}
        loop={loop}
        playsInline
        preload={reduced && background ? "none" : "auto"}
        onPlaying={() => setStatus("playing")}
        onWaiting={() => setStatus("loading")}
        onError={() => setStatus("error")}
        onEnded={onDone}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (!loop && v.duration - v.currentTime < 0.38) onNearEnd?.();
        }}
      />
      {!background &&
        !loop &&
        ["slow", "blocked", "error"].includes(status) && (
          <div className="haunt-film-status" role="status">
            {status === "error"
              ? "This film is unavailable. You can continue below."
              : status === "blocked"
                ? "Playback is paused. Play the film or continue below."
                : status === "slow"
                  ? "The film is taking a little longer. You can continue below."
                  : "Preparing your experience…"}
            {status === "blocked" && (
              <button
                onClick={() =>
                  ref.current.play().catch(() => setStatus("error"))
                }
              >
                PLAY FILM
              </button>
            )}
          </div>
        )}
    </>
  );
}
