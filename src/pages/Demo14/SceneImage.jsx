import { imageProps } from "./images";

// Keep the original file as a recovery path; render a plain img to retain layout.
export default function SceneImage({ name, sizes, ...props }) {
  return (
    <img
      {...imageProps(name, sizes)}
      decoding="async"
      {...props}
      onError={(event) => {
        const image = event.currentTarget;
        if (image.dataset.originalFallback) return;
        image.dataset.originalFallback = "true";
        image.removeAttribute("srcset");
        image.src = `/demo14/${name}`;
      }}
    />
  );
}
