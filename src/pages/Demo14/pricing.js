// Restore the supplied comparison prices at the user’s request.
export const publicPriceComparisons = Object.freeze({
  standardPrice: true,
  beforeDiscount: true,
  discount: true,
});
export function getPricingVisibility({
  development = false,
  search = "",
} = {}) {
  const preview =
    development && new URLSearchParams(search).get("pricing-preview") === "1";
  return {
    ...publicPriceComparisons,
    // After-scene reference restored at the user’s request.
    afterReference: true,
    ...(preview
      ? { standardPrice: true, beforeDiscount: true, discount: true }
      : {}),
    preview,
  };
}
export const pricing = getPricingVisibility({
  development: import.meta.env?.DEV === true,
  search: typeof window === "undefined" ? "" : window.location.search,
});
