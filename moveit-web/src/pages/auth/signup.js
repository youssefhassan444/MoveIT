import { AuthService } from '../../services/auth.js';
import { router } from '../../router.js';
import { Toast } from '../../components/toast.js';

export const renderSignup = () => {
  const container = document.createElement('div');
  container.className = 'auth-page';
  
  container.innerHTML = `
    <!-- Left Hero Side -->
    <div class="auth-hero">
      <img src="/moveit.png" alt="MoveIt" class="auth-hero__logo" />
      <h1 class="auth-hero__title">Join MoveIt Today</h1>
      <p class="auth-hero__subtitle">Create an account to start booking deliveries instantly.</p>
      
      <div class="auth-hero__features">
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="zap"></i></div>
          <span>Instant quotes and booking</span>
        </div>
        <div class="auth-hero__feature">
          <div class="auth-hero__feature-icon"><i data-lucide="credit-card"></i></div>
          <span>Transparent pricing with no hidden fees</span>
        </div>
      </div>
    </div>

    <!-- Right Form Side -->
    <div class="auth-form-side">
      <div class="auth-form-container">
        <div class="auth-form-header">
          <h2 class="auth-form-header__title">Create Account</h2>
          <p class="auth-form-header__subtitle">Sign up as a customer</p>
        </div>

        <form id="signup-form" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="name">Full Name</label>
            <div class="form-input-icon">
              <i data-lucide="user"></i>
              <input type="text" id="name" class="form-input" placeholder="Enter your full name" required />
            </div>
          </div>

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
              <input type="password" id="password" class="form-input" placeholder="Create a password (min 6 chars)" minlength="6" required />
              <button type="button" class="password-toggle__btn toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label" for="confirm-password">Confirm Password</label>
            <div class="form-input-icon password-toggle">
              <i data-lucide="lock"></i>
              <input type="password" id="confirm-password" class="form-input" placeholder="Confirm your password" minlength="6" required />
              <button type="button" class="password-toggle__btn toggle-pwd">
                <i data-lucide="eye"></i>
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-primary-lg auth-form__submit" id="submit-btn">
            Create Account
          </button>
        </form>

        <div class="auth-form__divider">OR</div>

        <div class="auth-form__footer">
          Already have an account? <a href="#/login">Login</a>
        </div>
      </div>
    </div>
  `;

  // Password visibility toggles
  const toggleBtns = container.querySelectorAll('.toggle-pwd');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('data-lucide', 'eye-off');
      } else {
        input.type = 'password';
        icon.setAttribute('data-lucide', 'eye');
      }
      window.lucide.createIcons({ root: btn });
    });
  });

  // Handle Submit
  const form = container.querySelector('#signup-form');
  const submitBtn = container.querySelector('#submit-btn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form['confirm-password'].value;
    
    if (password !== confirmPassword) {
      Toast.error('Passwords do not match');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Creating...';

    try {
      await AuthService.signup(name, email, password);
      Toast.success('Account created successfully!');
      router.navigate('/customer');
    } catch (error) {
      Toast.error(error.message);
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Create Account';
    }
  });

  return container;
};
