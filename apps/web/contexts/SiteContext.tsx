import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
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

type ServiceConfig = {
  maintenance: boolean;
  isCustomAlert: boolean;
  alertTitle: string;
  alertDescription: string;
};

type Props = {
  children: ReactElement | ReactElement[] | ReactNode;
};

export interface ISiteContext {
  session: Session | null;
  setSession: Dispatch<SetStateAction<Session | null>>;
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
  session: null,
  setSession: (value: SetStateAction<Session | null>): void => {
    value;
  },
  isLoading: false,
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
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchSession = async () => {
      const fetchedSession = await getSession();
      if (fetchSession === null) {
        setSession(fetchedSession);
      }
    };
    fetchSession();
  }, []);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
};

export default useSite;
