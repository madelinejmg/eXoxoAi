const CATEGORIES = [
  { name: 'Gas Giant', color: '#FFA500' },
  { name: 'Neptune-like', color: '#4FC3F7' },
  { name: 'Terrestrial', color: '#D32F2F' },
  { name: 'Super Earth', color: '#7CB342' },
];

export function Legend() {
  return (
<div className="fixed bottom-20 right-6 bg-slate-900/80 backdrop-blur-sm rounded-lg p-4 border border-white/10 shadow-lg">
      <h3 className="text-white text-sm font-semibold mb-3 uppercase tracking-wider">Category</h3>
      <div className="space-y-2">
        {CATEGORIES.map(category => (
          <div key={category.name} className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full shadow-lg"
              style={{
                backgroundColor: category.color,
                boxShadow: `0 0 10px ${category.color}80`,
              }}
            />
            <span className="text-white text-sm">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
