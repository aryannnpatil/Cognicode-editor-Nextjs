import { cn } from "@/lib/utils";
import { Footer } from "@/modules/home/footer";
import { Header } from "@/modules/home/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "cognicode",
    default: "code editor for cognicoders - cognicode",
  },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 🔥 Background grid (NOW covers entire screen including header) */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        )}
      />

      {/* 🔥 Radial mask-bg */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />

      {/* ⭐ Everything else stays above background */}
      <div className="relative z-20">
        <Header />

        <main className="w-full">
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
}
