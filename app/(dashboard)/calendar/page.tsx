import { redirect } from "next/navigation";

import CalendarView from "@/components/calendar-view";

import { createClient } from "@/lib/supabase/server";

import {
  ClubEvent,
} from "@/types/event";

import {
  Task,
  TaskPriority,
} from "@/types/task";

export default async function CalendarPage() {
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
    tasksResult,
  ] = await Promise.all([
    supabase
      .from("clubs")
      .select(
        `
          id,
          name
        `
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

    supabase
      .from("tasks")
      .select(
        `
          id,
          club_id,
          title,
          description,
          due_at,
          priority,
          completed
        `
      )
      .not(
        "due_at",
        "is",
        null
      )
      .order(
        "due_at",
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

  if (
    tasksResult.error
  ) {
    console.error(
      "Error loading tasks:",
      tasksResult.error
    );
  }

  const clubNames =
    new Map(
      (
        clubsResult.data ??
        []
      ).map(
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

  const tasks: Task[] =
    (
      tasksResult.data ??
      []
    ).map(
      (task) => ({
        id:
          task.id,

        clubId:
          task.club_id ??
          undefined,

        clubName:
          task.club_id
            ? clubNames.get(
                task.club_id
              )
            : undefined,

        title:
          task.title,

        description:
          task.description ??
          undefined,

        dueAt:
          task.due_at ??
          undefined,

        priority:
          task.priority as TaskPriority,

        completed:
          task.completed,
      })
    );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-10 md:py-10">
      <CalendarView
        events={
          events
        }
        tasks={
          tasks
        }
        nowIso={
          nowIso
        }
      />
    </div>
  );
}