// import nextra from 'nextra';

// const withNextra = nextra({
//   defaultShowCopyCode: true,
//   mdxOptions: {
//     remarkPlugins: [],
//     rehypePlugins: []
//   }
// });

// export default withNextra({
//   pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
//   theme: 'nextra-theme-docs',
//   themeConfig: './theme.config.tsx',
//   turbopack: {
//     resolveAlias: {
//       'next-mdx-import-source-file': './mdx-components.tsx'
//     }
//   },
// });

import nextra from "nextra";

const withNextra = nextra({
  // theme: "nextra-theme-docs",
  // themeConfig: "./theme.config.tsx",
});

export default withNextra({
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  turbopack: {
    resolveAlias: {
      "next-mdx-import-source-file": "./mdx-components.js",
    },
  },
  // async redirects() {
  //   return [
  //     {
  //       source: "/docs",
  //       destination: "/docs",
  //       permanent: true,
  //     },
  //     {
  //       source: "/develop",
  //       destination: "/develop/intro",
  //       permanent: true,
  //     },
  //   ];
  // }
});
