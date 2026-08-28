"use client";

import Link from "next/link";

import {
  CalendarDays,
  CheckSquare,
  House,
  LogOut,
  PartyPopper,
  Users,
} from "lucide-react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useState } from "react";

import { createClient } from "@/lib/supabase/client";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: House,
  },
  {
    name: "Clubs",
    href: "/clubs",
    icon: Users,
  },
  {
    name: "Events",
    href: "/events",
    icon: PartyPopper,
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: CalendarDays,
  },
  {
    name: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
];

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [signingOut, setSigningOut] =
    useState(false);

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);

    const supabase = createClient();

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Error signing out:",
        error
      );

      setSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-zinc-800 bg-zinc-950 md:flex md:flex-col">
        <div className="border-b border-zinc-800 px-6 py-6">
          <p className="text-lg font-bold">
            Club Tracker
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Baruch × Macaulay
          </p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <Icon size={18} />

                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-4">
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={18} />

            {signingOut
              ? "Signing Out..."
              : "Sign Out"}
          </button>

          <p className="mt-3 px-3 text-xs text-zinc-600">
            Personal club workspace
          </p>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/95 px-5 py-4 backdrop-blur md:hidden">
        <div>
          <p className="font-semibold">
            Club Tracker
          </p>

          <p className="text-xs text-zinc-500">
            Baruch × Macaulay
          </p>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="rounded-xl p-2.5 text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
          aria-label="Sign out"
        >
          <LogOut size={19} />
        </button>
      </header>

      {/* Main content */}
      <main className="min-h-screen pb-24 md:ml-64 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur md:hidden">
        <div className="grid grid-cols-5">
          {navigation.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(
                    item.href
                  );

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 py-3 text-[11px] ${
                  active
                    ? "text-white"
                    : "text-zinc-500"
                }`}
              >
                <Icon size={20} />

                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}