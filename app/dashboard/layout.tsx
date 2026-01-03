import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";
import { createUserIfNotExists } from "@/modules/auth/actions/create-user"; // ✅ ADD

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ THIS LINE IS MANDATORY
  await createUserIfNotExists();

  const playgroundData = await getAllPlaygroundForUser();

  const formattedplaygroundData = playgroundData?.map((item) => ({
    id: item.id,
    name: item.title,
    starred: item.StarMark?.[0]?.isMarked || false,
    icon: item.template,
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
