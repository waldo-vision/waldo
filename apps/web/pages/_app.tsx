import { SiteProvider } from '@site';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@utils/theme';
import { trpc } from '@utils/trpc';
import type { NextPage } from 'next';
import { SessionProvider } from 'next-auth/react';
import type { AppProps } from 'next/app';
import type { ReactElement, ReactNode } from 'react';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  // eslint-disable-next-line no-unused-vars
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? (page => page);

  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <SiteProvider>{getLayout(<Component {...pageProps} />)}</SiteProvider>
      </ChakraProvider>
    </SessionProvider>
  );
}

export default trpc.withTRPC(App);
