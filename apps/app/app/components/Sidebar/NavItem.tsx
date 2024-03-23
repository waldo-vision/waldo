import { usePathname, useRouter } from 'next/navigation';
import { NavItem } from '../Sidebar';

interface NavItemCompProps {
  item: NavItem;
  index: number;
}

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
          <div className="h-4 w-4 text-gray-500">
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

export default NavItemComp;
