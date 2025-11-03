import type { Stats } from "../types/patient";

interface DashboardProps {
  stats: Stats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      label: "Total Patients",
      value: stats.totalPatients,
      color: "bg-blue-500",
      icon: "👥",
    },
    {
      label: "Currently Admitted",
      value: stats.admittedPatients,
      color: "bg-yellow-500",
      icon: "🏥",
    },
    {
      label: "Ready for Review",
      value: stats.readyForReviewPatients,
      color: "bg-green-500",
      icon: "✅",
    },
    {
      label: "Discharged",
      value: stats.dischargedPatients,
      color: "bg-gray-500",
      icon: "🏠",
    },
  ];

  console.log(stats.averageLengthOfStay);

  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              </div>
              <div
                className={`${stat.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}
              >
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 mb-1">Average Length of Stay</p>
            <p className="text-3xl font-bold text-gray-800">
              {stats.averageLengthOfStay} days
            </p>
          </div>
          <div className="bg-purple-500 w-12 h-12 rounded-full flex items-center justify-center text-2xl">
            📊
          </div>
        </div>
      </div>
    </div>
  );
}
