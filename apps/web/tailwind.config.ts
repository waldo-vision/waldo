import type { Config } from 'tailwindcss';
import baseConfig from 'tailwind-config';
import path from 'path';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx,mdx}',

    path.join(
      path.dirname(require.resolve('ui')),
      './components/**/*.{js,ts,jsx,tsx}',
    ),

    // '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
  presets: [baseConfig],
} satisfies Config;
