-- Create activity_logs table for persistent daily checklist logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  land_id UUID REFERENCES public.lahan(id) ON DELETE CASCADE NOT NULL,
  activity_name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to manage logs for their own lands
CREATE POLICY "Petani dapat mengelola log aktivitas lahannya"
ON public.activity_logs FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.lahan
    WHERE public.lahan.id = public.activity_logs.land_id
    AND public.lahan.petani_id = auth.uid()
  )
);
