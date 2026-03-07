-- Create projects table
CREATE TABLE public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    github TEXT NOT NULL,
    demo TEXT,
    live TEXT,
    thumbnail_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (portfolio is public)
CREATE POLICY "Anyone can view projects" 
ON public.projects 
FOR SELECT 
USING (true);

-- Create policy for authenticated users to manage projects (admin)
CREATE POLICY "Authenticated users can insert projects" 
ON public.projects 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects" 
ON public.projects 
FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can delete projects" 
ON public.projects 
FOR DELETE 
TO authenticated
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for project thumbnails
INSERT INTO storage.buckets (id, name, public) VALUES ('project-thumbnails', 'project-thumbnails', true);

-- Create storage policies for thumbnails
CREATE POLICY "Anyone can view project thumbnails" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can upload project thumbnails" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can update project thumbnails" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (bucket_id = 'project-thumbnails');

CREATE POLICY "Authenticated users can delete project thumbnails" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (bucket_id = 'project-thumbnails');