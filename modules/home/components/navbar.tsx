import { Role } from "@/lib/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export const Navbar = ({ userRole }: any) => {
  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-[var(--nav-glass)] backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200 hover:bg-[var(--nav-glass)]">
        <div className="px-6 py-4 flex justify-between items-center">
          <Link href={"/"} className="flex items-center gap-2">
            <Image src={"/logo.svg"} alt="TreeBio" width={42} height={42} />
            <span className="font-bold text-2xl tracking-widest text-amber-300">
              LeetCode
            </span>
          </Link>

          <div className="flex flex-row items-center justify-center gap-x-4">
            <Link
              href="/problems"
              className="text-sm font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] cursor-pointer"
            >
              Problems
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] cursor-pointer"
            >
              About
            </Link>
            <Link
              href="/profile"
              className="text-sm font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] cursor-pointer"
            >
              Profile
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <ModeToggle />
            <Show when={"signed-in"}>
              {userRole && userRole === Role.ADMIN && (
                <Link href={"/create-problem"}>
                  <Button variant={"outline"} size={"default"}>
                    Create Problem
                  </Button>
                </Link>
              )}
              <UserButton />
            </Show>

            <Show when={"signed-out"}>
              <SignInButton />
              <SignUpButton>
                <Button
                  size="sm"
                  className="text-sm font-medium bg-[var(--amber-fill)] hover:bg-[var(--amber-text-emphasis)] text-[var(--text-on-accent)]"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      </div>
    </nav>
  );
};
