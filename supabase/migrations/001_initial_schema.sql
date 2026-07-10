-- Tables

create table if not exists public.words (
  id             bigserial   primary key,
  german         text        not null,
  english        text        not null,
  gender         text,
  part_of_speech text        not null,
  cefr_level     text        not null default 'A1',
  example_de     text,
  example_en     text,
  image_url      text,
  created_at     timestamptz not null default now()
);

create table if not exists public.user_cards (
  user_id       uuid        not null references auth.users(id) on delete cascade,
  word_id       bigint      not null references public.words(id) on delete cascade,
  interval      integer     not null default 1,
  ease_factor   real        not null default 2.5,
  repetitions   integer     not null default 0,
  due_date      date        not null default current_date,
  last_reviewed timestamptz,
  created_at    timestamptz not null default now(),
  primary key (user_id, word_id)
);

-- Indexes

create index if not exists user_cards_user_due
  on public.user_cards (user_id, due_date);

create index if not exists words_cefr
  on public.words (cefr_level);

-- Row-level security

alter table public.words      enable row level security;
alter table public.user_cards enable row level security;

drop policy if exists "words are readable by anyone" on public.words;
create policy "words are readable by anyone"
  on public.words
  for select
  to anon, authenticated
  using (true);

drop policy if exists "users manage their own cards" on public.user_cards;
create policy "users manage their own cards"
  on public.user_cards
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
