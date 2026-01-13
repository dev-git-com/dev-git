import CardsSection from "@/shared/components/landing/CardsSection";
import HeroSection from "@/shared/components/landing/HeroSection";
import TimelineCards from "@/shared/components/landing/Timeline";
import ScrollProgressIndicator from "@/shared/components/landing/ScrollProgressIndicator";
import TeamMemberList from "@/shared/components/landing/TeamMemberList";
import DeveloperTestimonials from "@/shared/components/landing/DevelopertesTimonials";

export const metadata = {
  title: "DEV GIT",
  description: "Welcome to the first full backend generator.",
  icons: {
    icon: "/1753286370096.ico",
  },
};

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <ScrollProgressIndicator />
      <HeroSection />
      <CardsSection />
      <TimelineCards />
      <DeveloperTestimonials />
      <TeamMemberList />
    </div>
  );
};

export default Home;
