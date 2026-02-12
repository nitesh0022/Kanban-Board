import { createContext, useContext, useReducer, useState, useEffect } from 'react';
import mockAPI from '../utils/mockAPI';

const KanbanContext = createContext();

const kanbanReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TASK_OPTIMISTIC': {
      const newColumns = { ...state.columns };
      newColumns[action.payload.columnId] = {
        ...newColumns[action.payload.columnId],
        items: [...newColumns[action.payload.columnId].items, action.payload.task]
      };
      return { ...state, columns: newColumns };
    }
    
    case 'MOVE_TASK_OPTIMISTIC': {
      const { sourceColumn, targetColumn, item } = action.payload;
      const newColumns = { ...state.columns };
      
      newColumns[sourceColumn] = {
        ...newColumns[sourceColumn],
        items: newColumns[sourceColumn].items.filter(i => i.id !== item.id)
      };
      
      newColumns[targetColumn] = {
        ...newColumns[targetColumn],
        items: [...newColumns[targetColumn].items, item]
      };
      
      return { ...state, columns: newColumns };
    }
    
    case 'DELETE_TASK_OPTIMISTIC': {
      const newColumns = { ...state.columns };
      newColumns[action.payload.columnId] = {
        ...newColumns[action.payload.columnId],
        items: newColumns[action.payload.columnId].items.filter(
          item => item.id !== action.payload.taskId
        )
      };
      return { ...state, columns: newColumns };
    }
    
    case 'ROLLBACK':
      return { ...state, columns: action.payload };
    
    default:
      return state;
  }
};

export function KanbanProvider({ children }) {
  const initialColumns = {
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
  };

  const [state, dispatch] = useReducer(kanbanReducer, {
    columns: JSON.parse(localStorage.getItem('kanbanColumns') || JSON.stringify(initialColumns))
  });
  
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(state.columns));
  }, [state.columns]);

  const showToast = (message, type = 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const addTask = async (columnId, content) => {
    const newTask = {
      id: Date.now().toString(),
      content: content,
    };
    
    const previousState = { ...state.columns };
    
    dispatch({ 
      type: 'ADD_TASK_OPTIMISTIC', 
      payload: { columnId, task: newTask } 
    });
    
    try {
      await mockAPI.addTask(newTask);
    } catch (error) {
      dispatch({ type: 'ROLLBACK', payload: previousState });
      showToast('Failed to add task. Please try again.');
    }
  };

  const moveTask = async (sourceColumn, targetColumn, item) => {
    if (sourceColumn === targetColumn) return;
    
    const previousState = { ...state.columns };
    
    dispatch({ 
      type: 'MOVE_TASK_OPTIMISTIC', 
      payload: { sourceColumn, targetColumn, item } 
    });
    
    try {
      await mockAPI.moveTask(item.id, sourceColumn, targetColumn);
    } catch (error) {
      dispatch({ type: 'ROLLBACK', payload: previousState });
      showToast('Failed to move task. Please try again.');
    }
  };

  const deleteTask = async (columnId, taskId) => {
    const previousState = { ...state.columns };
    
    dispatch({ 
      type: 'DELETE_TASK_OPTIMISTIC', 
      payload: { columnId, taskId } 
    });
    
    try {
      await mockAPI.deleteTask(taskId, columnId);
    } catch (error) {
      dispatch({ type: 'ROLLBACK', payload: previousState });
      showToast('Failed to delete task. Please try again.');
    }
  };

  return (
    <KanbanContext.Provider value={{ 
      columns: state.columns, 
      addTask, 
      moveTask, 
      deleteTask,
      toasts 
    }}>
      {children}
    </KanbanContext.Provider>
  );
}

export const useKanban = () => {
  const context = useContext(KanbanContext);
  if (!context) {
    throw new Error('useKanban must be used within KanbanProvider');
  }
  return context;
};
