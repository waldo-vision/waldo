import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import { GlobalContext, globalContextInt } from '@context/GlobalContext';
import theme from '@utils/theme';

export type NextPageWithLayout<P = Record<string, unknown>, IP = P> = NextPage<
  P,
  IP
> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function getSession(): globalContextInt {
  // Get Next-auth
  return {
    user: {
      auth: {
        discord: {
          id: undefined,
          connected: false,
          iconURL: '',
        },
      },
    },
  };
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  // eslint-disable-next-line arrow-parens
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <GlobalContext.Provider value={getSession()}>
        <ChakraProvider theme={theme}>
          {getLayout(<Component {...pageProps} />)}
        </ChakraProvider>
      </GlobalContext.Provider>
    </>
  );
}
