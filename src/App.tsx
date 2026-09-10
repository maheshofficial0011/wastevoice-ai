import './App.css'

function App() {
  return (
    <main className="app">
      <section className="hero">
        <div className="badge">♻️ Better Tomorrow Project</div>

        <h1>WasteVoice AI</h1>

        <p className="subtitle">
          AI-Assisted Campus Waste Reporting and Resolution Tracking System
        </p>

        <p className="description">
          Report waste, structure the information with AI, track cleaning action,
          and support human-verified resolution with before-and-after evidence.
        </p>

        <div className="workflow">
          <span>Report</span>
          <span>→</span>
          <span>AI Assist</span>
          <span>→</span>
          <span>Review</span>
          <span>→</span>
          <span>Clean</span>
          <span>→</span>
          <span>Verify</span>
          <span>→</span>
          <span>Resolve</span>
        </div>

        <div className="status-card">
          <span className="status-dot"></span>
          <span>Project foundation is successfully running.</span>
        </div>
      </section>
    </main>
  )
}

export default App