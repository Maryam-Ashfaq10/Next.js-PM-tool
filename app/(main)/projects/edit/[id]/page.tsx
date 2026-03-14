"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Project {
  _id: string;
  name: string;
  description: string;
  status: string;
  dueDate: string;
  assigneeId: string;
  assigneeName: string;
  comments: string;
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users/all");
        const data = await res.json();
        if (!res.ok) {
          console.error(data.message || "Failed to fetch users");
          return;
        }
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch project");
        }

        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProject();
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    if (!project) return;
    const { name, value } = e.target;
  
    if (name === "assigneeId") {
      const user = users.find((u) => u.id === value);
      const displayName = user ? (user.name || user.email || "") : "";
  
      setProject({
        ...project,
        assigneeId: value,
        assigneeName: displayName,
      });
    } else {
      setProject({
        ...project,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update project");
      }

      // Go back to all projects (or wherever you want)
      router.push("/projects/all");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading project...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-100 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Edit project
        </h1>
       

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project name */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Project name
            </label>
            <input
              type="text"
              name="name"
              value={project?.name ?? ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={project?.description ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Status + Assignee */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={project?.status ?? ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="todo">TODO</option>
                <option value="inprogress">IN PROGRESS</option>
                <option value="uat">UAT</option>
                <option value="prod">PRODUCTION</option>
                <option value="completed">COMPLETED</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Assignee
              </label>
              <select
                name="assigneeId"
                value={project?.assigneeId ?? ""}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
              {project?.assigneeName && (
                <p className="text-xs text-gray-500 mt-1">
                  Current: {project.assigneeName}
                </p>
              )}
            </div>
          </div>

          {/* Due date */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Due date
            </label>
            <input
              type="date"
              name="dueDate"
              value={project?.dueDate ?? ""}
              onChange={handleChange}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Comments */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Comments
            </label>
            <textarea
              name="comments"
              value={project?.comments ?? ""}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Actions + error */}
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}