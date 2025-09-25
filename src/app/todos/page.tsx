"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Status = "Completed" | "In-progress";
interface Todo {
  id: number;
  name: string;
  description: string;
  time: string;
  status: Status;
}

export default function TodoPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const perPage = 5;
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem("userID");
    if (!storedId) {
      router.push("/"); 
      return;
    }
    setUserId(storedId);
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:3000/todos/${userId}`)
      .then((res) => res.json())
      .then(setTodos)
      .catch(() => alert("Failed to load todos"))
      .finally(() => setLoading(false));
  }, [userId]);

  const filtered =
    filter === "All" ? todos : todos.filter((t) => t.status === filter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleStatus = async (id: number, status: Status) => {
    const newStatus = status === "Completed" ? "In-progress" : "Completed";
    const res = await fetch(`http://localhost:3000/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
      );
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("userID"); 
    router.push("/"); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-cyan-900 to-black p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">To-Do List</h2>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/create-todo")}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium"
            >
              + New
            </button>
            <button
              onClick={handleSignOut}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex gap-2 justify-start mb-4">
          {["All", "Completed", "In-progress"].map((f) => (
            <button
              key={f}
              onClick={() => {
                setFilter(f as any);
                setPage(1);
              }}
              className={`px-4 py-1 rounded-lg ${
                filter === f ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : current.length ? (
          <ul className="space-y-2">
            {current.map((todo) => {
              const isDone = todo.status === "Completed";
              return (
                <li
                  key={todo.id}
                  className={`flex justify-between items-end p-3 rounded-lg border ${
                    isDone
                      ? "bg-green-100 border-green-400"
                      : "bg-yellow-100 border-yellow-400"
                  }`}
                >
                  <div>
                    <p className="font-semibold">{todo.name}</p>
                    <p className="text-sm text-gray-700">{todo.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(todo.time).toLocaleString()}
                    </p>
                    <p
                      className={`text-sm font-medium ${
                        isDone ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {todo.status}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleStatus(todo.id, todo.status)}
                    className={`px-3 py-1 rounded-lg text-sm text-white ${
                      isDone
                        ? "bg-yellow-500 hover:bg-yellow-600"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isDone ? "Mark In-Progress" : "Mark Completed"}
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No todos found</p>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
