import type { Config } from 'tailwindcss';
import baseConfig from 'tailwind-config';

export default {
  content: ['./src/**/*.tsx', './components/**/*.tsx'],
  presets: [baseConfig],
} satisfies Config;
