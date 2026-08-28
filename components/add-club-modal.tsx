"use client";

import { FormEvent, useState } from "react";
import { X } from "lucide-react";

import {
  Club,
  ClubOrganization,
  ClubStatus,
} from "@/types/club";

type AddClubModalProps = {
  open: boolean;
  onClose: () => void;
  onAdd: (club: Club) => void;
};

export default function AddClubModal({
  open,
  onClose,
  onAdd,
}: AddClubModalProps) {
  const [name, setName] = useState("");
  const [organization, setOrganization] =
    useState<ClubOrganization>("Baruch");
  const [category, setCategory] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] =
    useState<ClubStatus>("Interested");
  const [instagram, setInstagram] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  if (!open) {
    return null;
  }

  function resetForm() {
    setName("");
    setOrganization("Baruch");
    setCategory("");
    setRole("");
    setStatus("Interested");
    setInstagram("");
    setWebsite("");
    setDescription("");
    setNotes("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const newClub: Club = {
      id: crypto.randomUUID(),
      name: trimmedName,
      organization,
      status,
      category: category.trim() || undefined,
      role: role.trim() || undefined,
      instagram: instagram.trim() || undefined,
      website: website.trim() || undefined,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onAdd(newClub);
    resetForm();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-club-title"
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-5">
          <div>
            <h2
              id="add-club-title"
              className="text-xl font-semibold"
            >
              Add Club
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add a Baruch or Macaulay organization.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-6"
        >
          {/* Club name */}
          <div>
            <label
              htmlFor="club-name"
              className="mb-2 block text-sm font-medium"
            >
              Club name *
            </label>

            <input
              id="club-name"
              type="text"
              required
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="e.g. Accounting Society"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          {/* Organization + status */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="organization"
                className="mb-2 block text-sm font-medium"
              >
                Organization *
              </label>

              <select
                id="organization"
                value={organization}
                onChange={(event) =>
                  setOrganization(
                    event.target
                      .value as ClubOrganization
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
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
                htmlFor="status"
                className="mb-2 block text-sm font-medium"
              >
                Status *
              </label>

              <select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as ClubStatus
                  )
                }
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none"
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

          {/* Category + role */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-medium"
              >
                Category
              </label>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
                placeholder="Professional, cultural, social..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-medium"
              >
                Your role
              </label>

              <input
                id="role"
                type="text"
                value={role}
                onChange={(event) =>
                  setRole(event.target.value)
                }
                placeholder="e.g. Member, Analyst, E-Board"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
              />
            </div>
          </div>

          {/* Instagram */}
          <div>
            <label
              htmlFor="instagram"
              className="mb-2 block text-sm font-medium"
            >
              Instagram
            </label>

            <input
              id="instagram"
              type="text"
              value={instagram}
              onChange={(event) =>
                setInstagram(event.target.value)
              }
              placeholder="@clubhandle"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="mb-2 block text-sm font-medium"
            >
              Website
            </label>

            <input
              id="website"
              type="url"
              value={website}
              onChange={(event) =>
                setWebsite(event.target.value)
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              Description
            </label>

            <textarea
              id="description"
              rows={3}
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What does this club do?"
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          {/* Notes */}
          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-medium"
            >
              Notes
            </label>

            <textarea
              id="notes"
              rows={4}
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Application details, people to contact, reminders..."
              className="w-full resize-none rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm outline-none transition placeholder:text-zinc-600 focus:border-zinc-600"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 border-t border-zinc-800 pt-5">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-zinc-900 hover:text-white"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
            >
              Add Club
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}