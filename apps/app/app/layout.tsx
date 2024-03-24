'use client';
import './_styles/globals.css';
import React, { useEffect, useState } from 'react';
import { SessionProvider } from '@contexts/SessionContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { V2Session, createSession } from 'identity';
import Loading from './components/Loading';
import MobileSidebar from './components/MobileSidebar';
function RootLayout({ children }: { children: React.ReactNode }) {
  const [session, setSessionState] = useState<V2Session | undefined>();
  const [openMobileSidebar, setOpenMobileSidebar] = useState<boolean>(false);
  useEffect(() => {
    const querySession = async () => {
      const user = await createSession();
      // Only need to check error here as Try/Catch only catches the axios error.
      if (!(user instanceof Error)) {
        setSessionState(user);
      } else {
        setSessionState(undefined);
      }
    };
    querySession();
  }, [session]);

  const openMobileSidebarFunc = () => setOpenMobileSidebar(!openMobileSidebar);

  return (
    <>
      <html>
        <SessionProvider>
          <body>
            {!session ? (
              <div className="flex w-full">
                <Loading />
              </div>
            ) : (
              <div className="bg-white flex flex-row min-h-screen">
                <div className="hidden lg:flex md:flex">
                  <Sidebar />
                </div>
                <div className="lg:hidden md:hidden sm:flex">
                  <MobileSidebar openMobileSidebar={openMobileSidebar} />
                </div>
                <div className="flex flex-col w-full">
                  <Header openMobileSidebarFunc={openMobileSidebarFunc} />
                  <main className="flex-grow">{children}</main>
                </div>
              </div>
            )}
          </body>
        </SessionProvider>
      </html>
    </>
  );
}

export default RootLayout;
