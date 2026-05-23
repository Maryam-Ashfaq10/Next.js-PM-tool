'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface User {
  name: string;
}

const STATUS_LABEL: Record<string, string> = {
  todo: 'TODO',
  inprogress: 'In progress',
  uat: 'UAT',
  prod: 'Production',
  completed: 'Completed',
};

const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-slate-400',
  inprogress: 'bg-blue-500',
  uat: 'bg-amber-500',
  prod: 'bg-violet-500',
  completed: 'bg-emerald-500',
};

// Replace with API fetch later
const DUMMY = {
  stats: {
    total: 24,
    inProgress: 8,
    dueThisWeek: 5,
    overdue: 3,
    completed: 11,
  },
  byStatus: [
    { status: 'todo', count: 4 },
    { status: 'inprogress', count: 8 },
    { status: 'uat', count: 3 },
    { status: 'prod', count: 2 },
    { status: 'completed', count: 7 },
  ],
  dueSoon: [
    {
      id: '1',
      name: 'Website redesign',
      status: 'inprogress',
      dueDate: '2026-05-25T17:00:00.000Z',
      assigneeName: 'Alex Kim',
    },
    {
      id: '2',
      name: 'Mobile app MVP',
      status: 'uat',
      dueDate: '2026-05-24T12:00:00.000Z',
      assigneeName: 'You',
    },
    {
      id: '3',
      name: 'API migration',
      status: 'todo',
      dueDate: '2026-05-22T09:00:00.000Z',
      assigneeName: 'Jordan Lee',
    },
  ],
  recentActivity: [
    {
      id: 'a1',
      message: 'moved to UAT',
      projectName: 'Mobile app MVP',
      at: '2026-05-23T10:30:00.000Z',
    },
    {
      id: 'a2',
      message: 'created project',
      projectName: 'Q3 marketing campaign',
      at: '2026-05-23T09:15:00.000Z',
    },
    {
      id: 'a3',
      message: 'marked completed',
      projectName: 'Onboarding docs',
      at: '2026-05-22T16:45:00.000Z',
    },
    {
      id: 'a4',
      message: 'due date updated',
      projectName: 'Website redesign',
      at: '2026-05-22T11:00:00.000Z',
    },
  ],
};

function formatDue(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const label = d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
  if (diffDays < 0) return { label, tone: 'text-red-600', badge: 'Overdue' };
  if (diffDays === 0) return { label, tone: 'text-amber-600', badge: 'Today' };
  if (diffDays <= 7) return { label, tone: 'text-amber-700', badge: `${diffDays}d` };
  return { label, tone: 'text-gray-600', badge: null };
}

function StatCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: number;
  hint?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { stats, byStatus, dueSoon, recentActivity } = DUMMY;
  const statusTotal = byStatus.reduce((s, x) => s + x.count, 0) || 1;

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/userProfile');
        const data = await res.json();
        if (res.ok) setUser({ name: data.name });
      } catch {
        // generic greeting
      }
    };
    fetchMe();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Hi{user ? `, ${user.name}` : ''}
          </h1>
          <p className="text-gray-500 mt-1">
            Overview of your projects and what needs attention.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/projects/all"
            className="px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50"
          >
            All projects
          </Link>
          <Link
            href="/projects/create"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600"
          >
            New project
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total projects" value={stats.total} />
        <StatCard title="In progress" value={stats.inProgress} />
        <StatCard title="Due this week" value={stats.dueThisWeek} />
        <StatCard title="Overdue" value={stats.overdue} hint="Needs action" />
        <StatCard title="Completed" value={stats.completed} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <section className="lg:col-span-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Projects by status
          </h2>
          <ul className="space-y-4">
            {byStatus.map(({ status, count }) => (
              <li key={status}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">
                    {STATUS_LABEL[status] ?? status}
                  </span>
                  <span className="font-medium text-gray-900">{count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                    style={{ width: `${(count / statusTotal) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Due soon */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Due soon</h2>
            <Link href="/projects/all" className="text-sm text-blue-500 hover:text-blue-700">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="pb-2 font-medium">Project</th>
                  <th className="pb-2 font-medium">Status</th>
                  <th className="pb-2 font-medium">Assignee</th>
                  <th className="pb-2 font-medium text-right">Due</th>
                </tr>
              </thead>
              <tbody>
                {dueSoon.map((p) => {
                  const due = formatDue(p.dueDate);
                  return (
                    <tr key={p.id} className="border-b border-gray-50 last:border-0">
                      <td className="py-3">
                        <Link
                          href={`/projects/edit/${p.id}`}
                          className="font-medium text-gray-900 hover:text-blue-600"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="py-3">
                        <span className="text-xs font-medium bg-gray-100 text-gray-600 rounded-full px-2 py-0.5">
                          {STATUS_LABEL[p.status] ?? p.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{p.assigneeName}</td>
                      <td className={`py-3 text-right ${due.tone}`}>
                        {due.label}
                        {due.badge && (
                          <span className="ml-2 text-xs font-semibold uppercase">
                            {due.badge}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Recent activity */}
      <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h2>
        <ul className="divide-y divide-gray-100">
          {recentActivity.map((item) => (
            <li key={item.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <p className="text-gray-800">
                <span className="font-medium">{item.projectName}</span>{' '}
                <span className="text-gray-600">{item.message}</span>
              </p>
              <time className="text-xs text-gray-400 shrink-0">
                {new Date(item.at).toLocaleString()}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}