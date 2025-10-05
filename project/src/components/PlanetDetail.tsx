import { Exoplanet } from '../types/exoplanet';
import { X, Ruler, Weight, Thermometer, Calendar, Globe, Clock, Layers } from 'lucide-react';

interface PlanetDetailProps {
  planet: Exoplanet | null;
  onClose: () => void;
}

const CATEGORY_COLORS = {
  'Gas Giant': '#FFA500',
  'Ice Giant': '#4FC3F7',
  'Rocky': '#D32F2F',
  'Super Earth': '#7CB342',
};

export function PlanetDetail({ planet, onClose }: PlanetDetailProps) {
  if (!planet) return null;

  const color = CATEGORY_COLORS[planet.category];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-2xl max-w-2xl w-full border border-white/10 shadow-2xl overflow-hidden">
        <div
          className="h-2"
          style={{ backgroundColor: color }}
        />

        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{planet.name}</h2>
              <div
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${color}20`,
                  color: color,
                  border: `1px solid ${color}40`,
                }}
              >
                {planet.category}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-blue-400" />
                <span className="text-slate-400 text-sm font-medium">Distance</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.distance_ly.toFixed(2)}
                <span className="text-base font-normal text-slate-400 ml-2">ly</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Ruler size={20} className="text-green-400" />
                <span className="text-slate-400 text-sm font-medium">Radius</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.radius_earth.toFixed(2)}
                <span className="text-base font-normal text-slate-400 ml-2">R⊕</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Weight size={20} className="text-yellow-400" />
                <span className="text-slate-400 text-sm font-medium">Mass</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.mass_earth.toFixed(2)}
                <span className="text-base font-normal text-slate-400 ml-2">M⊕</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Thermometer size={20} className="text-red-400" />
                <span className="text-slate-400 text-sm font-medium">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.temperature_k.toFixed(0)}
                <span className="text-base font-normal text-slate-400 ml-2">K</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-purple-400" />
                <span className="text-slate-400 text-sm font-medium">Orbital Period</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.orbital_period_days.toFixed(1)}
                <span className="text-base font-normal text-slate-400 ml-2">days</span>
              </div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <Calendar size={20} className="text-cyan-400" />
                <span className="text-slate-400 text-sm font-medium">Discovered</span>
              </div>
              <div className="text-2xl font-bold text-white">{planet.discovery_year}</div>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-white/5 col-span-2">
              <div className="flex items-center gap-3 mb-2">
                <Layers size={20} className="text-orange-400" />
                <span className="text-slate-400 text-sm font-medium">Density</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {planet.density_gcc.toFixed(2)}
                <span className="text-base font-normal text-slate-400 ml-2">g/cm³</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-slate-400 text-sm">
              <span className="font-semibold text-white">Position in Space:</span> X: {planet.x_position.toFixed(1)}, Y: {planet.y_position.toFixed(1)}, Z: {planet.z_position.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
