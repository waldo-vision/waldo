import { createContext } from 'react';
export interface globalContextInt {
  user: {
    auth: {
      discord: {
        id: number | undefined;
        connected: boolean;
        iconURL: string;
      };
    };
  };
}
export const GlobalContext = createContext<globalContextInt>({
  user: {
    auth: {
      discord: {
        id: undefined,
        connected: false,
        iconURL: '',
      },
    },
  },
});
