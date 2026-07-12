-- ============================================================
-- আমার খাতা — Supabase ডেটাবেজ স্কিমা
-- Supabase Dashboard -> SQL Editor -> New query -> এই পুরো ফাইলটা
-- পেস্ট করে "Run" চাপুন। একবারই চালালেই হবে।
-- ============================================================

-- ১) লেখার টেবিল
create table if not exists posts (
  id           bigint generated always as identity primary key,
  title        text not null,
  type         text not null check (type in ('কবিতা', 'গল্প')),
  author_name  text not null default 'আপনি',
  content      text not null,
  tags         text[] not null default '{}',
  likes_count  integer not null default 0,
  created_at   timestamptz not null default now()
);

-- ২) মন্তব্যের টেবিল
create table if not exists comments (
  id          bigint generated always as identity primary key,
  post_id     bigint not null references posts(id) on delete cascade,
  name        text not null,
  text        text not null,
  created_at  timestamptz not null default now()
);

-- ৩) লাইকের টেবিল (কে কোন লেখা লাইক করেছে, ব্রাউজার-আইডি দিয়ে ট্র্যাক করা)
create table if not exists likes (
  id          bigint generated always as identity primary key,
  post_id     bigint not null references posts(id) on delete cascade,
  visitor_id  text not null,
  created_at  timestamptz not null default now(),
  unique(post_id, visitor_id)
);

-- ============================================================
-- Row Level Security (RLS) চালু করা — এটাই ঠিক করে দেয় কে কী করতে পারবে
-- ============================================================
alter table posts    enable row level security;
alter table comments enable row level security;
alter table likes    enable row level security;

-- সবাই সব লেখা পড়তে পারবে
create policy "সবাই লেখা পড়তে পারবে" on posts
  for select using (true);

-- শুধুমাত্র লগইন করা অ্যাডমিন (আপনি) লেখা প্রকাশ/এডিট/মুছতে পারবেন
create policy "শুধু অ্যাডমিন লেখা প্রকাশ করতে পারবে" on posts
  for insert with check (auth.role() = 'authenticated');

create policy "শুধু অ্যাডমিন লেখা এডিট করতে পারবে" on posts
  for update using (auth.role() = 'authenticated');

create policy "শুধু অ্যাডমিন লেখা মুছতে পারবে" on posts
  for delete using (auth.role() = 'authenticated');

-- মন্তব্য: সবাই পড়তে ও লিখতে পারবে (লগইন ছাড়াই)
create policy "সবাই মন্তব্য পড়তে পারবে" on comments
  for select using (true);
create policy "সবাই মন্তব্য করতে পারবে" on comments
  for insert with check (true);

-- লাইক: সবাই পড়তে ও লাইক দিতে পারবে (লগইন ছাড়াই), কিন্তু একই ভিজিটর একবারই লাইক দিতে পারবে
create policy "সবাই লাইক দেখতে পারবে" on likes
  for select using (true);
create policy "সবাই লাইক দিতে পারবে" on likes
  for insert with check (true);
create policy "নিজের লাইক সরাতে পারবে" on likes
  for delete using (true);

-- লাইকের সংখ্যা স্বয়ংক্রিয়ভাবে posts.likes_count এ আপডেট হবে
create or replace function sync_likes_count() returns trigger as $$
begin
  update posts set likes_count = (select count(*) from likes where post_id = coalesce(new.post_id, old.post_id))
  where id = coalesce(new.post_id, old.post_id);
  return null;
end;
$$ language plpgsql;

create trigger likes_after_insert after insert on likes
  for each row execute function sync_likes_count();
create trigger likes_after_delete after delete on likes
  for each row execute function sync_likes_count();

-- ============================================================
-- এবার Authentication -> Users এ গিয়ে নিজের ইমেইল দিয়ে একটা ইউজার
-- বানিয়ে নিন (আপনি = অ্যাডমিন)। এই একটা ইউজার দিয়েই লগইন করে
-- publish পেজ থেকে লেখা প্রকাশ করতে পারবেন।
-- ============================================================
