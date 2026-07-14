import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function Landing() {
  return (
    <div>
      <Navbar />

      <section className="hero">
        <div>
          <span className="hero-eyebrow">No.001 — Project tracking</span>
          <h1>
            Run your projects like a <em>ledger</em>, not a mess.
          </h1>
          <p className="lede">
            TaskFlow gives freelancers and small teams one clear record of what's owed, what's
            done, and what's next — no scattered sticky notes, no dropped tasks.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary">
              Start free — no card needed
            </Link>
            <Link to="/pricing" className="btn btn-secondary">
              See pricing
            </Link>
          </div>
          <p className="hero-note">Free plan includes 3 projects. Upgrade anytime.</p>
        </div>

        <div className="ledger-card">
          <div className="ledger-row">
            <span className="ledger-row-num">001</span>
            <span className="ledger-row-title">Redesign client onboarding flow</span>
            <span className="stamp stamp-done">Done</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-row-num">002</span>
            <span className="ledger-row-title">Draft Q3 invoice for Acme Co.</span>
            <span className="stamp stamp-progress">Active</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-row-num">003</span>
            <span className="ledger-row-title">Write launch announcement</span>
            <span className="stamp stamp-todo">To do</span>
          </div>
          <div className="ledger-row">
            <span className="ledger-row-num">004</span>
            <span className="ledger-row-title">Review contractor proposal</span>
            <span className="stamp stamp-todo">To do</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <span className="hero-eyebrow">No.002 — How it works</span>
          <h2>Everything stays in one open book</h2>
          <p>
            Every project is its own ledger. Every task is an entry. Nothing gets buried in a
            chat thread again.
          </p>
        </div>
        <div className="feature-grid">
          <div className="feature">
            <span className="feature-num">01</span>
            <h3>Projects as ledgers</h3>
            <p>Group related work into a project, color-coded so you can spot it at a glance.</p>
          </div>
          <div className="feature">
            <span className="feature-num">02</span>
            <h3>Tasks as entries</h3>
            <p>
              Add tasks with priority and due dates, then move them through To do, Active, and
              Done.
            </p>
          </div>
          <div className="feature">
            <span className="feature-num">03</span>
            <h3>Built for solo & small teams</h3>
            <p>Simple enough for one freelancer, structured enough for a growing team.</p>
          </div>
        </div>
      </section>

      <footer className="footer">© {new Date().getFullYear()} TaskFlow. All rights reserved.</footer>
    </div>
  );
}
