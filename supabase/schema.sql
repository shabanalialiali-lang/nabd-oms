-- ======================================================
-- نبض | قاعدة بيانات نظام تشغيل وصيانة المرافق
-- شغّل هذا الملف كاملاً من: Supabase Dashboard > SQL Editor > New query
-- ======================================================

-- جدول ملفات المستخدمين (يمتد من نظام المصادقة الأساسي)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  role text default 'engineer', -- engineer | manager | technician
  created_at timestamptz default now()
);

-- جدول بلاغات الصيانة
create table if not exists public.maintenance_requests (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  department text,
  priority text not null default 'normal', -- urgent | normal
  status text not null default 'pending',  -- pending | in_progress | done
  created_by uuid references auth.users,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- تفعيل الحماية على مستوى الصفوف
alter table public.profiles enable row level security;
alter table public.maintenance_requests enable row level security;

-- سياسات profiles
drop policy if exists "profiles_select_authenticated" on public.profiles;
create policy "profiles_select_authenticated"
  on public.profiles for select
  using (auth.role() = 'authenticated');

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

-- سياسات maintenance_requests
drop policy if exists "requests_select_authenticated" on public.maintenance_requests;
create policy "requests_select_authenticated"
  on public.maintenance_requests for select
  using (auth.role() = 'authenticated');

drop policy if exists "requests_insert_authenticated" on public.maintenance_requests;
create policy "requests_insert_authenticated"
  on public.maintenance_requests for insert
  with check (auth.role() = 'authenticated');

drop policy if exists "requests_update_authenticated" on public.maintenance_requests;
create policy "requests_update_authenticated"
  on public.maintenance_requests for update
  using (auth.role() = 'authenticated');

-- إنشاء صف profile تلقائيًا عند تسجيل مستخدم جديد
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- بيانات تجريبية اختيارية (يمكن حذف هذا الجزء)
-- insert into public.maintenance_requests (title, description, department, priority, status)
-- values
--   ('عطل تكييف مركزي', 'وحدة العناية المركزة', 'العناية المركزة', 'urgent', 'in_progress'),
--   ('صيانة دورية لجهاز تعقيم', 'غرفة العمليات 3', 'غرفة العمليات', 'normal', 'done');
