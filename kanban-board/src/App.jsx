
import { useState, useEffect } from "react";
// import "./App.css";
import mockAPI from "./api/mockApi";
import Toast from "./Toast";
import LoginPage from "./LoginPage";

function App() {
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [
        { id: "1", content: "Market research" },
        { id: "2", content: "Write Projects" },
      ],
    },
    inprogress: {
      name: "In Progress",
      items: [{ id: "3", content: "Design UI" }],
    },
    done: {
      name: "Done",
      items: [{ id: "4", content: "Set Up" }],
    },
  });
  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  // Check if user is logged 
  useEffect(() => {
    const savedUser = localStorage.getItem("kanban_user");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const handleLogin = (username) => {
    localStorage.setItem("kanban_user", username);
    setUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem("kanban_user");
    setUser(null);
  };

  const showToast = (message) => {
    setToast(message);
  };

  const addNewTask = async () => {
    if (newTask.trim() === "") return;

    const taskId = Date.now().toString();
    const task = { id: taskId, content: newTask };

    
    const updatedColumns = { ...columns };
    updatedColumns[activeColumn].items.push(task);
    setColumns(updatedColumns);
    setNewTask("");

    // API call
    try {
      await mockAPI.addTask(task, activeColumn);
    } catch (error) {
      // Rollback on failure
      showToast("Failed to add task. Please try again.");
      const rollbackColumns = { ...columns };
      rollbackColumns[activeColumn].items = rollbackColumns[activeColumn].items.filter(
        (item) => item.id !== taskId
      );
      setColumns(rollbackColumns);
    }
  };

  const removeTask = async (columnId, taskId) => {

    const previousColumns = { ...columns };

   
    const updatedColumns = { ...columns };
    updatedColumns[columnId].items = updatedColumns[columnId].items.filter(
      (item) => item.id !== taskId
    );
    setColumns(updatedColumns);

    try {
      await mockAPI.deleteTask(taskId, columnId);
    } catch (error) {
     
      showToast("Failed to delete task. Please try again.");
      setColumns(previousColumns);
    }
  };

  const handleDragStart = (columnId, item) => {
    setDraggedItem({ columnId, item });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, columnId) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { columnId: sourceColumnId, item } = draggedItem;
    if (sourceColumnId === columnId) return;

    const previousColumns = { ...columns };


    const updatedColumns = { ...columns };
    updatedColumns[sourceColumnId].items = updatedColumns[sourceColumnId].items.filter(
      (i) => i.id !== item.id
    );
    updatedColumns[columnId].items.push(item);
    setColumns(updatedColumns);
    setDraggedItem(null);

  
    try {
      await mockAPI.moveTask(item.id, sourceColumnId, columnId);
    } catch (error) {
  
      showToast("Failed to move task. Please try again.");
      setColumns(previousColumns);
    }
  };

  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-blue-600 to-blue-400",
      border: "border-blue-400",
    },
    inprogress: {
      header: "bg-gradient-to-r from-yellow-500 to-amber-400",
      border: "border-yellow-400",
    },
    done: {
      header: "bg-gradient-to-r from-green-500 to-emerald-400",
      border: "border-green-400",
    },
  };

  // <----------------------------------Show login page if not authenticated------------------------------------>
  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      <div className="flex flex-col gap-4 w-full max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400">
            React Kanban Board
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400">Welcome, {user}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

 
        <div className="mb-8 flex w-full max-w-lg mx-auto shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 bg-zinc-700 text-white outline-none"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />
          <select
            value={activeColumn}
            onChange={(e) => setActiveColumn(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-l border-zinc-600"
          >
            {Object.keys(columns).map((columnId) => (
              <option key={columnId} value={columnId}>
                {columns[columnId].name}
              </option>
            ))}
          </select>
          <button
            onClick={addNewTask}
            className="px-6 bg-gradient-to-r from-yellow-600 to-amber-500 text-white font-medium hover:from-yellow-500 hover:to-amber-400 transition-all"
          >
            Add
          </button>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-6">
          {Object.keys(columns).map((columnId) => (
            <div
              key={columnId}
              className={`flex-shrink-0 w-80 bg-zinc-800 rounded-lg shadow-xl border-t-4 ${columnStyles[columnId].border}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              <div
                className={`p-4 text-white font-bold text-xl rounded-t-md ${columnStyles[columnId].header}`}
              >
                {columns[columnId].name}
                <span className="ml-2 px-2 py-1 bg-zinc-800 bg-opacity-30 rounded-full text-sm">
                  {columns[columnId].items.length}
                </span>
              </div>
              <div className="p-3 min-h-[16rem]">
                {columns[columnId].items.length === 0 ? (
                  <div className="text-center py-10 text-zinc-500 italic text-sm">
                    Drop tasks here
                  </div>
                ) : (
                  columns[columnId].items.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(columnId, item)}
                      className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <span>{item.content}</span>
                      <button
                        onClick={() => removeTask(columnId, item.id)}
                        className="text-zinc-400 hover:text-red-400 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;