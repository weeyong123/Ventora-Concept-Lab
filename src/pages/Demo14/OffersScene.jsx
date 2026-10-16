import { useEffect, useRef } from "react";
import { pricing } from "./pricing";
import SceneImage from "./SceneImage";
import { imageSource } from "./images";
import {
  offers,
  discountPercent,
  offerTerms,
  additionalScope,
} from "./content";
import {
  Icon,
  OfferPrice,
  HalloweenWeb,
  RoomEmblem,
  PumpkinSeal,
} from "./Artwork";

export default function OffersScene({
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
}) {
  const cards = useRef(null);
  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.add("has-entered");
        observer.unobserve(target);
      });
    }, { threshold: 0, rootMargin: "0px 0px -40px 0px" });
    cards.current?.querySelectorAll(".haunt-card").forEach(card => observer.observe(card));
    // If the user changes this setting, reveal everything immediately.
    const stop = () => { if (motion.matches) observer.disconnect(); };
    motion.addEventListener("change", stop);
    return () => { observer.disconnect(); motion.removeEventListener("change", stop); };
  }, []);
  return (
    <>
      <section
        className="haunt-reveal"
        id="haunt-reveal"
        style={{
          "--reveal-bg": `url("${imageSource("final-reveal-bg.png")}")`,
          "--reveal-bg-mobile": `url("${imageSource("final-reveal-bg.png", true)}")`,
        }}
      >
        <div className="haunt-reveal-copy">
          <p className="haunt-eyebrow">
            {allRoomsComplete
              ? "THREE CURSES BROKEN. CHOOSE YOUR NEXT CHAPTER."
              : "YOUR NEXT CHAPTER STARTS HERE"}
          </p>
          <span className="haunt-rule">
            <Icon type="moon" />
          </span>
          {title(
            <>
              EVERY WEBSITE DESERVES
              <br />
              <em>A SECOND LIFE.</em>
            </>,
          )}
          <p>We don't just build websites. We bring them back to life.</p>
          <span className="haunt-signature">VENTORA DIGITAL</span>
          <a className="haunt-scroll-cue" href="#haunt-offers">
            <span>DISCOVER YOUR HALLOWEEN OFFER</span>
            <strong>SCROLL TO EXPLORE OFFERS</strong>
            <svg viewBox="0 0 24 32" fill="none" aria-hidden="true">
              <path d="M12 2v25m-7-7 7 7 7-7" />
            </svg>
          </a>
        </div>
      </section>
      <section className="haunt-offers" id="haunt-offers">
        <HalloweenWeb />
        <div className="haunt-section-heading">
          <div>
            <p className="haunt-eyebrow">
              <span className="haunt-pumpkin" aria-hidden="true">
                🎃
              </span>{" "}
              HALLOWEEN SPECIAL / 2026
            </p>
            <h2>
              A new chapter.
              <br />
              <em>A different ending.</em>
            </h2>
          </div>
          <div className="haunt-offer-meta">
            <span>SCOPE & AVAILABILITY CONFIRMED BEFORE BOOKING</span>
            <p>
              <span className="haunt-pumpkin" aria-hidden="true">
                🎃
              </span>{" "}
              OFFER ENDS NOVEMBER 2, 2026
            </p>
            <small>All prices in USD.</small>
          </div>
        </div>
        <div className="haunt-offer-grid" ref={cards}>
          {offers.map((o, i) => (
            <article
              key={o.name}
              id={`haunt-offer-${i}`}
              tabIndex={-1}
              className={`haunt-card ${i === 1 ? "haunt-card-featured" : ""} ${selected === i ? "selected" : ""}`}
              style={{
                "--card-enter-delay": `${i * 100}ms`,
                "--card-image": `url("${imageSource(`door${i + 1}-after.png`, true)}")`,
              }}
            >
              <div className="haunt-card-top">
                <span>
                  <RoomEmblem index={i} /> 0{i + 1} / {o.chapter}
                </span>
                <span>
                  {selected === i ? "YOUR SELECTION" : "HALLOWEEN SPECIAL"}
                </span>
              </div>
              <figure className="haunt-offer-preview">
                <SceneImage
                  name={`door${i + 1}-after.png`}
                  sizes="(max-width: 700px) 88vw, (max-width: 1440px) 28vw, 400px"
                  alt={`${o.name} — restored website concept`}
                  loading="lazy"
                />
                <PumpkinSeal />
                <figcaption>
                  <span>AFTER / {o.chapter}</span>
                  <span>CONCEPT PREVIEW</span>
                </figcaption>
              </figure>
              <p
                className="haunt-featured-label"
                aria-hidden={i !== 1 ? true : undefined}
              >
                {i === 1 ? "BEST FOR GROWING BUSINESSES" : ""}
              </p>
              <h3>{o.name}</h3>
              <p className="haunt-package-description">
                {o.description}
                <span className="haunt-package-scope">{o.shortLabel}</span>
                <span className="haunt-package-audience">{o.audience}</span>
              </p>
              <div className="haunt-price">
                {(pricing.standardPrice || pricing.discount) && (
                  <div className="haunt-price-before">
                    {pricing.standardPrice && (
                      <span>
                        REGULAR PRICE · BEFORE DISCOUNT{" "}
                        <s>${o.regularPrice.toLocaleString("en-US")}+ USD</s>
                      </span>
                    )}
                    {pricing.discount && (
                      <b className="haunt-discount">
                        SAVE {discountPercent(o)}%
                      </b>
                    )}
                  </div>
                )}
                <div className="haunt-price-now">
                  <strong>${o.price}</strong>
                  <span>
                    USD · ONE-TIME PROJECT FEE
                    <br />
                    HALLOWEEN SPECIAL
                  </span>
                </div>
              </div>
              <small className="haunt-included-label">WHAT’S INCLUDED</small>
              <ul>
                {o.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="haunt-offer-result">
                <small>THE RESULT</small>
                <p>{o.result}</p>
              </div>
              <a
                href="#haunt-claim"
                className="haunt-button"
                onClick={() => setSelected(i)}
              >
                CLAIM THIS OFFER
                <Icon />
              </a>
            </article>
          ))}
        </div>
        <p className="haunt-deposit">
          50% deposit after scope approval · 50% upon completion and approval,
          before final handover or launch.
        </p>
      </section>
      <section className="haunt-terms">
        <p>{additionalScope}</p>
        <details>
          <summary>View Full Terms</summary>
          <ul>
            {offerTerms.map((term) => (
              <li key={term}>{term}</li>
            ))}
          </ul>
        </details>
      </section>
      <section className="haunt-trust">
        <p className="haunt-eyebrow">BEYOND THE TEMPLATE</p>
        <h2>A better first impression.</h2>
        <div>
          <p>
            <strong>Custom Design</strong>Built around your brand
          </p>
          <p>
            <strong>Mobile Ready</strong>Designed for every screen
          </p>
          <p>
            <strong>Clear Direction</strong>Focused on next steps
          </p>
        </div>
        <p>
          Every project is designed around your business, your audience and your
          goals — to communicate more clearly.
        </p>
        <a
          className="haunt-text"
          href="https://ventoradigital.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          EXPLORE VENTORA DIGITAL
          <Icon type="external" />
        </a>
      </section>
      <section className="haunt-claim" id="haunt-claim">
        <div className="haunt-claim-intro">
          <p className="haunt-eyebrow">YOUR NEXT CHAPTER STARTS HERE</p>
          <h2>
            CLAIM YOUR
            <br />
            <em>HALLOWEEN OFFER</em>
          </h2>
          <p>
            Choose an offer and send an enquiry. We confirm scope, availability
            and timing together; after agreement and a 50% deposit, your project
            joins the agreed schedule.
          </p>
          <span className="haunt-note">
            Your details stay in this page until you choose a contact channel
            and send your message.
          </span>
        </div>
        <div className="haunt-generator">
          <p className="haunt-selected-guidance" role="status">
            <strong>
              {room
                ? `${room.name} — ${room.scope} selected.`
                : "Choose your Halloween offer."}
            </strong>{" "}
            Personalize your message below, then choose WhatsApp, Facebook or
            Email to contact us.
          </p>
          <fieldset>
            <legend>Package</legend>
            {offers.map((o, i) => (
              <label className="haunt-radio" key={o.name}>
                <input
                  type="radio"
                  name="package"
                  value={i}
                  checked={selected === i}
                  onChange={() => setSelected(i)}
                />
                <span>{o.name}</span>
                <OfferPrice offer={o} />
              </label>
            ))}
          </fieldset>
          <div className="haunt-inputs">
            <label>
              Name <span>(optional)</span>
              <input
                autoComplete="name"
                value={fields.name}
                onChange={(e) => setFields({ ...fields, name: e.target.value })}
                maxLength={150}
              />
            </label>
            <label>
              Website URL <span>(optional)</span>
              <input
                type="url"
                autoComplete="url"
                placeholder="https://yourwebsite.com"
                value={fields.website}
                onChange={(e) =>
                  setFields({ ...fields, website: e.target.value })
                }
                maxLength={500}
              />
            </label>
          </div>
          <label>
            Project Notes <span>(optional)</span>
            <textarea
              rows={3}
              value={fields.notes}
              onChange={(e) => setFields({ ...fields, notes: e.target.value })}
              maxLength={2500}
            />
          </label>
          <label className="haunt-message-label">
            Your offer message
            <textarea
              ref={messageArea}
              className="haunt-message"
              readOnly
              value={message}
              rows={12}
            />
          </label>
          <button
            className="haunt-button"
            disabled={selected === null}
            onClick={() => copy()}
          >
            COPY MY OFFER MESSAGE
            <Icon />
          </button>
          <p className="haunt-notice" role="status">
            {notice ||
              "Copy your message, or choose a channel below. You decide when to send."}
          </p>
          <div className="haunt-contacts">
            <a
              href={links.facebook}
              aria-disabled={selected === null}
              tabIndex={selected === null ? -1 : undefined}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                if (selected === null) event.preventDefault();
                else void copy(true);
              }}
            >
              CONTACT VIA FACEBOOK <Icon type="external" />
            </a>
            <a
              href={links.whatsapp}
              aria-disabled={selected === null}
              tabIndex={selected === null ? -1 : undefined}
              onClick={(event) => {
                if (selected === null) event.preventDefault();
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTACT VIA WHATSAPP <Icon type="external" />
            </a>
            <a
              href={links.email}
              aria-disabled={selected === null}
              tabIndex={selected === null ? -1 : undefined}
              onClick={(event) => {
                if (selected === null) event.preventDefault();
              }}
            >
              CONTACT VIA EMAIL <Icon type="external" />
            </a>
          </div>
        </div>
      </section>
      <footer className="haunt-footer">
        <span>VENTORA DIGITAL © 2026</span>
        <nav className="haunt-footer-navigation" aria-label="Experience navigation">
          <button onClick={() => go("hall")}>
            <Icon type="back" /> RETURN TO THE HALL
          </button>
          <button onClick={() => go("hero")}>
            <Icon type="up" /> BACK TO THE MANSION
          </button>
        </nav>
        <span>GOOD DESIGN HAS A SECOND LIFE.</span>
      </footer>
    </>
  );
}
