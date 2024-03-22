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
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from '@contexts/SessionContext';
import { BiNotepad } from 'react-icons/bi';
import { Collapsible, CollapsibleContent } from 'ui';

interface NavItem {
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
  const router = useRouter();
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
      href: '/d/inbox',
      iconLoc: 'left',
    },
    {
      icon: <GlobeAltIcon color="white" />,
      name: 'Waldo Hub',
      href: '/d/w_hub',
      iconLoc: 'left',
    },
    {
      icon: <ArrowRightIcon color="white" />,
      name: 'Submissions',
      href: '/d/submissions',
      iconLoc: 'right',
      altIcon: <ArrowDownIcon color="white" />,
      click: toggleSubItems,
      last: true,
    },
  ];

  return (
    <>
      <div className="flex w-max px-6 mr-4 bg-black min-h-screen rounded-tr-xl rounded-br-xl">
        {/* Main Container */}
        <div className="mt-12 flex flex-col gap-7">
          {/* Icon Container */}
          <div className="items-center flex flex-row gap-5">
            {session ? (
              <>
                <div className="py-2 px-[1px] bg-[#6F1DD8] absolute rounded-md"></div>

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
        </div>
      </div>
    </>
  );
};

const NavItemComp = ({ item, index }: NavItemCompProps) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      onClick={() =>
        item.click != null ? item.click() : router.push(item.href)
      }
      className={
        pathname !== item.href
          ? 'flex flex-row  py-2 px-2 cursor-pointer gap-2 text-gray-500 items-center font-semibold hover:bg-[#6F1DD8] hover:rounded-lg hover:text-white '
          : 'flex flex-row  py-2 px-2 cursor-pointer gap-2 text-white items-center font-semibold bg-[#6F1DD8] rounded-lg '
      }
      key={index}
    >
      <div className="flex items-center">
        {item.iconLoc == 'left' && (
          <div className="h-5 w-5 text-gray-500">
            {item.name == 'Inbox' && (
              <div className="px-1 py-1 absolute bg-red-500 rounded-lg"></div>
            )}
            {item.icon}
          </div>
        )}
        <div className="flex flex-row items-center px-1 gap-1">
          <div>{item.name}</div>
          <div className="h-4 w-4 ">{item.iconLoc == 'right' && item.icon}</div>
        </div>
      </div>
    </div>
  );
};

const SUB_ITEMS: NavItem[] = [
  {
    icon: <BiNotepad color="white" />,
    name: 'Upload',
    href: '/d/upload',
    iconLoc: 'left',
  },
];

export default Sidebar;

interface NavItemCompProps {
  item: NavItem;
  index: number;
}

Sidebar.displayName = 'Sidebar';
