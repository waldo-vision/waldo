/* eslint-disable @next/next/no-img-element */
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import WaldoLogo from '../public/android-chrome-256x256.png';
import { discord, docs, github } from '@utils/links';
//import useSite from '@site';
export default function Header() {
  //const { session } = useSite();

  return (
    <>
      <div className="  text-gray-500 min-w-max items-center gap-2 w-[100%] z-100">
        <div className="flex m-8 mx-12">
          <div className="font-semibold text-md gap-3 items-center flex flex-row">
            <h1>Hey,</h1>
            <img
              className="h-8 w-8 rounded-2xl"
              alt="User Image"
              src="https://cdn.dribbble.com/users/1259559/avatars/normal/edc2487dcc64f59128c66a366ca2215b.jpeg?1639083971"
            />
            <h1 className="text-gray-700">Finn</h1>
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItem {
  label: string;
  href: string;
  pathName: string | null;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Home',
    href: '/',
    pathName: '/',
  },
  {
    label: 'Submissions',
    href: '/submissions',
    pathName: '/submissions',
  },
  {
    label: 'Community',
    href: discord,
    pathName: null,
  },
  {
    label: 'Docs',
    href: docs,
    pathName: null,
  },
  {
    label: 'Github',
    href: github,
    pathName: null,
  },
];
