"use client";

import {
  CalendarClock,
  Check,
  Trash2,
} from "lucide-react";

import { Task } from "@/types/task";

type TaskCardProps = {
  task: Task;

  onToggle: (
    task: Task
  ) => Promise<void>;

  onDelete: (
    task: Task
  ) => Promise<void>;
};

function formatDueDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

export default function TaskCard({
  task,
  onToggle,
  onDelete,
}: TaskCardProps) {
  const overdue =
    !task.completed &&
    task.dueAt &&
    new Date(task.dueAt) <
      new Date();

  return (
    <article
      className={`rounded-2xl border p-5 ${
        task.completed
          ? "border-zinc-900 bg-zinc-950 opacity-60"
          : "border-zinc-800 bg-zinc-900"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() =>
            onToggle(task)
          }
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition ${
            task.completed
              ? "border-white bg-white text-black"
              : "border-zinc-700 hover:border-zinc-500"
          }`}
        >
          {task.completed && (
            <Check size={15} />
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2
                className={`font-semibold ${
                  task.completed
                    ? "line-through"
                    : ""
                }`}
              >
                {task.title}
              </h2>

              {task.clubName && (
                <p className="mt-1 text-xs text-zinc-500">
                  {task.clubName}
                </p>
              )}
            </div>

            <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
              {task.priority}
            </span>
          </div>

          {task.description && (
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between gap-3">
            <div>
              {task.dueAt && (
                <div
                  className={`flex items-center gap-2 text-xs ${
                    overdue
                      ? "font-medium text-white"
                      : "text-zinc-500"
                  }`}
                >
                  <CalendarClock
                    size={14}
                  />

                  {overdue
                    ? "Overdue · "
                    : ""}

                  {formatDueDate(
                    task.dueAt
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                onDelete(task)
              }
              className="rounded-lg p-2 text-zinc-600 transition hover:bg-zinc-800 hover:text-white"
              aria-label="Delete task"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}