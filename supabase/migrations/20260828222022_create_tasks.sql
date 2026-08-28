create table public.tasks (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  club_id uuid
    references public.clubs(id)
    on delete cascade,

  title text not null,

  description text,

  due_at timestamptz,

  priority text not null default 'Medium'
    check (
      priority in (
        'Low',
        'Medium',
        'High'
      )
    ),

  completed boolean not null default false,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint tasks_title_not_empty
    check (char_length(trim(title)) > 0)
);

create index tasks_user_id_idx
  on public.tasks(user_id);

create index tasks_club_id_idx
  on public.tasks(club_id);

create index tasks_due_at_idx
  on public.tasks(due_at);

alter table public.tasks
  enable row level security;

grant select, insert, update, delete
  on table public.tasks
  to authenticated;

create policy "Users can view their own tasks"
  on public.tasks
  for select
  to authenticated
  using (
    auth.uid() = user_id
  );

create policy "Users can create their own tasks"
  on public.tasks
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
  );

create policy "Users can update their own tasks"
  on public.tasks
  for update
  to authenticated
  using (
    auth.uid() = user_id
  )
  with check (
    auth.uid() = user_id
  );

create policy "Users can delete their own tasks"
  on public.tasks
  for delete
  to authenticated
  using (
    auth.uid() = user_id
  );

create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute function public.set_updated_at();