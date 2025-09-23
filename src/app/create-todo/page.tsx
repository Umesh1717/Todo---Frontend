"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTodoPage() {

  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    time: "",
    status: "In-progress",
    userId: 0
  });

  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (!storedId) {
      router.push("/");
      return;
    }
    else {
      setForm((prev) => ({ ...prev, userId: parseInt(storedId) }));

    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/todos");
    } else {
      alert("Failed to create To-Do");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyan-950 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Create To-Do</h2>

        <input
          type="text"
          name="name"
          placeholder="Task Name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          rows={3}
          required
        />

        <input
          type="datetime-local"
          name="time"
          value={form.time}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
        >
          <option value="In-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Create To-Do
        </button>
      </form>
    </div>
  );
}
