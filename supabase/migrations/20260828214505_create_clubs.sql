create table public.clubs (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  name text not null,

  organization text not null
    check (organization in ('Baruch', 'Macaulay')),

  status text not null default 'Interested'
    check (
      status in (
        'Interested',
        'Applying',
        'Applied',
        'Active',
        'Inactive'
      )
    ),

  category text,
  role text,

  instagram text,
  website text,

  description text,
  notes text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint clubs_name_not_empty
    check (char_length(trim(name)) > 0)
);

create index clubs_user_id_idx
  on public.clubs(user_id);

alter table public.clubs
  enable row level security;

grant select, insert, update, delete
  on table public.clubs
  to authenticated;

create policy "Users can view their own clubs"
  on public.clubs
  for select
  to authenticated
  using (
    auth.uid() = user_id
  );

create policy "Users can create their own clubs"
  on public.clubs
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
  );

create policy "Users can update their own clubs"
  on public.clubs
  for update
  to authenticated
  using (
    auth.uid() = user_id
  )
  with check (
    auth.uid() = user_id
  );

create policy "Users can delete their own clubs"
  on public.clubs
  for delete
  to authenticated
  using (
    auth.uid() = user_id
  );

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger clubs_set_updated_at
before update on public.clubs
for each row
execute function public.set_updated_at();