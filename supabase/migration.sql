-- School News Website — initial schema
-- Run this in the Supabase SQL editor, or via `supabase db push`.

-- ============================================================
-- Extensions
-- ============================================================
create extension if not exists pgcrypto;

-- ============================================================
-- Table: news
-- ============================================================
create table if not exists news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text not null,
  content text not null,
  category text not null check (category in ('school','events','announcements','contests','results')),
  image_url text,
  image_alt text,
  published boolean not null default true,
  featured_in_carousel boolean not null default false,
  pinned boolean not null default false,
  priority smallint not null default 0 check (priority between 0 and 3),
  event_at timestamptz,
  location text,
  audience text,
  cta_label text,
  cta_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists news_published_created_at_idx
  on news (published, created_at desc);

create index if not exists news_category_idx
  on news (category);

create index if not exists news_editorial_order_idx
  on news (published, pinned desc, priority desc, created_at desc);

alter table news enable row level security;

drop policy if exists "public can read published news" on news;
create policy "public can read published news"
  on news for select
  using (published = true);

drop policy if exists "authenticated admin full access" on news;
create policy "authenticated admin full access"
  on news for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- keep updated_at fresh on every update
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists news_set_updated_at on news;
create trigger news_set_updated_at
  before update on news
  for each row
  execute function set_updated_at();

-- ============================================================
-- Table: site_settings (single row)
-- ============================================================
create table if not exists site_settings (
  id int primary key default 1,
  school_name text not null default 'اسم المدرسة',
  logo_url text,
  phone text,
  email text,
  address text,
  facebook_page_url text,
  facebook_group_url text,
  about_text text,
  developer_name text,
  developer_email text,
  developer_phone text,
  developer_bio text,
  developer_photo_url text,
  dedication_text text,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

alter table site_settings enable row level security;

drop policy if exists "public can read settings" on site_settings;
create policy "public can read settings"
  on site_settings for select
  using (true);

drop policy if exists "authenticated admin can update settings" on site_settings;
create policy "authenticated admin can update settings"
  on site_settings for update
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

drop trigger if exists site_settings_set_updated_at on site_settings;
create trigger site_settings_set_updated_at
  before update on site_settings
  for each row
  execute function set_updated_at();

-- ============================================================
-- Table: news_images (gallery — additional images per article)
-- ============================================================
create table if not exists news_images (
  id uuid primary key default gen_random_uuid(),
  news_id uuid not null references news(id) on delete cascade,
  image_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists news_images_news_id_idx
  on news_images (news_id, sort_order);

alter table news_images enable row level security;

drop policy if exists "public can read images of published news" on news_images;
create policy "public can read images of published news"
  on news_images for select
  using (
    exists (
      select 1 from news
      where news.id = news_images.news_id
      and news.published = true
    )
  );

drop policy if exists "authenticated admin full access to news_images" on news_images;
create policy "authenticated admin full access to news_images"
  on news_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ============================================================
-- Storage buckets
-- ============================================================
insert into storage.buckets (id, name, public)
values ('news-images', 'news-images', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- news-images: public read, authenticated write
drop policy if exists "news-images public read" on storage.objects;
create policy "news-images public read"
  on storage.objects for select
  using (bucket_id = 'news-images');

drop policy if exists "news-images authenticated insert" on storage.objects;
create policy "news-images authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'news-images' and auth.role() = 'authenticated');

drop policy if exists "news-images authenticated update" on storage.objects;
create policy "news-images authenticated update"
  on storage.objects for update
  using (bucket_id = 'news-images' and auth.role() = 'authenticated');

drop policy if exists "news-images authenticated delete" on storage.objects;
create policy "news-images authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'news-images' and auth.role() = 'authenticated');

-- site-assets: public read, authenticated write
drop policy if exists "site-assets public read" on storage.objects;
create policy "site-assets public read"
  on storage.objects for select
  using (bucket_id = 'site-assets');

drop policy if exists "site-assets authenticated insert" on storage.objects;
create policy "site-assets authenticated insert"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' and auth.role() = 'authenticated');

drop policy if exists "site-assets authenticated update" on storage.objects;
create policy "site-assets authenticated update"
  on storage.objects for update
  using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

drop policy if exists "site-assets authenticated delete" on storage.objects;
create policy "site-assets authenticated delete"
  on storage.objects for delete
  using (bucket_id = 'site-assets' and auth.role() = 'authenticated');

-- ============================================================
-- Seed content — start-of-academic-year news, all 5 categories
-- ============================================================
insert into news (title, slug, excerpt, content, category, published, created_at)
values
(
  'فتح باب التسجيل للعام الدراسي الجديد',
  'fath-bab-altasjil-lil-aam-aldirasi-aljadid',
  'يعلن قسم شؤون الطلاب عن بدء التسجيل للعام الدراسي الجديد لجميع المراحل، مع استمرار العمل بأسعار العام الماضي حتى نهاية الأسبوع الأول من سبتمبر.',
  E'يسر إدارة المدرسة أن تعلن عن فتح باب التسجيل للعام الدراسي الجديد لجميع المراحل التعليمية، من الروضة وحتى الثانوية.\n\nيرجى من أولياء الأمور الراغبين في التسجيل أو إعادة القيد التوجه إلى مكتب شؤون الطلاب مصطحبين الأوراق المطلوبة، وذلك من الساعة التاسعة صباحًا وحتى الثانية ظهرًا، من السبت إلى الخميس.\n\nكما تعلن الإدارة عن استمرار العمل بمصروفات العام الماضي دون زيادة لجميع من يسجلون حتى نهاية الأسبوع الأول من شهر سبتمبر، تقديرًا لثقة أولياء الأمور المستمرة.',
  'school',
  true,
  now() - interval '9 days'
),
(
  'اعتماد الجدول الدراسي للفصل الأول',
  'ietimad-aljadwal-aldirasi-lilfasl-alawal',
  'تم اعتماد الجدول الدراسي النهائي لجميع الصفوف للفصل الدراسي الأول، ويمكن الاطلاع عليه عبر تطبيق المدرسة أو بالحضور إلى الإدارة.',
  E'تعلن الإدارة الأكاديمية عن اعتماد الجدول الدراسي النهائي لجميع الصفوف للفصل الدراسي الأول ٢٠٢٦/٢٠٢٧.\n\nيمكن لأولياء الأمور والطلاب الاطلاع على الجدول كاملًا من خلال تطبيق المدرسة الإلكتروني، أو بالحضور شخصيًا إلى مكتب شؤون الطلاب للحصول على نسخة مطبوعة.\n\nنلفت عناية الجميع إلى أن اليوم الدراسي يبدأ الساعة السابعة والنصف صباحًا، ونرجو الالتزام بمواعيد الحضور تجنبًا لأي إرباك في الأسبوع الأول من الدراسة.',
  'school',
  true,
  now() - interval '7 days'
),
(
  'يوم الاستقبال والتعارف للطلاب الجدد',
  'yawm-alaistiqbal-waltaearuf-liltalaba-aljudud',
  'تنظم المدرسة يوم استقبال خاص بالطلاب المستجدين وأسرهم، يتضمن جولة تعريفية بالمرافق ولقاء مع المعلمين والإدارة.',
  E'حرصًا على تسهيل اندماج الطلاب الجدد في بيئتهم الدراسية، تنظم المدرسة يوم استقبال وتعارف مخصص للطلاب المستجدين وأولياء أمورهم.\n\nيتضمن اليوم جولة تعريفية بمرافق المدرسة، ولقاءً مباشرًا مع المعلمين والمرشدين الأكاديميين، بالإضافة إلى فقرات ترفيهية للطلاب للتعارف على زملائهم الجدد.\n\nيرجى من أولياء أمور الطلاب المستجدين تأكيد الحضور عبر إدارة شؤون الطلاب قبل موعد الفعالية بثلاثة أيام على الأقل.',
  'events',
  true,
  now() - interval '6 days'
),
(
  'نتائج معرض العلوم المدرسي لهذا العام',
  'natayij-maerid-aleulum-almadrasii-lhdha-aleam',
  'أسفر معرض العلوم السنوي عن تكريم عشرة مشاريع طلابية متميزة في مجالات الفيزياء والكيمياء والأحياء والتكنولوجيا.',
  E'اختتمت المدرسة فعاليات معرض العلوم السنوي بنجاح كبير، بمشاركة أكثر من ستين مشروعًا طلابيًا من مختلف المراحل.\n\nتوزعت المشاريع الفائزة على مجالات الفيزياء والكيمياء والأحياء والتكنولوجيا، وقد أشرفت عليها لجنة تحكيم من معلمي العلوم بالمدرسة.\n\nتتقدم الإدارة بالتهنئة لجميع الطلاب المشاركين والفائزين، وتشكر أولياء الأمور على دعمهم المستمر لأبنائهم خلال فترة التحضير للمعرض.',
  'contests',
  true,
  now() - interval '4 days'
),
(
  'افتتاح معمل الحاسب الآلي الجديد',
  'aiftitah_maml_alhasib_alaly_aljadid',
  'افتتحت المدرسة معملًا جديدًا للحاسب الآلي مجهزًا بأحدث الأجهزة لدعم مناهج البرمجة والتفكير الحاسوبي.',
  E'في إطار خطة تطوير البنية التحتية التكنولوجية، افتتحت إدارة المدرسة معمل الحاسب الآلي الجديد المجهز بأحدث الأجهزة والبرمجيات التعليمية.\n\nيهدف المعمل إلى دعم مناهج البرمجة والتفكير الحاسوبي المقررة على جميع المراحل، وتمكين الطلاب من اكتساب المهارات الرقمية اللازمة لمواكبة التطورات التقنية.\n\nسيبدأ استخدام المعمل رسميًا مع بداية الأسبوع الثاني من الدراسة وفق جدول الحصص المعتمد.',
  'school',
  true,
  now() - interval '3 days'
),
(
  'جلسة تعريفية لأولياء الأمور حول العام الدراسي',
  'jalsat-taerifiat-liawlia-alumur-hawl-aleam-aldirasii',
  'تدعو إدارة المدرسة جميع أولياء الأمور لحضور جلسة تعريفية تتناول خطة العام الدراسي والأنشطة والفعاليات القادمة.',
  E'تدعو إدارة المدرسة جميع أولياء الأمور لحضور جلسة تعريفية عن خطة العام الدراسي الجديد، تتضمن استعراضًا للمنهج الدراسي والأنشطة اللاصفية والفعاليات المخطط لها خلال الفصل الأول.\n\nكما ستتيح الجلسة فرصة للقاء مباشر مع الإدارة والمعلمين لطرح الأسئلة والاستفسارات.\n\nستعقد الجلسة في القاعة الكبرى بالمدرسة، وسيتم إرسال موعد دقيق عبر تطبيق المدرسة قريبًا.',
  'announcements',
  true,
  now() - interval '1 days'
);
