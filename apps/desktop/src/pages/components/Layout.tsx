import Sidebar from './Sidebar';
import { ReactNode } from 'react';
export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <Sidebar>{children}</Sidebar>;
}
