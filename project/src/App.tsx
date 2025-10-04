import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Exoplanet, FilterOptions } from './types/exoplanet';
import { SpaceVisualization } from './components/SpaceVisualization';
import { FilterPanel } from './components/FilterPanel';
import { PlanetDetail } from './components/PlanetDetail';
import { Legend } from './components/Legend';

function App() {
  const [exoplanets, setExoplanets] = useState<Exoplanet[]>([]);
  const [filteredPlanets, setFilteredPlanets] = useState<Exoplanet[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<Exoplanet | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<Exoplanet | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterOptions>({
    categories: ['Gas Giant', 'Ice Giant', 'Rocky', 'Super Earth'],
    distanceRange: [0, 3000],
    radiusRange: [0, 3],
    massRange: [0, 3000],
    temperatureRange: [0, 5000],
    yearRange: [1990, 2024],
  });

  useEffect(() => {
    fetchExoplanets();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [exoplanets, filters]);

  const fetchExoplanets = async () => {
    try {
      const { data, error } = await supabase
        .from('exoplanets')
        .select('*')
        .order('name');

      if (error) throw error;
      setExoplanets(data || []);
    } catch (error) {
      console.error('Error fetching exoplanets:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = exoplanets.filter(planet => {
      return (
        filters.categories.includes(planet.category) &&
        planet.distance_ly >= filters.distanceRange[0] &&
        planet.distance_ly <= filters.distanceRange[1] &&
        planet.radius_earth >= filters.radiusRange[0] &&
        planet.radius_earth <= filters.radiusRange[1] &&
        planet.mass_earth >= filters.massRange[0] &&
        planet.mass_earth <= filters.massRange[1] &&
        planet.temperature_k >= filters.temperatureRange[0] &&
        planet.temperature_k <= filters.temperatureRange[1] &&
        planet.discovery_year >= filters.yearRange[0] &&
        planet.discovery_year <= filters.yearRange[1]
      );
    });
    setFilteredPlanets(filtered);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading exoplanets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <FilterPanel
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterOpen}
        setIsOpen={setIsFilterOpen}
        planetCount={filteredPlanets.length}
      />

      <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Exoplanet Explorer
        </h1>
      </div>

      <div className="w-full h-screen">
        <SpaceVisualization
          exoplanets={filteredPlanets}
          onPlanetClick={setSelectedPlanet}
          hoveredPlanet={hoveredPlanet}
          setHoveredPlanet={setHoveredPlanet}
        />
      </div>

      <Legend />

      <PlanetDetail
        planet={selectedPlanet}
        onClose={() => setSelectedPlanet(null)}
      />
    </div>
  );
}

export default App;
