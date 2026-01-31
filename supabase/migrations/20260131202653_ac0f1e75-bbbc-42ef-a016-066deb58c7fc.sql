-- Create storage bucket for recharge screenshots
INSERT INTO storage.buckets (id, name, public) VALUES ('recharge-screenshots', 'recharge-screenshots', false);

-- Storage policies for recharge screenshots
CREATE POLICY "Users can upload their own screenshots"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'recharge-screenshots' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own screenshots"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'recharge-screenshots' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin')));

CREATE POLICY "Admins can view all screenshots"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'recharge-screenshots' AND public.has_role(auth.uid(), 'admin'));