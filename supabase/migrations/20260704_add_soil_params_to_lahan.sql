-- Add ph and slope columns to lahan table so that they are stored and returned properly
ALTER TABLE public.lahan 
  ADD COLUMN IF NOT EXISTS ph TEXT,
  ADD COLUMN IF NOT EXISTS slope TEXT,
  ADD COLUMN IF NOT EXISTS clay NUMERIC,
  ADD COLUMN IF NOT EXISTS sand NUMERIC,
  ADD COLUMN IF NOT EXISTS cec NUMERIC;
