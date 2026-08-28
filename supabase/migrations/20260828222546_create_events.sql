create table public.events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  club_id uuid
    references public.clubs(id)
    on delete set null,

  title text not null,

  description text,
  location text,

  start_at timestamptz not null,
  end_at timestamptz not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint events_title_not_empty
    check (char_length(trim(title)) > 0),

  constraint events_end_after_start
    check (end_at > start_at)
);

create index events_user_id_idx
  on public.events(user_id);

create index events_club_id_idx
  on public.events(club_id);

create index events_start_at_idx
  on public.events(start_at);

alter table public.events
  enable row level security;

grant select, insert, update, delete
  on table public.events
  to authenticated;

create policy "Users can view their own events"
  on public.events
  for select
  to authenticated
  using (
    auth.uid() = user_id
  );

create policy "Users can create their own events"
  on public.events
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
  );

create policy "Users can update their own events"
  on public.events
  for update
  to authenticated
  using (
    auth.uid() = user_id
  )
  with check (
    auth.uid() = user_id
  );

create policy "Users can delete their own events"
  on public.events
  for delete
  to authenticated
  using (
    auth.uid() = user_id
  );

create trigger events_set_updated_at
before update on public.events
for each row
execute function public.set_updated_at();