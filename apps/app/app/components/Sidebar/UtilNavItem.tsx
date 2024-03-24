import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from '../Sidebar';
import { ArrowRightEndOnRectangleIcon } from '@heroicons/react/24/outline';

interface NavItemCompProps {
  item: NavItem;
  index: number;
}

const UtilNavItemComp = ({ item, index }: NavItemCompProps) => {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <div
      onClick={() =>
        item.click != null ? item.click() : router.push(item.href)
      }
      className={
        pathname !== item.href
          ? 'flex flex-row py-2 px-2 cursor-pointer gap-2 text-gray-500 items-center font-semibold hover:bg-yellow-400 hover:rounded-lg hover:text-white'
          : 'flex flex-row py-2 px-2 cursor-pointer gap-2 text-white items-center font-semibold bg-yellow-400 rounded-lg'
      }
      key={index}
    >
      <div className="flex flex-row w-full justify-between items-center">
        <h1>{item.name}</h1>
        <ArrowRightEndOnRectangleIcon color="white" className="h-5 w-5" />
      </div>
    </div>
  );
};

export default UtilNavItemComp;
