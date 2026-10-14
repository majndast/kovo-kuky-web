import { NotFoundView } from "@/components/not-found-view";

// Next.js marks not-found responses as noindex on its own
export default function NotFound() {
  return <NotFoundView />;
}
