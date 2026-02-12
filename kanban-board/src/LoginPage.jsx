import { useState } from "react";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center p-6">
      <div className="bg-zinc-800 p-8 rounded-lg shadow-2xl max-w-md w-full border border-zinc-700">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400 text-center">
          Kanban Board
        </h1>
        <p className="text-zinc-400 text-center mb-8">Sign in to continue</p>
        
        <form onSubmit={handleLogin}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username or email"
            className="w-full p-3 bg-zinc-700 text-white rounded-lg outline-none border border-zinc-600 focus:border-amber-500 mb-4"
          />
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium rounded-lg hover:from-yellow-500 hover:to-amber-400 transition-all"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;