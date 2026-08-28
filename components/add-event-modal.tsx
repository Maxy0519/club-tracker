"use client";

import {
  FormEvent,
  useState,
} from "react";

import { X } from "lucide-react";

import { Club } from "@/types/club";
import { NewClubEvent } from "@/types/event";

type AddEventModalProps = {
  open: boolean;
  clubs: Club[];
  onClose: () => void;
  onAdd: (
    event: NewClubEvent
  ) => Promise<boolean>;
};

function dateToLocalInput(
  date: Date
) {
  const offset =
    date.getTimezoneOffset() *
    60_000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export default function AddEventModal({
  open,
  clubs,
  onClose,
  onAdd,
}: AddEventModalProps) {
  const [title, setTitle] =
    useState("");

  const [clubId, setClubId] =
    useState("");

  const [startAt, setStartAt] =
    useState("");

  const [endAt, setEndAt] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

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
    setStartAt("");
    setEndAt("");
    setLocation("");
    setDescription("");
    setErrorMessage("");
  }

  function handleClose() {
    if (saving) {
      return;
    }

    resetForm();
    onClose();
  }

  function handleStartChange(
    value: string
  ) {
    setStartAt(value);

    if (
      value &&
      !endAt
    ) {
      const end =
        new Date(value);

      end.setHours(
        end.getHours() + 1
      );

      setEndAt(
        dateToLocalInput(end)
      );
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedTitle =
      title.trim();

    if (
      !trimmedTitle ||
      !startAt ||
      !endAt
    ) {
      return;
    }

    const start =
      new Date(startAt);

    const end =
      new Date(endAt);

    if (
      end.getTime() <=
      start.getTime()
    ) {
      setErrorMessage(
        "End time must be after the start time."
      );

      return;
    }

    setSaving(true);
    setErrorMessage("");

    const newEvent: NewClubEvent = {
      title: trimmedTitle,

      clubId:
        clubId ||
        undefined,

      startAt:
        start.toISOString(),

      endAt:
        end.toISOString(),

      location:
        location.trim() ||
        undefined,

      description:
        description.trim() ||
        undefined,
    };

    const success =
      await onAdd(newEvent);

    setSaving(false);

    if (!success) {
      setErrorMessage(
        "Unable to add event. Please try again."
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
              Add Event
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a meeting,
              workshop, interview,
              or club event.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
            aria-label="Close"
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
              htmlFor="event-title"
              className="mb-2 block text-sm font-medium"
            >
              Event name *
            </label>

            <input
              id="event-title"
              required
              disabled={saving}
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value
                )
              }
              placeholder="General Interest Meeting"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="event-club"
              className="mb-2 block text-sm font-medium"
            >
              Club
            </label>

            <select
              id="event-club"
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

              {clubs.map(
                (club) => (
                  <option
                    key={club.id}
                    value={club.id}
                  >
                    {club.name}
                  </option>
                )
              )}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="event-start"
                className="mb-2 block text-sm font-medium"
              >
                Starts *
              </label>

              <input
                id="event-start"
                type="datetime-local"
                required
                disabled={saving}
                value={startAt}
                onChange={(event) =>
                  handleStartChange(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="event-end"
                className="mb-2 block text-sm font-medium"
              >
                Ends *
              </label>

              <input
                id="event-end"
                type="datetime-local"
                required
                disabled={saving}
                value={endAt}
                onChange={(event) =>
                  setEndAt(
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="event-location"
              className="mb-2 block text-sm font-medium"
            >
              Location
            </label>

            <input
              id="event-location"
              disabled={saving}
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              placeholder="NVC 14-220, Macaulay, Zoom..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="event-description"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="event-description"
              rows={4}
              disabled={saving}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="What do you need to know or bring?"
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
              onClick={handleClose}
              disabled={saving}
              className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:opacity-50"
            >
              {saving
                ? "Adding..."
                : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}