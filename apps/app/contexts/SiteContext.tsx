import { trpc } from '@utils/trpc';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import {
  createContext,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as Sentry from '@sentry/nextjs';
import { getUserData } from '@server/utils/logto';
import { V2Session } from 'types/logto-auth';

type ServiceConfig =
  | {
      maintenance: boolean;
      isCustomAlert: boolean;
      alertTitle: string | null;
      alertDescription: string | null;
    }
  | undefined;

type Props = {
  children: ReactElement | ReactElement[] | ReactNode;
};

export interface ISiteContext {
  session: V2Session | undefined | null;
  setSession: Dispatch<SetStateAction<V2Session | undefined | null>>;
  isLoading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setSiteConfig: Dispatch<SetStateAction<ServiceConfig>>;
  setUploadConfig: Dispatch<SetStateAction<ServiceConfig>>;
  setReviewConfig: Dispatch<SetStateAction<ServiceConfig>>;
  setAccountConfig: Dispatch<SetStateAction<ServiceConfig>>;
  services: {
    site: ServiceConfig;
    upload: ServiceConfig;
    review: ServiceConfig;
    account: ServiceConfig;
  };
}

const SiteContext = createContext<ISiteContext>({
  session: undefined,
  setSession: (value: SetStateAction<V2Session | undefined | null>): void => {
    value;
  },
  isLoading: true,
  setLoading: (value: SetStateAction<boolean>): void => {
    value;
  },
  setSiteConfig: (value: SetStateAction<ServiceConfig>): void => {
    value;
  },
  setUploadConfig: (value: SetStateAction<ServiceConfig>): void => {
    value;
  },
  setReviewConfig: (value: SetStateAction<ServiceConfig>): void => {
    value;
  },
  setAccountConfig: (value: SetStateAction<ServiceConfig>): void => {
    value;
  },
  services: {
    site: {
      maintenance: false,
      isCustomAlert: false,
      alertTitle: '',
      alertDescription: '',
    },
    upload: {
      maintenance: false,
      isCustomAlert: false,
      alertTitle: '',
      alertDescription: '',
    },
    review: {
      maintenance: false,
      isCustomAlert: false,
      alertTitle: '',
      alertDescription: '',
    },
    account: {
      maintenance: false,
      isCustomAlert: false,
      alertTitle: '',
      alertDescription: '',
    },
  },
});

const useSite = (): ISiteContext => {
  return useContext<ISiteContext>(SiteContext);
};

export const SiteProvider = ({ children }: Props): ReactElement => {
  const [session, setSession] = useState<V2Session | null | undefined>(
    undefined,
  );
  const [isLoading, setLoading] = useState<boolean>(true);
  const [siteConfig, setSiteConfig] = useState<ServiceConfig>({
    maintenance: false,
    isCustomAlert: false,
    alertTitle: '',
    alertDescription: '',
  });
  const [uploadConfig, setUploadConfig] = useState<ServiceConfig>({
    maintenance: false,
    isCustomAlert: false,
    alertTitle: '',
    alertDescription: '',
  });
  const [reviewConfig, setReviewConfig] = useState<ServiceConfig>({
    maintenance: false,
    isCustomAlert: false,
    alertTitle: '',
    alertDescription: '',
  });
  const [accountConfig, setAccountConfig] = useState<ServiceConfig>({
    maintenance: false,
    isCustomAlert: false,
    alertTitle: '',
    alertDescription: '',
  });

  const value = {
    session,
    setSession,
    isLoading,
    setLoading,
    setSiteConfig,
    setUploadConfig,
    setReviewConfig,
    setAccountConfig,
    services: {
      site: siteConfig,
      upload: uploadConfig,
      review: reviewConfig,
      account: accountConfig,
    },
  };
  const { data: aData } = trpc.site.getPageData.useQuery({
    name: 'account',
  });
  const { data: rData } = trpc.site.getPageData.useQuery({
    name: 'review',
  });
  const uData = {
    maintenance: false,
    isCustomAlert: true,
    alertDescription: '',
    alertTitle: '',
  };
  useEffect(() => {
    async function doSessionData() {
      setSession(await getUserData());
    }
    doSessionData();
    if (aData && rData && uData) {
      setAccountConfig({
        maintenance: aData.maintenance,
        isCustomAlert: aData.isCustomAlert,
        alertDescription: aData.alertDescription,
        alertTitle: aData.alertTitle,
      });
      setReviewConfig({
        maintenance: rData.maintenance,
        isCustomAlert: rData.isCustomAlert,
        alertDescription: rData.alertDescription,
        alertTitle: rData.alertTitle,
      });
      setUploadConfig({
        maintenance: uData.maintenance,
        isCustomAlert: uData.isCustomAlert,
        alertDescription: uData.alertDescription,
        alertTitle: uData.alertTitle,
      });
    }
  }, []);

  // Set Sentry user context
  useEffect(() => {
    if (session === undefined || session === null) {
      Sentry.setUser(null);
      return;
    }
    if (session === undefined) return;

    Sentry.setUser({
      id: session.logto_id,
    });
  }, [session]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export default useSite;
