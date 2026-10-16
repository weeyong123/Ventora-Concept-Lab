import { useEffect, useRef, useState } from "react";
import { asset, offers, offerMessage, contactLinks } from "./content";
import "./Demo14.css";
import { createSceneAudio } from "./audio";
import HauntedPointer from "./HauntedPointer";
import { warmImage } from "./images";
import Film from "./Film";
import { Icon } from "./Artwork";
import HauntHeader from "./HauntHeader";
import HeroScene from "./HeroScene";
import HallScene from "./HallScene";
import RoomScene from "./RoomScene";
import OffersScene from "./OffersScene";

export default function Demo14() {
  const [scene, setScene] = useState("hero");
  const [selected, setSelected] = useState(null);
  const [completedRooms, setCompletedRooms] = useState([]);
  const [sound, setSound] = useState(false);
  const [soundHint, setSoundHint] = useState(true);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [fading, setFading] = useState(false);
  const [breaking, setBreaking] = useState(false);
  const [offerTarget, setOfferTarget] = useState(null);
  const [previewDoor, setPreviewDoor] = useState(null);
  const [fields, setFields] = useState({ name: "", website: "", notes: "" });
  const [copyResult, setCopyResult] = useState(null);
  const audio = useRef(null);
  useEffect(() => {
    audio.current = createSceneAudio();
    return () => {
      audio.current.dispose();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    audio.current?.enter(scene);
  }, [scene]);
  function toggleSound() {
    setSoundHint(false);
    const next = !sound;
    audio.current?.enable(next);
    setSound(next);
  }
  const lock = useRef(false);
  const timer = useRef(null);
  const heading = useRef(null);
  const messageArea = useRef(null);
  const allRoomsComplete = completedRooms.length === offers.length;
  const room = offers[selected];
  const message = offerMessage(selected, fields);
  const links = contactLinks(selected, message);
  useEffect(() => {
    const oldTitle = document.title;
    document.title = "The Haunted Website — Ventora Digital | Halloween 2026";
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = (e) => setReduced(e.matches);
    query.addEventListener("change", change);
    return () => {
      document.title = oldTitle;
      query.removeEventListener("change", change);
      clearTimeout(timer.current);
    };
  }, []);
  const notice = copyResult?.message === message ? copyResult.text : "";
  const setNotice = (text) => setCopyResult({ message, text });
  useEffect(() => {
    // Fetch only the next relevant still, never every room from the entrance.
    const nextImage =
      scene === "opening"
        ? "three-doors-hall.png"
        : scene === "before" || scene === "transformation"
          ? `door${selected + 1}-after.png`
          : scene === "after"
            ? "final-reveal-bg.png"
            : null;
    if (nextImage) warmImage(nextImage);
    if (scene !== "hero") heading.current?.focus({ preventScroll: true });
  }, [scene, selected]);
  function go(next, index, target) {
    if (lock.current) return;
    lock.current = true;
    document.querySelectorAll(".haunt video").forEach((video) => video.pause());
    audio.current?.transition(next);
    const commit = () => {
      setFading(true);
      timer.current = setTimeout(
        () => {
          if (index !== undefined) setSelected(index);
          if (next === "after") {
            const completedIndex = index ?? selected;
            setCompletedRooms((previous) =>
              previous.includes(completedIndex)
                ? previous
                : [...previous, completedIndex],
            );
          }
          setOfferTarget(
            next === "offers"
              ? {
                  id:
                    target || "haunt-reveal",
                }
              : null,
          );
          setScene(next);
          setPreviewDoor(null);
          setBreaking(false);
          window.scrollTo({ top: 0, behavior: "instant" });
          setFading(false);
          lock.current = false;
        },
        reduced ? 0 : 320,
      );
    };
    if (scene === "before" && next === "transformation" && !reduced) {
      setBreaking(true);
      timer.current = setTimeout(commit, 650);
    } else commit();
  }
  useEffect(() => {
    if (scene !== "hall" || previewDoor === null) return;
    warmImage(`door${previewDoor + 1}-before.png`);
    const frame = requestAnimationFrame(() => {
      const card = document.getElementById(`door-choice-${previewDoor}`);
      card?.scrollIntoView({
        behavior: reduced ? "instant" : "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [previewDoor, scene, reduced]);
  useEffect(() => {
    if (scene !== "offers" || !offerTarget) return;
    const frame = requestAnimationFrame(() =>
      document
        .getElementById(offerTarget.id)
        ?.scrollIntoView({ behavior: "instant", block: "start" }),
    );
    return () => cancelAnimationFrame(frame);
  }, [scene, offerTarget]);
  function chooseDoor(index) {
    if (window.matchMedia("(max-width: 700px), (hover: none)").matches)
      setPreviewDoor(index);
    else go("before", index);
  }

  async function copy(facebook = false) {
    if (selected === null) return;
    try {
      await navigator.clipboard.writeText(message);
      setNotice(
        facebook
          ? "MESSAGE COPIED! Paste it into Facebook and send when you are ready."
          : "MESSAGE COPIED!",
      );
    } catch {
      setNotice(
        "Automatic copy is unavailable. Select and copy the message below, then paste it into your chosen channel.",
      );
      messageArea.current?.focus();
      messageArea.current?.select();
    }
  }
  const title = (text, level = 1) =>
    level === 1 ? (
      <h1 ref={heading} tabIndex={-1}>
        {text}
      </h1>
    ) : (
      <h2 ref={heading} tabIndex={-1}>
        {text}
      </h2>
    );
  return (
    <main
      className={`haunt haunt-scene-${scene} ${fading ? "is-fading" : ""} ${breaking ? "is-breaking" : ""}`}
    >
      <HauntedPointer
        cinematic={["opening", "transformation"].includes(scene)}
      />
      <a className="haunt-skip" href="#haunt-content">
        SKIP TO CONTENT
      </a>
      <HauntHeader
        {...{
          go,
          sound,
          toggleSound,
          scene,
          soundHint,
          completedRooms,
          selected,
        }}
      />
      <div id="haunt-content" className="haunt-content">
        {scene === "hero" && <HeroScene {...{ go, reduced, title }} />}
        {scene === "opening" && (
          <section className="haunt-stage">
            <Film
              src="mansion-door-opening.mp4"
              poster={asset("mansion-poster.jpg")}
              sound={sound}
              onDone={() => go("hall")}
              onNearEnd={() => go("hall")}
            />
            <h1 className="haunt-sr" tabIndex={-1} ref={heading}>
              Entering the mansion
            </h1>
            <button className="haunt-film-skip" onClick={() => go("hall")}>
              SKIP INTRO / ENTER THE HALL <Icon />
            </button>
          </section>
        )}
        {scene === "hall" && (
          <HallScene
            {...{
              go,
              title,
              previewDoor,
              setPreviewDoor,
              chooseDoor,
              completedRooms,
            }}
          />
        )}
        {["before", "transformation", "after"].includes(scene) && (
          <RoomScene
            {...{ scene, room, selected, sound, go, reduced, title, heading }}
          />
        )}
        {scene === "offers" && (
          <OffersScene
            {...{
              go,
              allRoomsComplete,
              title,
              selected,
              setSelected,
              room,
              fields,
              setFields,
              messageArea,
              message,
              copy,
              notice,
              links,
            }}
          />
        )}
      </div>
      <div className="haunt-transition" aria-hidden="true" />
    </main>
  );
}
