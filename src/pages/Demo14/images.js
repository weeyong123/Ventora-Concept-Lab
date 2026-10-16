import manifest from "./image-manifest.json";

export function imageProps(name, sizes = "100vw") {
  const image = manifest[name];
  if (!image) return { src: `/demo14/${name}` };
  return {
    src: image.variants.at(-1).src,
    srcSet: image.variants
      .map((variant) => `${variant.src} ${variant.width}w`)
      .join(", "),
    sizes,
    width: image.width,
    height: image.height,
  };
}

export function imageSource(name, compact = false) {
  const image = manifest[name];
  return image
    ? (compact ? image.variants[0] : image.variants.at(-1)).src
    : `/demo14/${name}`;
}

export function warmImage(name) {
  const connection = navigator.connection;
  if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || ""))
    return;
  const image = new Image();
  const props = imageProps(name);
  image.sizes = props.sizes || "100vw";
  if (props.srcSet) image.srcset = props.srcSet;
  image.src = props.src;
  image.decode?.().catch(() => {});
}
