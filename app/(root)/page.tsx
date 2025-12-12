import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center overflow-hidden px-4">

      {/* Hero Image */}
      <Image
        src="/hero.svg"
        alt="Hero-Section"
        height={400}
        width={400}
        className="mb-4"
      />

      {/* Title */}
      <h1
        className="
        text-5xl md:text-6xl font-extrabold text-center
        bg-clip-text text-transparent
        bg-gradient-to-r from-[#ff7b1b] via-[#ff9348] to-[#ffb870]
        dark:from-[#ff7b1b] dark:via-[#ff9348] dark:to-[#ffb870]
        tracking-tight leading-tight
      "
      >
        CogniCode With Intelligence
      </h1>

      {/* Paragraph */}
      <p className="mt-4 text-center max-w-xl text-gray-600 dark:text-gray-400 text-base md:text-lg">
        CogniCode Editor is a powerful and intelligent code editor that enhances
        your coding experience with advanced features and seamless integration.
      </p>

      {/* Button */}
      <Link href="/dashboard">
        <Button variant="brand" size="lg" className="mt-6">
          Get Started
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </Link>
    </div>
  );
}
