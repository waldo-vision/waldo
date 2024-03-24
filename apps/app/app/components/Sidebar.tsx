'use client';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  GlobeAltIcon,
  HomeIcon,
  InboxIcon,
} from '@heroicons/react/24/solid';
import React, { useEffect, useState } from 'react';

import { Input, Spinner } from 'ui';
import { usePathname } from 'next/navigation';
import { useSession } from '@contexts/SessionContext';
import { Collapsible, CollapsibleContent } from 'ui';
import NavItemComp from './Sidebar/NavItem';
import UtilNavItem from './Sidebar/UtilNavItem';
import {
  ArrowUpOnSquareIcon,
  PencilSquareIcon,
} from '@heroicons/react/24/outline';

export interface NavItem {
  icon: React.ReactNode;
  name: string;
  href: string;
  iconLoc: 'left' | 'right';
  altIcon?: React.ReactNode;
  click?: () => void;
  last?: boolean;
}

const Sidebar = () => {
  const pathname = usePathname();
  const s = useSession();
  const session = s?.session;
  const [sub, setSub] = useState<boolean>(false);
  const toggleSubItems = () => setSub(!sub);

  useEffect(() => {
    SUB_ITEMS.forEach(item => {
      if (item.href == pathname) {
        setSub(true);
      } else {
        setSub(false);
      }
    });
  }, []);

  const NAV_ITEMS: NavItem[] = [
    {
      icon: <HomeIcon color="white" />,
      name: 'Dashboard',
      href: '/',
      iconLoc: 'left',
    },
    {
      icon: <InboxIcon color="white" />,
      name: 'Inbox',
      href: '/wip',
      iconLoc: 'left',
    },
    {
      icon: <GlobeAltIcon color="white" />,
      name: 'Waldo Hub',
      href: '/wip',
      iconLoc: 'left',
    },
    {
      icon: <ArrowRightIcon color="white" />,
      name: 'Submissions',
      href: '',
      iconLoc: 'right',
      altIcon: <ArrowDownIcon color="white" />,
      click: toggleSubItems,
      last: true,
    },
  ];

  return (
    <>
      <div className="hidden lg:flex md:flex w-max px-6 mr-4 bg-black min-h-screen rounded-tr-xl rounded-br-xl">
        {/* Main Container */}
        <div className="mt-12 flex flex-col gap-7">
          {/* Icon Container */}
          <div className="items-center flex flex-row gap-5">
            {session ? (
              <>
                <div className="py-2 px-[1px] bg-sigp absolute rounded-md"></div>

                <div className="px-2 py-2 bg-gray-900 rounded-2xl">
                  <img
                    className="h-10 w-10 rounded-xl"
                    alt="User Image"
                    src={session?.image}
                  />
                </div>
              </>
            ) : (
              <Spinner color="white" />
            )}
            <h1 className="text-white font-semibold text-lg">
              {session && session.name}
            </h1>
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
          <div className="flex flex-col justify-between h-full pb-3">
            <div className=" flex flex-col gap-3">
              <h1 className="text-gray-700 font-bold text-xs ml-3 mb-2">
                OVERVIEW
              </h1>
              {NAV_ITEMS.map((item, index) => (
                <>
                  <NavItemComp item={item} index={index} />

                  {item.last && (
                    <Collapsible open={sub}>
                      <CollapsibleContent className="ml-4">
                        {SUB_ITEMS.map((item, index) => (
                          <NavItemComp item={item} index={index} />
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </>
              ))}
            </div>
            <div className="flex flex-col">
              {UTIL_ITEMS.map((item, index) => (
                <UtilNavItem item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const SUB_ITEMS: NavItem[] = [
  {
    icon: <ArrowUpOnSquareIcon color="white" />,
    name: 'Upload',
    href: '/submissions/upload',
    iconLoc: 'left',
  },
  {
    icon: <PencilSquareIcon color="white" />,
    name: 'Review',
    href: '/submissions/review',
    iconLoc: 'left',
  },
];

const UTIL_ITEMS: NavItem[] = [
  {
    icon: <></>,
    name: 'Sign Out',
    href: '/api/logto/sign-out',
    iconLoc: 'left',
  },
];

export default Sidebar;

Sidebar.displayName = 'Sidebar';
