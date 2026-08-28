"use client";

import {
  useMemo,
  useState,
} from "react";

import { Plus } from "lucide-react";

import AddEventModal from "@/components/add-event-modal";
import EditEventModal from "@/components/edit-event-modal";
import EventCard from "@/components/event-card";

import { createClient } from "@/lib/supabase/client";

import { Club } from "@/types/club";

import {
  ClubEvent,
  NewClubEvent,
} from "@/types/event";

type EventsViewProps = {
  initialEvents: ClubEvent[];
  clubs: Club[];
  userId: string;
  nowIso: string;
};

type EventFilter =
  | "Upcoming"
  | "Past"
  | "All";

export default function EventsView({
  initialEvents,
  clubs,
  userId,
  nowIso,
}: EventsViewProps) {
  const [events, setEvents] =
    useState<ClubEvent[]>(
      initialEvents
    );

  const [filter, setFilter] =
    useState<EventFilter>(
      "Upcoming"
    );

  const [
    addModalOpen,
    setAddModalOpen,
  ] = useState(false);

  const [
    editingEvent,
    setEditingEvent,
  ] =
    useState<ClubEvent | null>(
      null
    );

  const now =
    new Date(nowIso).getTime();

  const upcomingCount =
    events.filter(
      (event) =>
        new Date(
          event.endAt
        ).getTime() >= now
    ).length;

  const pastCount =
    events.length -
    upcomingCount;

  const filteredEvents =
    useMemo(() => {
      const filtered =
        events.filter(
          (event) => {
            const eventEnd =
              new Date(
                event.endAt
              ).getTime();

            if (
              filter ===
              "Upcoming"
            ) {
              return (
                eventEnd >= now
              );
            }

            if (
              filter ===
              "Past"
            ) {
              return (
                eventEnd < now
              );
            }

            return true;
          }
        );

      return [
        ...filtered,
      ].sort(
        (a, b) => {
          const aTime =
            new Date(
              a.startAt
            ).getTime();

          const bTime =
            new Date(
              b.startAt
            ).getTime();

          if (
            filter ===
            "Past"
          ) {
            return (
              bTime -
              aTime
            );
          }

          return (
            aTime -
            bTime
          );
        }
      );
    }, [
      events,
      filter,
      now,
    ]);

  function getClubName(
    clubId?: string
  ) {
    if (!clubId) {
      return undefined;
    }

    return clubs.find(
      (club) =>
        club.id ===
        clubId
    )?.name;
  }

  async function handleAddEvent(
    newEvent: NewClubEvent
  ) {
    const supabase =
      createClient();

    const {
      data,
      error,
    } = await supabase
      .from("events")
      .insert({
        user_id:
          userId,

        club_id:
          newEvent.clubId ??
          null,

        title:
          newEvent.title,

        description:
          newEvent.description ??
          null,

        location:
          newEvent.location ??
          null,

        start_at:
          newEvent.startAt,

        end_at:
          newEvent.endAt,
      })
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
      .single();

    if (error) {
      console.error(
        "Error adding event:",
        error
      );

      return false;
    }

    const createdEvent: ClubEvent = {
      id:
        data.id,

      clubId:
        data.club_id ??
        undefined,

      clubName:
        getClubName(
          data.club_id ??
            undefined
        ),

      title:
        data.title,

      description:
        data.description ??
        undefined,

      location:
        data.location ??
        undefined,

      startAt:
        data.start_at,

      endAt:
        data.end_at,
    };

    setEvents(
      (current) => [
        ...current,
        createdEvent,
      ]
    );

    setFilter(
      "Upcoming"
    );

    return true;
  }

  async function handleUpdateEvent(
    eventId: string,
    updates: NewClubEvent
  ) {
    const supabase =
      createClient();

    const {
      data,
      error,
    } = await supabase
      .from("events")
      .update({
        club_id:
          updates.clubId ??
          null,

        title:
          updates.title,

        description:
          updates.description ??
          null,

        location:
          updates.location ??
          null,

        start_at:
          updates.startAt,

        end_at:
          updates.endAt,
      })
      .eq(
        "id",
        eventId
      )
      .eq(
        "user_id",
        userId
      )
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
      .single();

    if (error) {
      console.error(
        "Error updating event:",
        error
      );

      return false;
    }

    const updatedEvent: ClubEvent = {
      id:
        data.id,

      clubId:
        data.club_id ??
        undefined,

      clubName:
        getClubName(
          data.club_id ??
            undefined
        ),

      title:
        data.title,

      description:
        data.description ??
        undefined,

      location:
        data.location ??
        undefined,

      startAt:
        data.start_at,

      endAt:
        data.end_at,
    };

    setEvents(
      (current) =>
        current.map(
          (event) =>
            event.id ===
            eventId
              ? updatedEvent
              : event
        )
    );

    setEditingEvent(
      null
    );

    return true;
  }

  async function handleDeleteEvent(
    eventId: string
  ) {
    const supabase =
      createClient();

    const { error } =
      await supabase
        .from("events")
        .delete()
        .eq(
          "id",
          eventId
        )
        .eq(
          "user_id",
          userId
        );

    if (error) {
      console.error(
        "Error deleting event:",
        error
      );

      return false;
    }

    setEvents(
      (current) =>
        current.filter(
          (event) =>
            event.id !==
            eventId
        )
    );

    setEditingEvent(
      null
    );

    return true;
  }

  return (
    <>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Events
          </h1>

          <p className="mt-2 text-zinc-400">
            Keep your club
            meetings, interviews,
            workshops, and events
            together.
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
            Add Event
          </span>
        </button>
      </header>

      <section className="mb-8 flex gap-8 border-b border-zinc-800 pb-5">
        <div>
          <p className="text-2xl font-semibold">
            {upcomingCount}
          </p>

          <p className="text-xs text-zinc-500">
            Upcoming
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            {pastCount}
          </p>

          <p className="text-xs text-zinc-500">
            Past
          </p>
        </div>
      </section>

      <div className="mb-6 flex gap-2">
        {(
          [
            "Upcoming",
            "Past",
            "All",
          ] as EventFilter[]
        ).map(
          (option) => (
            <button
              key={option}
              type="button"
              onClick={() =>
                setFilter(
                  option
                )
              }
              className={`rounded-xl px-4 py-2 text-sm transition ${
                filter ===
                option
                  ? "bg-white text-black"
                  : "bg-zinc-900 text-zinc-400 hover:text-white"
              }`}
            >
              {option}
            </button>
          )
        )}
      </div>

      {filteredEvents.length >
      0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredEvents.map(
            (event) => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={
                  setEditingEvent
                }
              />
            )
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="font-medium">
            No events here
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {filter ===
            "Upcoming"
              ? "Add your next club meeting, interview, or event."
              : "Nothing to show in this view yet."}
          </p>
        </section>
      )}

      <AddEventModal
        open={
          addModalOpen
        }
        clubs={clubs}
        onClose={() =>
          setAddModalOpen(
            false
          )
        }
        onAdd={
          handleAddEvent
        }
      />

      <EditEventModal
        event={
          editingEvent
        }
        open={
          editingEvent !==
          null
        }
        clubs={clubs}
        onClose={() =>
          setEditingEvent(
            null
          )
        }
        onSave={
          handleUpdateEvent
        }
        onDelete={
          handleDeleteEvent
        }
      />
    </>
  );
}