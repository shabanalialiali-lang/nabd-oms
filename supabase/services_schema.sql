-- ======================================================
-- نبض خدمات | قاعدة بيانات تطبيق الصيانة العامة (الجوال)
-- شغّل هذا الملف بعد schema.sql من: Supabase Dashboard > SQL Editor > New query
-- آمن لإعادة التشغيل أكثر من مرة
-- ======================================================

-- 1) توسيع ملفات المستخدمين: عميل أو فني + المهن التي يعمل بها
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists account_type text not null default 'customer';
alter table public.profiles add column if not exists trades text[] not null default '{}';

alter table public.profiles drop constraint if exists profiles_account_type_check;
alter table public.profiles add constraint profiles_account_type_check
  check (account_type in ('customer', 'technician'));

-- إنشاء صف profile تلقائيًا عند التسجيل (يدعم بيانات التطبيق وبيانات نظام المستشفى)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, full_name, phone, city, account_type, trades)
  values (
    new.id,
    coalesce(meta->>'full_name', new.email),
    meta->>'phone',
    meta->>'city',
    case when meta->>'account_type' = 'technician' then 'technician' else 'customer' end,
    case when jsonb_typeof(meta->'trades') = 'array'
      then array(select jsonb_array_elements_text(meta->'trades'))
      else '{}'::text[] end
  );
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 2) طلبات الخدمة
create table if not exists public.service_orders (
  id bigint generated always as identity primary key,
  customer_id uuid not null references auth.users on delete cascade,
  technician_id uuid references auth.users on delete set null,
  category text not null,          -- electrical | plumbing | ac | electronics | ...
  title text not null,
  description text,
  city text,
  preferred_time text,
  urgency text not null default 'normal' check (urgency in ('normal', 'urgent')),
  status text not null default 'open'
    check (status in ('open', 'accepted', 'in_progress', 'completed', 'cancelled')),
  price numeric(10, 2),
  rating smallint check (rating between 1 and 5),
  review text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz
);

create index if not exists service_orders_open_idx on public.service_orders (status, category);
create index if not exists service_orders_customer_idx on public.service_orders (customer_id);
create index if not exists service_orders_technician_idx on public.service_orders (technician_id);

-- بيانات التواصل الخاصة (العنوان والجوال) منفصلة: لا يراها إلا العميل والفني المُسند فقط
create table if not exists public.service_order_contacts (
  order_id bigint primary key references public.service_orders on delete cascade,
  address text,
  contact_phone text
);

alter table public.service_orders enable row level security;
alter table public.service_order_contacts enable row level security;

-- العميل يرى طلباته، الفني يرى المسندة له + الطلبات المفتوحة في مهنه
drop policy if exists "service_orders_select" on public.service_orders;
create policy "service_orders_select"
  on public.service_orders for select
  using (
    customer_id = auth.uid()
    or technician_id = auth.uid()
    or (
      status = 'open'
      and exists (
        select 1 from public.profiles p
        where p.id = auth.uid()
          and p.account_type = 'technician'
          and service_orders.category = any (p.trades)
      )
    )
  );

drop policy if exists "service_order_contacts_select" on public.service_order_contacts;
create policy "service_order_contacts_select"
  on public.service_order_contacts for select
  using (
    exists (
      select 1 from public.service_orders o
      where o.id = service_order_contacts.order_id
        and (o.customer_id = auth.uid() or o.technician_id = auth.uid())
    )
  );

-- لا توجد سياسات insert/update/delete مباشرة: كل التعديلات تمر عبر الدوال التالية
-- حتى لا يستطيع أحد تغيير حالة أو سعر أو تقييم طلب ليس من حقه.

-- 3) الدوال (RPC)

-- إنشاء طلب جديد (العميل)
create or replace function public.create_service_order(
  p_category text,
  p_title text,
  p_description text default null,
  p_city text default null,
  p_address text default null,
  p_contact_phone text default null,
  p_preferred_time text default null,
  p_urgency text default 'normal'
) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  v_id bigint;
begin
  if auth.uid() is null then
    raise exception 'يجب تسجيل الدخول';
  end if;
  if coalesce(trim(p_title), '') = '' or coalesce(trim(p_category), '') = '' then
    raise exception 'نوع الخدمة وعنوان الطلب مطلوبان';
  end if;

  insert into service_orders (customer_id, category, title, description, city, preferred_time, urgency)
  values (
    auth.uid(), p_category, trim(p_title), p_description, p_city, p_preferred_time,
    case when p_urgency = 'urgent' then 'urgent' else 'normal' end
  )
  returning id into v_id;

  insert into service_order_contacts (order_id, address, contact_phone)
  values (v_id, p_address, p_contact_phone);

  return v_id;
end;
$$;

-- قبول طلب (الفني) — أول فني يقبل يحصل على الطلب
create or replace function public.accept_service_order(p_order_id bigint)
returns void
language plpgsql security definer set search_path = public as $$
begin
  update service_orders o
     set technician_id = auth.uid(),
         status = 'accepted',
         accepted_at = now(),
         updated_at = now()
   where o.id = p_order_id
     and o.status = 'open'
     and o.customer_id <> auth.uid()
     and exists (
       select 1 from profiles p
       where p.id = auth.uid() and p.account_type = 'technician' and o.category = any (p.trades)
     );
  if not found then
    raise exception 'الطلب غير متاح للقبول (ربما قبله فني آخر)';
  end if;
end;
$$;

-- تحديث حالة الطلب حسب الدور
--   الفني: accepted -> in_progress -> completed (مع السعر)، أو التراجع accepted -> open
--   العميل: open/accepted -> cancelled
create or replace function public.update_service_order_status(
  p_order_id bigint,
  p_status text,
  p_price numeric default null
) returns void
language plpgsql security definer set search_path = public as $$
declare
  o service_orders%rowtype;
begin
  select * into o from service_orders where id = p_order_id for update;
  if not found then
    raise exception 'الطلب غير موجود';
  end if;

  if o.technician_id = auth.uid() then
    if o.status = 'accepted' and p_status = 'in_progress' then
      update service_orders set status = 'in_progress', updated_at = now() where id = p_order_id;
    elsif o.status in ('accepted', 'in_progress') and p_status = 'completed' then
      update service_orders
         set status = 'completed', price = coalesce(p_price, price),
             completed_at = now(), updated_at = now()
       where id = p_order_id;
    elsif o.status = 'accepted' and p_status = 'open' then
      update service_orders
         set status = 'open', technician_id = null, accepted_at = null, updated_at = now()
       where id = p_order_id;
    else
      raise exception 'انتقال غير مسموح';
    end if;
  elsif o.customer_id = auth.uid() then
    if o.status in ('open', 'accepted') and p_status = 'cancelled' then
      update service_orders set status = 'cancelled', updated_at = now() where id = p_order_id;
    else
      raise exception 'لا يمكن إلغاء الطلب بعد بدء التنفيذ';
    end if;
  else
    raise exception 'غير مصرح';
  end if;
end;
$$;

-- تقييم الفني بعد اكتمال الطلب (العميل، مرة واحدة)
create or replace function public.rate_service_order(
  p_order_id bigint,
  p_rating smallint,
  p_review text default null
) returns void
language plpgsql security definer set search_path = public as $$
begin
  if p_rating is null or p_rating not between 1 and 5 then
    raise exception 'التقييم يجب أن يكون من 1 إلى 5';
  end if;
  update service_orders
     set rating = p_rating, review = p_review, updated_at = now()
   where id = p_order_id
     and customer_id = auth.uid()
     and status = 'completed'
     and rating is null;
  if not found then
    raise exception 'لا يمكن تقييم هذا الطلب';
  end if;
end;
$$;

-- إحصائيات الفنيين (متوسط التقييم وعدد الأعمال المنجزة) — أرقام مجمّعة فقط
create or replace view public.technician_stats as
  select technician_id,
         count(*) filter (where status = 'completed') as completed_jobs,
         round(avg(rating)::numeric, 1) as avg_rating,
         count(rating) as ratings_count
    from public.service_orders
   where technician_id is not null
   group by technician_id;

revoke all on public.technician_stats from anon, public;
grant select on public.technician_stats to authenticated;

revoke all on function public.create_service_order(text, text, text, text, text, text, text, text) from public, anon;
revoke all on function public.accept_service_order(bigint) from public, anon;
revoke all on function public.update_service_order_status(bigint, text, numeric) from public, anon;
revoke all on function public.rate_service_order(bigint, smallint, text) from public, anon;
grant execute on function public.create_service_order(text, text, text, text, text, text, text, text) to authenticated;
grant execute on function public.accept_service_order(bigint) to authenticated;
grant execute on function public.update_service_order_status(bigint, text, numeric) to authenticated;
grant execute on function public.rate_service_order(bigint, smallint, text) to authenticated;
