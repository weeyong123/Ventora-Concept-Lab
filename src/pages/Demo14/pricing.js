// Enable public comparisons only after the actual standard-price basis is verified.
export const publicPriceComparisons = Object.freeze({
  standardPrice: false,
  beforeDiscount: false,
  discount: false,
});
export function getPricingVisibility({
  development = false,
  search = "",
} = {}) {
  const preview =
    development && new URLSearchParams(search).get("pricing-preview") === "1";
  return {
    ...publicPriceComparisons,
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
