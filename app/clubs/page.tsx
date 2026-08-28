import ClubCard from "@/components/club-card";
import { clubs } from "@/data/clubs";
import { Plus } from "lucide-react";

export default function ClubsPage() {
  const activeClubs = clubs.filter(
    (club) => club.status === "Active"
  ).length;

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Clubs
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your Baruch and Macaulay organizations.
          </p>
        </div>

        <button className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200">
          <Plus size={17} />

          <span className="hidden sm:inline">
            Add Club
          </span>
        </button>
      </header>

      <section className="mb-8 flex gap-6 border-b border-zinc-800 pb-5">
        <div>
          <p className="text-2xl font-semibold">
            {clubs.length}
          </p>

          <p className="text-xs text-zinc-500">
            Tracked
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            {activeClubs}
          </p>

          <p className="text-xs text-zinc-500">
            Active
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {clubs.map((club) => (
          <ClubCard
            key={club.id}
            club={club}
          />
        ))}
      </section>
    </div>
  );
}