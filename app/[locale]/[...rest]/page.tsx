import { notFound } from "next/navigation";

// unknown paths inside a locale end up on the localized 404 page
export default function CatchAllPage() {
  notFound();
}
