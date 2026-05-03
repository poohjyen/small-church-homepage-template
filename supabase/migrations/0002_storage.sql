-- ============================================
-- Storage 버킷 RLS 정책
-- 실행 전 Dashboard → Storage에서 다음 5개 버킷을 모두 Public으로 생성:
--   bulletins, gallery, resources, hero, site
-- ============================================

-- bulletins 버킷
create policy "Public read bulletins"
on storage.objects for select to anon, authenticated
using (bucket_id = 'bulletins');

create policy "Admin upload bulletins"
on storage.objects for insert to authenticated
with check (bucket_id = 'bulletins' and is_admin());

create policy "Admin update bulletins"
on storage.objects for update to authenticated
using (bucket_id = 'bulletins' and is_admin());

create policy "Admin delete bulletins"
on storage.objects for delete to authenticated
using (bucket_id = 'bulletins' and is_admin());

-- gallery 버킷
create policy "Public read gallery"
on storage.objects for select to anon, authenticated
using (bucket_id = 'gallery');

create policy "Admin upload gallery"
on storage.objects for insert to authenticated
with check (bucket_id = 'gallery' and is_admin());

create policy "Admin update gallery"
on storage.objects for update to authenticated
using (bucket_id = 'gallery' and is_admin());

create policy "Admin delete gallery"
on storage.objects for delete to authenticated
using (bucket_id = 'gallery' and is_admin());

-- resources 버킷
create policy "Public read resources"
on storage.objects for select to anon, authenticated
using (bucket_id = 'resources');

create policy "Admin upload resources"
on storage.objects for insert to authenticated
with check (bucket_id = 'resources' and is_admin());

create policy "Admin update resources"
on storage.objects for update to authenticated
using (bucket_id = 'resources' and is_admin());

create policy "Admin delete resources"
on storage.objects for delete to authenticated
using (bucket_id = 'resources' and is_admin());

-- hero 버킷
create policy "Public read hero"
on storage.objects for select to anon, authenticated
using (bucket_id = 'hero');

create policy "Admin upload hero"
on storage.objects for insert to authenticated
with check (bucket_id = 'hero' and is_admin());

create policy "Admin update hero"
on storage.objects for update to authenticated
using (bucket_id = 'hero' and is_admin());

create policy "Admin delete hero"
on storage.objects for delete to authenticated
using (bucket_id = 'hero' and is_admin());

-- site 버킷
create policy "Public read site"
on storage.objects for select to anon, authenticated
using (bucket_id = 'site');

create policy "Admin upload site"
on storage.objects for insert to authenticated
with check (bucket_id = 'site' and is_admin());

create policy "Admin update site"
on storage.objects for update to authenticated
using (bucket_id = 'site' and is_admin());

create policy "Admin delete site"
on storage.objects for delete to authenticated
using (bucket_id = 'site' and is_admin());
