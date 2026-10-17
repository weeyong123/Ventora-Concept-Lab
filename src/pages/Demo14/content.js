export const asset = (name) => `/demo14/${name}`;
export const revealBackground = asset("final-reveal-bg.png");
export const offers = [
  {
    chapter: "REVIVE",
    scopeNote: "Designed for refreshing up to 3 existing website pages. Full website migrations, platform rebuilds, advanced functionality and additional pages are quoted separately. Existing platform compatibility is subject to review.",
    title: "THE OUTDATED WEBSITE",
    name: "Website Redesign",
    price: 499,
    regularPrice: 799,
    scope: "Up to 3 Pages",
    shortLabel: "Up to 3 Pages · Custom Redesign & Development",
    before: "Your website is stuck in the past.",
    detail:
      "An outdated experience can make a great business feel less trustworthy.",
    after: "A stronger first impression starts here.",
    video: "outdated-website-transformation.mp4",
    description: "Refresh your existing website with a modern, custom design.",
    audience: "For businesses refreshing an existing website.",
    result:
      "A refreshed website with up to 3 existing standard pages, redesigned and developed around your business.",
    items: [
      "Custom redesign of up to 3 existing website pages.",
      "Mobile-responsive design and development.",
      "Updated layout, typography and visual presentation.",
      "Clear navigation and calls to action.",
      "Basic on-page SEO setup.",
      "2 rounds of revisions.",
      "Standard launch support, subject to existing platform compatibility.",
    ],
  },
  {
    chapter: "REBUILD",
    scopeNote: "Designed for standard business websites. Custom booking systems, interactive builders, advanced integrations and automation are quoted separately.",
    title: "THE MISSING PRESENCE",
    name: "Business Website",
    price: 1099,
    regularPrice: 1699,
    scope: "Up to 5 Pages",
    shortLabel: "Up to 5 Pages · Custom Design & Development",
    before: "Your business deserves to be seen.",
    detail:
      "Give potential customers a professional place to discover what you do.",
    after: "Make your business easier to discover and understand.",
    video: "missing-presence-transformation.mp4",
    description: "Build a professional website tailored to your business.",
    audience: "For businesses building a new professional website.",
    result:
      "Up to 5 standard pages built around your business, such as Home, About, Services, Portfolio and Contact.",
    items: [
      "Up to 5 custom-designed website pages.",
      "Mobile-responsive design and development.",
      "Navigation and clear calls to action.",
      "Basic on-page SEO setup.",
      "One basic contact form.",
      "2 rounds of revisions.",
      "Standard website deployment.",
    ],
  },
  {
    chapter: "CONVERT",
    scopeNote: "Designed for one standalone landing page promoting a single service, offer or campaign. Multi-step sales funnels, advanced integrations, CRM automation and advertising services are quoted separately.",
    title: "THE LOST LEADS",
    name: "New Landing Page",
    price: 349,
    regularPrice: 599,
    scope: "1 Page",
    shortLabel: "1 Page · Conversion-Focused Design & Development",
    before: "Visitors came. Opportunities vanished.",
    detail:
      "Without a clear next step, interested visitors may leave without reaching out.",
    after: "Give every interested visitor a clearer path to contact you.",
    video: "lost-leads-transformation.mp4",
    description:
      "Create a focused landing page for one service, offer, or campaign.",
    audience: "For one service, offer, or campaign needing a focused page.",
    result:
      "One standalone marketing page with 5–7 standard content sections and a clear path to enquire.",
    items: [
      "1 custom-designed landing page.",
      "Up to 5–7 standard content sections.",
      "Mobile-responsive design and development.",
      "Clear call-to-action buttons.",
      "One basic enquiry form.",
      "Basic on-page SEO setup.",
      "2 rounds of revisions.",
      "Standard deployment.",
    ],
  },
];
export const additionalScope =
  "Additional pages, advanced features, e-commerce, booking systems, CRM automation, full copywriting, ongoing maintenance and third-party fees are quoted separately where required.";
export const offerTerms = [
  "Additional pages, complex features and customer dashboards are outside the standard packages and require separate scope and quotation.",
  "E-commerce, payment systems, advanced booking, CRM automation and complex third-party integrations are quoted separately.",
  "Full copywriting and professional long-form sales copy are not included.",
  "Domain registration, paid hosting, third-party subscriptions and ongoing maintenance fees are not included.",
  "Existing platform compatibility is subject to review. Direct code replacement on WordPress, Wix, Squarespace or any other existing platform is not guaranteed.",
  "Clients provide their company or brand name, logo, final website copy, product or service information, images, brand assets and required account or domain access where applicable.",
  "Two rounds of revisions apply only within the agreed scope. Extra revisions, additional pages, features and major changes of design direction require a new agreement and quotation.",
  "Every package includes actual design and development, not only design files. Specific deliverables, schedule and cooperation terms must be confirmed before work begins.",
  "Website Redesign covers up to 3 existing standard pages. Business Website creates up to 5 new standard pages. New Landing Page covers one service, offer or campaign and is not a multi-step sales funnel; advertising and guaranteed lead results are not included.",
  "50% deposit is payable after scope, schedule and cooperation terms are confirmed. The remaining 50% is payable after completion and approval, before final handover or launch.",
  "Halloween Special prices apply only to each package’s stated base deliverables. Additional requirements are scoped and quoted separately, and agreed by both parties before development begins.",
  "The Halloween offer deadline is November 2, 2026. To secure the promotional price, both parties must confirm the project scope and the client must pay the 50% deposit before this deadline. An enquiry alone does not reserve the offer. This is not a delivery deadline. All prices are in USD.",
  "Project cancellation, refund eligibility and the treatment of work already completed are governed by the project agreement formally confirmed by both parties.",
  "Project scheduling depends on the final scope, receipt of the client’s required materials and the speed of client feedback. The specific delivery date is confirmed by both parties before development begins.",
];
export const savingsAmount = (offer) => offer.regularPrice - offer.price;
export const discountPercent = (offer) =>
  Math.floor((1 - offer.price / offer.regularPrice) * 100);
export function journeyStage(scene) {
  return scene === "hall"
    ? 1
    : ["before", "transformation"].includes(scene)
      ? 2
      : scene === "after"
        ? 3
        : scene === "offers"
          ? 4
          : 0;
}
export function offerMessage(index, fields = {}) {
  const offer = offers[index];
  if (!offer) return "Choose a Halloween offer above to prepare your enquiry.";
  return [
    "Hi Ventora Digital! 🎃",
    "I'd like to enquire about your Halloween Special Offer.",
    `Package: ${offer.name} — ${offer.scope} — $${offer.price} USD\nScope: ${offer.shortLabel}`,
    [
      fields.name?.trim() && `Name: ${fields.name.trim()}`,
      fields.website?.trim() && `Website: ${fields.website.trim()}`,
      fields.notes?.trim() && `Project details: ${fields.notes.trim()}`,
    ]
      .filter(Boolean)
      .join("\n"),
    "I understand that the Halloween price covers the stated base package only; extras require a separate quotation agreed before development. To secure the offer, we must confirm the project scope and I must pay the 50% deposit before the November 2, 2026 deadline. Please confirm availability, delivery date and the project agreement before development. Cancellation, refunds and completed work are handled under that agreement. Payment: 50% deposit after agreement; 50% after completion and approval, before final handover or launch.",
    "Thank you!",
  ]
    .filter(Boolean)
    .join("\n\n");
}
export function contactLinks(index, message) {
  const offer = offers[index];
  if (!offer) return {};
  return {
    facebook: "https://www.facebook.com/dylan.ang87/",
    whatsapp: `https://wa.me/60129608633?text=${encodeURIComponent(message)}`,
    email: `mailto:hello@ventoradigital.com?subject=${encodeURIComponent(`Halloween Special Enquiry — ${offer.name}`)}&body=${encodeURIComponent(message)}`,
  };
}
