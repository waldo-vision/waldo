export const SITE = {
  title: 'Waldo Docs',
  description: 'Docs for the Waldo project.',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: '../public/android-chrome-256x256.png',
    alt: 'the waldo logo on a plain background',
  },
  twitter: 'waldovision',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/waldo-vision/waldo/tree/master/docs`;

export const COMMUNITY_INVITE_URL = `https://waldo.vision/chat`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'XXXXXXXXXX',
  appId: 'XXXXXXXXXX',
  apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
  typeof KNOWN_LANGUAGE_CODES[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    'Start Here': [
      { text: 'Introduction', link: 'en/introduction' },
      { text: 'Getting Started', link: 'en/getting-started' },
    ],
    Referance: [
      { text: 'Working in the Monorepo', link: 'en/working-in-monorepo' },
    ],
    Legal: [
      { text: 'Code of Conduct', link: 'legal/code-of-conduct' },
      { text: 'Cookie Policy', link: 'legal/cookie-policy' },
      { text: 'Privacy Policy', link: 'legal/privacy-policy' },
      { text: 'Terms of Service', link: 'legal/terms-of-service' },
    ],
  },
};
