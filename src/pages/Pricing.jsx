import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { api } from "../api.js";
import { useAuth } from "../AuthContext.jsx";

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  async function handleSubscribe(plan) {
    if (!user) {
      navigate("/register");
      return;
    }
    setLoadingPlan(plan);
    try {
      const { url } = await api.createCheckoutSession(plan);
      window.location.href = url;
    } catch (err) {
      alert(err.message);
      setLoadingPlan(null);
    }
  }

  return (
    <div>
      <Navbar />

      <div className="pricing-head">
        <span className="hero-eyebrow">No.003 — Pricing</span>
        <h2>One plan for every project you'll ever run</h2>
        <p style={{ marginTop: 12, color: "var(--slate)" }}>
          Start free. Upgrade the moment you outgrow three projects.
        </p>
      </div>

      <div className="pricing-grid">
        <div className="price-card">
          <h3>Free</h3>
          <div className="price-amount">
            $0<span> / forever</span>
          </div>
          <ul className="price-list">
            <li>Up to 3 projects</li>
            <li>Unlimited tasks per project</li>
            <li>Kanban board view</li>
            <li>Email support</li>
          </ul>
          <button
            className="btn btn-secondary btn-block"
            style={{ marginTop: 28 }}
            onClick={() => navigate(user ? "/dashboard" : "/register")}
          >
            {user ? "Go to dashboard" : "Start free"}
          </button>
        </div>

        <div className="price-card featured">
          <span className="badge">Most popular</span>
          <h3>Pro</h3>
          <div className="price-amount">
            $12<span> / month</span>
          </div>
          <ul className="price-list">
            <li>Unlimited projects</li>
            <li>Unlimited tasks per project</li>
            <li>Kanban board view</li>
            <li>Priority email support</li>
            <li>Cancel anytime</li>
          </ul>
          <button
            className="btn btn-primary btn-block"
            style={{ marginTop: 28 }}
            disabled={loadingPlan === "monthly"}
            onClick={() => handleSubscribe("monthly")}
          >
            {loadingPlan === "monthly" ? "Redirecting…" : "Subscribe monthly"}
          </button>
          <button
            className="btn btn-ghost btn-block"
            style={{ marginTop: 8 }}
            disabled={loadingPlan === "yearly"}
            onClick={() => handleSubscribe("yearly")}
          >
            {loadingPlan === "yearly" ? "Redirecting…" : "Or pay yearly (2 months free)"}
          </button>
        </div>
      </div>

      <footer className="footer">© {new Date().getFullYear()} TaskFlow. All rights reserved.</footer>
    </div>
  );
}
