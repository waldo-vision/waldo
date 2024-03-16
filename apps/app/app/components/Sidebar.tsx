'use client';
import { HomeIcon, InboxIcon } from '@heroicons/react/24/solid';
import * as React from 'react';

import { Button, Input } from 'ui';
import { usePathname, useRouter } from 'next/navigation';
const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <>
      <div className="flex w-max px-6 mr-4 bg-black min-h-screen rounded-tr-xl rounded-br-xl">
        {/* Main Container */}
        <div className="mt-12 flex flex-col gap-7">
          {/* Icon Container */}
          <div className="items-center flex flex-row gap-5">
            <div className="py-2 px-[1px] bg-yellow-500 absolute rounded-md"></div>

            <div className="px-2 py-2 bg-gray-900 rounded-2xl">
              <img
                className="h-10 w-10 rounded-xl"
                alt="User Image"
                src="https://cdn.dribbble.com/users/1259559/avatars/normal/edc2487dcc64f59128c66a366ca2215b.jpeg?1639083971"
              />
            </div>
            <h1 className="text-white font-semibold text-lg">Finn</h1>
          </div>

          {/* Keyword Search Box */}
          <div className="flex flex-row items-center gap-4">
            {/* <Button className="bg-[#5A3090] hover:bg-[#5A3090]">Go</Button> */}
            <Input
              className="bg-gray-900 border-gray-900 text-white rounded-xl"
              placeholder="Search..."
            />
          </div>

          {/* Navigation Main Container. */}
          <div className=" flex flex-col gap-3">
            <h1 className="text-gray-700 font-bold text-xs ml-3 mb-2">
              OVERVIEW
            </h1>
            {NAV_ITEMS.map((item, index) => (
              <div
                onClick={() => router.push(item.href)}
                className={
                  pathname !== item.href
                    ? 'flex flex-row  py-2 px-2 cursor-pointer gap-2 text-gray-500 items-center font-semibold hover:bg-[#6F1DD8] hover:rounded-lg hover:text-white '
                    : 'flex flex-row  py-2 px-2 cursor-pointer gap-2 text-white items-center font-semibold bg-[#6F1DD8] rounded-lg '
                }
                key={index}
              >
                <div className="h-5 w-5 text-gray-500">
                  {item.name == 'Inbox' && (
                    <div className="px-1 py-1 absolute bg-red-500 rounded-lg"></div>
                  )}
                  {item.icon}
                </div>
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

interface NavItem {
  icon: React.ReactNode;
  name: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    icon: <HomeIcon color="white" />,
    name: 'Dashboard',
    href: '/',
  },
  {
    icon: <InboxIcon color="white" />,
    name: 'Inbox',
    href: '/d/inbox',
  },
];
