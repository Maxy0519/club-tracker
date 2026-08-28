"use client";

import {
  useMemo,
  useState,
} from "react";

import { Plus } from "lucide-react";

import AddTaskModal from "@/components/add-task-modal";
import TaskCard from "@/components/task-card";

import { createClient } from "@/lib/supabase/client";

import { Club } from "@/types/club";

import {
  NewTask,
  Task,
  TaskPriority,
} from "@/types/task";

type TasksViewProps = {
  initialTasks: Task[];
  clubs: Club[];
  userId: string;
};

type TaskFilter =
  | "Open"
  | "Completed"
  | "All";

export default function TasksView({
  initialTasks,
  clubs,
  userId,
}: TasksViewProps) {
  const [tasks, setTasks] =
    useState<Task[]>(
      initialTasks
    );

  const [filter, setFilter] =
    useState<TaskFilter>(
      "Open"
    );

  const [
    addModalOpen,
    setAddModalOpen,
  ] = useState(false);

  const openCount =
    tasks.filter(
      (task) =>
        !task.completed
    ).length;

  const completedCount =
    tasks.filter(
      (task) =>
        task.completed
    ).length;

  const filteredTasks =
    useMemo(() => {
      const filtered =
        tasks.filter(
          (task) => {
            if (
              filter === "Open"
            ) {
              return !task.completed;
            }

            if (
              filter ===
              "Completed"
            ) {
              return task.completed;
            }

            return true;
          }
        );

      return [...filtered].sort(
        (a, b) => {
          if (
            a.completed !==
            b.completed
          ) {
            return a.completed
              ? 1
              : -1;
          }

          if (
            a.dueAt &&
            b.dueAt
          ) {
            return (
              new Date(
                a.dueAt
              ).getTime() -
              new Date(
                b.dueAt
              ).getTime()
            );
          }

          if (a.dueAt) {
            return -1;
          }

          if (b.dueAt) {
            return 1;
          }

          return 0;
        }
      );
    }, [tasks, filter]);

  async function handleAddTask(
    newTask: NewTask
  ) {
    const supabase =
      createClient();

    const {
      data,
      error,
    } = await supabase
      .from("tasks")
      .insert({
        user_id: userId,
        club_id:
          newTask.clubId ??
          null,
        title: newTask.title,
        description:
          newTask.description ??
          null,
        due_at:
          newTask.dueAt ??
          null,
        priority:
          newTask.priority,
      })
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
      .single();

    if (error) {
      console.error(
        "Error adding task:",
        error
      );

      return false;
    }

    const club =
      clubs.find(
        (club) =>
          club.id ===
          data.club_id
      );

    const createdTask: Task = {
      id: data.id,
      clubId:
        data.club_id ??
        undefined,
      clubName:
        club?.name,
      title: data.title,
      description:
        data.description ??
        undefined,
      dueAt:
        data.due_at ??
        undefined,
      priority:
        data.priority as TaskPriority,
      completed:
        data.completed,
    };

    setTasks(
      (current) => [
        ...current,
        createdTask,
      ]
    );

    return true;
  }

  async function handleToggleTask(
    task: Task
  ) {
    const supabase =
      createClient();

    const nextCompleted =
      !task.completed;

    const { error } =
      await supabase
        .from("tasks")
        .update({
          completed:
            nextCompleted,
        })
        .eq("id", task.id)
        .eq(
          "user_id",
          userId
        );

    if (error) {
      console.error(
        "Error updating task:",
        error
      );

      return;
    }

    setTasks(
      (current) =>
        current.map(
          (item) =>
            item.id ===
            task.id
              ? {
                  ...item,
                  completed:
                    nextCompleted,
                }
              : item
        )
    );
  }

  async function handleDeleteTask(
    task: Task
  ) {
    const confirmed =
      window.confirm(
        `Delete "${task.title}"?`
      );

    if (!confirmed) {
      return;
    }

    const supabase =
      createClient();

    const { error } =
      await supabase
        .from("tasks")
        .delete()
        .eq("id", task.id)
        .eq(
          "user_id",
          userId
        );

    if (error) {
      console.error(
        "Error deleting task:",
        error
      );

      return;
    }

    setTasks(
      (current) =>
        current.filter(
          (item) =>
            item.id !==
            task.id
        )
    );
  }

  return (
    <>
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Tasks
          </h1>

          <p className="mt-2 text-zinc-400">
            Track applications,
            deadlines, and club
            responsibilities.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setAddModalOpen(
              true
            )
          }
          className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black hover:bg-zinc-200"
        >
          <Plus size={17} />

          <span className="hidden sm:inline">
            Add Task
          </span>
        </button>
      </header>

      <section className="mb-8 flex gap-8 border-b border-zinc-800 pb-5">
        <div>
          <p className="text-2xl font-semibold">
            {openCount}
          </p>

          <p className="text-xs text-zinc-500">
            Open
          </p>
        </div>

        <div>
          <p className="text-2xl font-semibold">
            {completedCount}
          </p>

          <p className="text-xs text-zinc-500">
            Completed
          </p>
        </div>
      </section>

      <div className="mb-6 flex gap-2">
        {(
          [
            "Open",
            "Completed",
            "All",
          ] as TaskFilter[]
        ).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              setFilter(option)
            }
            className={`rounded-xl px-4 py-2 text-sm transition ${
              filter === option
                ? "bg-white text-black"
                : "bg-zinc-900 text-zinc-400 hover:text-white"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {filteredTasks.length >
      0 ? (
        <section className="grid gap-4 xl:grid-cols-2">
          {filteredTasks.map(
            (task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={
                  handleToggleTask
                }
                onDelete={
                  handleDeleteTask
                }
              />
            )
          )}
        </section>
      ) : (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center">
          <p className="font-medium">
            No tasks here
          </p>

          <p className="mt-2 text-sm text-zinc-500">
            {filter === "Open"
              ? "Add an application deadline or club task to get started."
              : "Nothing to show in this view yet."}
          </p>
        </section>
      )}

      <AddTaskModal
        open={addModalOpen}
        clubs={clubs}
        onClose={() =>
          setAddModalOpen(
            false
          )
        }
        onAdd={
          handleAddTask
        }
      />
    </>
  );
}