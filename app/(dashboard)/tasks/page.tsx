import { redirect } from "next/navigation";

import TasksView from "@/components/tasks-view";

import { createClient } from "@/lib/supabase/server";

import {
  Club,
  ClubOrganization,
  ClubStatus,
} from "@/types/club";

import {
  Task,
  TaskPriority,
} from "@/types/task";

export default async function TasksPage() {
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

  const [
    clubsResult,
    tasksResult,
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
      .order(
        "created_at",
        {
          ascending: false,
        }
      ),
  ]);

  if (clubsResult.error) {
    console.error(
      "Error loading clubs:",
      clubsResult.error
    );
  }

  if (tasksResult.error) {
    console.error(
      "Error loading tasks:",
      tasksResult.error
    );
  }

  const clubs: Club[] =
    (
      clubsResult.data ??
      []
    ).map((club) => ({
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
    }));

  const clubNames =
    new Map(
      clubs.map(
        (club) => [
          club.id,
          club.name,
        ]
      )
    );

  const tasks: Task[] =
    (
      tasksResult.data ??
      []
    ).map((task) => ({
      id: task.id,

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
    }));

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <TasksView
        initialTasks={tasks}
        clubs={clubs}
        userId={userId}
      />
    </div>
  );
}