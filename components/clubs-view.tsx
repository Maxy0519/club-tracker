"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  Plus,
  Search,
} from "lucide-react";

import AddClubModal from "@/components/add-club-modal";
import ClubCard from "@/components/club-card";

import { createClient } from "@/lib/supabase/client";

import {
  Club,
  ClubOrganization,
  ClubStatus,
  NewClub,
} from "@/types/club";

type ClubsViewProps = {
  initialClubs: Club[];
  userId: string;
};

type OrganizationFilter =
  | "All"
  | ClubOrganization;

type StatusFilter =
  | "All"
  | ClubStatus;

export default function ClubsView({
  initialClubs,
  userId,
}: ClubsViewProps) {
  const [clubs, setClubs] =
    useState<Club[]>(initialClubs);

  const [search, setSearch] =
    useState("");

  const [organization, setOrganization] =
    useState<OrganizationFilter>("All");

  const [status, setStatus] =
    useState<StatusFilter>("All");

  const [
    addModalOpen,
    setAddModalOpen,
  ] = useState(false);

  const activeClubs =
    clubs.filter(
      (club) =>
        club.status === "Active"
    ).length;

  const filteredClubs =
    useMemo(() => {
      const normalizedSearch =
        search
          .trim()
          .toLowerCase();

      return clubs.filter(
        (club) => {
          const matchesSearch =
            normalizedSearch === "" ||
            club.name
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.organization
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.status
              .toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.category
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.role
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.description
              ?.toLowerCase()
              .includes(
                normalizedSearch
              ) ||
            club.notes
              ?.toLowerCase()
              .includes(
                normalizedSearch
              );

          const matchesOrganization =
            organization ===
              "All" ||
            club.organization ===
              organization;

          const matchesStatus =
            status === "All" ||
            club.status === status;

          return (
            matchesSearch &&
            matchesOrganization &&
            matchesStatus
          );
        }
      );
    }, [
      clubs,
      search,
      organization,
      status,
    ]);

  async function handleAddClub(
    newClub: NewClub
  ) {
    const supabase =
      createClient();

    const {
      data,
      error,
    } = await supabase
      .from("clubs")
      .insert({
        user_id: userId,
        name: newClub.name,
        organization:
          newClub.organization,
        status:
          newClub.status,
        category:
          newClub.category ?? null,
        role:
          newClub.role ?? null,
        instagram:
          newClub.instagram ?? null,
        website:
          newClub.website ?? null,
        description:
          newClub.description ?? null,
        notes:
          newClub.notes ?? null,
      })
      .select(
        `
          id,
          name,
          organization,
          status,
          category,
          role,
          instagram,
          website,
          description,
          notes
        `
      )
      .single();

    if (error) {
      console.error(
        "Error adding club:",
        error
      );

      return false;
    }

    const createdClub: Club = {
      id: data.id,
      name: data.name,
      organization:
        data.organization as ClubOrganization,
      status:
        data.status as ClubStatus,
      category:
        data.category ?? undefined,
      role:
        data.role ?? undefined,
      instagram:
        data.instagram ?? undefined,
      website:
        data.website ?? undefined,
      description:
        data.description ?? undefined,
      notes:
        data.notes ?? undefined,
    };

    setClubs(
      (currentClubs) => [
        ...currentClubs,
        createdClub,
      ]
    );

    setSearch("");
    setOrganization("All");
    setStatus("All");

    return true;
  }

  return (
    <>
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
            setAddModalOpen(
              true
            )
          }
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <Plus size={17} />

          <span className="hidden sm:inline">
            Add Club
          </span>
        </button>
      </header>

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
              setSearch(
                event.target.value
              )
            }
            placeholder="Search clubs..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
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
          Showing{" "}
          {filteredClubs.length}{" "}
          of {clubs.length} clubs
        </p>
      </section>

      {filteredClubs.length >
      0 ? (
        <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredClubs.map(
            (club) => (
              <ClubCard
                key={club.id}
                club={club}
              />
            )
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="font-medium">
            No clubs found
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {clubs.length === 0
              ? "Add your first club to get started."
              : "Try changing your search or filters."}
          </p>
        </section>
      )}

      <AddClubModal
        open={addModalOpen}
        onClose={() =>
          setAddModalOpen(
            false
          )
        }
        onAdd={
          handleAddClub
        }
      />
    </>
  );
}