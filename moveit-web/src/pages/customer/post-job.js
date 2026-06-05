import { AuthService } from '../../services/auth.js';
import { JobsService } from '../../services/jobs.js';
import { GeocodingService } from '../../services/geocoding.js';
import { createNavbar } from '../../components/navbar.js';
import { createSidebar } from '../../components/sidebar.js';
import { MapWidget } from '../../components/map.js';
import { auth } from '../../firebase.js';
import { router } from '../../router.js';
import { Toast } from '../../components/toast.js';

export const renderCustomerPostJob = async () => {
  const user = auth.currentUser;
  const userDoc = await AuthService.getUserDoc(user.uid);
  
  const container = document.createElement('div');
  container.className = 'admin-layout flex h-full';

  container.appendChild(createSidebar('customer', '/customer/post-job'));
  
  const mainContent = document.createElement('div');
  mainContent.className = 'main-content w-full flex-col';
  mainContent.appendChild(createNavbar(userDoc));

  const content = document.createElement('div');
  content.className = 'p-xl';
  content.innerHTML = `
    <div class="wizard">
      <h2 class="text-headline mb-xl text-center">Post a New Job</h2>
      
      <!-- Stepper -->
      <div class="wizard-stepper">
        <div class="wizard-step wizard-step--active" id="step-nav-1">
          <div class="wizard-step__number">1</div>
          <div class="wizard-step__label">Route</div>
          <div class="wizard-step__connector"></div>
        </div>
        <div class="wizard-step wizard-step--upcoming" id="step-nav-2">
          <div class="wizard-step__number">2</div>
          <div class="wizard-step__label">Details</div>
          <div class="wizard-step__connector"></div>
        </div>
        <div class="wizard-step wizard-step--upcoming" id="step-nav-3">
          <div class="wizard-step__number">3</div>
          <div class="wizard-step__label">Vehicle</div>
          <div class="wizard-step__connector"></div>
        </div>
        <div class="wizard-step wizard-step--upcoming" id="step-nav-4" style="flex: 0">
          <div class="wizard-step__number">4</div>
          <div class="wizard-step__label">Review</div>
        </div>
      </div>

      <!-- Step 1: Route -->
      <div class="wizard-content" id="step-1">
        <h3 class="text-title mb-md">Where are we moving?</h3>
        
        <div class="map-container map-container--full mb-md" id="booking-map">
          <div class="map-search">
            <div class="form-input-icon mb-sm">
              <i data-lucide="map-pin" class="text-brand-success"></i>
              <input type="text" class="form-input" id="search-pickup" placeholder="Search pickup location..." />
            </div>
            <div id="results-pickup" class="map-search-results hidden"></div>

            <div class="form-input-icon">
              <i data-lucide="map-pin" class="text-brand-error"></i>
              <input type="text" class="form-input" id="search-dropoff" placeholder="Search dropoff location..." />
            </div>
            <div id="results-dropoff" class="map-search-results hidden"></div>
          </div>
        </div>

        <div class="wizard-actions" style="justify-content: flex-end">
          <button class="btn btn-primary" id="btn-next-1" disabled>Next Step <i data-lucide="arrow-right"></i></button>
        </div>
      </div>

      <!-- Step 2: Item Details -->
      <div class="wizard-content hidden" id="step-2">
        <h3 class="text-title mb-md">What are we moving?</h3>
        
        <div class="form-group mb-md">
          <label class="form-label">Item Description</label>
          <input type="text" class="form-input" id="item-desc" placeholder="e.g. 2 Bedroom Furniture, 10 Boxes of Electronics..." />
        </div>

        <div class="form-group mb-md">
          <label class="form-label">Notes for Driver (Optional)</label>
          <textarea class="form-input" id="item-notes" rows="3" placeholder="Any special handling instructions?"></textarea>
        </div>

        <div class="wizard-actions">
          <button class="btn btn-ghost" id="btn-prev-2">Back</button>
          <button class="btn btn-primary" id="btn-next-2">Next Step <i data-lucide="arrow-right"></i></button>
        </div>
      </div>

      <!-- Step 3: Vehicle -->
      <div class="wizard-content hidden" id="step-3">
        <h3 class="text-title mb-md">Select Vehicle Type</h3>
        
        <div class="vehicle-select mb-xl">
          <div class="vehicle-option" data-type="motorcycle" data-rate="5">
            <div class="vehicle-option__icon">🏍️</div>
            <div class="vehicle-option__name">GoFast</div>
            <div class="text-caption text-secondary">Documents & small parcels</div>
            <div class="vehicle-option__price">5 EGP / km</div>
          </div>
          <div class="vehicle-option selected" data-type="car" data-rate="7">
            <div class="vehicle-option__icon">🚗</div>
            <div class="vehicle-option__name">TruckSend</div>
            <div class="text-caption text-secondary">Medium boxes & groceries</div>
            <div class="vehicle-option__price">7 EGP / km</div>
          </div>
          <div class="vehicle-option" data-type="van" data-rate="10">
            <div class="vehicle-option__icon">🚐</div>
            <div class="vehicle-option__name">FrozenGo</div>
            <div class="text-caption text-secondary">Cold chain & perishables</div>
            <div class="vehicle-option__price">10 EGP / km</div>
          </div>
          <div class="vehicle-option" data-type="truck" data-rate="15">
            <div class="vehicle-option__icon">🚚</div>
            <div class="vehicle-option__name">HeavyLoad</div>
            <div class="text-caption text-secondary">Furniture & large items</div>
            <div class="vehicle-option__price">15 EGP / km</div>
          </div>
        </div>

        <div class="wizard-actions">
          <button class="btn btn-ghost" id="btn-prev-3">Back</button>
          <button class="btn btn-primary" id="btn-next-3">Next Step <i data-lucide="arrow-right"></i></button>
        </div>
      </div>

      <!-- Step 4: Review -->
      <div class="wizard-content hidden" id="step-4">
        <h3 class="text-title mb-md">Review Booking</h3>
        
        <div class="review-summary">
          <div class="review-row">
            <div class="review-row__label">Pickup</div>
            <div class="review-row__value text-right" id="review-pickup" style="max-width: 60%">-</div>
          </div>
          <div class="review-row">
            <div class="review-row__label">Dropoff</div>
            <div class="review-row__value text-right" id="review-dropoff" style="max-width: 60%">-</div>
          </div>
          <div class="review-row">
            <div class="review-row__label">Distance</div>
            <div class="review-row__value" id="review-dist">-</div>
          </div>
          <div class="review-row">
            <div class="review-row__label">Item</div>
            <div class="review-row__value" id="review-item">-</div>
          </div>
          <div class="review-row">
            <div class="review-row__label">Vehicle</div>
            <div class="review-row__value" id="review-vehicle">-</div>
          </div>
          <div class="review-row review-row--total">
            <div class="review-row__label">Total Estimated Price</div>
            <div class="review-row__value" id="review-price">0.00 EGP</div>
          </div>
        </div>

        <div class="wizard-actions">
          <button class="btn btn-ghost" id="btn-prev-4">Back</button>
          <button class="btn btn-primary btn-primary-lg" id="btn-submit">Confirm Booking</button>
        </div>
      </div>
    </div>
  `;

  mainContent.appendChild(content);
  container.appendChild(mainContent);

  // Wizard State
  const state = {
    pickup: null, // { lat, lng, address }
    dropoff: null, // { lat, lng, address }
    distanceKm: 0,
    itemDesc: '',
    itemNotes: '',
    vehicleType: 'car',
    vehicleRate: 7,
    priceEGP: 0
  };

  setTimeout(() => {
    if (window.lucide) window.lucide.createIcons({ root: container });

    // Initialize Map
    const mapWidget = new MapWidget('booking-map', { center: [30.0444, 31.2357], zoom: 12 });
    mapWidget.init();

    // Search Logic Setup
    const setupSearch = (inputId, resultsId, type) => {
      const input = container.querySelector(`#${inputId}`);
      const results = container.querySelector(`#${resultsId}`);
      let timeout;

      input.addEventListener('input', (e) => {
        clearTimeout(timeout);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
          results.classList.add('hidden');
          return;
        }

        timeout = setTimeout(async () => {
          const locations = await GeocodingService.searchAddress(query);
          results.innerHTML = '';
          
          if (locations.length === 0) {
            results.innerHTML = '<div class="p-sm text-secondary text-center">No results found</div>';
          } else {
            locations.forEach(loc => {
              const div = document.createElement('div');
              div.className = 'map-search-result';
              div.textContent = loc.address;
              div.addEventListener('click', () => {
                selectLocation(type, loc);
                input.value = loc.address.split(',')[0];
                results.classList.add('hidden');
              });
              results.appendChild(div);
            });
          }
          results.classList.remove('hidden');
        }, 500);
      });

      // Hide results on click outside
      document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !results.contains(e.target)) {
          results.classList.add('hidden');
        }
      });
    };

    setupSearch('search-pickup', 'results-pickup', 'pickup');
    setupSearch('search-dropoff', 'results-dropoff', 'dropoff');

    const updateMapAndRoute = async () => {
      if (state.pickup && state.dropoff) {
        try {
          const route = await GeocodingService.getRoute(
            state.pickup.lat, state.pickup.lng,
            state.dropoff.lat, state.dropoff.lng
          );
          mapWidget.drawRoute(route.coordinates);
          mapWidget.fitBoundsToRoute();
          
          state.distanceKm = route.distanceMeters / 1000;
          container.querySelector('#btn-next-1').disabled = false;
        } catch (error) {
          Toast.error('Could not calculate route between these locations.');
        }
      } else if (state.pickup) {
        mapWidget.centerOn(state.pickup.lat, state.pickup.lng, 15);
      } else if (state.dropoff) {
        mapWidget.centerOn(state.dropoff.lat, state.dropoff.lng, 15);
      }
    };

    const selectLocation = (type, loc) => {
      state[type] = loc;
      mapWidget.setMarker(type, loc.lat, loc.lng, type, type === 'pickup' ? 'Pickup' : 'Dropoff');
      updateMapAndRoute();
      
      if (state.pickup && state.dropoff) {
        container.querySelector('#btn-next-1').disabled = false;
      }
    };

    // Navigation Logic
    const showStep = (step) => {
      for (let i = 1; i <= 4; i++) {
        container.querySelector(`#step-${i}`).classList.add('hidden');
        const nav = container.querySelector(`#step-nav-${i}`);
        nav.className = 'wizard-step';
        
        if (i < step) nav.classList.add('wizard-step--completed');
        else if (i === step) nav.classList.add('wizard-step--active');
        else nav.classList.add('wizard-step--upcoming');
      }
      container.querySelector(`#step-${step}`).classList.remove('hidden');

      // Populate review on step 4
      if (step === 4) {
        state.priceEGP = Math.max((state.distanceKm * state.vehicleRate), 20); // 20 EGP min
        
        container.querySelector('#review-pickup').textContent = state.pickup.address;
        container.querySelector('#review-dropoff').textContent = state.dropoff.address;
        container.querySelector('#review-dist').textContent = `${state.distanceKm.toFixed(1)} km`;
        container.querySelector('#review-item').textContent = state.itemDesc;
        container.querySelector('#review-vehicle').textContent = state.vehicleType;
        container.querySelector('#review-price').textContent = `${state.priceEGP.toFixed(2)} EGP`;
      }
    };

    container.querySelector('#btn-next-1').addEventListener('click', () => showStep(2));
    
    container.querySelector('#btn-prev-2').addEventListener('click', () => showStep(1));
    container.querySelector('#btn-next-2').addEventListener('click', () => {
      const desc = container.querySelector('#item-desc').value.trim();
      if (!desc) {
        Toast.warning('Please enter an item description');
        return;
      }
      state.itemDesc = desc;
      state.itemNotes = container.querySelector('#item-notes').value.trim();
      showStep(3);
    });

    container.querySelector('#btn-prev-3').addEventListener('click', () => showStep(2));
    container.querySelector('#btn-next-3').addEventListener('click', () => showStep(4));
    
    container.querySelector('#btn-prev-4').addEventListener('click', () => showStep(3));

    // Vehicle selection
    container.querySelectorAll('.vehicle-option').forEach(opt => {
      opt.addEventListener('click', () => {
        container.querySelectorAll('.vehicle-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        state.vehicleType = opt.dataset.type;
        state.vehicleRate = parseFloat(opt.dataset.rate);
      });
    });

    // Handle initial vehicle query param if any
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1]);
    const initVehicle = urlParams.get('type');
    if (initVehicle) {
      const opt = container.querySelector(`.vehicle-option[data-type="${initVehicle}"]`);
      if (opt) opt.click();
    }

    // Submission
    const submitBtn = container.querySelector('#btn-submit');
    submitBtn.addEventListener('click', async () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner" style="width:20px;height:20px;border-width:2px"></span> Booking...';

      try {
        const jobId = await JobsService.createJob({
          customerId: user.uid,
          customerName: userDoc.displayName,
          customerPhone: userDoc.phoneNumber || 'Not provided',
          pickupAddress: state.pickup.address,
          pickupLat: state.pickup.lat,
          pickupLng: state.pickup.lng,
          dropoffAddress: state.dropoff.address,
          dropoffLat: state.dropoff.lat,
          dropoffLng: state.dropoff.lng,
          distanceMeters: Math.round(state.distanceKm * 1000),
          pricePiastres: Math.round(state.priceEGP * 100),
          itemDescription: state.itemDesc,
          notes: state.itemNotes,
          vehicleTypeRequired: state.vehicleType,
          status: 'pending',
          driverId: null
        });

        Toast.success('Job posted successfully!');
        router.navigate(`/customer/job/${jobId}`);
      } catch (error) {
        Toast.error('Failed to post job. Please try again.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Confirm Booking';
      }
    });

  }, 100); // small delay to ensure DOM is attached for Leaflet

  return container;
};
