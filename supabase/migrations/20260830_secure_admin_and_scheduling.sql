-- Production admin roles, least-privilege policies, and scheduled publishing.

alter table news add column if not exists publish_at timestamptz;
create index if not exists news_publication_schedule_idx
  on news (published, publish_at, created_at desc);

create table if not exists admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'editor' check (role in ('editor', 'publisher', 'super_admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table admin_profiles add column if not exists email text;

-- Existing authenticated accounts are the current trusted operators.
insert into admin_profiles (id, email, role)
select id, email, 'super_admin' from auth.users
on conflict (id) do update set email = excluded.email;

drop trigger if exists admin_profiles_set_updated_at on admin_profiles;
create trigger admin_profiles_set_updated_at
  before update on admin_profiles
  for each row execute function set_updated_at();

alter table admin_profiles enable row level security;

drop policy if exists "admins can read own profile" on admin_profiles;
drop policy if exists "super admins can read profiles" on admin_profiles;
drop policy if exists "super admins can insert profiles" on admin_profiles;
drop policy if exists "super admins can update profiles" on admin_profiles;
drop policy if exists "super admins can delete profiles" on admin_profiles;
create policy "admins can read own profile"
  on admin_profiles for select
  to authenticated
  using (id = auth.uid());

create or replace function current_admin_role()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from admin_profiles where id = auth.uid();
$$;

revoke all on function current_admin_role() from public;
grant execute on function current_admin_role() to authenticated;

create policy "super admins can read profiles"
  on admin_profiles for select to authenticated
  using (current_admin_role() = 'super_admin');
create policy "super admins can insert profiles"
  on admin_profiles for insert to authenticated
  with check (current_admin_role() = 'super_admin');
create policy "super admins can update profiles"
  on admin_profiles for update to authenticated
  using (current_admin_role() = 'super_admin')
  with check (current_admin_role() = 'super_admin');
create policy "super admins can delete profiles"
  on admin_profiles for delete to authenticated
  using (current_admin_role() = 'super_admin');

drop policy if exists "public can read published news" on news;
create policy "public can read published news"
  on news for select
  to anon
  using (published = true and (publish_at is null or publish_at <= now()));

drop policy if exists "authenticated admin full access" on news;
drop policy if exists "admins can read all news" on news;
drop policy if exists "editors can insert news" on news;
drop policy if exists "editors can update news" on news;
drop policy if exists "publishers can delete news" on news;
create policy "admins can read all news"
  on news for select
  to authenticated
  using (current_admin_role() is not null);

create policy "editors can insert news"
  on news for insert
  to authenticated
  with check (current_admin_role() in ('editor', 'publisher', 'super_admin'));

create policy "editors can update news"
  on news for update
  to authenticated
  using (current_admin_role() in ('editor', 'publisher', 'super_admin'))
  with check (current_admin_role() in ('editor', 'publisher', 'super_admin'));

create policy "publishers can delete news"
  on news for delete
  to authenticated
  using (current_admin_role() in ('publisher', 'super_admin'));

drop policy if exists "public can read images of published news" on news_images;
create policy "public can read images of published news"
  on news_images for select
  to anon
  using (exists (
    select 1 from news
    where news.id = news_images.news_id
      and news.published = true
      and (news.publish_at is null or news.publish_at <= now())
  ));

drop policy if exists "authenticated admin full access to news_images" on news_images;
drop policy if exists "admins can read all news images" on news_images;
drop policy if exists "editors can insert news images" on news_images;
drop policy if exists "editors can update news images" on news_images;
drop policy if exists "editors can delete news images" on news_images;
create policy "admins can read all news images"
  on news_images for select
  to authenticated
  using (current_admin_role() is not null);
create policy "editors can insert news images"
  on news_images for insert
  to authenticated
  with check (current_admin_role() in ('editor', 'publisher', 'super_admin'));
create policy "editors can update news images"
  on news_images for update
  to authenticated
  using (current_admin_role() in ('editor', 'publisher', 'super_admin'))
  with check (current_admin_role() in ('editor', 'publisher', 'super_admin'));
create policy "editors can delete news images"
  on news_images for delete
  to authenticated
  using (current_admin_role() in ('editor', 'publisher', 'super_admin'));

drop policy if exists "authenticated admin can update settings" on site_settings;
drop policy if exists "publishers can update settings" on site_settings;
create policy "publishers can update settings"
  on site_settings for update
  to authenticated
  using (current_admin_role() in ('publisher', 'super_admin'))
  with check (current_admin_role() in ('publisher', 'super_admin'));

-- Replace broad authenticated storage policies with role-aware policies.
drop policy if exists "news-images authenticated insert" on storage.objects;
drop policy if exists "news-images authenticated update" on storage.objects;
drop policy if exists "news-images authenticated delete" on storage.objects;
drop policy if exists "admins insert news images" on storage.objects;
drop policy if exists "admins update news images" on storage.objects;
drop policy if exists "admins delete news images" on storage.objects;
create policy "admins insert news images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'news-images' and current_admin_role() in ('editor', 'publisher', 'super_admin'));
create policy "admins update news images"
  on storage.objects for update to authenticated
  using (bucket_id = 'news-images' and current_admin_role() in ('editor', 'publisher', 'super_admin'));
create policy "admins delete news images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'news-images' and current_admin_role() in ('editor', 'publisher', 'super_admin'));

drop policy if exists "site-assets authenticated insert" on storage.objects;
drop policy if exists "site-assets authenticated update" on storage.objects;
drop policy if exists "site-assets authenticated delete" on storage.objects;
drop policy if exists "publishers insert site assets" on storage.objects;
drop policy if exists "publishers update site assets" on storage.objects;
drop policy if exists "publishers delete site assets" on storage.objects;
create policy "publishers insert site assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'site-assets' and current_admin_role() in ('publisher', 'super_admin'));
create policy "publishers update site assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'site-assets' and current_admin_role() in ('publisher', 'super_admin'));
create policy "publishers delete site assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'site-assets' and current_admin_role() in ('publisher', 'super_admin'));
