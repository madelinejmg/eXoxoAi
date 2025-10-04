/*
  # Create exoplanets table with 4 categories

  1. New Tables
    - `exoplanets`
      - `id` (uuid, primary key) - Unique identifier
      - `name` (text) - Planet name
      - `category` (text) - One of 4 categories: Gas Giant, Ice Giant, Rocky, Super Earth
      - `distance_ly` (numeric) - Distance from Earth in light years
      - `radius_earth` (numeric) - Radius relative to Earth
      - `mass_earth` (numeric) - Mass relative to Earth
      - `temperature_k` (numeric) - Surface temperature in Kelvin
      - `orbital_period_days` (numeric) - Orbital period in days
      - `discovery_year` (integer) - Year discovered
      - `x_position` (numeric) - X coordinate for visualization
      - `y_position` (numeric) - Y coordinate for visualization
      - `z_position` (numeric) - Z coordinate for visualization (depth)
      - `created_at` (timestamptz) - Record creation timestamp
  
  2. Security
    - Enable RLS on `exoplanets` table
    - Add policy for public read access (visualization is public)
  
  3. Sample Data
    - Insert sample exoplanets across all 4 categories with realistic data
*/

CREATE TABLE IF NOT EXISTS exoplanets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL CHECK (category IN ('Gas Giant', 'Ice Giant', 'Rocky', 'Super Earth')),
  distance_ly numeric NOT NULL,
  radius_earth numeric NOT NULL,
  mass_earth numeric NOT NULL,
  temperature_k numeric NOT NULL,
  orbital_period_days numeric NOT NULL,
  discovery_year integer NOT NULL,
  x_position numeric NOT NULL,
  y_position numeric NOT NULL,
  z_position numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exoplanets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access to exoplanets"
  ON exoplanets
  FOR SELECT
  TO anon
  USING (true);

-- Insert sample exoplanets across 4 categories
INSERT INTO exoplanets (name, category, distance_ly, radius_earth, mass_earth, temperature_k, orbital_period_days, discovery_year, x_position, y_position, z_position) VALUES
  -- Gas Giants
  ('HD 209458 b', 'Gas Giant', 159, 1.38, 220, 1400, 3.5, 1999, -120, 80, 30),
  ('51 Pegasi b', 'Gas Giant', 50.45, 1.9, 150, 1200, 4.2, 1995, 40, -30, -20),
  ('TrES-2b', 'Gas Giant', 750, 1.27, 1.44, 1800, 2.5, 2006, -200, 150, 60),
  ('WASP-12b', 'Gas Giant', 871, 1.79, 446, 2600, 1.1, 2008, 180, -120, -40),
  ('HD 189733 b', 'Gas Giant', 64.5, 1.14, 360, 1200, 2.2, 2005, -60, 50, 10),
  ('KELT-9b', 'Gas Giant', 670, 1.89, 2700, 4050, 1.5, 2016, 150, 100, -30),
  ('Jupiter Analog', 'Gas Giant', 320, 1.1, 318, 165, 4332, 2015, 80, -90, 40),
  
  -- Ice Giants
  ('GJ 436 b', 'Ice Giant', 31.8, 0.37, 23, 712, 2.6, 2004, 25, 15, -15),
  ('HAT-P-11b', 'Ice Giant', 122, 0.42, 26, 878, 4.9, 2009, -90, -60, 25),
  ('Kepler-18c', 'Ice Giant', 1080, 0.51, 17, 650, 7.6, 2011, 220, 140, -50),
  ('K2-18 b', 'Ice Giant', 124, 0.24, 8.6, 270, 33, 2015, -110, 70, 35),
  ('TOI-270 d', 'Ice Giant', 73, 0.23, 4.8, 350, 11.4, 2019, 50, -45, 20),
  ('GJ 3470 b', 'Ice Giant', 96, 0.38, 14, 650, 3.3, 2012, -140, 90, -25),
  
  -- Rocky Planets
  ('Kepler-452b', 'Rocky', 1402, 1.63, 5, 265, 385, 2015, 300, 200, -70),
  ('Proxima Centauri b', 'Rocky', 4.24, 1.17, 1.3, 234, 11.2, 2016, 3, -2, 1),
  ('TRAPPIST-1e', 'Rocky', 39.5, 0.91, 0.77, 251, 6.1, 2017, -35, 28, -8),
  ('Kepler-442b', 'Rocky', 1206, 1.34, 2.3, 233, 112, 2015, 250, -180, 55),
  ('LHS 1140 b', 'Rocky', 40.7, 1.43, 6.6, 230, 24.7, 2017, 32, -25, 12),
  ('TOI-700 e', 'Rocky', 101, 0.95, 0.82, 267, 27.8, 2023, -85, 65, -30),
  ('Wolf 1061c', 'Rocky', 13.8, 1.66, 4.3, 223, 17.9, 2015, -12, 9, -5),
  ('Kepler-62f', 'Rocky', 1200, 1.41, 2.8, 208, 267, 2013, -260, 170, 80),
  
  -- Super Earths
  ('Kepler-22b', 'Super Earth', 620, 2.4, 9.1, 295, 290, 2011, 140, -110, 45),
  ('Gliese 667 Cc', 'Super Earth', 23.6, 1.54, 3.8, 277, 28.1, 2011, -20, 16, -7),
  ('Kepler-69c', 'Super Earth', 2700, 1.7, 5.7, 299, 242, 2013, -350, 280, -90),
  ('HD 40307 g', 'Super Earth', 42, 2.0, 7.1, 198, 197, 2012, 38, -32, 15),
  ('55 Cancri e', 'Super Earth', 41, 1.99, 8.6, 2700, 0.7, 2004, -36, 30, -14),
  ('Kepler-186f', 'Super Earth', 582, 1.17, 1.4, 188, 130, 2014, 130, 95, -42),
  ('GJ 1214 b', 'Super Earth', 48, 2.85, 6.5, 555, 1.6, 2009, 42, -38, 18),
  ('Kepler-1649c', 'Super Earth', 301, 1.06, 1.2, 234, 19.5, 2020, -95, 72, 28);
