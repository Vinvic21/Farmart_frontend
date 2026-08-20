import './App.css'

function App() {
  return (
    <div className="app">
      <nav className="navbar">
        <h2 className="logo">Farmart</h2>

        <div className="nav-links">
          <a href="/">Home</a>
          <a href="#animals">Animals</a>
          <a href="#about">About</a>
          <button className="login-btn">Login</button>
        </div>
      </nav>

      <main>
        <section className="hero">
          <div className="hero-content">
            <p className="hero-label">FARM DIRECT • BUY WITH CONFIDENCE</p>

            <h1>
              Buy and sell farm animals
              <span> directly from farmers.</span>
            </h1>

            <p className="hero-text">
              Farmart connects farmers directly with buyers, making
              farm-animal trading simple, transparent, and convenient.
            </p>

            <button className="primary-btn">Browse Animals</button>
          </div>
        </section>

        <section id="animals" className="featured">
          <h2>Featured Animals</h2>
          <p>Find healthy animals from farmers near you.</p>

          <div className="animal-grid">
            <div className="animal-card">
              <div className="animal-image">🐄</div>
              <h3>Cow</h3>
              <p>Healthy farm cow</p>
              <strong>From KSh 80,000</strong>
            </div>

            <div className="animal-card">
              <div className="animal-image">🐐</div>
              <h3>Goat</h3>
              <p>Healthy farm goat</p>
              <strong>From KSh 12,000</strong>
            </div>

            <div className="animal-card">
              <div className="animal-image">🐑</div>
              <h3>Sheep</h3>
              <p>Healthy farm sheep</p>
              <strong>From KSh 15,000</strong>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App