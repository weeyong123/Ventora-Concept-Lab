import test from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { offers, offerMessage, contactLinks } from "./content";
import { pricing } from "./pricing";
import HallScene from "./HallScene";
import HeroScene from "./HeroScene";
import RoomScene from "./RoomScene";
import OffersScene from "./OffersScene";
import HauntHeader from "./HauntHeader";
const noop = () => {};
const title = (text) => <h1>{text}</h1>;
const base = {
  go: noop,
  title,
  heading: { current: null },
  reduced: true,
  sound: false,
};
const offerProps = (selected) => ({
  ...base,
  allRoomsComplete: false,
  selected,
  setSelected: noop,
  room: offers[selected],
  fields: { name: "", website: "", notes: "" },
  setFields: noop,
  messageArea: { current: null },
  message: offerMessage(selected),
  copy: noop,
  notice: "",
  links: contactLinks(selected, offerMessage(selected)),
});
const text = (html) =>
  html
    .replace(/<[^>]*>/g, "")
    .replaceAll("&#x27;", "'")
    .replaceAll("&amp;", "&");
test("entrance exposes only its single primary invitation", () => {
  const html = renderToStaticMarkup(<HeroScene {...base} />);
  assert(html.includes("ENTER THE MANSION"));
  assert(!html.includes("VIEW HALLOWEEN OFFERS"));
  assert(!html.includes("SKIP INTRO"));
});
test("hall previews preserve suspense and never leak prices", () => {
  for (let i = 0; i < 3; i++) {
    const html = renderToStaticMarkup(
      <HallScene
        {...base}
        previewDoor={i}
        setPreviewDoor={noop}
        chooseDoor={noop}
        completedRooms={[]}
      />,
    );
    assert(html.includes("SAVE ??%"));
    assert(!/\$|STANDARD PRICE|BEFORE DISCOUNT/.test(html));
    for (const offer of offers) {
      assert(html.includes(offer.name.toUpperCase()));
      assert(html.includes(offer.scope.toUpperCase()));
    }
  }
});
test("before/after preserve both story stages without revealing activity prices", () => {
  for (let i = 0; i < 3; i++) {
    const props = { ...base, selected: i, room: offers[i] };
    const before = renderToStaticMarkup(
      <RoomScene {...props} scene="before" />,
    );
    assert(before.includes("BREAK THE CURSE"));
    assert(before.includes("SEE THE OFFER"));
    assert(!before.includes("BACK TO THE HALL"));
    const after = renderToStaticMarkup(<RoomScene {...props} scene="after" />);
    assert(after.includes("CHECK MY HALLOWEEN OFFER →"));
    assert(after.includes("HOW MUCH CAN YOU SAVE? ??%"));
    assert(after.includes("EXPLORE OTHER OFFERS"));
    assert(after.includes("BEFORE DISCOUNT"));
    assert(after.includes(`$${offers[i].regularPrice.toLocaleString("en-US")}`));
    assert(!after.includes(`$${offers[i].price}`));
    assert(after.includes(offers[i].scope.toUpperCase()));
  }
});
test("public offer cards show regular and special prices with scope", () => {
  const html = renderToStaticMarkup(<OffersScene {...offerProps(null)} />);
  for (const offer of offers) {
    assert(html.includes(`$${offer.price.toLocaleString("en-US")}`));
    assert(html.includes(`$${offer.regularPrice.toLocaleString("en-US")}`));
    assert(html.includes(offer.scopeNote));
    assert(text(html).includes(offer.shortLabel));
  }
  assert(!html.includes('checked=""'));
  assert(html.includes("Choose your Halloween offer."));
  assert(html.includes('disabled=""'));
  assert(!html.includes("https://wa.me/"));
  assert(html.includes("View Full Terms"));
  assert(!html.includes("MOST POPULAR"));
  assert(html.includes("REGULAR STARTING PRICE"));
  assert.equal((html.match(/<s>/g) || []).length, 3);
  assert(!/SAVE \d+%/.test(html));
  for (const amount of [300, 600, 250]) assert(text(html).includes(`SAVE $${amount} ON THE BASE PACKAGE`));
  assert.equal((html.match(/SCOPE NOTE/g) || []).length, 3);
});
test("selected enquiries render the correct current package without reference charges", () => {
  for (let i = 0; i < 3; i++) {
    const html = renderToStaticMarkup(<OffersScene {...offerProps(i)} />);
    assert(
      text(html).includes(
        `${offers[i].name} — ${offers[i].scope} — $${offers[i].price} USD`,
      ),
    );
    assert(html.includes("https://wa.me/"));
    assert(html.includes('checked=""'));
  }
});
test("internal comparison preview is explicit and keeps the After activity price secret", () => {
  Object.assign(pricing, {
    standardPrice: true,
    beforeDiscount: true,
    discount: true,
    preview: true,
  });
  try {
    const header = renderToStaticMarkup(
      <HauntHeader
        {...base}
        scene="after"
        soundHint={false}
        toggleSound={noop}
      />,
    );
    assert(header.includes("INTERNAL PRICING PREVIEW"));
    const html = renderToStaticMarkup(
      <RoomScene {...base} selected={0} room={offers[0]} scene="after" />,
    );
    assert(html.includes("BEFORE DISCOUNT"));
    assert(html.includes("$799"));
    assert(!html.includes("$499"));
    const offer = renderToStaticMarkup(<OffersScene {...offerProps(0)} />);
    assert(text(offer).includes("SAVE $300 ON THE BASE PACKAGE"));
    assert(offer.includes("REGULAR STARTING PRICE"));
    assert(!/SAVE \d+%/.test(offer));
    assert(offer.includes("<s>"));
  } finally {
    Object.assign(pricing, {
      standardPrice: true,
      beforeDiscount: false,
      discount: true,
      preview: false,
    });
  }
});

test("Journey checks reached stages and resets with the scene", () => {
  for (const [scene, count] of [["hall", 1], ["before", 2], ["transformation", 2], ["after", 3], ["offers", 4], ["hero", 0]]) {
    const html = renderToStaticMarkup(<HauntHeader {...base} scene={scene} soundHint={false} toggleSound={noop} />);
    assert.equal((html.match(/aria-label="Reached"/g) || []).length, count);
  }
});

test("each card places claim CTA before inclusions and keeps scope after result", () => {
  const html = renderToStaticMarkup(<OffersScene {...offerProps(null)} />);
  for (const card of html.match(/<article[\s\S]*?<\/article>/g)) {
    assert(card.indexOf("CLAIM THIS OFFER") < card.indexOf("WHAT’S INCLUDED"));
    assert(card.indexOf("THE RESULT") < card.indexOf("SCOPE NOTE"));
  }
});
