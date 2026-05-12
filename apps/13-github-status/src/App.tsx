import { useEffect, useState } from 'react';

interface Component {
  id: string;
  name: string;
  status: string;
  description: string;
}

interface Incident {
  id: string;
  name: string;
  status: string;
  created_at: string;
  updated_at: string;
  impact: string;
}

interface StatusData {
  status: {
    indicator: string;
    description: string;
  };
  components: Component[];
  incidents: Incident[];
  updated_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  operational: { bg: 'bg-green-50', text: 'text-green-900', dot: 'bg-green-500', border: 'border-green-200' },
  degraded_performance: { bg: 'bg-yellow-50', text: 'text-yellow-900', dot: 'bg-yellow-500', border: 'border-yellow-200' },
  partial_outage: { bg: 'bg-orange-50', text: 'text-orange-900', dot: 'bg-orange-500', border: 'border-orange-200' },
  major_outage: { bg: 'bg-red-50', text: 'text-red-900', dot: 'bg-red-500', border: 'border-red-200' },
  investigating: { bg: 'bg-blue-50', text: 'text-blue-900', dot: 'bg-blue-500', border: 'border-blue-200' },
};

const formatStatusLabel = (status: string): string => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function App() {
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      setError(null);
      const response = await fetch('https://www.githubstatus.com/api/v2/status.json');
      if (!response.ok) throw new Error('Failed to fetch status');
      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load status');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status] || STATUS_COLORS.operational;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-200 border-t-blue-500"></div>
          <p className="mt-4 text-slate-600 font-medium">Loading GitHub status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="inline-block p-3 bg-red-100 rounded-full mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Failed to Load</h1>
          <p className="text-slate-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <p className="text-slate-600">No data available</p>
      </div>
    );
  }

  const overallStatus = getStatusColor(data.status.indicator);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub Status
            </h1>
            <p className="text-slate-600 text-lg">Real-time system status and component health</p>
          </div>
          <button
            onClick={fetchStatus}
            disabled={refreshing}
            className="px-6 py-2.5 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 active:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm hover:shadow-md"
          >
            {refreshing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Refreshing
              </div>
            ) : (
              'Refresh'
            )}
          </button>
        </div>

        <div className={`rounded-xl shadow-md border-2 p-6 mb-10 ${overallStatus.bg} ${overallStatus.border} transition-all`}>
          <div className="flex items-start gap-4">
            <div className={`w-5 h-5 rounded-full ${overallStatus.dot} flex-shrink-0 mt-0.5 animate-pulse`}></div>
            <div>
              <h2 className={`text-3xl font-bold ${overallStatus.text} mb-1`}>
                {formatStatusLabel(data.status.indicator)}
              </h2>
              <p className={`${overallStatus.text} text-lg`}>{data.status.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
          <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Components
            </h3>
          </div>
          <div className="divide-y divide-slate-200">
            {data.components.map((component) => {
              const colors = getStatusColor(component.status);
              return (
                <div key={component.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0 mt-1.5`}></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-slate-900">{component.name}</h4>
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} whitespace-nowrap`}>
                          {formatStatusLabel(component.status)}
                        </span>
                      </div>
                      {component.description && (
                        <p className="text-sm text-slate-600">{component.description}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {data.incidents && data.incidents.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Recent Incidents
              </h3>
            </div>
            <div className="divide-y divide-slate-200">
              {data.incidents.slice(0, 5).map((incident) => {
                const colors = getStatusColor(incident.status);
                return (
                  <div key={incident.id} className="px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3 mb-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} flex-shrink-0 mt-1.5`}></div>
                      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{incident.name}</h4>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} w-fit whitespace-nowrap`}>
                          {incident.impact.charAt(0).toUpperCase() + incident.impact.slice(1)} Impact
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 ml-5">
                      Started {formatDate(incident.created_at)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-center text-sm text-slate-500 pt-4 border-t border-slate-200">
          <p>Last updated: <span className="font-medium text-slate-600">{formatDate(data.updated_at)}</span></p>
          <p className="text-xs mt-2">Refreshes automatically every 60 seconds</p>
        </div>
      </div>
    </div>
  );
}
