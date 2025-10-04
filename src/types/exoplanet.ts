export interface Exoplanet {
  id: string;
  name: string;
  category: 'Gas Giant' | 'Ice Giant' | 'Rocky' | 'Super Earth';
  distance_ly: number;
  radius_earth: number;
  mass_earth: number;
  temperature_k: number;
  orbital_period_days: number;
  discovery_year: number;
  density_gcc: number;
  x_position: number;
  y_position: number;
  z_position: number;
  created_at: string;
}

export interface FilterOptions {
  categories: string[];
  distanceRange: [number, number];
  radiusRange: [number, number];
  massRange: [number, number];
  temperatureRange: [number, number];
  yearRange: [number, number];
}
