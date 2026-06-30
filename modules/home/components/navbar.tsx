"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Role } from "@/lib/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, Show } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { href: "/problems", label: "Problems" },
  { href: "/about",    label: "About"    },
  { href: "/profile",  label: "Profile"  },
] as const;

type NavbarProps = {
  userRole: Role | null | undefined;
};

export const Navbar = ({ userRole }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the sheet whenever the route changes (back button, link click)
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-5xl px-4">
      <div className="bg-[var(--nav-glass)] backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 transition-all duration-200">
        <div className="px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image src="/logo.svg" alt="LeetCode" width={42} height={42} />
            <span className="font-bold text-2xl tracking-widest text-amber-300">
              LeetCode
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex flex-row items-center gap-x-4">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop auth controls */}
          <div className="hidden md:flex items-center gap-4">
            <ModeToggle />
            <Show when="signed-in">
              {userRole === Role.ADMIN && (
                <Link href="/create-problem">
                  <Button variant="outline" size="default">
                    Create Problem
                  </Button>
                </Link>
              )}
              <UserButton />
            </Show>
            <Show when="signed-out">
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

          {/* Mobile: mode toggle + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <ModeToggle />
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="text-[var(--nav-link)]"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72 flex flex-col gap-6 pt-10">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image src="/logo.svg" alt="LeetCode" width={32} height={32} />
                    <span className="font-bold text-xl tracking-widest text-amber-300">
                      LeetCode
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile nav links */}
                <nav className="flex flex-col gap-1">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium text-[var(--nav-link)] hover:text-[var(--nav-link-hover)] hover:bg-[var(--surface-subtle)] rounded-lg px-3 py-2 transition-colors"
                    >
                      {label}
                    </Link>
                  ))}
                </nav>

                {/* Mobile auth controls */}
                <div className="flex flex-col gap-3 mt-auto pb-4">
                  <Show when="signed-in">
                    {userRole === Role.ADMIN && (
                      <Link href="/create-problem" onClick={() => setOpen(false)}>
                        <Button variant="outline" className="w-full">
                          Create Problem
                        </Button>
                      </Link>
                    )}
                    <div className="flex items-center gap-3 px-1">
                      <UserButton />
                      <span className="text-sm text-[var(--text-muted)]">Account</span>
                    </div>
                  </Show>
                  <Show when="signed-out">
                    <SignUpButton>
                      <Button className="w-full bg-[var(--amber-fill)] hover:bg-[var(--amber-text-emphasis)] text-[var(--text-on-accent)]">
                        Sign Up
                      </Button>
                    </SignUpButton>
                    <SignInButton>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </SignInButton>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </nav>
  );
};
