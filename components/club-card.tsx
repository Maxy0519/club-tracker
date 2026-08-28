import { Club } from "@/types/club";

type ClubCardProps = {
  club: Club;
};

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-medium text-zinc-500">
            {club.organization}
          </span>

          <h2 className="mt-1 text-lg font-semibold">
            {club.name}
          </h2>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            club.status === "Active"
              ? "bg-white text-black"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {club.status}
        </span>
      </div>

      {club.description && (
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          {club.description}
        </p>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
          {club.category}
        </span>

        <span className="rounded-lg bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
          {club.role}
        </span>
      </div>
    </article>
  );
}