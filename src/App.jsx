import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, ClipboardList, Plus, Trash2, CalendarDays } from "lucide-react";

const starterTasks = [
  { id: 1, title: "Revise JavaScript array methods", category: "Study", dueDate: "", completed: false },
  { id: 2, title: "Complete React components practice", category: "Assignment", dueDate: "", completed: true },
];

function readTasks() {
  try {
    const saved = localStorage.getItem("student-task-manager-tasks");
    return saved ? JSON.parse(saved) : starterTasks;
  } catch {
    return starterTasks;
  }
}

export default function App() {
  const [tasks, setTasks] = useState(readTasks);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Study");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("student-task-manager-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const completedCount = tasks.filter((task) => task.completed).length;
  const pendingCount = tasks.length - completedCount;
  const visibleTasks = useMemo(() => {
    if (filter === "Pending") return tasks.filter((task) => !task.completed);
    if (filter === "Completed") return tasks.filter((task) => task.completed);
    return tasks;
  }, [tasks, filter]);

  function addTask(event) {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle) {
      setError("Please enter a task title.");
      return;
    }
    setTasks((current) => [
      { id: Date.now(), title: cleanTitle, category, dueDate, completed: false },
      ...current,
    ]);
    setTitle("");
    setDueDate("");
    setCategory("Study");
    setError("");
  }

  function toggleTask(id) {
    setTasks((current) => current.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  return (
    <main className="page-shell">
      <header className="topbar">
        <div className="brand-mark"><ClipboardList size={23} /></div>
        <div><p className="eyebrow">STUDENT WORKSPACE</p><h1>My Task Manager</h1></div>
        <span className="today-pill"><CalendarDays size={15} /> Stay on track</span>
      </header>

      <section className="welcome">
        <div>
          <p className="eyebrow">YOUR DAY, ORGANIZED</p>
          <h2>Small steps. <span>Big progress.</span></h2>
          <p className="subtext">Keep your assignments, study goals, and daily tasks in one place.</p>
        </div>
        <div className="progress-ring"><strong>{tasks.length ? Math.round(completedCount / tasks.length * 100) : 0}%</strong><span>completed</span></div>
      </section>

      <section className="stats">
        <article className="stat-card"><span className="stat-icon total"><ClipboardList size={19} /></span><div><p>Total tasks</p><strong>{tasks.length}</strong></div></article>
        <article className="stat-card"><span className="stat-icon pending"><Circle size={19} /></span><div><p>Pending</p><strong>{pendingCount}</strong></div></article>
        <article className="stat-card"><span className="stat-icon done"><CheckCircle2 size={19} /></span><div><p>Completed</p><strong>{completedCount}</strong></div></article>
      </section>

      <section className="content-grid">
        <form className="panel add-panel" onSubmit={addTask}>
          <div className="panel-heading"><div><p className="eyebrow">GET IT DONE</p><h3>Add a task</h3></div><span className="plus-badge"><Plus size={20} /></span></div>
          <label htmlFor="task-title">Task title</label>
          <input id="task-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Prepare DBMS notes" />
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Study</option><option>Assignment</option><option>Personal</option><option>Project</option>
          </select>
          <label htmlFor="due-date">Due date <span className="optional">(optional)</span></label>
          <input id="due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          {error && <p className="error-message">{error}</p>}
          <button className="primary-button" type="submit"><Plus size={18} /> Add task</button>
          <p className="small-note">Your tasks are saved in this browser using Local Storage.</p>
        </form>

        <section className="panel tasks-panel">
          <div className="list-heading"><div><p className="eyebrow">YOUR CHECKLIST</p><h3>Tasks <span className="count-badge">{visibleTasks.length}</span></h3></div>
            <select aria-label="Filter tasks" className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option>All</option><option>Pending</option><option>Completed</option>
            </select>
          </div>
          <div className="task-list">
            {visibleTasks.length === 0 ? <div className="empty-state"><ClipboardList size={30} /><strong>No tasks here yet</strong><p>Add a task or choose another filter.</p></div> :
              visibleTasks.map((task) => (
                <article className={`task-row ${task.completed ? "is-complete" : ""}`} key={task.id}>
                  <button className="check-button" onClick={() => toggleTask(task.id)} aria-label={task.completed ? "Mark pending" : "Mark completed"}>
                    {task.completed ? <CheckCircle2 size={23} /> : <Circle size={23} />}
                  </button>
                  <div className="task-info"><h4>{task.title}</h4><div className="task-meta"><span className={`category-tag ${task.category.toLowerCase()}`}>{task.category}</span>{task.dueDate && <span className="due-date"><CalendarDays size={13} /> {task.dueDate}</span>}</div></div>
                  <button className="delete-button" onClick={() => deleteTask(task.id)} aria-label="Delete task"><Trash2 size={17} /></button>
                </article>
              ))
            }
          </div>
        </section>
      </section>
      <footer>Built with React · useState · useEffect · Local Storage</footer>
    </main>
  );
}