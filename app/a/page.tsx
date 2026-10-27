import { LandingPage } from "@/components/LandingPage";

// Varijanta A. Posetioci ne dolaze direktno ovde: middleware ih sa "/" interno prebacuje.
export default function Page() {
  return <LandingPage variant="a" />;
}
