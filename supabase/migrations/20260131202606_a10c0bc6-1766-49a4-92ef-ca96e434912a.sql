-- Fix search_path for generate_otp function
CREATE OR REPLACE FUNCTION public.generate_otp()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
    SELECT LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0')
$$;