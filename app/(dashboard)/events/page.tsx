import { redirect } from "next/navigation";

import EventsView from "@/components/events-view";

import { createClient } from "@/lib/supabase/server";

import {
  Club,
  ClubOrganization,
  ClubStatus,
} from "@/types/club";

import { ClubEvent } from "@/types/event";

export default async function EventsPage() {
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

  const nowIso =
    new Date().toISOString();

  const [
    clubsResult,
    eventsResult,
  ] = await Promise.all([
    supabase
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
        "name",
        {
          ascending: true,
        }
      ),

    supabase
      .from("events")
      .select(
        `
          id,
          club_id,
          title,
          description,
          location,
          start_at,
          end_at
        `
      )
      .order(
        "start_at",
        {
          ascending: true,
        }
      ),
  ]);

  if (
    clubsResult.error
  ) {
    console.error(
      "Error loading clubs:",
      clubsResult.error
    );
  }

  if (
    eventsResult.error
  ) {
    console.error(
      "Error loading events:",
      eventsResult.error
    );
  }

  const clubs: Club[] =
    (
      clubsResult.data ??
      []
    ).map(
      (club) => ({
        id:
          club.id,

        name:
          club.name,

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

  const clubNames =
    new Map(
      clubs.map(
        (club) => [
          club.id,
          club.name,
        ]
      )
    );

  const events: ClubEvent[] =
    (
      eventsResult.data ??
      []
    ).map(
      (event) => ({
        id:
          event.id,

        clubId:
          event.club_id ??
          undefined,

        clubName:
          event.club_id
            ? clubNames.get(
                event.club_id
              )
            : undefined,

        title:
          event.title,

        description:
          event.description ??
          undefined,

        location:
          event.location ??
          undefined,

        startAt:
          event.start_at,

        endAt:
          event.end_at,
      })
    );

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <EventsView
        initialEvents={
          events
        }
        clubs={clubs}
        userId={userId}
        nowIso={nowIso}
      />
    </div>
  );
}