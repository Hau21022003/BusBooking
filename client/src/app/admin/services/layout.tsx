import { getPathname } from "@/lib/get-current-pathname";
import { cn } from "@/lib/utils";
import { faBoxOpen, faTicketSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = await getPathname();
  const serviceOptions = [
    {
      busUrl: "/admin/services/booking",
      label: "Đặt vé",
      icon: <FontAwesomeIcon icon={faTicketSimple} size="lg" />,
    },
    {
      busUrl: "/admin/services/delivery",
      label: "Giao hàng",
      icon: <FontAwesomeIcon icon={faBoxOpen} size="lg" />,
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto">
        <div className="flex gap-2 mb-4">
          {serviceOptions.map(({ busUrl, label, icon }) => (
            <a
              href={busUrl}
              key={busUrl}
              className={cn(
                "flex items-center gap-2",
                "px-4 text-center py-2 rounded-md font-medium",
                pathname === busUrl ? "bg-gray-300" : "opacity-70"
              )}
            >
              {icon}
              <p>{label}</p>
            </a>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
