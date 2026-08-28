CREATE POLICY "Public can read property media" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'property-media');
CREATE POLICY "Admin can upload property media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'property-media');
CREATE POLICY "Admin can update property media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'property-media');
CREATE POLICY "Admin can delete property media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'property-media');