type Row = { label: string; value: string | number | null | undefined };

export function VehicleSpecTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e0e0e0] bg-white">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-[#e0e0e0] last:border-0">
              <td className="bg-[#f5f5f5] px-4 py-3 font-medium text-[#6b7280]">{r.label}</td>
              <td className="px-4 py-3 text-[#0a0a0a]">{r.value ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
