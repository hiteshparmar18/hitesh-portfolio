
-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  issuer TEXT NOT NULL,
  date TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'certification' CHECK (type IN ('certification', 'publication')),
  skills TEXT[] NOT NULL DEFAULT '{}'::text[],
  verify_url TEXT,
  image_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Anyone can view certifications"
  ON public.certifications FOR SELECT
  USING (true);

-- Authenticated users can manage
CREATE POLICY "Authenticated users can insert certifications"
  ON public.certifications FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update certifications"
  ON public.certifications FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete certifications"
  ON public.certifications FOR DELETE
  TO authenticated
  USING (true);

-- Timestamp trigger
CREATE TRIGGER update_certifications_updated_at
  BEFORE UPDATE ON public.certifications
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
