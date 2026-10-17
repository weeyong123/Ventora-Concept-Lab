import { asset } from "./content";
import { Icon, HalloweenBats } from "./Artwork";
import Film from "./Film";

export default function HeroScene({ go, reduced, title }) {
  return (
    <section className="haunt-stage haunt-entrance">
      <HalloweenBats />
      <Film
        src="mansion-hero-loop.mp4"
        poster={asset("mansion-poster.jpg")}
        sound={false}
        background
        reduced={reduced}
      />
      <div className="haunt-shade" />
      <div className="haunt-hero-copy">
        <span className="haunt-rule">
          <Icon type="moon" />
        </span>
        {title(
          <>
            <span className="haunt-hero-line">ENTER IF</span>{" "}
            <em className="haunt-hero-line">YOU DARE.</em>
          </>,
        )}
        <p>
          Three nightmares. One way to bring
          <br className="haunt-desktop" /> your business back to life.
        </p>
      </div>
      <button
        className="haunt-button haunt-entrance-button"
        onClick={() => go(reduced ? "hall" : "opening")}
      >
        <span className="haunt-keyhole">
          <Icon type="door" />
        </span>
        <span className="haunt-enter-label">ENTER THE MANSION</span>
        <span className="haunt-invitation-arrow" aria-hidden="true">
          <Icon type="up" />
        </span>
      </button>
      <div className="haunt-hero-invitation">
        <p className="haunt-invited-title">YOU’RE INVITED.</p>
        <p className="haunt-invited-copy">
          Welcome to Ventora’s Halloween experience.
          <span>The mansion awaits.</span>
        </p>
      </div>
    </section>
  );
}
