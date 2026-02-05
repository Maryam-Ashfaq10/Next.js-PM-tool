"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  createdAt?: string;
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {project.name}
                </h2>
                <p className="text-gray-600 mb-4 ">
                  {project.description}
                </p>
                <p className="text-gray-600 mb-4 ">
                  {project.status}
                </p>

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
                  className="text-blue-500 hover:text-blue-700">
                  View Project
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
