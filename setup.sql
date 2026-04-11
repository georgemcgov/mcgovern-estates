-- ============================================================
-- McGovern Estates — Supabase Database Setup
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. Properties table
CREATE TABLE IF NOT EXISTS properties (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name          TEXT NOT NULL,
  address       TEXT NOT NULL,
  price         TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'For Sale',  -- 'For Sale' | 'To Let' | 'Sale Agreed' | 'Let Agreed'
  category      TEXT DEFAULT 'residential',
  beds          INTEGER,
  baths         INTEGER,
  parking       INTEGER,
  size          TEXT,
  description   TEXT,
  link          TEXT,
  image         TEXT,           -- primary display image URL
  images        TEXT[] DEFAULT '{}',  -- additional image URLs
  featured      BOOLEAN DEFAULT false,
  active        BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER properties_updated_at
BEFORE UPDATE ON properties
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 3. Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public (website visitors) can read active listings
CREATE POLICY "Public can read active properties"
ON properties FOR SELECT
USING (active = true);

-- Logged-in admins can do everything
CREATE POLICY "Admins can manage properties"
ON properties FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- 4. Seed existing listings (optional — remove if starting fresh)
-- ============================================================
INSERT INTO properties (name, address, price, status, category, beds, baths, parking, size, link, image, featured, display_order)
VALUES
  ('18 Oaklands',           'Greystones, Co. Wicklow', '€585,000',       'For Sale', 'residential', 3, 2, 1, '86 m²',    'https://www.mcgovernestates.ie/residential/brochure/18-oaklands-greystones-wicklow/4982342',            'https://photos-a.propertyimages.ie/media/2/4/3/4982342/1b52e8c5-0c9b-4dc3-9c44-07e6de8c8334_l.jpg', true,  1),
  ('16 The Walk',           'Ashford, Co. Wicklow',    '€595,000',       'For Sale', 'residential', 4, 3, 2, '142.5 m²', 'https://www.mcgovernestates.ie/residential/brochure/16-the-walk-ashford-wicklow/4982253',                'https://photos-a.propertyimages.ie/media/3/5/2/4982253/1c4c58c4-17e1-4bb3-a07a-4afd69887343_l.jpg', false, 2),
  ('71 Priory Court',       'Delgany, Co. Wicklow',    '€395,000',       'For Sale', 'residential', 2, 1, 1, '83.9 m²',  'https://www.mcgovernestates.ie/residential/brochure/71-priory-court-delgany-wicklow/4838518',           'https://photos-a.propertyimages.ie/media/8/1/5/4838518/5d6d566e-288b-43ca-8e73-49c2de7bb10a_l.jpg', false, 3),
  ('Apt 4, Marina Village', 'Greystones, Co. Wicklow', '€1,950 / month', 'To Let',   'letting',     2, 1, 1, '72 m²',    'https://www.mcgovernestates.ie/residentiallettingservice',                                            'https://photos-a.propertyimages.ie/media/2/4/3/4982342/1b52e8c5-0c9b-4dc3-9c44-07e6de8c8334_l.jpg', false, 4),
  ('1 Delgany Glen',        'Greystones, Co. Wicklow', '€675,000',       'For Sale', 'residential', 3, 2, 2, '116.5 m²', 'https://www.mcgovernestates.ie/residential/brochure/1-delgany-glen-greystones-wicklow/4981648',       'https://photos-a.propertyimages.ie/media/8/4/6/4981648/ea098485-18ab-4d68-8872-51c9daa26b33_l.jpg', false, 5);

-- ============================================================
-- 5. Storage bucket — run AFTER creating the bucket in the dashboard
--    Dashboard → Storage → New Bucket → "property-images" → Public: ON
--    Then run these policies:
-- ============================================================

CREATE POLICY "Public can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Admins can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images' AND auth.role() = 'authenticated');

CREATE POLICY "Admins can delete property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');
