"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Trash2,
  X,
} from "lucide-react";

import { Club } from "@/types/club";

import {
  ClubEvent,
  NewClubEvent,
} from "@/types/event";

type EditEventModalProps = {
  event: ClubEvent | null;
  open: boolean;
  clubs: Club[];

  onClose: () => void;

  onSave: (
    eventId: string,
    updates: NewClubEvent
  ) => Promise<boolean>;

  onDelete: (
    eventId: string
  ) => Promise<boolean>;
};

type EditEventFormProps = {
  event: ClubEvent;
  clubs: Club[];

  onClose: () => void;

  onSave: (
    eventId: string,
    updates: NewClubEvent
  ) => Promise<boolean>;

  onDelete: (
    eventId: string
  ) => Promise<boolean>;
};

function toLocalInputValue(
  value: string
) {
  const date =
    new Date(value);

  const offset =
    date.getTimezoneOffset() *
    60_000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export default function EditEventModal({
  event,
  open,
  clubs,
  onClose,
  onSave,
  onDelete,
}: EditEventModalProps) {
  if (
    !open ||
    !event
  ) {
    return null;
  }

  return (
    <EditEventForm
      key={event.id}
      event={event}
      clubs={clubs}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}

function EditEventForm({
  event,
  clubs,
  onClose,
  onSave,
  onDelete,
}: EditEventFormProps) {
  const [title, setTitle] =
    useState(event.title);

  const [clubId, setClubId] =
    useState(
      event.clubId ?? ""
    );

  const [startAt, setStartAt] =
    useState(
      toLocalInputValue(
        event.startAt
      )
    );

  const [endAt, setEndAt] =
    useState(
      toLocalInputValue(
        event.endAt
      )
    );

  const [location, setLocation] =
    useState(
      event.location ?? ""
    );

  const [
    description,
    setDescription,
  ] = useState(
    event.description ?? ""
  );

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const busy =
    saving || deleting;

  async function handleSubmit(
    formEvent: FormEvent<HTMLFormElement>
  ) {
    formEvent.preventDefault();

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

    const updates: NewClubEvent = {
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
      await onSave(
        event.id,
        updates
      );

    setSaving(false);

    if (!success) {
      setErrorMessage(
        "Unable to save changes."
      );

      return;
    }

    onClose();
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${event.title}"?`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");

    const success =
      await onDelete(
        event.id
      );

    setDeleting(false);

    if (!success) {
      setErrorMessage(
        "Unable to delete event."
      );

      return;
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(mouseEvent) => {
        if (
          mouseEvent.target ===
            mouseEvent.currentTarget &&
          !busy
        ) {
          onClose();
        }
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2 className="text-xl font-semibold">
              Edit Event
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your event
              details.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
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
              htmlFor="edit-event-title"
              className="mb-2 block text-sm font-medium"
            >
              Event name *
            </label>

            <input
              id="edit-event-title"
              required
              disabled={busy}
              value={title}
              onChange={(changeEvent) =>
                setTitle(
                  changeEvent.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-event-club"
              className="mb-2 block text-sm font-medium"
            >
              Club
            </label>

            <select
              id="edit-event-club"
              disabled={busy}
              value={clubId}
              onChange={(changeEvent) =>
                setClubId(
                  changeEvent.target.value
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
                htmlFor="edit-event-start"
                className="mb-2 block text-sm font-medium"
              >
                Starts *
              </label>

              <input
                id="edit-event-start"
                type="datetime-local"
                required
                disabled={busy}
                value={startAt}
                onChange={(changeEvent) =>
                  setStartAt(
                    changeEvent.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="edit-event-end"
                className="mb-2 block text-sm font-medium"
              >
                Ends *
              </label>

              <input
                id="edit-event-end"
                type="datetime-local"
                required
                disabled={busy}
                value={endAt}
                onChange={(changeEvent) =>
                  setEndAt(
                    changeEvent.target.value
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="edit-event-location"
              className="mb-2 block text-sm font-medium"
            >
              Location
            </label>

            <input
              id="edit-event-location"
              disabled={busy}
              value={location}
              onChange={(changeEvent) =>
                setLocation(
                  changeEvent.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="edit-event-description"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="edit-event-description"
              rows={4}
              disabled={busy}
              value={description}
              onChange={(changeEvent) =>
                setDescription(
                  changeEvent.target.value
                )
              }
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-zinc-400">
              {errorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={busy}
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
            >
              <Trash2 size={16} />

              {deleting
                ? "Deleting..."
                : "Delete Event"}
            </button>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 hover:bg-zinc-900 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black hover:bg-zinc-200 disabled:opacity-50"
              >
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}