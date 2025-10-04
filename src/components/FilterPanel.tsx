import { FilterOptions } from '../types/exoplanet';
import { Filter, X } from 'lucide-react';

interface FilterPanelProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  planetCount: number;
}

const CATEGORIES = ['Gas Giant', 'Ice Giant', 'Rocky', 'Super Earth'];

export function FilterPanel({ filters, setFilters, isOpen, setIsOpen, planetCount }: FilterPanelProps) {
  const toggleCategory = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    setFilters({ ...filters, categories: newCategories });
  };

  const resetFilters = () => {
    setFilters({
      categories: CATEGORIES,
      distanceRange: [0, 3000],
      radiusRange: [0, 3],
      massRange: [0, 3000],
      temperatureRange: [0, 5000],
      yearRange: [1990, 2024],
    });
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 bg-slate-900/80 hover:bg-slate-800/90 text-white px-5 py-3 rounded-lg backdrop-blur-sm border border-white/10 transition-all flex items-center gap-2 shadow-lg"
      >
        <Filter size={20} />
        <span className="font-medium">Filters</span>
        <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded text-sm">{planetCount}</span>
      </button>

      <div
        className={`fixed top-0 left-0 h-full bg-slate-900/95 backdrop-blur-md text-white transition-transform duration-300 z-40 border-r border-white/10 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ width: '360px' }}
      >
        <div className="p-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Filter Exoplanets</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">Category</h3>
                <button
                  onClick={resetFilters}
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Reset All
                </button>
              </div>
              <div className="space-y-2">
                {CATEGORIES.map(category => (
                  <label
                    key={category}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={filters.categories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="w-5 h-5 rounded accent-blue-500"
                    />
                    <span className="flex-1">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/10" />

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Distance (Light Years)
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.distanceRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        distanceRange: [Number(e.target.value), filters.distanceRange[1]],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.distanceRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        distanceRange: [filters.distanceRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="3000"
                  step="10"
                  value={filters.distanceRange[1]}
                  onChange={e =>
                    setFilters({
                      ...filters,
                      distanceRange: [filters.distanceRange[0], Number(e.target.value)],
                    })
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Radius (Earth = 1)
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="number"
                    step="0.1"
                    value={filters.radiusRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        radiusRange: [Number(e.target.value), filters.radiusRange[1]],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={filters.radiusRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        radiusRange: [filters.radiusRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Mass (Earth = 1)
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.massRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        massRange: [Number(e.target.value), filters.massRange[1]],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.massRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        massRange: [filters.massRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Temperature (Kelvin)
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.temperatureRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        temperatureRange: [Number(e.target.value), filters.temperatureRange[1]],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.temperatureRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        temperatureRange: [filters.temperatureRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300 mb-3">
                Discovery Year
              </h3>
              <div className="space-y-2">
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={filters.yearRange[0]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        yearRange: [Number(e.target.value), filters.yearRange[1]],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    value={filters.yearRange[1]}
                    onChange={e =>
                      setFilters({
                        ...filters,
                        yearRange: [filters.yearRange[0], Number(e.target.value)],
                      })
                    }
                    className="flex-1 bg-slate-800/50 border border-white/10 rounded-lg px-3 py-2 text-sm"
                    placeholder="Max"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
