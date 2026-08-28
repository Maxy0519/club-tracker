"use client";

import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
} from "lucide-react";

import Link from "next/link";

import {
  useMemo,
  useState,
} from "react";

import { ClubEvent } from "@/types/event";
import { Task } from "@/types/task";

type CalendarViewProps = {
  events: ClubEvent[];
  tasks: Task[];
  nowIso: string;
};

type CalendarItem = {
  id: string;
  type: "event" | "task";
  title: string;
  clubName?: string;
  date: string;
  completed?: boolean;
};

const WEEKDAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

function getDateKey(
  value: Date
) {
  const year =
    value.getFullYear();

  const month =
    String(
      value.getMonth() + 1
    ).padStart(2, "0");

  const day =
    String(
      value.getDate()
    ).padStart(2, "0");

  return `${year}-${month}-${day}`;
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

export default function CalendarView({
  events,
  tasks,
  nowIso,
}: CalendarViewProps) {
  const initialDate =
    new Date(nowIso);

  const [year, setYear] =
    useState(
      initialDate.getFullYear()
    );

  const [month, setMonth] =
    useState(
      initialDate.getMonth()
    );

  const todayKey =
    getDateKey(initialDate);

  const calendarItems =
    useMemo(() => {
      const eventItems: CalendarItem[] =
        events.map(
          (event) => ({
            id:
              event.id,
            type:
              "event",
            title:
              event.title,
            clubName:
              event.clubName,
            date:
              event.startAt,
          })
        );

      const taskItems: CalendarItem[] =
        tasks
          .filter(
            (task) =>
              task.dueAt
          )
          .map(
            (task) => ({
              id:
                task.id,
              type:
                "task",
              title:
                task.title,
              clubName:
                task.clubName,
              date:
                task.dueAt!,
              completed:
                task.completed,
            })
          );

      return [
        ...eventItems,
        ...taskItems,
      ];
    }, [
      events,
      tasks,
    ]);

  const itemsByDate =
    useMemo(() => {
      const map =
        new Map<
          string,
          CalendarItem[]
        >();

      for (
        const item
        of calendarItems
      ) {
        const key =
          getDateKey(
            new Date(
              item.date
            )
          );

        const existing =
          map.get(key) ??
          [];

        existing.push(
          item
        );

        map.set(
          key,
          existing
        );
      }

      for (
        const items
        of map.values()
      ) {
        items.sort(
          (a, b) =>
            new Date(
              a.date
            ).getTime() -
            new Date(
              b.date
            ).getTime()
        );
      }

      return map;
    }, [
      calendarItems,
    ]);

  const days =
    useMemo(() => {
      const firstDay =
        new Date(
          year,
          month,
          1
        );

      const lastDay =
        new Date(
          year,
          month + 1,
          0
        );

      const startOffset =
        firstDay.getDay();

      const totalDays =
        lastDay.getDate();

      const cells: Date[] =
        [];

      for (
        let index =
          startOffset - 1;
        index >= 0;
        index--
      ) {
        cells.push(
          new Date(
            year,
            month,
            -index
          )
        );
      }

      for (
        let day = 1;
        day <= totalDays;
        day++
      ) {
        cells.push(
          new Date(
            year,
            month,
            day
          )
        );
      }

      let nextDay = 1;

      while (
        cells.length %
          7 !==
        0
      ) {
        cells.push(
          new Date(
            year,
            month + 1,
            nextDay
          )
        );

        nextDay++;
      }

      return cells;
    }, [
      year,
      month,
    ]);

  const monthLabel =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    ).format(
      new Date(
        year,
        month,
        1
      )
    );

  function goToPreviousMonth() {
    if (
      month === 0
    ) {
      setMonth(11);
      setYear(
        (current) =>
          current - 1
      );

      return;
    }

    setMonth(
      (current) =>
        current - 1
    );
  }

  function goToNextMonth() {
    if (
      month === 11
    ) {
      setMonth(0);
      setYear(
        (current) =>
          current + 1
      );

      return;
    }

    setMonth(
      (current) =>
        current + 1
    );
  }

  function goToToday() {
    setYear(
      initialDate.getFullYear()
    );

    setMonth(
      initialDate.getMonth()
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Calendar
        </h1>

        <p className="mt-2 text-zinc-400">
          See your club events
          and application
          deadlines together.
        </p>
      </header>

      {/* Calendar controls */}
      <section className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            {monthLabel}
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Events and task
            deadlines
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={
              goToToday
            }
            className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700 hover:text-white"
          >
            Today
          </button>

          <button
            type="button"
            onClick={
              goToPreviousMonth
            }
            aria-label="Previous month"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
          >
            <ChevronLeft
              size={18}
            />
          </button>

          <button
            type="button"
            onClick={
              goToNextMonth
            }
            aria-label="Next month"
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-2.5 text-zinc-400 transition hover:border-zinc-700 hover:text-white"
          >
            <ChevronRight
              size={18}
            />
          </button>
        </div>
      </section>

      {/* Legend */}
      <section className="mb-4 flex flex-wrap gap-4 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <Clock
            size={14}
          />

          Event
        </div>

        <div className="flex items-center gap-2">
          <CircleCheck
            size={14}
          />

          Task deadline
        </div>
      </section>

      {/* Calendar */}
      <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
        {/* Weekday headings */}
        <div className="grid grid-cols-7 border-b border-zinc-800">
          {WEEKDAYS.map(
            (weekday) => (
              <div
                key={
                  weekday
                }
                className="px-1 py-3 text-center text-[11px] font-medium text-zinc-500 sm:text-xs"
              >
                {weekday}
              </div>
            )
          )}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map(
            (
              date,
              index
            ) => {
              const dateKey =
                getDateKey(
                  date
                );

              const items =
                itemsByDate.get(
                  dateKey
                ) ?? [];

              const isCurrentMonth =
                date.getMonth() ===
                month;

              const isToday =
                dateKey ===
                todayKey;

              const visibleItems =
                items.slice(
                  0,
                  3
                );

              const remaining =
                items.length -
                visibleItems.length;

              return (
                <div
                  key={`${dateKey}-${index}`}
                  className={`min-h-24 border-b border-r border-zinc-800 p-1.5 sm:min-h-32 sm:p-2 ${
                    !isCurrentMonth
                      ? "bg-zinc-950/50"
                      : ""
                  }`}
                >
                  <div className="mb-2 flex justify-end">
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                        isToday
                          ? "bg-white font-semibold text-black"
                          : isCurrentMonth
                            ? "text-zinc-300"
                            : "text-zinc-700"
                      }`}
                    >
                      {
                        date.getDate()
                      }
                    </span>
                  </div>

                  <div className="space-y-1">
                    {visibleItems.map(
                      (
                        item
                      ) => {
                        const href =
                          item.type ===
                          "event"
                            ? "/events"
                            : "/tasks";

                        return (
                          <Link
                            key={`${item.type}-${item.id}`}
                            href={
                              href
                            }
                            className={`block truncate rounded-md px-1.5 py-1 text-[9px] transition sm:text-[11px] ${
                              item.type ===
                              "event"
                                ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                                : item.completed
                                  ? "bg-zinc-950 text-zinc-600 line-through"
                                  : "border border-zinc-700 bg-zinc-950 text-zinc-300 hover:border-zinc-600"
                            }`}
                            title={
                              item.title
                            }
                          >
                            <span className="hidden sm:inline">
                              {formatTime(
                                item.date
                              )}
                              {" "}
                            </span>

                            {
                              item.title
                            }
                          </Link>
                        );
                      }
                    )}

                    {remaining >
                      0 && (
                      <p className="px-1 text-[9px] text-zinc-600 sm:text-[11px]">
                        +
                        {
                          remaining
                        }{" "}
                        more
                      </p>
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </section>

      {/* Mobile hint */}
      <p className="mt-4 text-xs text-zinc-600 sm:hidden">
        Tap an item to open
        its Events or Tasks
        page.
      </p>
    </div>
  );
}