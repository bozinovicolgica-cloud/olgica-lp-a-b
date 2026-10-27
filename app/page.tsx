import { LandingPage } from "@/components/LandingPage";

// Rezerva: middleware uvek prepisuje "/" na /a ili /b. Ovo se vidi samo ako middleware ne radi.
export default function Page() {
  return <LandingPage variant="a" />;
}
