import { getPathname } from "@/lib/get-current-pathname";
import { cn } from "@/lib/utils";

export default async function BusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = await getPathname();
  const busOptions = [
    { busUrl: "/admin/bus/list", label: "Xe khách" },
    { busUrl: "/admin/bus/bus-model", label: "Mẫu xe" },
  ];

  return (
    <div className="px-4 py-6 sm:px-8 sm:py-8 flex flex-col items-center">
      <div className="w-full max-w-screen-lg mx-auto">
        <div className="flex gap-2 mb-4">
          {busOptions.map(({ busUrl, label }) => (
            <a
              href={busUrl}
              key={busUrl}
              className={cn(
                "px-4 text-center py-2 rounded-md font-medium",
                pathname === busUrl ? "bg-gray-300" : "opacity-70"
              )}
            >
              {label}
            </a>
          ))}
        </div>
        {children}
      </div>
    </div>
  );
}
