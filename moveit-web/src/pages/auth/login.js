import { AuthService } from '../../services/auth.js';
import { router } from '../../router.js';
import { Toast } from '../../components/toast.js';

export const renderLogin = () => {
  const container = document.createElement('div');
  container.className = 'auth-page';
  
  container.innerHTML = `
    <!-- Left Hero Side -->
    <div class="auth-hero">
      <img src="/moveit.png" alt="MoveIt" class="auth-hero__logo" />
      <h1 class="auth-hero__title">Delivery Made Simple</h1>
      <p class="auth-hero__subtitle">Egypt's premier delivery platform. Book a delivery, track your package, and get it there fast.</p>
      
      <div class="auth-hero__features">
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="map-pin"></i></div>
          <span>Real-time tracking of your packages</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="truck"></i></div>
          <span>Multiple vehicle types for any load</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="shield-check"></i></div>
          <span>Secure and reliable drivers</span>
        </div>
      </div>
    </div>

    <!-- Right Form Side -->
    <div class="auth-form-side">
      <div class="auth-form-container">
        <div class="auth-form-header">
          <h2 class="auth-form-header__title">Welcome Back</h2>
          <p class="auth-form-header__subtitle">Login to manage your deliveries</p>
        </div>

        <form id="login-form" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email</label>
            <div class="form-input-icon">
              <i data-lucide="mail"></i>
              <input type="email" id="email" class="form-input" placeholder="Enter your email" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="password">Password</label>
            <div class="form-input-icon password-toggle">
              <i data-lucide="lock"></i>
              <input type="password" id="password" class="form-input" placeholder="Enter your password" required />
              <button type="button" class="password-toggle__btn" id="toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-primary-lg auth-form__submit" id="submit-btn">
            Login
          </button>
        </form>

        <div class="auth-form__divider">OR</div>

        <div class="auth-form__footer">
          Don't have an account? <a href="#/signup">Sign up</a>
        </div>
      </div>
    </div>
  `;

  // Password visibility toggle
  const pwdInput = container.querySelector('#password');
  const toggleBtn = container.querySelector('#toggle-pwd');
  const toggleIcon = toggleBtn.querySelector('i');
  
  toggleBtn.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      toggleIcon.setAttribute('data-lucide', 'eye-off');
    } else {
      pwdInput.type = 'password';
      toggleIcon.setAttribute('data-lucide', 'eye');
    }
    window.lucide.createIcons({ root: toggleBtn });
  });

  // Handle Submit
  const form = container.querySelector('#login-form');
  const submitBtn = container.querySelector('#submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = form.email.value.trim();
    const password = form.password.value;
    
    if (!email || !password) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Logging in...';

    try {
      const user = await AuthService.login(email, password);
      
      // Fetch user doc to check role
      const userDoc = await AuthService.getUserDoc(user.uid);
      
      if (userDoc?.role === 'admin') {
        Toast.success('Welcome back, Admin!');
        router.navigate('/admin');
      } else {
        Toast.success('Login successful!');
        router.navigate('/customer');
      }
    } catch (error) {
      Toast.error(error.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Login';
    }
  });

  return container;
};
