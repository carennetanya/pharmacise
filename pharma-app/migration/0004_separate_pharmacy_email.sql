-- Pharmacy contact email is independent from the owner's Auth email.

update public.pharmacies p
set email = ''
from auth.users u
where p.owner_id = u.id
  and lower(coalesce(p.email, '')) = lower(coalesce(u.email, ''));
