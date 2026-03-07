export function StatCard({ icon, label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'border-l-primary bg-blue-50',
    green: 'border-l-secondary bg-green-50',
    red: 'border-l-danger bg-red-50',
    amber: 'border-l-warning bg-amber-50',
  };

  return (
    <div className={`card border-l-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold mt-2 text-dark">{value}</p>
        </div>
        <div className="text-5xl">{icon}</div>
      </div>
    </div>
  );
}