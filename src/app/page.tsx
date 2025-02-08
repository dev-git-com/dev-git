import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "DEV-GIT",
  description: "Generate your app!",
};

//! change it to Landing Page
export default function LandingPage() {
  redirect("home");
}
