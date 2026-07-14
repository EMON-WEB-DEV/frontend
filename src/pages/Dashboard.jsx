import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Modal from "../components/Modal.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

const COLORS = ["#4B6350", "#E2A33D", "#B5502D", "#6B7280", "#3A6EA5"];

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [error, setError] = useState("");
  const [upgradeNeeded, setUpgradeNeeded] = useState(false);

  useEffect(() => {
    loadProjects();
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProjects() {
    setLoading(true);
    try {
      const { projects } = await api.listProjects();
      setProjects(projects);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError("");
    try {
      await api.createProject({ name, description, color });
      setShowModal(false);
      setName("");
      setDescription("");
      loadProjects();
    } catch (err) {
      if (err.code === "UPGRADE_REQUIRED") setUpgradeNeeded(true);
      setError(err.message);
    }
  }

  const isPaid = ["active", "trialing"].includes(user?.subscriptionStatus);

  async function handleManageBilling() {
    try {
      const { url } = await api.createPortalSession();
      window.location.href = url;
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div>
      <Navbar />

      <div className="dashboard-header">
        <div>
          <h1>Your projects</h1>
          <span className={`plan-pill ${isPaid ? "pro" : ""}`}>
            {isPaid ? "PRO PLAN" : "FREE PLAN — 3 project limit"}
          </span>
        </div>
        {!isPaid ? (
          <Link to="/pricing" className="btn btn-secondary">
            Upgrade to Pro
          </Link>
        ) : (
          <button className="btn btn-secondary" onClick={handleManageBilling}>
            Manage billing
          </button>
        )}
      </div>

      {upgradeNeeded && !isPaid && (
        <div className="upgrade-banner">
          <div className="upgrade-banner-inner">
            <p>You've reached the free plan's 3-project limit. Upgrade for unlimited projects.</p>
            <Link to="/pricing" className="btn btn-primary">
              View plans
            </Link>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">Loading projects…</div>
      ) : (
        <div className="project-grid">
          {projects.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="project-card"
              style={{ "--card-color": p.color }}
            >
              <h3>{p.name}</h3>
              <p>{p.description || "No description yet."}</p>
              <div className="meta">
                <span>{p._count.tasks} tasks</span>
                <span>{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
            </Link>
          ))}

          <button className="new-project-card" onClick={() => setShowModal(true)}>
            + New project
          </button>
        </div>
      )}

      {showModal && (
        <Modal title="New project" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <div className="field">
              <label htmlFor="pname">Project name</label>
              <input
                id="pname"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="field">
              <label htmlFor="pdesc">Description</label>
              <textarea
                id="pdesc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="field">
              <label>Color</label>
              <div style={{ display: "flex", gap: "8px" }}>
                {COLORS.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setColor(c)}
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: "50%",
                      background: c,
                      border: color === c ? "2px solid var(--ink)" : "2px solid transparent",
                      cursor: "pointer",
                    }}
                    aria-label={`Choose color ${c}`}
                  />
                ))}
              </div>
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
                Create project
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
