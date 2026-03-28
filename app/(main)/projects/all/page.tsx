"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt?: string;
  assigneeId: string;
  assigneeName: string;
}

const STATUS_ORDER = [
  "todo",
  "inprogress",
  "uat",
  "prod",
  "completed",
] as const;

const STATUS_LABEL: Record<string, string> = {
  todo: "TODO",
  inprogress: "In progress",
  uat: "UAT",
  prod: "Production",
  completed: "Completed",
};

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{project.name}</h2>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <span className="inline-block text-xs font-medium text-gray-600 bg-gray-100 rounded-full px-2 py-0.5 mb-4">
        {STATUS_LABEL[project.status] ?? project.status}
      </span>

      {project.assigneeName && (
        <p className="text-gray-600 mb-4">Assignee: {project.assigneeName}</p>
      )}

      {project.dueDate && (
        <p className="text-gray-600 mb-4">
          Due: {new Date(project.dueDate).toLocaleString()}
        </p>
      )}

      {project.createdAt && (
        <p className="text-gray-600 mb-4">
          Created: {new Date(project.createdAt).toLocaleString()}
        </p>
      )}
      <Link
        href={`/projects/edit/${project._id}`}
        className="text-blue-500 hover:text-blue-700"
      >
        View Project
      </Link>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects/all");
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch projects");
        }

        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const { grouped, unknown } = useMemo(() => {
    const grouped = STATUS_ORDER.reduce<Record<string, Project[]>>((acc, key) => {
      acc[key] = projects.filter((p) => p.status === key);
      return acc;
    }, {} as Record<string, Project[]>);

    const unknown = projects.filter(
      (p) => !STATUS_ORDER.includes(p.status as (typeof STATUS_ORDER)[number])
    );

    return { grouped, unknown };
  }, [projects]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading projects...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          All Projects
        </h1>

        {projects.length === 0 ? (
          <p className="text-center text-gray-500">No projects found.</p>
        ) : (
          <div className="space-y-10">
            {STATUS_ORDER.map((statusKey) => {
              const list = grouped[statusKey];
              if (!list.length) return null;

              return (
                <section key={statusKey}>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    {STATUS_LABEL[statusKey]}
                  </h2>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {list.map((project) => (
                      <ProjectCard key={String(project._id)} project={project} />
                    ))}
                  </div>
                </section>
              );
            })}

            {unknown.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                  Other
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {unknown.map((project) => (
                    <ProjectCard key={String(project._id)} project={project} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
