import Sidebar from '@components/dashboard/Sidebar';
import { ReactNode } from 'react';
export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <Sidebar>{children}</Sidebar>;
}
