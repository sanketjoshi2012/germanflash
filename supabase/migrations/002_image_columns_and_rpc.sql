alter table public.words
  add column if not exists image_credit_name text,
  add column if not exists image_credit_url text;

create or replace function public.set_word_image(
  p_word_id bigint,
  p_image_url text,
  p_credit_name text,
  p_credit_url text
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if (auth.uid() is null) then
    raise exception 'Not authorized';
  end if;
  update public.words
     set image_url = p_image_url,
         image_credit_name = p_credit_name,
         image_credit_url = p_credit_url
   where id = p_word_id;
end;
$$;

revoke execute on function public.set_word_image(bigint, text, text, text) from public;
grant execute on function public.set_word_image(bigint, text, text, text) to authenticated;
