import { useEffect, useRef, useState } from 'react';
import { Exoplanet } from '../types/exoplanet';

interface SpaceVisualizationProps {
  exoplanets: Exoplanet[];
  onPlanetClick: (planet: Exoplanet) => void;
  hoveredPlanet: Exoplanet | null;
  setHoveredPlanet: (planet: Exoplanet | null) => void;
}

const CATEGORY_COLORS = {
  'Gas Giant': '#FFA500',
  'Ice Giant': '#4FC3F7',
  'Rocky': '#D32F2F',
  'Super Earth': '#7CB342',
};

export function SpaceVisualization({
  exoplanets,
  onPlanetClick,
  hoveredPlanet,
  setHoveredPlanet
}: SpaceVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([]);

  useEffect(() => {
    const generatedStars = Array.from({ length: 200 }, () => ({
      x: Math.random() * 2000 - 1000,
      y: Math.random() * 2000 - 1000,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
    }));
    setStars(generatedStars);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const animate = () => {
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      ctx.save();
      ctx.translate(centerX, centerY);

      stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      exoplanets.forEach(planet => {
        const rotatedX = planet.x_position * Math.cos(rotation) - planet.z_position * Math.sin(rotation);
        const rotatedZ = planet.x_position * Math.sin(rotation) + planet.z_position * Math.cos(rotation);

        const scale = 1 + (rotatedZ / 500);
        const displayX = rotatedX * scale;
        const displayY = planet.y_position * scale;

        const baseSize = Math.max(4, planet.radius_earth * 3);
        const size = baseSize * scale;

        const isHovered = hoveredPlanet?.id === planet.id;
        const color = CATEGORY_COLORS[planet.category];

        const normalizedDensity = Math.min(Math.max(planet.density_gcc / 8, 0.3), 1.0);

        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = color;
        } else {
          ctx.shadowBlur = 10;
          ctx.shadowColor = color;
        }

        const hexToRgb = (hex: string) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : { r: 255, g: 255, b: 255 };
        };

        const rgb = hexToRgb(color);
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${normalizedDensity})`;
        ctx.beginPath();
        ctx.arc(displayX, displayY, size, 0, Math.PI * 2);
        ctx.fill();

        if (isHovered) {
          ctx.strokeStyle = 'white';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(displayX, displayY, size + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.shadowBlur = 0;
      });

      ctx.restore();
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, [exoplanets, rotation, hoveredPlanet, stars]);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => prev + 0.002);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left - canvas.width / 2;
    const clickY = e.clientY - rect.top - canvas.height / 2;

    for (const planet of exoplanets) {
      const rotatedX = planet.x_position * Math.cos(rotation) - planet.z_position * Math.sin(rotation);
      const rotatedZ = planet.x_position * Math.sin(rotation) + planet.z_position * Math.cos(rotation);

      const scale = 1 + (rotatedZ / 500);
      const displayX = rotatedX * scale;
      const displayY = planet.y_position * scale;

      const baseSize = Math.max(4, planet.radius_earth * 3);
      const size = baseSize * scale;

      const distance = Math.sqrt((clickX - displayX) ** 2 + (clickY - displayY) ** 2);

      if (distance <= size) {
        onPlanetClick(planet);
        return;
      }
    }
  };

  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - canvas.width / 2;
    const mouseY = e.clientY - rect.top - canvas.height / 2;

    let foundPlanet: Exoplanet | null = null;

    for (const planet of exoplanets) {
      const rotatedX = planet.x_position * Math.cos(rotation) - planet.z_position * Math.sin(rotation);
      const rotatedZ = planet.x_position * Math.sin(rotation) + planet.z_position * Math.cos(rotation);

      const scale = 1 + (rotatedZ / 500);
      const displayX = rotatedX * scale;
      const displayY = planet.y_position * scale;

      const baseSize = Math.max(4, planet.radius_earth * 3);
      const size = baseSize * scale;

      const distance = Math.sqrt((mouseX - displayX) ** 2 + (mouseY - displayY) ** 2);

      if (distance <= size) {
        foundPlanet = planet;
        break;
      }
    }

    setHoveredPlanet(foundPlanet);
  };

  return (
    <div className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredPlanet(null)}
        className="w-full h-full cursor-pointer"
      />

      {hoveredPlanet && (
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white px-4 py-3 rounded-lg backdrop-blur-sm border border-white/20 pointer-events-none"
          style={{ minWidth: '200px' }}
        >
          <div className="font-semibold text-lg mb-1">{hoveredPlanet.name}</div>
          <div className="text-sm opacity-80">{hoveredPlanet.category}</div>
        </div>
      )}
    </div>
  );
}
