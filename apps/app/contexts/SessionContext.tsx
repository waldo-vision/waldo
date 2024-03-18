// context/SessionContext.tsx
'use client';
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { V2Session, createSession } from 'identity';

interface SessionContextType {
  session: V2Session | undefined;
  setSession: (newSession: V2Session | undefined) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    console.log('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSessionState] = useState<V2Session | undefined>();

  useEffect(() => {
    const querySession = async () => {
      try {
        const user = await createSession();
        setSessionState(user);
      } catch (error) {
        // Handle error
        console.error('Error fetching session:', error);
      }
    };
    querySession();
  }, []); // Run only once when the component mounts

  const setSession = (newSession: V2Session | undefined) => {
    setSessionState(newSession);
  };

  const value = { session, setSession };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};
