import SceneImage from "./SceneImage";
import { offers } from "./content";
import { Icon, HalloweenWeb, RoomEmblem } from "./Artwork";

export default function HallScene({
  go,
  title,
  previewDoor,
  setPreviewDoor,
  chooseDoor,
  completedRooms,
}) {
  return (
    <section className="haunt-hall">
      <HalloweenWeb />
      <div className="haunt-hall-heading">
        <p className="haunt-eyebrow">01 / THE THRESHOLD</p>
        {title(
          <>
            CHOOSE YOUR <em>NIGHTMARE.</em>
          </>,
        )}
        <p className="haunt-hall-desktop-intro">
          Behind every door lies a problem your business may be facing.
        </p>
        <p className="haunt-hall-instructions">
          <b>1. TAP A DOOR</b>
          <span>
            Read its story below, then tap <strong>ENTER THIS ROOM</strong>.
          </span>
        </p>
      </div>
      <div className="haunt-hall-art">
        <SceneImage
          name="three-doors-hall.png"
          alt="A candlelit Gothic hall with a left door, a central door above the stairs, and a right door"
        />
        <div className="haunt-hall-atmosphere" aria-hidden="true">
          <i className="haunt-hall-blue" />
          <i className="haunt-hall-red" />
          <i className="haunt-hall-mist" />
          {[0, 1].map((i) => (
            <svg
              key={i}
              className={`haunt-watcher haunt-watcher-${i}`}
              viewBox="0 0 40 120"
              fill="currentColor"
            >
              <path d="M20 4C7 4 6 24 12 32L7 45 1 113Q20 104 39 117L32 45 27 32C34 20 31 4 20 4Z" />
              <path d="M12 36 3 72l7 3 11-34 9 35 7-4-8-35Z" />
            </svg>
          ))}
        </div>
        {offers.map((o, i) => (
          <button
            key={o.name}
            className={`haunt-door haunt-door-${i} ${previewDoor === i ? "is-previewed" : ""} ${completedRooms.includes(i) ? "is-explored" : ""}`}
            onClick={() => chooseDoor(i)}
            aria-label={`Enter ${o.title}: ${o.before}`}
          >
            <span className="haunt-door-omen" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="haunt-door-marker" aria-hidden="true">
              <span className="haunt-keyhole">
                <RoomEmblem index={i} />
              </span>
              <span className="haunt-door-enter">
                <span className="haunt-door-desktop-label">
                  {completedRooms.includes(i) ? "REVISIT ✓" : "ENTER"}
                </span>
                <span className="haunt-door-mobile-label">
                  {i + 1} · {completedRooms.includes(i) ? "✓" : "TAP"}
                </span>{" "}
                <span className="haunt-invitation-arrow" aria-hidden="true">
                  <Icon type="up" />
                </span>
              </span>
            </span>
            <span className="haunt-door-info">
              <small>
                0{i + 1} / {o.chapter}
              </small>
              <strong>{o.title}</strong>
              <span className="haunt-door-offer">{o.name.toUpperCase()}</span>
              <span className="haunt-door-scope">{o.scope.toUpperCase()}</span>
              <span className="haunt-door-surprise">SAVE ??%</span>
              <Icon type="key" />
            </span>
          </button>
        ))}
      </div>
      <div className="haunt-door-choices">
        {offers.map((o, i) => (
          <article
            key={o.name}
            id={`door-choice-${i}`}
            className={previewDoor === i ? "is-previewed" : ""}
          >
            <button
              className="haunt-door-select"
              aria-expanded={previewDoor === i}
              aria-controls={`door-preview-${i}`}
              onClick={() => setPreviewDoor(previewDoor === i ? null : i)}
            >
              <small>
                0{i + 1} / {["LEFT DOOR", "CENTER DOOR", "RIGHT DOOR"][i]} ·{" "}
                {
                  [
                    "THE BROKEN CLOCK",
                    "THE LOST SPIRIT",
                    "THE VANISHING LETTER",
                  ][i]
                }
              </small>
              <strong>{o.title}</strong>
              {completedRooms.includes(i) && (
                <span className="haunt-completed-label">
                  ✓ TRANSFORMATION EXPLORED
                </span>
              )}
              <span>
                {previewDoor === i ? (
                  <>
                    SELECTED · YOUR NEXT STEP IS BELOW <Icon type="down" />
                  </>
                ) : (
                  <>
                    TAP TO SELECT THIS ROOM <Icon type="down" />
                  </>
                )}
              </span>
            </button>
            {previewDoor === i && (
              <div className="haunt-door-preview" id={`door-preview-${i}`}>
                <span className="haunt-step-label">
                  2. ENTER YOUR SELECTED ROOM
                </span>
                <p className="haunt-door-offer">{o.name.toUpperCase()}</p>
                <p>{o.scope.toUpperCase()}</p>
                <em className="haunt-mobile-save-sticker"><span>SAVE</span>{" "}<strong>??%</strong></em>
                <button
                  className="haunt-button"
                  onClick={() => go("before", i)}
                >
                  ENTER THIS ROOM
                  <Icon type="up" />
                </button>
              </div>
            )}
          </article>
        ))}
      </div>
      <div className="haunt-hall-footer">
        <span>CHOOSE A DOOR. CHANGE THE ENDING.</span>
      </div>
    </section>
  );
}
