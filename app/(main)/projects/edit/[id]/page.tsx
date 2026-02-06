"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Project {
    _id: string;
    name: string;
    description: string;
    status: string;
    dueDate: string;
}

export default function EditProjectPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

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
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement| HTMLSelectElement>
      ) => {
        if (!project) return;
        setProject({ ...project, [e.target.name]: e.target.value });
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
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Edit Project: {project?.name}
                </h1>
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-1">Project Name</label>
                        <input
                            type="text"
                            name="name"
                            value={project?.name}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            value={project?.description}
                            onChange={handleChange}
                            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                        />

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={project?.status}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="todo">TODO</option>
                                <option value="inprogress">IN PROGRESS</option>
                                <option value="uat">UAT</option>
                                <option value="prod">PRODUCTION</option>
                                <option value="completed">COMPLETED</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Due Date</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={project?.dueDate}
                                onChange={handleChange}
                                className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                        {error && <p className="text-center" style={{ color: "red" }}>{error}</p>}
                    </div>
                </form>
            </div>
        
        </div>
    )
}