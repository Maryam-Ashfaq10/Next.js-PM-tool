"use client";

import { useState } from "react";

export default function NewProjectPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "draft",
    dueDate: "", // 👈 new field for due date
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Creating project:", form);
    // TODO: send POST to /api/projects/create
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a New Project</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-6"
      >
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter project name"
            required
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Enter project description"
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={form.status}
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

        {/* Due Date */}
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            name="dueDate"
            min={new Date().toISOString().split("T")[0]}
            value={form.dueDate}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Create Project
        </button>
      </form>
    </div>
  );
}
