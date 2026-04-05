export function VehicleFeatureBadges({ features }: { features: string[] }) {
  if (features.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {features.map((f) => (
        <span
          key={f}
          className="inline-flex items-center gap-1 rounded-full border border-[#e0e0e0] bg-white px-3 py-1 text-sm text-[#0a0a0a]"
        >
          <span className="text-[#0c47a5]">✓</span> {f}
        </span>
      ))}
    </div>
  );
}
