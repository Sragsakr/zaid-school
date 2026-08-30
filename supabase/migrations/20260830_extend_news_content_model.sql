-- Extend school news with editorial priority, event details, CTA, and image accessibility metadata.

alter table news
  add column if not exists pinned boolean not null default false,
  add column if not exists priority smallint not null default 0,
  add column if not exists event_at timestamptz,
  add column if not exists location text,
  add column if not exists audience text,
  add column if not exists cta_label text,
  add column if not exists cta_url text,
  add column if not exists image_alt text;

alter table news drop constraint if exists news_priority_check;
alter table news add constraint news_priority_check check (priority between 0 and 3);

create index if not exists news_editorial_order_idx
  on news (published, pinned desc, priority desc, created_at desc);
