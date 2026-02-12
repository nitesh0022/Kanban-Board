import { useState } from 'react';
import { KanbanProvider } from './context/KanbanContext';
import Login from './components/Login';
import KanbanBoard from './components/KanbanBoard';
import Toast from './components/Toast';

export default function App() {
  const [user, setUser] = useState(() => {
    return localStorage.getItem('user') || null;
  });

  const handleLogin = (username) => {
    localStorage.setItem('user', username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <KanbanProvider>
      {user ? (
        <>
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition shadow-lg"
            >
              Logout ({user})
            </button>
          </div>
          <KanbanBoard />
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      <Toast />
    </KanbanProvider>
  );
}
