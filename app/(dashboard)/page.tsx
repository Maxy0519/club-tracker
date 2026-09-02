import Link from "next/link";

import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
} from "lucide-react";

import { redirect } from "next/navigation";

import LocalDateTime from "@/components/local-date-time";

import { formatTaskDeadline } from "@/lib/date-time";
import { createClient } from "@/lib/supabase/server";

const APP_TIME_ZONE =
  "America/New_York";

export default async function DashboardPage() {
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

  const now =
    new Date();

  const nowIso =
    now.toISOString();

  const [
    clubsResult,
    tasksResult,
    eventsResult,
  ] = await Promise.all([
    supabase
      .from("clubs")
      .select(
        `
          id,
          name,
          organization,
          status
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
          due_at,
          priority,
          completed
        `
      )
      .eq(
        "completed",
        false
      )
      .order(
        "due_at",
        {
          ascending: true,
          nullsFirst: false,
        }
      ),

    supabase
      .from("events")
      .select(
        `
          id,
          club_id,
          title,
          location,
          start_at,
          end_at
        `
      )
      .gte(
        "end_at",
        nowIso
      )
      .order(
        "start_at",
        {
          ascending: true,
        }
      ),
  ]);

  if (
    clubsResult.error
  ) {
    console.error(
      "Error loading clubs:",
      clubsResult.error
    );
  }

  if (
    tasksResult.error
  ) {
    console.error(
      "Error loading tasks:",
      tasksResult.error
    );
  }

  if (
    eventsResult.error
  ) {
    console.error(
      "Error loading events:",
      eventsResult.error
    );
  }

  const clubs =
    clubsResult.data ??
    [];

  const tasks =
    tasksResult.data ??
    [];

  const events =
    eventsResult.data ??
    [];

  const activeClubs =
    clubs.filter(
      (club) =>
        club.status ===
        "Active"
    ).length;

  const applyingClubs =
    clubs.filter(
      (club) =>
        club.status ===
          "Applying" ||
        club.status ===
          "Applied"
    ).length;

  const clubNames =
    new Map(
      clubs.map(
        (club) => [
          club.id,
          club.name,
        ]
      )
    );

  const upcomingEvents =
    events.slice(0, 4);

  const openTasks =
    tasks.slice(0, 5);

  /*
   * Header date is still formatted
   * server-side, but explicitly in
   * New York time.
   */
  const dateLabel =
    new Intl.DateTimeFormat(
      "en-US",
      {
        weekday:
          "long",
        month:
          "long",
        day:
          "numeric",
        timeZone:
          APP_TIME_ZONE,
      }
    ).format(now);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <header className="mb-10">
        <p className="mb-2 text-sm text-zinc-500">
          {dateLabel}
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Your Baruch and
          Macaulay
          extracurricular hub.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Tracked Clubs
            </p>

            <Users
              size={18}
              className="text-zinc-600"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold">
            {
              clubs.length
            }
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Active Clubs
            </p>

            <CheckCircle2
              size={18}
              className="text-zinc-600"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold">
            {
              activeClubs
            }
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Applications
            </p>

            <Clock
              size={18}
              className="text-zinc-600"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold">
            {
              applyingClubs
            }
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-zinc-400">
              Open Tasks
            </p>

            <CalendarDays
              size={18}
              className="text-zinc-600"
            />
          </div>

          <p className="mt-3 text-3xl font-semibold">
            {
              tasks.length
            }
          </p>
        </div>
      </section>

      {/* Main dashboard */}
      <section className="mt-10 grid gap-8 xl:grid-cols-[1.35fr_1fr]">
        {/* Upcoming Events */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Upcoming
                Events
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                What&apos;s
                coming up next.
              </p>
            </div>

            <Link
              href="/events"
              className="flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
            >
              View all

              <ArrowRight
                size={15}
              />
            </Link>
          </div>

          {upcomingEvents.length >
          0 ? (
            <div className="space-y-3">
              {upcomingEvents.map(
                (event) => {
                  const clubName =
                    event.club_id
                      ? clubNames.get(
                          event.club_id
                        )
                      : undefined;

                  return (
                    <div
                      key={
                        event.id
                      }
                      className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
                    >
                      {clubName && (
                        <p className="text-xs text-zinc-500">
                          {
                            clubName
                          }
                        </p>
                      )}

                      <h3 className="mt-1 font-semibold">
                        {
                          event.title
                        }
                      </h3>

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-zinc-400">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={
                              14
                            }
                          />

                          <LocalDateTime
                            value={
                              event.start_at
                            }
                            variant="event"
                          />
                        </div>

                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin
                              size={
                                14
                              }
                            />

                            {
                              event.location
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="font-medium">
                Nothing
                scheduled
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                Add your next
                club meeting
                or event.
              </p>

              <Link
                href="/events"
                className="mt-4 inline-block rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
              >
                Add Event
              </Link>
            </div>
          )}
        </div>

        {/* Open Tasks */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Open Tasks
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Deadlines that
                need your
                attention.
              </p>
            </div>

            <Link
              href="/tasks"
              className="flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
            >
              View all

              <ArrowRight
                size={15}
              />
            </Link>
          </div>

          {openTasks.length >
          0 ? (
            <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
              {openTasks.map(
                (
                  task,
                  index
                ) => {
                  const clubName =
                    task.club_id
                      ? clubNames.get(
                          task.club_id
                        )
                      : undefined;

                  return (
                    <div
                      key={
                        task.id
                      }
                      className={`p-4 ${
                        index !==
                        openTasks.length -
                          1
                          ? "border-b border-zinc-800"
                          : ""
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium">
                            {
                              task.title
                            }
                          </p>

                          {clubName && (
                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                clubName
                              }
                            </p>
                          )}
                        </div>

                        <span className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300">
                          {
                            task.priority
                          }
                        </span>
                      </div>

                      {task.due_at && (
                        <p className="mt-3 text-xs text-zinc-500">
                          Due{" "}

                          {formatTaskDeadline(
                            task.due_at
                          )}
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
              <p className="font-medium">
                You&apos;re all
                caught up
              </p>

              <p className="mt-2 text-sm text-zinc-500">
                No open tasks
                right now.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Application Pipeline */}
      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              Club Pipeline
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Where your
              applications
              currently stand.
            </p>
          </div>

          <Link
            href="/clubs"
            className="flex items-center gap-1 text-sm text-zinc-400 transition hover:text-white"
          >
            Manage clubs

            <ArrowRight
              size={15}
            />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {[
            "Interested",
            "Applying",
            "Applied",
            "Active",
            "Inactive",
          ].map(
            (status) => {
              const count =
                clubs.filter(
                  (club) =>
                    club.status ===
                    status
                ).length;

              return (
                <div
                  key={
                    status
                  }
                  className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
                >
                  <p className="text-sm text-zinc-400">
                    {
                      status
                    }
                  </p>

                  <p className="mt-2 text-2xl font-semibold">
                    {
                      count
                    }
                  </p>
                </div>
              );
            }
          )}
        </div>
      </section>
    </div>
  );
}
