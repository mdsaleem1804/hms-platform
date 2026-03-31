'use client';

import { useEffect, useMemo, useState } from 'react';
import { Activity, CalendarDays, IndianRupee, Users } from 'lucide-react';
import dashboardService, {
  AppointmentStatusMetric,
  DashboardMetrics,
  DailyTrendPoint,
} from '@/services/dashboardService';

const STATUS_COLORS = ['bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-violet-500', 'bg-cyan-500'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const toLabel = (value: string) => {
  if (!value) return 'Unknown';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

function SummaryCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
          <p className="mt-2 text-xs text-gray-500">{hint}</p>
        </div>
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700">{icon}</div>
      </div>
    </article>
  );
}

function StatusBreakdownChart({ items }: { items: AppointmentStatusMetric[] }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  if (!items.length) {
    return <p className="text-sm text-gray-500">No appointments recorded for today.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.status}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">{toLabel(item.status)}</span>
              <span className="text-gray-500">{item.count} ({percentage}%)</span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full ${STATUS_COLORS[index % STATUS_COLORS.length]}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DailyTrendsChart({ points }: { points: DailyTrendPoint[] }) {
  const max = points.reduce(
    (acc, point) => Math.max(acc, point.patients, point.appointments),
    0
  );

  if (!points.length) {
    return <p className="text-sm text-gray-500">No trend data available.</p>;
  }

  const scale = max > 0 ? max : 1;

  return (
    <div className="space-y-3">
      {points.map((point) => {
        const label = new Date(point.date).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
        });

        return (
          <div key={point.date} className="grid grid-cols-[70px,1fr] items-center gap-3">
            <span className="text-xs font-medium text-gray-500">{label}</span>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <div className="h-2 rounded bg-blue-500" style={{ width: `${(point.patients / scale) * 100}%` }} />
                <span className="text-xs text-gray-600">Patients {point.patients}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 rounded bg-emerald-500" style={{ width: `${(point.appointments / scale) * 100}%` }} />
                <span className="text-xs text-gray-600">Appointments {point.appointments}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadMetrics = async () => {
      try {
        setLoading(true);
        const metricsResult = await dashboardService.getMetrics(7);

        if (!isMounted) return;
        setMetrics(metricsResult);
        setError('');
      } catch (e) {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load dashboard metrics');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    const refreshMetricsOnly = async () => {
      try {
        const latest = await dashboardService.getMetrics(7);
        if (!isMounted) return;
        setMetrics(latest);
      } catch {
      }
    };

    loadMetrics();
    const timer = window.setInterval(refreshMetricsOnly, 60000);

    return () => {
      isMounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const summary = metrics?.summary;
  const statusBreakdown = metrics?.appointmentStatusBreakdown ?? [];
  const dailyTrends = metrics?.dailyTrends ?? [];

  const totalTrendAppointments = useMemo(
    () => dailyTrends.reduce((sum, point) => sum + point.appointments, 0),
    [dailyTrends]
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Hospital Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Live operational metrics for front-desk and care teams.</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Today's Patients"
          value={loading ? '...' : String(summary?.todaysPatients ?? 0)}
          hint="New registrations created today"
          icon={<Users size={18} />}
        />
        <SummaryCard
          title="Today's Appointments"
          value={loading ? '...' : String(summary?.todaysAppointments ?? 0)}
          hint="Total appointments scheduled for today"
          icon={<CalendarDays size={18} />}
        />
        <SummaryCard
          title="Revenue Today"
          value={loading ? '...' : formatCurrency(summary?.revenueToday ?? 0)}
          hint="Collected from today's OPD bills"
          icon={<IndianRupee size={18} />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Appointment Status Breakdown</h2>
            <Activity size={16} className="text-gray-400" />
          </div>
          <StatusBreakdownChart items={statusBreakdown} />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Daily Trends (Last 7 Days)</h2>
            <span className="text-xs text-gray-500">Appointments total: {totalTrendAppointments}</span>
          </div>
          <DailyTrendsChart points={dailyTrends} />
        </section>
      </div>
    </>
  );
}
