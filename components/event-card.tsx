"use client";

import {
  CalendarPlus,
  Clock,
  MapPin,
  Pencil,
} from "lucide-react";

import { ClubEvent } from "@/types/event";

type EventCardProps = {
  event: ClubEvent;
  onEdit: (
    event: ClubEvent
  ) => void;
};

function formatGoogleDate(
  value: string
) {
  return new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}/, "");
}

function getGoogleCalendarUrl(
  event: ClubEvent
) {
  const params =
    new URLSearchParams({
      action: "TEMPLATE",

      text:
        event.title,

      dates:
        `${formatGoogleDate(
          event.startAt
        )}/${formatGoogleDate(
          event.endAt
        )}`,
    });

  if (event.description) {
    params.set(
      "details",
      event.description
    );
  }

  if (event.location) {
    params.set(
      "location",
      event.location
    );
  }

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday: "short",
      month: "short",
      day: "numeric",
    }
  ).format(
    new Date(value)
  );
}

function formatTime(
  value: string
) {
  return new Intl.DateTimeFormat(
    undefined,
    {
      hour: "numeric",
      minute: "2-digit",
    }
  ).format(
    new Date(value)
  );
}

export default function EventCard({
  event,
  onEdit,
}: EventCardProps) {
  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition hover:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          {event.clubName && (
            <p className="text-xs font-medium text-zinc-500">
              {event.clubName}
            </p>
          )}

          <h2 className="mt-1 text-lg font-semibold">
            {event.title}
          </h2>
        </div>

        <button
          type="button"
          onClick={() =>
            onEdit(event)
          }
          className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Edit event"
        >
          <Pencil size={16} />
        </button>
      </div>

      <div className="mt-5 space-y-2 text-sm text-zinc-400">
        <div className="flex items-center gap-2">
          <Clock size={15} />

          <span>
            {formatDate(
              event.startAt
            )}
            {" · "}
            {formatTime(
              event.startAt
            )}
            {" – "}
            {formatTime(
              event.endAt
            )}
          </span>
        </div>

        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin size={15} />

            <span>
              {event.location}
            </span>
          </div>
        )}
      </div>

      {event.description && (
        <p className="mt-4 text-sm leading-6 text-zinc-400">
          {event.description}
        </p>
      )}

      <div className="mt-5 border-t border-zinc-800 pt-4">
        <a
          href={getGoogleCalendarUrl(
            event
          )}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
        >
          <CalendarPlus size={15} />

          Add to Google Calendar
        </a>
      </div>
    </article>
  );
}