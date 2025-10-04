import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Community Comments",
  description: "Community Comments!",
};

export default function Community() {
  redirect("community/comments");
}
