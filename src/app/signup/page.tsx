"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    gender: "",
    country: "",
    hobbies: [] as string[],
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => {
        const hobbies = target.checked
          ? [...prev.hobbies, value]
          : prev.hobbies.filter((h) => h !== value);
        return { ...prev, hobbies };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = { ...formData, hobbies: formData.hobbies.join(",") };
      const res = await fetch("http://localhost:3000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Signup successful, please login!");
        router.push("/");
      } else {
        alert(data.message || "Signup failed, try again");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Signup</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <input
          type="tel"
          name="mobile"
          placeholder="Mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <div>
          <label className="block font-medium">Gender</label>
          <div className="flex gap-4">
            {["male", "female", "other"].map((g) => (
              <label key={g} className="flex items-center gap-1">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        <select
          name="country"
          value={formData.country}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        >
          <option value="">Select Country</option>
          <option value="India">India</option>
          <option value="SriLanka">Sri Lanka</option>
          <option value="Japan">Japan</option>
        </select>

        <div>
          <label className="block font-medium">Hobbies</label>
          <div className="flex gap-4">
            {["Music", "Sports", "Painting"].map((hobby) => (
              <label key={hobby} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  value={hobby}
                  checked={formData.hobbies.includes(hobby)}
                  onChange={handleChange}
                />
                {hobby}
              </label>
            ))}
          </div>
        </div>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}
