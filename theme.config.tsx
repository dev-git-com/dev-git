const config = {
  logo: <span>My Project</span>,
  project: {
    link: 'https://github.com/yourusername/yourproject',
  },
  docsRepositoryBase: 'https://github.com/yourusername/yourproject/tree/main',
  footer: {
    text: `© ${new Date().getFullYear()} Your Project. All rights reserved.`,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Your Project'
    };
  },
  sidebar: {
    defaultMenuCollapseLevel: 1,
    toggleButton: true,
  },
  navigation: {
    prev: true,
    next: true,
  },
  darkMode: false,
  primaryHue: {
    light: 215,
    dark: 204,
  },
};

export default config;