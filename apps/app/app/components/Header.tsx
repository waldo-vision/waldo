'use client';

import { Spinner } from 'ui';
import { discord, docs, github } from '@utils/links';
import { useSession } from '@contexts/SessionContext';
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';
import { Bars3Icon } from '@heroicons/react/24/outline';

export default function Header({
  openMobileSidebarFunc,
}: {
  openMobileSidebarFunc: () => void;
}) {
  const s = useSession();
  const session = s?.session;

  return (
    <>
      <div className="flex justify-between items-center pr-4 w-full py-2 text-gray-500 ">
        <div className="flex m-8 mx-12">
          <div className="font-semibold text-md gap-3 items-center flex flex-row">
            <Bars3Icon
              className="cursor-pointer lg:hidden md:hidden h-7 w-7"
              onClick={() => openMobileSidebarFunc()}
            />
            <h1>Hey,</h1>
            {session ? (
              <img
                className="h-8 w-8 rounded-2xl"
                alt="User Image"
                src={session?.image && session?.image}
              />
            ) : (
              <Spinner />
            )}
            <span className="text-gray-700 text-nowrap">
              {session && session.name}
            </span>
          </div>
        </div>
        <div className="flex ml-auto">
          {/* styles={NovuCustomStyling} */}
          <NovuProvider
            backendUrl={process.env.NEXT_PUBLIC_NOVU_BACKEND_URL}
            socketUrl={process.env.NEXT_PUBLIC_NOVU_WS_URL}
            subscriberId={session?.id}
            applicationIdentifier={process.env.NEXT_PUBLIC_NOVU_APP_ID}
          >
            <PopoverNotificationCenter colorScheme={'dark'}>
              {({ unseenCount }) => (
                <NotificationBell unseenCount={unseenCount} />
              )}
            </PopoverNotificationCenter>
          </NovuProvider>
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
