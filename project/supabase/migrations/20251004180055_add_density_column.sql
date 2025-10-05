/*
  # Add density column to exoplanets table

  1. Changes
    - Add `density_gcc` column (numeric) - Density in grams per cubic centimeter (g/cm³)
  
  2. Data Updates
    - Populate density values for all existing exoplanets
    - Density values are realistic based on planet category:
      - Gas Giants: 0.5-1.7 g/cm³ (low density, mostly hydrogen/helium)
      - Ice Giants: 1.2-2.0 g/cm³ (moderate density, ices and gases)
      - Rocky Planets: 3.9-5.5 g/cm³ (high density, silicate rocks and metals)
      - Super Earths: 2.5-8.0 g/cm³ (varies based on composition)
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'exoplanets' AND column_name = 'density_gcc'
  ) THEN
    ALTER TABLE exoplanets ADD COLUMN density_gcc numeric NOT NULL DEFAULT 1.0;
  END IF;
END $$;

-- Update Gas Giants (low density)
UPDATE exoplanets SET density_gcc = 1.33 WHERE name = 'HD 209458 b';
UPDATE exoplanets SET density_gcc = 0.69 WHERE name = '51 Pegasi b';
UPDATE exoplanets SET density_gcc = 1.21 WHERE name = 'TrES-2b';
UPDATE exoplanets SET density_gcc = 1.54 WHERE name = 'WASP-12b';
UPDATE exoplanets SET density_gcc = 0.93 WHERE name = 'HD 189733 b';
UPDATE exoplanets SET density_gcc = 1.68 WHERE name = 'KELT-9b';
UPDATE exoplanets SET density_gcc = 1.27 WHERE name = 'Jupiter Analog';

-- Update Ice Giants (moderate density)
UPDATE exoplanets SET density_gcc = 1.87 WHERE name = 'GJ 436 b';
UPDATE exoplanets SET density_gcc = 1.42 WHERE name = 'HAT-P-11b';
UPDATE exoplanets SET density_gcc = 1.55 WHERE name = 'Kepler-18c';
UPDATE exoplanets SET density_gcc = 2.07 WHERE name = 'K2-18 b';
UPDATE exoplanets SET density_gcc = 1.98 WHERE name = 'TOI-270 d';
UPDATE exoplanets SET density_gcc = 1.65 WHERE name = 'GJ 3470 b';

-- Update Rocky Planets (high density)
UPDATE exoplanets SET density_gcc = 5.24 WHERE name = 'Kepler-452b';
UPDATE exoplanets SET density_gcc = 5.42 WHERE name = 'Proxima Centauri b';
UPDATE exoplanets SET density_gcc = 5.31 WHERE name = 'TRAPPIST-1e';
UPDATE exoplanets SET density_gcc = 5.18 WHERE name = 'Kepler-442b';
UPDATE exoplanets SET density_gcc = 5.65 WHERE name = 'LHS 1140 b';
UPDATE exoplanets SET density_gcc = 5.29 WHERE name = 'TOI-700 e';
UPDATE exoplanets SET density_gcc = 5.48 WHERE name = 'Wolf 1061c';
UPDATE exoplanets SET density_gcc = 5.15 WHERE name = 'Kepler-62f';

-- Update Super Earths (varied density)
UPDATE exoplanets SET density_gcc = 3.21 WHERE name = 'Kepler-22b';
UPDATE exoplanets SET density_gcc = 4.85 WHERE name = 'Gliese 667 Cc';
UPDATE exoplanets SET density_gcc = 3.54 WHERE name = 'Kepler-69c';
UPDATE exoplanets SET density_gcc = 4.12 WHERE name = 'HD 40307 g';
UPDATE exoplanets SET density_gcc = 7.92 WHERE name = '55 Cancri e';
UPDATE exoplanets SET density_gcc = 4.67 WHERE name = 'Kepler-186f';
UPDATE exoplanets SET density_gcc = 2.58 WHERE name = 'GJ 1214 b';
UPDATE exoplanets SET density_gcc = 5.03 WHERE name = 'Kepler-1649c';
