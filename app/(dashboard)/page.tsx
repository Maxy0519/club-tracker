export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8 md:px-10 md:py-10">
      <header className="mb-10">
        <p className="mb-2 text-sm text-zinc-400">
          Friday, August 28
        </p>

        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 text-zinc-400">
          Your Baruch and Macaulay extracurricular hub.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Active Clubs</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">
            Upcoming Events
          </p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-sm text-zinc-400">Open Tasks</p>
          <p className="mt-2 text-3xl font-semibold">0</p>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Upcoming</h2>

          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200">
            Add Event
          </button>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center">
          <p className="font-medium">Nothing scheduled yet</p>

          <p className="mt-2 text-sm text-zinc-400">
            Your upcoming club events will appear here.
          </p>
        </div>
      </section>
    </div>
  );
}