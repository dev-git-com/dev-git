import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation",
  description: "Documentation to generate your app!",
};

export default function Docs() {
  return (
    <div className="">
      <p>{"No need for documentation because everything is clear for any child! :)"}</p>
      <p>{"Simply: Plan > SRS > Schema Diagram > Check features that you want on your project! > Done"}</p>
      <p>{"Project 90% Done! Time and Cost Saved 90%!"}</p>
      <p>{"File Structure:"}</p>
      <p>{"Naming Conventions:"}</p>
      <p>{"Code Principles:"}</p>
      <p>{"Versioning:"}</p>
      <p>{"Hosting:"}</p>
      <p>{"Features added:"}</p>
    </div>
  );
}
