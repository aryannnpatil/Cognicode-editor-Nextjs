import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const playgroundData = await getAllPlaygroundForUser();

  // Instead of mapping to icon names like "Zap",
  // we send EXACT technology keys matching Sidebar's icon map.
  const formattedplaygroundData = playgroundData?.map((item) => ({
    id: item.id,
    name: item.title,
    icon: item.template, // <-- MUST match: REACT, NEXTJS, EXPRESS, etc.
    // starred: item.starred || false, // adjust if your DB uses another field
  }));

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full overflow-x-hidden">
        {/* @ts-ignore */}
        <DashboardSidebar initialPlaygroundData={formattedplaygroundData} />

        <main className="flex-1">{children}</main>
      </div>
    </SidebarProvider>
  );
}
