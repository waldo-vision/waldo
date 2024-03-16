import React from 'react';
import './globals.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white flex flex-row">
        <Sidebar />
        <div className="flex flex-col">
          <div>
            <Header />
          </div>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
}

export default RootLayout;
