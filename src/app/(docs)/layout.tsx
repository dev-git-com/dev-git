import "nextra-theme-docs/style-prefixed.css";
import { Footer, Layout, Navbar } from "nextra-theme-docs";
import { Banner, Head } from "nextra/components";
import { getPageMap } from "nextra/page-map";
import Image from "next/image";
import logo from "@/assets/images/logo/logo.png";

export const metadata = {
  // Define your metadata here
  // For more information on metadata API, see: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
};

const banner = <Banner storageKey="some-key">Nextra 4.0 is released 🎉</Banner>;
const navbar = (
  <Navbar
    logo={
      <>
        <Image alt="logo" src={logo} width={"40"} height={"40"} /> Dev-Git
      </>
    }
    // ... Your additional navbar options
  />
);
const footer = <Footer>MIT {new Date().getFullYear()} © Nextra.</Footer>;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fullPageMap = await getPageMap();
  const docsPageMap: any = fullPageMap.filter((item: any) =>
    item.route?.startsWith("/docs")
  );
  // Todo: get sorded list from API
  const sortedPages = ["intro", "getting-started", "features"];
  if (docsPageMap && docsPageMap.length > 0 && docsPageMap[0].children) {
    docsPageMap[0].children.sort((a: any, b: any) => {
      const aIndex = sortedPages.indexOf(a.route.split("/").pop() || "");
      const bIndex = sortedPages.indexOf(b.route.split("/").pop() || "");
      return aIndex - bIndex;
    });
  }

  return (
    //   <Head
    //   // ... Your additional head options
    //   >
    //     {/* Your additional tags should be passed as `children` of `<Head>` element */}
    //   </Head>
    <Layout
      banner={banner}
      navbar={navbar}
      darkMode={true}
      pageMap={docsPageMap}
      docsRepositoryBase="https://github.com/shuding/nextra/tree/main/docs"
      footer={footer}
      // ... Your additional layout options
    >
      {children}
    </Layout>
  );
}
