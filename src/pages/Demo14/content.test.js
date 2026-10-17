import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import {
  offers,
  offerMessage,
  contactLinks,
  revealBackground,
  journeyStage,
  offerTerms,
} from "./content.js";
import { publicPriceComparisons, getPricingVisibility } from "./pricing.js";

test("all final packages share the exact name, scope and activity price", () => {
  assert.deepEqual(
    offers.map((o) => [o.name, o.scope, o.price, o.regularPrice]),
    [
      ["Website Redesign", "Up to 3 Pages", 499, 799],
      ["Business Website", "Up to 5 Pages", 1099, 1699],
      ["New Landing Page", "1 Page", 349, 599],
    ],
  );
  assert.equal(offers[0].items.length, 7);
  assert.equal(offers[1].items.length, 7);
  assert.equal(offers[2].items.length, 8);
  assert(offerTerms.some((t) => t.includes("compatibility")));
});
test("every room retains its before, after and transformation assets", () => {
  offers.forEach((offer, i) => {
    for (const filename of [
      `door${i + 1}-before.png`,
      `door${i + 1}-after.png`,
      offer.video,
    ])
      assert(existsSync(`public/demo14/${filename}`), filename);
  });
  assert(existsSync(`public${revealBackground}`));
});
test("regular prices are visible; production query cannot enable savings or preview", () => {
  assert.deepEqual(publicPriceComparisons, {
    standardPrice: true,
    beforeDiscount: false,
    discount: true,
  });
  assert.deepEqual(getPricingVisibility({ search: "?pricing-preview=1" }), {
    ...publicPriceComparisons,
    afterReference: true,
    preview: false,
  });
  assert.deepEqual(
    getPricingVisibility({ development: true, search: "?pricing-preview=1" }),
    {
      standardPrice: true,
      beforeDiscount: true,
      discount: true,
      afterReference: true,
      preview: true,
    },
  );
});
test("Journey follows actual scenes; cinematic playback is not completion", () => {
  assert.deepEqual(
    [
      "hero",
      "opening",
      "hall",
      "before",
      "transformation",
      "after",
      "offers",
      "hall",
      "before",
    ].map(journeyStage),
    [0, 0, 1, 2, 2, 3, 4, 1, 2],
  );
});
test("no selection produces no package promise or contact destination", () => {
  assert(!offerMessage(null).includes("$"));
  assert.deepEqual(contactLinks(null, offerMessage(null)), {});
});
test("all enquiry messages use the actual package, scope and payable price only", () => {
  offers.forEach((offer, index) => {
    const message = offerMessage(index);
    assert(
      message.includes(`${offer.name} — ${offer.scope} — $${offer.price} USD`),
    );
    assert(!message.includes(String(offer.regularPrice)));
    assert(!/discount|regular price|standard price|% off/i.test(message));
    assert(message.includes("50% deposit"));
    assert(message.includes("50% after completion"));
    assert(!/Name:|Website:|Project details:/.test(message));
  });
});
test("optional fields and all encoded destinations share the same enquiry", () => {
  for (let index = 0; index < offers.length; index++) {
    const message = offerMessage(index, {
      name: " Alex & Co ",
      website: "https://example.com/?a=1&b=2",
      notes: "A “new” page\nWith #leads & enquiries.",
    });
    const links = contactLinks(index, message);
    assert(message.includes("Name: Alex & Co\n"));
    assert.equal(new URL(links.whatsapp).searchParams.get("text"), message);
    assert.equal(new URL(links.email).searchParams.get("body"), message);
    assert.equal(
      new URL(links.email).searchParams.get("subject"),
      `Halloween Special Enquiry — ${offers[index].name}`,
    );
    assert.equal(links.facebook, "https://www.facebook.com/dylan.ang87/");
  }
});

test("base-package savings and scope notes are complete", () => {
  assert.deepEqual(offers.map(o => o.regularPrice - o.price), [300, 600, 250]);
  offers.forEach(o => assert(o.scopeNote.includes("quoted separately")));
});

test("terms preserve scope and define reservation, cancellation and delivery", () => {
  const terms = offerTerms.join(" ");
  for (const phrase of ["base deliverables", "before development begins", "November 2, 2026", "50% deposit before this deadline", "refund eligibility", "work already completed", "speed of client feedback", "Two rounds of revisions", "compatibility", "actual design and development"]) assert(terms.includes(phrase), phrase);
});
