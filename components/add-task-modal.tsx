"use client";

import {
  FormEvent,
  useState,
} from "react";

import { X } from "lucide-react";

import {
  NewTask,
  TaskPriority,
} from "@/types/task";

import { Club } from "@/types/club";

type AddTaskModalProps = {
  open: boolean;
  clubs: Club[];
  onClose: () => void;
  onAdd: (
    task: NewTask
  ) => Promise<boolean>;
};

export default function AddTaskModal({
  open,
  clubs,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] =
    useState("");

  const [clubId, setClubId] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [dueAt, setDueAt] =
    useState("");

  const [priority, setPriority] =
    useState<TaskPriority>("Medium");

  const [saving, setSaving] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  if (!open) {
    return null;
  }

  function resetForm() {
    setTitle("");
    setClubId("");
    setDescription("");
    setDueAt("");
    setPriority("Medium");
    setErrorMessage("");
  }

  function handleClose() {
    if (saving) {
      return;
    }

    resetForm();
    onClose();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (!trimmedTitle) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const newTask: NewTask = {
      title: trimmedTitle,
      clubId:
        clubId || undefined,
      description:
        description.trim() ||
        undefined,
      dueAt:
        dueAt
          ? new Date(
              dueAt
            ).toISOString()
          : undefined,
      priority,
    };

    const success =
      await onAdd(newTask);

    setSaving(false);

    if (!success) {
      setErrorMessage(
        "Unable to add task. Please try again."
      );

      return;
    }

    resetForm();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">
              Add Task
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Track an application,
              deadline, or club
              responsibility.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="task-title"
              className="mb-2 block text-sm font-medium"
            >
              Task *
            </label>

            <input
              id="task-title"
              required
              disabled={saving}
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="Submit club application"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="task-club"
              className="mb-2 block text-sm font-medium"
            >
              Club
            </label>

            <select
              id="task-club"
              disabled={saving}
              value={clubId}
              onChange={(event) =>
                setClubId(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none disabled:opacity-50"
            >
              <option value="">
                No specific club
              </option>

              {clubs.map((club) => (
                <option
                  key={club.id}
                  value={club.id}
                >
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-due"
              className="mb-2 block text-sm font-medium"
            >
              Deadline
            </label>

            <input
              id="task-due"
              type="datetime-local"
              disabled={saving}
              value={dueAt}
              onChange={(event) =>
                setDueAt(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="task-priority"
              className="mb-2 block text-sm font-medium"
            >
              Priority
            </label>

            <select
              id="task-priority"
              disabled={saving}
              value={priority}
              onChange={(event) =>
                setPriority(
                  event.target
                    .value as TaskPriority
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none disabled:opacity-50"
            >
              <option value="Low">
                Low
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="High">
                High
              </option>
            </select>
          </div>

          <div>
            <label
              htmlFor="task-description"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="task-description"
              rows={4}
              disabled={saving}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="Application requirements, interview prep, reminders..."
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-zinc-400">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              disabled={saving}
              onClick={handleClose}
              className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving
                ? "Adding..."
                : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}