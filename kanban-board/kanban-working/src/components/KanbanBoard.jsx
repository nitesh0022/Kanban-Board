import { useState } from "react";
import { useKanban } from "../context/KanbanContext";

export default function KanbanBoard() {
  const { columns, addTask, moveTask, deleteTask } = useKanban();
  
  const [newTask, setNewTask] = useState("");
  const [activeColumn, setActiveColumn] = useState("todo");
  const [draggedItem, setDraggedItem] = useState(null);

  const addNewTask = async () => {
    if (newTask.trim() === "") return;
    
    await addTask(activeColumn, newTask);
    setNewTask("");
  };

  const removeTask = async (columnId, taskId) => {
    await deleteTask(columnId, taskId);
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

    await moveTask(sourceColumnId, columnId, item);
    setDraggedItem(null);
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

  return (
    <div className="p-6 w-full min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 flex items-center justify-center">
      <div className="flex flex-col gap-4 w-full max-w-6xl">
        <h1 className="text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-rose-400 text-center">
          React Kanban Board
        </h1>

        {/* Add Task */}
        <div className="mb-8 flex w-full max-w-lg mx-auto shadow-lg rounded-lg overflow-hidden">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-grow p-3 bg-zinc-700 text-white outline-none placeholder-zinc-400"
            onKeyDown={(e) => e.key === "Enter" && addNewTask()}
          />

          <select
            value={activeColumn}
            onChange={(e) => setActiveColumn(e.target.value)}
            className="p-3 bg-zinc-700 text-white border-l border-zinc-600 outline-none"
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

        {/* Columns */}
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
                      onDragStart={() =>
                        handleDragStart(columnId, item)
                      }
                      className="p-4 mb-3 bg-zinc-700 text-white rounded-lg shadow-md cursor-move flex items-center justify-between transform transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    >
                      <span>{item.content}</span>
                      <button
                        onClick={() =>
                          removeTask(columnId, item.id)
                        }
                        className="text-zinc-400 hover:text-red-400 w-6 h-6 flex items-center justify-center rounded-full hover:bg-zinc-600 transition"
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
