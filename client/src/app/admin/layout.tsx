import AdminSidebar from "@/app/admin/admin-sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col xl:flex-row">
      {/* Sidebar bên trái */}
      <div className="h-full hidden xl:block">
        <AdminSidebar />
      </div>

      <div className="block xl:hidden p-2 bg-white">
        <Sheet>
          <SheetTrigger asChild>
            <div className="cursor-pointer">
              <Menu className="h-6 w-6 text-black" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="h-full overflow-y-auto">
            <AdminSidebar />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 h-full overflow-y-auto bg-gray-50">
        {children}
      </main>
    </div>
  );
}
