import "../../shared/css/landing/landing-globals.css";
import HeroSection from "@/shared/components/landing/HeroSection";
import Cards from "@/shared/components/landing/Cards";
import TimelineCards from "@/shared/components/landing/Timeline";
import DeveloperTestimonials from "@/shared/components/landing/DeveloperTestimonials";
import DataTable from "@/shared/components/landing/Table";
import { Source_Code_Pro } from "next/font/google";
import AnimatedGrid from "@/shared/components/landing/AnimatedGrid";
import Footer from "@/shared/components/landing/Footer";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-source-code-pro",
  display: "swap",
});

export const metadata = {
  title: "DEV GIT",
  description: "Welcome to the first full backend generator.",
  icons: {
    icon: "/1753286370096.ico",
  },
};

const Home = () => {
  return (
    <div
      className={`landing-main ${sourceCodePro.variable} bg-black text-white relative min-h-screen overflow-x-hidden`}
    >
      <AnimatedGrid>
        <HeroSection />
        <Cards />
        <DataTable />
        <TimelineCards />
        <DeveloperTestimonials />
      </AnimatedGrid>
      <Footer />
    </div>
  );
};

export default Home;
