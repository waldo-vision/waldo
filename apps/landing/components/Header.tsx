'use client';
import Image from 'next/image';
import React from 'react';
import { WaldoButton } from 'ui';
import { cn } from 'ui/lib/utils';
import { usePathname } from 'next/navigation';
export const Header = () => {
  const pathname = usePathname();
  return (
    <div className="min-w-max items-center gap-2 fixed w-[100%] z-[100] mt-3">
      <div className="flex flex-row justify-evenly items-center">
        {/* Logo */}
        <div className="flex">
          <Image
            src={
              'https://waldo.vision/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fandroid-chrome-256x256.47d544ec.png&w=96&q=75'
            }
            width={35}
            height={30}
            alt="alt"
          />
        </div>
        {/* Navigation Items */}
        <div className="flex flex-row gap-4">
          {NAV_ITEMS.map((item: NavItem, index: number) => {
            return (
              <h1
                className={`text-white ${
                  pathname.includes(item.href) ? 'font-bold' : 'font-regular'
                }`}
                key={index}
              >
                {item.label}
              </h1>
            );
          })}
        </div>
        {/* CTA Buttons */}
        <div className="flex gap-2">
          <WaldoButton className="text-sm text-white font-medium" size="sm">
            Login
          </WaldoButton>
          <WaldoButton className="text-sm text-white font-medium" size="sm">
            Sign up
          </WaldoButton>
        </div>
      </div>
    </div>
  );
};

interface NavItem {
  name: string;
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    name: 'home',
    href: '/',
    label: 'Home',
  },
  {
    name: 'github',
    href: 'https://github.com/waldo-vision',
    label: 'GitHub',
  },
  {
    name: 'account',
    href: 'https://app.waldo.vision/account',
    label: 'Account',
  },
  {
    name: 'app',
    href: 'https://app.waldo.vision/submissions',
    label: 'App',
  },
  {
    name: 'docs',
    href: 'https://docs.waldo.vision',
    label: 'Docs',
  },
];
