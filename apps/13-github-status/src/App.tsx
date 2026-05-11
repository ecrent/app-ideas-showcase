import { useEffect, useState } from 'react';

interface Component {
  id: string;
  name: string;
  status: string;
  description: string;
}

interface StatusData {
  status: {
    indicator: string;
    description: string;
  };
  components: Component[];
  updated_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  operational: { bg: 'bg-green-50', text: 'text-green-900', dot: 'bg-green-500' },
  degraded_performance: { bg: 'bg-yellow-50', text: 'text-yellow-900', dot: 'bg-yellow-500' },
  partial_outage: { bg: 'bg-orange-50', text: 'text-orange-900', dot: 'bg-orange-500' },
  major_outage: { bg: 'bg-red-50', text: 'text-red-900', dot: 'bg-red-500' },
  investigating: { bg: 'bg-blue-50', text: 'text-blue-900', dot: 'bg-blue-500' },
};

export default function App() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://www.githubstatus.com/api/v2/status.json');
        if (!response.ok) throw new Error('Failed to fetch status');
        const json = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load status');
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || STATUS_COLORS.operational;
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading GitHub status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  const overallStatus = getStatusColor(data.status.indicator);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">GitHub Status</h1>
          <p className="text-gray-600">System status and component health</p>
        </div>

        <div className={`rounded-lg shadow-sm border p-6 mb-8 ${overallStatus.bg}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-4 h-4 rounded-full ${overallStatus.dot}`}></div>
            <h2 className={`text-2xl font-bold ${overallStatus.text}`}>
              {getStatusLabel(data.status.indicator)}
            </h2>
          </div>
          <p className={overallStatus.text}>{data.status.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold text-gray-900">Components</h3>
          </div>
          <div className="divide-y">
            {data.components.map((component) => {
              const colors = getStatusColor(component.status);
              return (
                <div key={component.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className={`w-3 h-3 rounded-full ${colors.dot}`}></div>
                        <h4 className="font-semibold text-gray-900">{component.name}</h4>
                        <span className={`text-sm ${colors.text}`}>
                          {getStatusLabel(component.status)}
                        </span>
                      </div>
                      {component.description && (
                        <p className="text-sm text-gray-600 ml-5">{component.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          Last updated: {new Date(data.updated_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}
