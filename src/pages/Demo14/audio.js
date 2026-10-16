// One shared, gesture-enabled mixer. GainNodes also provide fades on mobile
// browsers that do not support changing HTMLMediaElement.volume.
export const audioAssets = {
  hero: "/demo14/audio/mansion-ambience.mp3",
  hall: "/demo14/audio/hall-ambience.MP3",
  door: "/demo14/audio/door-creak.mp3",
  curse: "/demo14/audio/cursed-click.mp3",
  reveal: "/demo14/audio/reveal-impact.mp3",
};
export function createSceneAudio() {
  let context,
    master,
    enabled = false,
    scene = "hero",
    disposed = false;
  const buffers = new Map(),
    tracks = new Map(),
    versions = new Map();
  const abort = new AbortController();
  function stop(key, fade = 0) {
    versions.set(key, (versions.get(key) || 0) + 1);
    const track = tracks.get(key);
    if (!track) return;
    const now = context.currentTime;
    track.gain.gain.cancelScheduledValues(now);
    if (fade) {
      track.gain.gain.setValueAtTime(track.gain.gain.value, now);
      track.gain.gain.linearRampToValueAtTime(0, now + fade);
    } else track.gain.gain.setValueAtTime(0, now);
    try {
      track.source.stop(now + fade);
    } catch {
      /* Already ended. */
    }
  }
  function load(key) {
    if (!buffers.has(key))
      buffers.set(
        key,
        fetch(audioAssets[key], { signal: abort.signal })
          .then((response) => {
            if (!response.ok) throw new Error("Audio unavailable");
            return response.arrayBuffer();
          })
          .then((bytes) => context.decodeAudioData(bytes))
          .catch(() => {
            buffers.delete(key);
            return null;
          }),
      );
    return buffers.get(key);
  }
  async function play(key, volume, loop = false, fade = 0) {
    stop(key);
    const version = versions.get(key);
    if (!enabled || disposed || document.hidden || !context) return;
    const buffer = await load(key);
    if (
      !buffer ||
      !enabled ||
      disposed ||
      document.hidden ||
      versions.get(key) !== version ||
      context.state !== "running"
    )
      return;
    const source = context.createBufferSource(),
      gain = context.createGain();
    source.buffer = buffer;
    source.loop = loop;
    gain.gain.setValueAtTime(fade ? 0 : volume, context.currentTime);
    if (fade)
      gain.gain.linearRampToValueAtTime(volume, context.currentTime + fade);
    source.connect(gain).connect(master);
    const track = { source, gain };
    tracks.set(key, track);
    source.onended = () => {
      source.disconnect();
      gain.disconnect();
      if (tracks.get(key) === track) tracks.delete(key);
    };
    source.start();
  }
  function stopAll() {
    Object.keys(audioAssets).forEach((key) => stop(key));
  }
  function enable(value) {
    enabled = value;
    if (!value) {
      if (master) master.gain.setValueAtTime(0, context.currentTime);
      stopAll();
      return;
    }
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext || disposed) return;
    if (!context) {
      context = new AudioContext();
      master = context.createGain();
      master.connect(context.destination);
    }
    master.gain.setValueAtTime(1, context.currentTime);
    // Called directly by SOUND ON, never bypassing gesture/autoplay policy.
    context
      .resume()
      .then(() => {
        if (enabled && !disposed) {
          resumeAmbience();
          prepareCue();
        }
      })
      .catch(() => {});
  }
  function prepareCue() {
    if (!enabled || !context || disposed) return;
    const cue =
      scene === "hall"
        ? "door"
        : scene === "before"
          ? "curse"
          : scene === "after"
            ? "reveal"
            : null;
    if (cue) void load(cue);
  }
  function resumeAmbience() {
    if (scene === "hero") void play("hero", 0.22, true, 0.7);
    if (scene === "hall") void play("hall", 0.18, true, 0.7);
  }
  function transition(next) {
    stop("door");
    stop("curse");
    stop("reveal");
    if (next !== "hero") stop("hero", 0.32);
    if (next !== "hall") stop("hall", 0.32);
    if (scene === "hall" && next === "before") void play("door", 0.42);
    if (scene === "before" && ["transformation", "after"].includes(next))
      void play("curse", 0.3);
  }
  function enter(next) {
    const changed = scene !== next;
    scene = next;
    prepareCue();
    if (next !== "hero") stop("hero");
    resumeAmbience();
    if (next !== "before") stop("door");
    // The click belongs to the dark transition; finish before embedded film audio.
    if (next === "transformation" || next === "after") stop("curse");
    if (changed && next === "offers") void play("reveal", 0.38);
  }
  function visibility() {
    if (document.hidden) stopAll();
    else if (enabled) resumeAmbience();
  }
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("pagehide", stopAll);
  return {
    enable,
    transition,
    enter,
    dispose() {
      disposed = true;
      enabled = false;
      stopAll();
      abort.abort();
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", stopAll);
      context?.close().catch(() => {});
    },
  };
}
