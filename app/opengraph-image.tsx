import { createSocialImage } from "./social-image";

export const runtime = "edge";

export default function OpenGraphImage() {
  return createSocialImage(
    "Jay Chothiyawala | Nocturne Archive",
    "Personal essays, reflections, and stories shaped for slow reading.",
  );
}
