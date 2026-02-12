import { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");

  const handleLogin = () => {
    if (!name.trim()) return;
    localStorage.setItem("user", name);
    onLogin(name);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80">
        <h1 className="text-xl font-bold mb-4">Login</h1>

        <input
          className="border p-2 w-full mb-3 outline-none focus:border-blue-500"
          placeholder="Enter username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
