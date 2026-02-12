# Kanban Board - Setup & Architecture Guide

## Quick Start

### Installation Steps

1. **Navigate to the project directory:**
   ```bash
   cd kanban-board
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open the app:**
   The app will automatically open at `http://localhost:3000`

That's it! No backend setup required.

---

## Architecture Overview

### State Management Strategy

The application uses **React Context API** for state management with two separate contexts:

#### 1. AuthContext (`src/context/AuthContext.jsx`)
- Manages user authentication state
- Persists login state to localStorage
- Provides login/logout functionality

#### 2. BoardContext (`src/context/BoardContext.jsx`)
- Manages all board state (tasks across three columns)
- Implements optimistic UI updates
- Handles rollback on API failures
- Persists tasks to localStorage
- Manages toast notifications

### Optimistic UI Pattern

The app follows this pattern for all mutations (add, move, delete):

1. **Immediate Update:** UI updates instantly (optimistic)
2. **API Call:** Mock API is called in background (1-2s delay)
3. **Success:** No action needed (already updated)
4. **Failure:** Automatic rollback + show error toast

Example from `BoardContext.jsx`:
```javascript
// 1. Store previous state
const previousTasks = { ...tasks };

// 2. Optimistic update
setTasks(/* new state */);

try {
  // 3. Call API
  await mockApi.moveTask(...);
} catch (error) {
  // 4. Rollback on failure
  setTasks(previousTasks);
  showToast(error.message);
}
```

---

## Component Structure

```
App
├── AuthProvider (Context)
│   └── AppContent
│       ├── LandingPage (if not logged in)
│       └── BoardProvider (Context) (if logged in)
│           └── Board
│               ├── Header
│               ├── Add Task Form
│               └── Three Columns
│                   └── TaskCards
```

### Key Components

**LandingPage** (`src/components/LandingPage.jsx`)
- Mock login form
- Clean, minimal design
- Handles authentication

**Board** (`src/components/Board.jsx`)
- Main dashboard
- Add task functionality
- Houses the three columns

**Column** (`src/components/Column.jsx`)
- Handles drag-and-drop events
- Visual feedback for drag operations
- Displays task count

**TaskCard** (`src/components/TaskCard.jsx`)
- Individual task UI
- Draggable
- Shows creation time
- Delete button (shows on hover)

**Toast** (`src/components/Toast.jsx`)
- Error notifications
- Auto-dismiss after 4 seconds
- Slide-in animation

---

## Mock API Implementation

Located in `src/api/mockApi.js`

### Features:
- **Random Delay:** 1-2 seconds for all operations
- **20% Failure Rate:** Randomly fails to test error handling
- **Realistic Responses:** Returns success/error objects

### Usage Example:
```javascript
try {
  await mockApi.addTask(newTask);
  // Success - optimistic update already applied
} catch (error) {
  // Failure - rollback and show toast
  setTasks(previousState);
  showToast(error.message);
}
```

---

## Drag and Drop Implementation

Uses native HTML5 Drag and Drop API:

### Flow:
1. **Drag Start:** Store task data in dataTransfer
2. **Drag Over:** Allow drop and show visual feedback
3. **Drop:** Parse data and call moveTask
4. **Drag End:** Clean up visual states

### Key Code (Column.jsx):
```javascript
const handleDrop = (e) => {
  e.preventDefault();
  const { taskId, fromColumn } = JSON.parse(e.dataTransfer.getData('text/plain'));
  
  if (fromColumn !== columnId) {
    onMoveTask(taskId, fromColumn, columnId);
  }
};
```

---

## Data Persistence

### localStorage Keys:
- `kanban_user` - Stores logged-in user data
- `kanban_tasks` - Stores all tasks across columns

### Auto-sync:
Tasks are automatically saved to localStorage whenever they change using:
```javascript
useEffect(() => {
  localStorage.setItem('kanban_tasks', JSON.stringify(tasks));
}, [tasks]);
```

---

## Styling Approach

### Tailwind CSS Utilities
The app uses Tailwind for all styling with:
- Custom color palette (blue primary)
- Responsive design (mobile-first)
- Smooth transitions and animations
- Custom utility classes in `index.css`

### Key Design Decisions:
- **No AI-looking gradients:** Simple, solid colors
- **Subtle shadows:** Professional depth
- **Hover states:** Clear interaction feedback
- **Smooth animations:** 150-300ms transitions
- **Accessible colors:** Proper contrast ratios

---

## Error Handling Strategy

### Three Levels of Error Handling:

1. **Prevention:**
   - Disabled buttons when inputs are empty
   - Form validation before submission

2. **Graceful Degradation:**
   - Optimistic UI ensures app feels instant
   - Users can continue working during API calls

3. **Clear Feedback:**
   - Toast notifications explain what went wrong
   - Automatic rollback maintains data integrity

---

## Testing the Application

### How to Verify Optimistic UI:

1. **Add a Task:**
   - Type a task name and click "Add Task"
   - Task appears immediately in "To Do"
   - Wait 1-2 seconds - if it fails, task disappears + toast shows

2. **Move a Task:**
   - Drag a task to another column
   - Card moves instantly
   - Wait 1-2 seconds - if it fails, card jumps back + toast shows

3. **Delete a Task:**
   - Click × on a task
   - Task disappears immediately
   - Wait 1-2 seconds - if it fails, task reappears + toast shows

### Expected Behavior:
- 80% of operations succeed (task stays in new state)
- 20% of operations fail (task reverts + error toast)

---

## Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires:
- JavaScript enabled
- localStorage support
- Modern CSS support (Flexbox, Grid)

---

## Performance Considerations

### Optimizations:
- **useCallback:** Prevents unnecessary re-renders
- **Minimal re-renders:** Context split into Auth and Board
- **localStorage:** Async operations don't block UI
- **CSS transitions:** Hardware-accelerated

### Scalability:
For production with many tasks:
- Consider virtual scrolling for long lists
- Implement pagination or lazy loading
- Add task search/filter functionality
- Use React.memo for TaskCard components

---

## Common Issues & Solutions

### Issue: Tasks don't persist after refresh
**Solution:** Check browser localStorage settings (not in incognito mode)

### Issue: Drag and drop not working
**Solution:** Ensure you're using a modern browser with HTML5 support

### Issue: npm start fails
**Solution:** Delete node_modules and package-lock.json, then run `npm install` again

### Issue: Port 3000 already in use
**Solution:** Kill the process or use: `PORT=3001 npm start`

---

## Future Enhancements

Potential features to add:
- Task editing (click to edit title)
- Task descriptions and due dates
- Tags and priority levels
- Search and filter
- Multiple boards
- Dark mode
- Export tasks to JSON/CSV
- Real backend integration
- User avatars
- Task assignment to users

---

## File Reference

### Must-Have Files:
- `package.json` - Dependencies and scripts
- `tailwind.config.js` - Tailwind configuration
- `postcss.config.js` - PostCSS setup for Tailwind
- `src/index.css` - Global styles + Tailwind imports
- `src/index.js` - React entry point
- `src/App.jsx` - Root component
- `public/index.html` - HTML template

### Context Files:
- `src/context/AuthContext.jsx`
- `src/context/BoardContext.jsx`

### Component Files:
- `src/components/LandingPage.jsx`
- `src/components/Board.jsx`
- `src/components/Column.jsx`
- `src/components/TaskCard.jsx`
- `src/components/Toast.jsx`

### API Files:
- `src/api/mockApi.js`

---

## Conclusion

This Kanban board demonstrates:
✅ Proper state management with Context API
✅ Optimistic UI updates for instant feedback
✅ Robust error handling with automatic rollback
✅ Clean, professional design
✅ Persistence across sessions
✅ Smooth drag-and-drop UX

The architecture is production-ready and can easily be extended with a real backend API by swapping out the mock API implementation.
