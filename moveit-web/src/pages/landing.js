export const renderLanding = () => {
  const container = document.createElement('div');
  container.className = 'landing-page';

  container.innerHTML = `
    <!-- Navbar -->
    <nav class="landing-nav">
      <div class="landing-nav__logo">
        <img src="/logo.png" alt="MoveIt Logo" />
        <span>MoveIt</span>
      </div>
      <div class="landing-nav__links">
        <a href="#features">Features</a>
        <a href="#how-it-works">How it Works</a>
        <a href="#driver">Become a Driver</a>
        <a href="#/login" class="btn btn-primary landing-nav__login">Portal Login</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="hero-section">
      <div class="hero-content">
        <span class="hero-badge">Egypt's Premier Delivery Network</span>
        <h1 class="hero-title">Delivery Made <span class="text-gradient">Simple & Fast</span></h1>
        <p class="hero-subtitle">
          Book a delivery, track your package in real-time, and get it there safely. 
          MoveIt connects you with a fleet of verified drivers instantly.
        </p>
        <div class="hero-actions">
          <a href="#/signup" class="btn btn-primary btn-large">
            <i data-lucide="smartphone"></i> Get the App
          </a>
          <a href="#/login" class="btn btn-outline btn-large">
            <i data-lucide="layout-dashboard"></i> Web Portal
          </a>
        </div>
      </div>
      <div class="hero-image-wrapper">
        <img src="/hero_delivery.png" alt="MoveIt Delivery" class="hero-image floating" />
      </div>
    </header>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-header text-center">
        <h2>Why Choose MoveIt?</h2>
        <p>We built our platform from the ground up to ensure reliability and speed.</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="map"></i></div>
          <h3>Real-time Tracking</h3>
          <p>Watch your delivery move on the map from pickup to dropoff with zero delay.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="shield-check"></i></div>
          <h3>Verified Drivers</h3>
          <p>Every driver undergoes a strict KYC check, verifying their national ID and vehicle license.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="wallet"></i></div>
          <h3>Transparent Pricing</h3>
          <p>Know exactly what you'll pay before you book. No hidden fees or surprise surges.</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon"><i data-lucide="clock"></i></div>
          <h3>Instant Matching</h3>
          <p>Our algorithm finds the nearest available driver to pick up your package in minutes.</p>
        </div>
      </div>
    </section>

    <!-- How it Works Section -->
    <section id="how-it-works" class="how-it-works-section">
      <div class="section-header text-center">
        <h2>How It Works</h2>
      </div>
      <div class="steps-container">
        <div class="step-card">
          <div class="step-number">1</div>
          <h3>Request</h3>
          <p>Enter your pickup and dropoff locations, select the vehicle type, and get a quote instantly.</p>
        </div>
        <div class="step-connector"><i data-lucide="arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">2</div>
          <h3>Match</h3>
          <p>We'll ping nearby verified drivers. Once accepted, you'll see their details and ETA.</p>
        </div>
        <div class="step-connector"><i data-lucide="arrow-right"></i></div>
        <div class="step-card">
          <div class="step-number">3</div>
          <h3>Deliver</h3>
          <p>Track the journey live. Pay securely once the package arrives safely at its destination.</p>
        </div>
      </div>
    </section>

    <!-- Driver Recruitment Section -->
    <section id="driver" class="driver-cta-section">
      <div class="driver-cta-content">
        <h2>Drive with MoveIt</h2>
        <p>Set your own schedule, earn competitive payouts, and join Egypt's fastest-growing delivery network.</p>
        <ul class="driver-benefits">
          <li><i data-lucide="check-circle-2"></i> Low 3% Platform Fee</li>
          <li><i data-lucide="check-circle-2"></i> Instant Payouts</li>
          <li><i data-lucide="check-circle-2"></i> Flexible Hours</li>
        </ul>
        <button class="btn btn-primary btn-large mt-lg">Download Driver App</button>
      </div>
      <div class="driver-cta-image">
        <div class="mockup-frame">
          <!-- Placeholder for driver app mockup -->
          <i data-lucide="truck" size="64" class="text-primary opacity-50"></i>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="landing-footer">
      <div class="footer-content">
        <div class="footer-brand">
          <div class="landing-nav__logo mb-sm">
            <img src="/logo.png" alt="MoveIt Logo" />
            <span class="text-white">MoveIt</span>
          </div>
          <p class="text-muted">Delivering excellence across Egypt, one package at a time.</p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Contact</a>
          </div>
          <div class="link-group">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Driver Agreement</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} MoveIt. All rights reserved.</p>
      </div>
    </footer>
  `;

  return container;
};
