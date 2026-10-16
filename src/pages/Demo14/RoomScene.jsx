import { pricing } from "./pricing";
import SceneImage from "./SceneImage";
import { imageSource } from "./images";
import { asset } from "./content";
import { Icon, CurseSeal } from "./Artwork";
import Film from "./Film";

export default function RoomScene({
  scene,
  room,
  selected,
  sound,
  go,
  reduced,
  title,
  heading,
}) {
  return (
    <section className={`haunt-stage haunt-room haunt-room-${selected}`}>
      {scene === "transformation" ? (
        <Film
          key={room.video}
          src={room.video}
          poster={imageSource(
            `door${selected + 1}-before.png`,
            window.innerWidth <= 700,
          )}
          sound={sound}
          onDone={() => go("after")}
        />
      ) : (
        <SceneImage
          className="haunt-media"
          name={`door${selected + 1}-${scene}.png`}
          alt={`${room.title.toLowerCase()} — ${scene === "before" ? "a haunted business nightmare" : "a restored, professional digital experience"}`}
        />
      )}
      <div className="haunt-room-shade" />
      {scene === "before" && !reduced && (
        <video
          className="haunt-preload"
          src={asset(room.video)}
          preload="metadata"
          muted
          aria-hidden="true"
        />
      )}
      {scene !== "transformation" ? (
        <div className="haunt-room-copy">
          <div className="haunt-room-story">
            <p className="haunt-eyebrow">
              0{selected + 1} / {room.chapter}{" "}
              <span>
                — {scene === "before" ? "THE NIGHTMARE" : "THE SECOND LIFE"}
              </span>
            </p>
            {title(
              scene === "before" ? (
                "BREAK THE CURSE"
              ) : (
                <>
                  THE CURSE
                  <br />
                  <em>IS BROKEN.</em>
                </>
              ),
            )}
            {scene === "before" && (
              <p className="haunt-see-offer">SEE THE OFFER</p>
            )}
            <p className="haunt-room-lead">
              {scene === "before" ? room.before : room.after}
            </p>
            <p className="haunt-room-detail">
              {scene === "before" ? (
                room.detail
              ) : (
                <>
                  <strong>{room.name.toUpperCase()}</strong>
                  <span className="haunt-after-scope">
                    {room.scope.toUpperCase()}
                  </span>
                  {pricing.standardPrice && (
                    <span className="haunt-reference-price">
                      {pricing.beforeDiscount && <small>BEFORE DISCOUNT</small>}
                      <b>${room.regularPrice.toLocaleString("en-US")} USD</b>
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
          {scene === "after" && (
            <p className="haunt-room-outcome">{room.result}</p>
          )}
          <div className="haunt-room-actions">
            <button
              className={
                scene === "before" ? "haunt-curse-button" : "haunt-button"
              }
              onClick={() =>
                go(
                  scene === "before"
                    ? reduced
                      ? "after"
                      : "transformation"
                    : "offers",
                )
              }
            >
              {scene === "before" ? <CurseSeal /> : <Icon type="key" />}
              <span>
                {scene === "before"
                  ? "BREAK THE CURSE"
                  : "CLAIM MY HALLOWEEN OFFER"}
              </span>
              {scene === "before" ? (
                <span className="haunt-invitation-arrow" aria-hidden="true">
                  <Icon type="up" />
                </span>
              ) : (
                <Icon />
              )}
            </button>
            {scene === "after" && (
              <button className="haunt-text" onClick={() => go("hall")}>
                EXPLORE OTHER OFFERS <Icon />
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <h1 className="haunt-sr" ref={heading} tabIndex={-1}>
            Breaking the curse: {room.name}
          </h1>
          <button className="haunt-film-skip" onClick={() => go("after")}>
            SKIP TO THE TRANSFORMATION RESULT <Icon />
          </button>
        </>
      )}
    </section>
  );
}
