import React from 'react';
import './globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { SessionProvider } from '@contexts/SessionContext';
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white flex flex-row">
        <Sidebar />
        <div className="flex flex-col">
          <div>
            <Header />
          </div>
          <div>
            <SessionProvider>{children}</SessionProvider>
          </div>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
