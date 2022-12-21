import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Nunito', sans-serif`,
    body: `'Nunito', sans-serif`,
  },
  styles: {
    global: {
      body: {
        bg: '#F5F8FA',
        color: '#43475F',
      },
    },
  },
});

export default theme;
