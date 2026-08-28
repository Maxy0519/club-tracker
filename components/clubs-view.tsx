"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import AddClubModal from "@/components/add-club-modal";
import ClubCard from "@/components/club-card";

import {
  Club,
  ClubOrganization,
  ClubStatus,
} from "@/types/club";

type ClubsViewProps = {
  clubs: Club[];
};

type OrganizationFilter =
  | "All"
  | ClubOrganization;

type StatusFilter =
  | "All"
  | ClubStatus;

export default function ClubsView({
  clubs: initialClubs,
}: ClubsViewProps) {
  const [clubs, setClubs] =
    useState<Club[]>(initialClubs);

  const [search, setSearch] =
    useState("");

  const [organization, setOrganization] =
    useState<OrganizationFilter>("All");

  const [status, setStatus] =
    useState<StatusFilter>("All");

  const [addModalOpen, setAddModalOpen] =
    useState(false);

  const activeClubs = clubs.filter(
    (club) => club.status === "Active"
  ).length;

  const filteredClubs = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return clubs.filter((club) => {
      const matchesSearch =
        normalizedSearch === "" ||
        club.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        club.organization
          .toLowerCase()
          .includes(normalizedSearch) ||
        club.status
          .toLowerCase()
          .includes(normalizedSearch) ||
        club.category
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        club.role
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        club.description
          ?.toLowerCase()
          .includes(normalizedSearch) ||
        club.notes
          ?.toLowerCase()
          .includes(normalizedSearch);

      const matchesOrganization =
        organization === "All" ||
        club.organization === organization;

      const matchesStatus =
        status === "All" ||
        club.status === status;

      return (
        matchesSearch &&
        matchesOrganization &&
        matchesStatus
      );
    });
  }, [
    clubs,
    search,
    organization,
    status,
  ]);

  function handleAddClub(club: Club) {
    setClubs((currentClubs) => [
      ...currentClubs,
      club,
    ]);

    // Reset filters so the new club is
    // immediately visible after creation.
    setSearch("");
    setOrganization("All");
    setStatus("All");
  }

  return (
    <>
      {/* Page header */}
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Clubs
          </h1>

          <p className="mt-2 text-zinc-400">
            Manage your Baruch and Macaulay organizations.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAddModalOpen(true)
          }
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <Plus size={17} />

          <span className="hidden sm:inline">
            Add Club
          </span>
        </button>
      </header>

      {/* Summary */}
      <section className="mb-8 flex gap-8 border-b border-zinc-800 pb-5">
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

      {/* Search and filters */}
      <section className="mb-6 space-y-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search clubs..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Organization filter */}
          <select
            value={organization}
            onChange={(event) =>
              setOrganization(
                event.target
                  .value as OrganizationFilter
              )
            }
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 outline-none"
          >
            <option value="All">
              All organizations
            </option>

            <option value="Baruch">
              Baruch
            </option>

            <option value="Macaulay">
              Macaulay
            </option>
          </select>

          {/* Status filter */}
          <select
            value={status}
            onChange={(event) =>
              setStatus(
                event.target
                  .value as StatusFilter
              )
            }
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm text-zinc-300 outline-none"
          >
            <option value="All">
              All statuses
            </option>

            <option value="Interested">
              Interested
            </option>

            <option value="Applying">
              Applying
            </option>

            <option value="Applied">
              Applied
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <p className="text-xs text-zinc-500">
          Showing {filteredClubs.length} of{" "}
          {clubs.length} clubs
        </p>
      </section>

      {/* Club cards */}
      {filteredClubs.length > 0 ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
            />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="font-medium">
            No clubs found
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            Try changing your search or filters.
          </p>
        </section>
      )}

      {/* Add Club modal */}
      <AddClubModal
        open={addModalOpen}
        onClose={() =>
          setAddModalOpen(false)
        }
        onAdd={handleAddClub}
      />
    </>
  );
}