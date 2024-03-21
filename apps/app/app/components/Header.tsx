'use client';
/* eslint-disable @next/next/no-img-element */

import { Spinner } from 'ui';
import { discord, docs, github } from '@utils/links';
import { useSession } from '@contexts/SessionContext';
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
} from '@novu/notification-center';
//import useSite from '@site';
export default function Header() {
  const s = useSession();
  const session = s?.session;
  console.log(session);
  return (
    <>
      <div className="flex justify-between items-center w-full px-4 py-2 text-gray-400">
        <div className="flex m-8 mx-12">
          <div className="font-semibold text-md gap-3 items-center flex flex-row">
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
            <h1 className="text-gray-700">{session && session.name}</h1>
          </div>
        </div>
        <div className="flex ml-auto">
          <NovuProvider
            backendUrl={process.env.NOVU_BACKEND_URL}
            socketUrl={process.env.NOVU_WS_URL}
            subscriberId={session?.id}
            applicationIdentifier={process.env.NOVU_APP_ID}
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
