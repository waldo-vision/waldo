import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@ory/elements';
import '@ory/elements/assets/normalize.css';
import '@ory/elements/style.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme="dark">
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
