import Link from "next/link";
import { LogOut } from "lucide-react";
import { getPathname } from "@/lib/get-current-pathname";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faBusinessTime,
  faBusSide,
  faLocationDot,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";

const AdminSidebar = async () => {
  const pathname = await getPathname();

  const menuOptions = [
    {
      icon: <FontAwesomeIcon icon={faBus} size="xl" className="w-6 h-6" />,
      label: "Xe Khách",
      url: "/admin/bus-list",
      active: pathname === "/admin/bus-list" || pathname === "/admin/save-bus",
    },
    {
      icon: (
        <FontAwesomeIcon icon={faLocationDot} size="xl" className="w-6 h-6" />
      ),
      label: "Trạm Xe",
      url: "/admin/station",
      active: pathname === "/admin/station",
    },
    {
      icon: <FontAwesomeIcon icon={faRoute} size="xl" className="w-6 h-6" />,
      label: "Tuyến",
      url: "/admin/route",
      active: pathname === "/admin/route",
    },
    {
      icon: (
        <FontAwesomeIcon icon={faBusinessTime} size="xl" className="w-6 h-6" />
      ),
      label: "Lịch trình",
      url: "/admin/schedule",
      active: pathname === "/admin/schedule",
    },
    {
      icon: <FontAwesomeIcon icon={faBusSide} size="xl" className="w-6 h-6" />,
      label: "Chuyến xe",
      url: "/admin/trip",
      active: pathname === "/admin/trip",
    },
  ];

  return (
    <aside
      className={`lg:h-full w-full xl:w-64 text-black lg:flex lg:flex-col p-4 px-6 transition-all duration-300`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between gap-4 mt-2 mb-8">
        <div className="flex items-center gap-3">
          <Link href={`/home`}>
            <h1 className="cursor-pointer text-xl tracking-wider">
              Bus Booking
            </h1>
          </Link>
        </div>
      </div>
      <div
        className="flex-1 flex flex-col justify-between lg:overflow-y-auto"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <nav className="flex flex-col gap-3">
          {menuOptions.map((item) => (
            <a
              key={item.label}
              href={item.url}
              className={`flex items-center outline-none justify-between py-2 rounded-lg transition cursor-pointer ${
                item.active
                  ? "bg-white text-black"
                  : "cursor-pointer text-gray-400 hover:text-black"
              }`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                {/* </div> */}
                <span className="font-medium leading-none tracking-wide">
                  {item.label}
                </span>
              </div>
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-4 pt-4">
        <div className="border-t border-gray-400" />
        <a
          href="/logout"
          className="flex items-center justify-between gap-2 hover:text-black text-gray-400 py-2 rounded-lg transition cursor-pointer"
        >
          <span className="font-medium">Log out</span>
          <LogOut className="w-6 h-6" />
        </a>
      </div>
    </aside>
  );
};

export default AdminSidebar;
