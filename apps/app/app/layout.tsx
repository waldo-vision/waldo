import './globals.css';
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { SessionProvider } from '@contexts/SessionContext';
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <SessionProvider>
        <body>
          <div className="bg-white flex flex-row">
            <div>
              <Sidebar />
            </div>
            <div className="flex flex-col">
              <div>
                <Header />
              </div>
              <div>{children}</div>
            </div>
          </div>
        </body>
      </SessionProvider>
    </html>
  );
}

export default RootLayout;
