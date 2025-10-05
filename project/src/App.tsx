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
  planetClasses: ['Gas Giant', 'Ice Giant', 'Rocky', 'Super Earth'],
  radiusRange: [0, 20],           // adjust range for koi_prad (radius in Earth radii)
  temperatureRange: [0, 4000],    // koi_teq (K)
  periodRange: [0, 1000],         // koi_period (days)
  showPredicted: null,            // show all by default
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
    const matchesClass = filters.planetClasses.includes(planet.planet_class ?? '');
    const matchesRadius =
      planet.koi_prad >= filters.radiusRange[0] &&
      planet.koi_prad <= filters.radiusRange[1];
    const matchesTemp =
      planet.koi_teq >= filters.temperatureRange[0] &&
      planet.koi_teq <= filters.temperatureRange[1];
    const matchesPeriod =
      planet.koi_period >= filters.periodRange[0] &&
      planet.koi_period <= filters.periodRange[1];

    let matchesPrediction = true;
    if (filters.showPredicted === true)
      matchesPrediction = planet.predicted_label === 'Predicted_Exist';
    else if (filters.showPredicted === false)
      matchesPrediction = planet.predicted_label === 'Predicted_Not_Exist';

    return matchesClass && matchesRadius && matchesTemp && matchesPeriod && matchesPrediction;
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
          eXoxoAi
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
