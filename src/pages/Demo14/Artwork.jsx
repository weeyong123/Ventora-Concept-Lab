import { pricing } from "./pricing";
import { savingsAmount } from "./content";

export function Icon({ type = "arrow" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {type === "door" ? (
        <>
          <path d="M5 21V3h14v18M5 3l10 3v15l-10-3ZM11 12h1M3 21h18" />
        </>
      ) : type === "moon" ? (
        <path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z" />
      ) : type === "down" ? (
        <path d="M12 4v16M6 14l6 6 6-6" />
      ) : type === "up" ? (
        <path d="M12 20V4M6 10l6-6 6 6" />
      ) : type === "back" ? (
        <path d="M20 12H5M11 6l-6 6 6 6" />
      ) : type === "external" ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : type === "key" ? (
        <>
          <circle cx="12" cy="8" r="4" />
          <path d="m10 12-2 8h8l-2-8" />
        </>
      ) : type === "sound" ? (
        <>
          <path d="m11 5-6 4H2v6h3l6 4Z M15 8q5 4 0 8 M18 5q8 7 0 14" />
        </>
      ) : (
        <path d="M4 12h15M13 6l6 6-6 6" />
      )}
    </svg>
  );
}
export function OfferPrice({ offer }) {
  return (
    <span className="haunt-inline-price">
      {pricing.standardPrice && (
        <s
          aria-label={`Regular starting price ${offer.regularPrice} US dollars`}
        >
          ${offer.regularPrice.toLocaleString("en-US")}
        </s>
      )}
      <b aria-label={`Halloween price ${offer.price} US dollars`}>
        ${offer.price.toLocaleString("en-US")}
      </b>
      {pricing.discount && (
        <em className="haunt-discount">SAVE ${savingsAmount(offer)}</em>
      )}
    </span>
  );
}
export function SoundGhost() {
  return (
    <svg
      className="haunt-sound-ghost"
      viewBox="0 0 64 72"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 55V29C12 16 20 8 32 8s20 8 20 21v28l-8-5-7 7-8-6-8 6-9-4Z"
        fill="#f6eee1"
        stroke="#cbb4df"
        strokeWidth="1.5"
      />
      <ellipse cx="26" cy="29" rx="3" ry="5" fill="#292035" />
      <ellipse cx="40" cy="29" rx="3" ry="5" fill="#292035" />
      <path
        d="M29 40q5 5 9-1"
        stroke="#594265"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="m47 17 7-9m-5 0 5-1 1 5"
        stroke="#e4bb7d"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="20" cy="37" r="3" fill="#d4a3c6" opacity=".6" />
      <circle cx="45" cy="36" r="3" fill="#d4a3c6" opacity=".6" />
    </svg>
  );
}
export function HalloweenWeb() {
  return (
    <svg
      className="haunt-corner-web"
      viewBox="0 0 160 160"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 0v150M0 0h150M0 0l140 58M0 0l106 106M0 0l58 140M0 36q9-3 14-3 2-9 11-8 0-9 8-11-1-7 3-14M0 72q16-8 28-6 5-16 23-15-2-18 15-23-2-13 6-28M0 108q22-11 42-8 8-25 34-24-1-26 24-34-3-20 8-42M0 144q31-15 56-11 10-34 45-32-2-35 32-45-4-25 11-56" />
    </svg>
  );
}
export function HalloweenBats() {
  return (
    <div className="haunt-bats" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 100 45" focusable="false">
          <path d="M50 18 44 9l-2 10C29 16 13 4 2 1c4 12 5 22 3 31 12-7 18-6 24 3 8-6 14-3 21 10 7-13 13-16 21-10 6-9 12-10 24-3-2-9-1-19 3-31-11 3-27 15-40 18L56 9Z" />
        </svg>
      ))}
    </div>
  );
}
export function RoomEmblem({ index }) {
  return (
    <svg
      className="haunt-room-emblem"
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {index === 0 ? (
        <>
          <circle cx="24" cy="25" r="16" />
          <circle cx="24" cy="25" r="12" opacity=".4" />
          <path d="M24 14v12l7 4M20 5h8M24 5v4M10 40l3-4m25 4-3-4M11 11l-4 4m30-4 4 4" />
          <path d="m29 10-4 8 4 4-5 6" className="haunt-emblem-crack" />
        </>
      ) : index === 1 ? (
        <>
          <path d="M10 40V22a14 14 0 0 1 28 0v18l-7-5-7 6-7-6-7 5Z" />
          <ellipse cx="19" cy="22" rx="2" ry="3" fill="currentColor" />
          <ellipse cx="29" cy="22" rx="2" ry="3" fill="currentColor" />
          <path d="M21 30q3-3 6 0M6 9l2 3-2 3-2-3Zm35 22 2 3-2 3-2-3Z" />
        </>
      ) : (
        <>
          <path d="M33 12H7v24h26M7 12l16 13 10-8M7 36l13-13m6 0 7 7" />
          <path
            className="haunt-emblem-particles"
            d="M37 10h5m-6 8h8m-7 9h4m-6 9h7M40 42h4"
          />
        </>
      )}
    </svg>
  );
}
export function PumpkinSeal() {
  return (
    <span className="haunt-pumpkin-seal" aria-hidden="true">
      <svg viewBox="0 0 64 64" fill="none">
        <circle cx="32" cy="32" r="29" />
        <circle cx="32" cy="32" r="24" strokeDasharray="2 4" />
        <path d="M32 23c-12-6-20 2-16 13 3 8 10 10 16 7 6 3 13 1 16-7 4-11-4-19-16-13ZM32 23q-3-10 5-10M32 24v19M26 23q-8 9 0 20m12-20q8 9 0 20" />
        <path
          d="m22 28 6 5h-7Zm20 0-6 5h7ZM24 36l5 2 3-3 3 3 5-2q-7 10-16 0Z"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    </span>
  );
}
export function CurseSeal() {
  return (
    <span className="haunt-curse-seal" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="44" />
        <circle cx="50" cy="50" r="35" strokeDasharray="35 7 2 7" />
        <path
          className="haunt-seal-fracture"
          d="m55 17-13 24 13 9-13 32M47 34l-13-7m17 33 15 9"
        />
        <path d="M50 2v9m0 78v9M2 50h9m78 0h9M18 18l7 7m50 50 7 7M18 82l7-7m50-50 7-7" />
        <path d="m50 25 22 25-22 25-22-25Z" opacity=".4" />
      </svg>
    </span>
  );
}
