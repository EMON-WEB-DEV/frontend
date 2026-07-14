import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Modal from "../components/Modal.jsx";
import { api } from "../api.js";

const COLUMNS = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "Active" },
  { key: "done", label: "Done" },
];

export default function ProjectBoard() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [dragTaskId, setDragTaskId] = useState(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function load() {
    setLoading(true);
    try {
      const { project } = await api.getProject(id);
      setProject(project);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateTask(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createTask(id, { title, description, priority, dueDate: dueDate || null });
      setShowModal(false);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setDueDate("");
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDeleteTask(taskId) {
    await api.deleteTask(taskId);
    load();
  }

  async function moveTask(taskId, status) {
    await api.updateTask(taskId, { status });
    load();
  }

  if (loading) return <div className="page-loading">Loading project…</div>;
  if (!project) return <div className="page-loading">Project not found.</div>;

  return (
    <div>
      <Navbar />

      <div className="board-header">
        <div>
          <Link to="/dashboard" className="back-link">
            ← All projects
          </Link>
          <h1 style={{ borderLeft: `4px solid ${project.color}`, paddingLeft: 12 }}>
            {project.name}
          </h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + Add task
        </button>
      </div>

      <div className="board">
        {COLUMNS.map((col) => {
          const tasks = project.tasks.filter((t) => t.status === col.key);
          return (
            <div
              key={col.key}
              className="board-column"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragTaskId && moveTask(dragTaskId, col.key)}
            >
              <div className="board-column-head">
                <span>{col.label}</span>
                <span className="count">{tasks.length}</span>
              </div>

              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="task-card"
                  draggable
                  onDragStart={() => setDragTaskId(task.id)}
                >
                  <div className="task-card-title">{task.title}</div>
                  {task.description && (
                    <div className="task-card-desc">{task.description}</div>
                  )}
                  <div className="task-card-footer">
                    <span className={`priority-tag priority-${task.priority}`}>
                      {task.priority}
                    </span>
                    <div className="task-card-actions">
                      {col.key !== "done" && (
                        <button
                          className="icon-btn"
                          title="Move to next column"
                          onClick={() =>
                            moveTask(
                              task.id,
                              col.key === "todo" ? "in_progress" : "done"
                            )
                          }
                        >
                          →
                        </button>
                      )}
                      <button
                        className="icon-btn"
                        title="Delete task"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {tasks.length === 0 && (
                <button className="add-task-btn" onClick={() => setShowModal(true)}>
                  + Add a task
                </button>
              )}
            </div>
          );
        })}
      </div>

      {showModal && (
        <Modal title="New task" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreateTask}>
            <div className="field">
              <label htmlFor="ttitle">Title</label>
              <input
                id="ttitle"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="tdesc">Description</label>
              <textarea
                id="tdesc"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label htmlFor="tpriority">Priority</label>
              <select
                id="tpriority"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 13px",
                  borderRadius: "4px",
                  border: "1px solid var(--line-strong)",
                }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="tdue">Due date (optional)</label>
              <input
                id="tdue"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Add task
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
