import { useEffect, useRef, useState } from "react";
import { asset, offers, journeyStage } from "./content";
import { Icon, SoundGhost } from "./Artwork";
import { pricing } from "./pricing";

const stages = ["CHOOSE", "ENTER", "TRANSFORM", "REVEAL"];
export default function HauntHeader({
  go,
  sound,
  toggleSound,
  scene,
  soundHint,
}) {
  const [open, setOpen] = useState(false);
  const menu = useRef(null),
    trigger = useRef(null);
  const stage = journeyStage(scene);
  useEffect(() => {
    if (!open) return;
    const outside = (event) => {
      if (!menu.current?.contains(event.target)) setOpen(false);
    };
    const escape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", escape);
    };
  }, [open]);
  function navigate(next, index) {
    setOpen(false);
    trigger.current?.focus();
    go(next, index);
  }
  return (
    <header className="haunt-nav">
      <div className="haunt-brand-navigation">
        <button
          className="haunt-brand"
          onClick={() => navigate("hero")}
          aria-label="Return to the entrance"
        >
          <img src={asset("ventora-logo-white.png")} alt="Ventora Digital" />
        </button>
        <div
          className="haunt-menu"
          ref={menu}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget))
              setOpen(false);
          }}
        >
          <button
            ref={trigger}
            className="haunt-menu-trigger"
            aria-expanded={open}
            aria-controls="haunt-menu-panel"
            onClick={() => setOpen((value) => !value)}
          >
            MENU <span aria-hidden="true">{open ? "−" : "+"}</span>
          </button>
          {open && (
            <nav
              id="haunt-menu-panel"
              aria-label="Mansion navigation"
              className="haunt-menu-panel"
            >
              <button onClick={() => navigate("hero")}>MANSION ENTRANCE</button>
              <button onClick={() => navigate("hall")}>THREE DOORS</button>
              {offers.map((offer, index) => (
                <button
                  key={offer.name}
                  onClick={() => navigate("before", index)}
                >
                  {offer.name.toUpperCase()}
                </button>
              ))}
              <button onClick={() => navigate("offers")}>
                HALLOWEEN OFFERS
              </button>
            </nav>
          )}
        </div>
      </div>
      <div className="haunt-nav-actions">
        <a
          className="haunt-main-site"
          href="https://ventoradigital.com/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Ventora Digital main site (opens in a new tab)"
        >
          <span className="haunt-site-desktop">VISIT MAIN SITE</span>
          <span className="haunt-site-mobile">MAIN SITE</span>
          <Icon type="external" />
        </a>
        <div className="haunt-sound-control">
          <button
            className="haunt-sound"
            aria-pressed={sound}
            onClick={toggleSound}
          >
            <Icon type="sound" /> SOUND {sound ? "ON" : "OFF"}
          </button>
          {scene === "hero" && soundHint && !sound && (
            <button
              className="haunt-sound-hint"
              onClick={toggleSound}
              aria-label="Enable sound for the experience"
            >
              <SoundGhost />
              <span className="haunt-sound-hint-copy">
                <small>
                  <span className="haunt-sound-hint-desktop">
                    Sound adds to the haunting
                  </span>
                  <span className="haunt-sound-hint-mobile">Tap for sound</span>
                  <Icon type="up" />
                </small>
              </span>
            </button>
          )}
        </div>
      </div>
      {stage > 0 && (
        <div
          className="haunt-progress"
          aria-label={`Your Journey: ${String(stage).padStart(2, "0")} — ${stages[stage - 1]}`}
        >
          <span className="haunt-progress-caption">YOUR JOURNEY</span>
          <ol>
            {stages.map((label, index) => (
              <li
                key={label}
                className={
                  stage === index + 1
                    ? "is-current"
                    : stage > index + 1
                      ? "is-complete"
                      : ""
                }
                aria-current={stage === index + 1 ? "step" : undefined}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span className="haunt-progress-name">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      {pricing.preview && (
        <p className="haunt-pricing-preview" role="status">
          INTERNAL PRICING PREVIEW · NOT FOR PUBLIC USE
        </p>
      )}
    </header>
  );
}
