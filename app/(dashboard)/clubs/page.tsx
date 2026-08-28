import { redirect } from "next/navigation";

import ClubsView from "@/components/clubs-view";

import { createClient } from "@/lib/supabase/server";

import {
  Club,
  ClubOrganization,
  ClubStatus,
} from "@/types/club";

export default async function ClubsPage() {
  const supabase =
    await createClient();

  const {
    data: claimsData,
  } =
    await supabase.auth.getClaims();

  const userId =
    claimsData?.claims?.sub;

  if (!userId) {
    redirect("/login");
  }

  const {
    data,
    error,
  } = await supabase
    .from("clubs")
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
    .order(
      "created_at",
      {
        ascending: true,
      }
    );

  if (error) {
    console.error(
      "Error loading clubs:",
      error
    );
  }

  const clubs: Club[] =
    (data ?? []).map(
      (club) => ({
        id: club.id,
        name: club.name,
        organization:
          club.organization as ClubOrganization,
        status:
          club.status as ClubStatus,
        category:
          club.category ??
          undefined,
        role:
          club.role ??
          undefined,
        instagram:
          club.instagram ??
          undefined,
        website:
          club.website ??
          undefined,
        description:
          club.description ??
          undefined,
        notes:
          club.notes ??
          undefined,
      })
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <ClubsView
        initialClubs={clubs}
        userId={userId}
      />
    </div>
  );
}