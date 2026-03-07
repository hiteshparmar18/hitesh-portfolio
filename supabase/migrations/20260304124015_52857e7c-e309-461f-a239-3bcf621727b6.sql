
-- Drop all restrictive policies on certifications
DROP POLICY IF EXISTS "Anyone can view certifications" ON public.certifications;
DROP POLICY IF EXISTS "Authenticated users can delete certifications" ON public.certifications;
DROP POLICY IF EXISTS "Authenticated users can insert certifications" ON public.certifications;
DROP POLICY IF EXISTS "Authenticated users can update certifications" ON public.certifications;

-- Drop all restrictive policies on projects
DROP POLICY IF EXISTS "Anyone can view projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON public.projects;

-- Recreate as PERMISSIVE policies for certifications
CREATE POLICY "Anyone can view certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert certifications" ON public.certifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update certifications" ON public.certifications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete certifications" ON public.certifications FOR DELETE TO authenticated USING (true);

-- Recreate as PERMISSIVE policies for projects
CREATE POLICY "Anyone can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert projects" ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update projects" ON public.projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete projects" ON public.projects FOR DELETE TO authenticated USING (true);
