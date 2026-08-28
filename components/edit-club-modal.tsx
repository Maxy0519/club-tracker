"use client";

import {
  FormEvent,
  useState,
} from "react";

import {
  Trash2,
  X,
} from "lucide-react";

import {
  Club,
  ClubOrganization,
  ClubStatus,
  NewClub,
} from "@/types/club";

type EditClubModalProps = {
  club: Club | null;
  open: boolean;
  onClose: () => void;
  onSave: (
    clubId: string,
    updates: NewClub
  ) => Promise<boolean>;
  onDelete: (
    clubId: string
  ) => Promise<boolean>;
};

type EditClubFormProps = {
  club: Club;
  onClose: () => void;
  onSave: (
    clubId: string,
    updates: NewClub
  ) => Promise<boolean>;
  onDelete: (
    clubId: string
  ) => Promise<boolean>;
};

export default function EditClubModal({
  club,
  open,
  onClose,
  onSave,
  onDelete,
}: EditClubModalProps) {
  if (!open || !club) {
    return null;
  }

  return (
    <EditClubForm
      key={club.id}
      club={club}
      onClose={onClose}
      onSave={onSave}
      onDelete={onDelete}
    />
  );
}

function EditClubForm({
  club,
  onClose,
  onSave,
  onDelete,
}: EditClubFormProps) {
  const [name, setName] =
    useState(club.name);

  const [
    organization,
    setOrganization,
  ] =
    useState<ClubOrganization>(
      club.organization
    );

  const [status, setStatus] =
    useState<ClubStatus>(
      club.status
    );

  const [category, setCategory] =
    useState(
      club.category ?? ""
    );

  const [role, setRole] =
    useState(
      club.role ?? ""
    );

  const [instagram, setInstagram] =
    useState(
      club.instagram ?? ""
    );

  const [website, setWebsite] =
    useState(
      club.website ?? ""
    );

  const [
    description,
    setDescription,
  ] =
    useState(
      club.description ?? ""
    );

  const [notes, setNotes] =
    useState(
      club.notes ?? ""
    );

  const [saving, setSaving] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState("");

  const busy =
    saving || deleting;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName =
      name.trim();

    if (!trimmedName) {
      return;
    }

    setSaving(true);
    setErrorMessage("");

    const updates: NewClub = {
      name: trimmedName,
      organization,
      status,
      category:
        category.trim() ||
        undefined,
      role:
        role.trim() ||
        undefined,
      instagram:
        instagram.trim() ||
        undefined,
      website:
        website.trim() ||
        undefined,
      description:
        description.trim() ||
        undefined,
      notes:
        notes.trim() ||
        undefined,
    };

    const success =
      await onSave(
        club.id,
        updates
      );

    setSaving(false);

    if (!success) {
      setErrorMessage(
        "Unable to save changes. Please try again."
      );

      return;
    }

    onClose();
  }

  async function handleDelete() {
    const confirmed =
      window.confirm(
        `Delete "${club.name}"? This cannot be undone.`
      );

    if (!confirmed) {
      return;
    }

    setDeleting(true);
    setErrorMessage("");

    const success =
      await onDelete(
        club.id
      );

    setDeleting(false);

    if (!success) {
      setErrorMessage(
        "Unable to delete this club. Please try again."
      );

      return;
    }

    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !busy
        ) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-club-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2
              id="edit-club-title"
              className="text-xl font-semibold"
            >
              Edit Club
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Update your application
              or membership details.
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onClose}
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
          {/* Name */}
          <div>
            <label
              htmlFor="edit-name"
              className="mb-2 block text-sm font-medium"
            >
              Club name *
            </label>

            <input
              id="edit-name"
              required
              disabled={busy}
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {/* Organization + Status */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-organization"
                className="mb-2 block text-sm font-medium"
              >
                Organization
              </label>

              <select
                id="edit-organization"
                disabled={busy}
                value={
                  organization
                }
                onChange={(
                  event
                ) =>
                  setOrganization(
                    event.target
                      .value as ClubOrganization
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none disabled:opacity-50"
              >
                <option value="Baruch">
                  Baruch
                </option>

                <option value="Macaulay">
                  Macaulay
                </option>
              </select>
            </div>

            <div>
              <label
                htmlFor="edit-status"
                className="mb-2 block text-sm font-medium"
              >
                Status
              </label>

              <select
                id="edit-status"
                disabled={busy}
                value={status}
                onChange={(
                  event
                ) =>
                  setStatus(
                    event.target
                      .value as ClubStatus
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none disabled:opacity-50"
              >
                <option value="Interested">
                  Interested
                </option>

                <option value="Applying">
                  Applying
                </option>

                <option value="Applied">
                  Applied
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>
              </select>
            </div>
          </div>

          {/* Category + Role */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <input
                id="edit-category"
                disabled={busy}
                value={category}
                onChange={(event) =>
                  setCategory(
                    event.target.value
                  )
                }
                placeholder="Professional, cultural, social..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
              />
            </div>

            <div>
              <label
                htmlFor="edit-role"
                className="mb-2 block text-sm font-medium"
              >
                Your role
              </label>

              <input
                id="edit-role"
                disabled={busy}
                value={role}
                onChange={(event) =>
                  setRole(
                    event.target.value
                  )
                }
                placeholder="Member, Analyst, E-Board..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label
              htmlFor="edit-instagram"
              className="mb-2 block text-sm font-medium"
            >
              Instagram
            </label>

            <input
              id="edit-instagram"
              disabled={busy}
              value={instagram}
              onChange={(event) =>
                setInstagram(
                  event.target.value
                )
              }
              placeholder="@clubhandle"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="edit-website"
              className="mb-2 block text-sm font-medium"
            >
              Website
            </label>

            <input
              id="edit-website"
              type="url"
              disabled={busy}
              value={website}
              onChange={(event) =>
                setWebsite(
                  event.target.value
                )
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="edit-description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="edit-description"
              rows={3}
              disabled={busy}
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              placeholder="What does this club do?"
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="edit-notes"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="edit-notes"
              rows={5}
              disabled={busy}
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              placeholder="Application deadlines, interview notes, contacts, reminders..."
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition focus:border-zinc-600 disabled:opacity-50"
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3">
              <p className="text-sm text-zinc-400">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 border-t border-zinc-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              disabled={busy}
              onClick={
                handleDelete
              }
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm text-zinc-500 transition hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2
                size={16}
              />

              {deleting
                ? "Deleting..."
                : "Delete Club"}
            </button>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                disabled={busy}
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-sm text-zinc-400 transition hover:bg-zinc-900 hover:text-white disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={busy}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50"
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