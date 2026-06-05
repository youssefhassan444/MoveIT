# MoveIt — Testing Guide

## Setup Test Accounts

### Account 1: Customer
1. Open the app and tap **Sign Up**
2. Fill in:
   - Name: `Test Customer`
   - Email: `customer@test.com`
   - Password: `test1234`
   - Role: **Customer**
3. Tap **Create Account**
4. You should land on the Customer home screen with Post Job tab

### Account 2: Driver (Motorcycle)
1. Log out from the Customer account (Profile → Log Out)
2. Tap **Sign Up**
3. Fill in:
   - Name: `Test Driver`
   - Email: `driver@test.com`
   - Password: `test1234`
   - Role: **Driver**
   - Vehicle Type: **Motorcycle**
4. Tap **Create Account**
5. You should land on the Driver home screen with Job Board tab

---

## Full Job Lifecycle Test

### Step 1: Post a Job (Customer)

1. Log in as `customer@test.com`
2. On the **Post Job** tab:
   - Step 1: Enter "2 boxes of electronics" as item description
   - Step 2: Tap on the map to set pickup location in Cairo
   - Step 3: Tap on the map to set dropoff location
   - Step 4: Select **Motorcycle** as vehicle type
   - Step 5: Enter `50` as price (50 EGP)
3. Tap **Submit Job**
4. You should see a success bottom sheet with the Job ID

### Step 2: Verify Job Appears (Customer)

1. Switch to the **My Jobs** tab
2. You should see the job card with:
   - Description: "2 boxes of electronics"
   - Status chip: **Pending** (grey)
   - Price: **50.00 EGP**

### Step 3: Accept the Job (Driver)

1. Log out, then log in as `driver@test.com`
2. On the **Job Board** tab, you should see the posted job
   - It appears because it requires a Motorcycle and the driver has a Motorcycle
3. Tap **Accept Job**
4. The app should navigate to the Active Job screen
5. The status is now **Accepted**

### Step 4: Start Transit (Driver)

1. On the Active Job screen, tap **Arrived at Pickup — Start Transit**
2. The status updates to **In Transit**

### Step 5: Verify Live Tracking (Customer)

1. Log in as `customer@test.com` on a second device or emulator
2. Go to **My Jobs** → tap the job card
3. You should see:
   - A Google Map with pickup and dropoff markers
   - A green driver marker showing real-time position
   - A polyline from driver → pickup → dropoff
   - Status timeline highlighting "In Transit"

### Step 6: Complete Delivery (Driver)

1. On the driver device, tap **Mark as Delivered**
2. Success snackbar: "Delivery completed! Earnings updated."
3. The driver returns to the Job Board

### Step 7: Verify Earnings (Driver)

1. Go to the **Profile** tab
2. You should see:
   - Total Earned: **50.00 EGP**
   - Completed Jobs: **1**

### Step 8: Verify Delivery Status (Customer)

1. On the customer device, go to **My Jobs**
2. The job card should show status: **Delivered** (green)

---

## Simulating Location Updates

### On Android Emulator:
1. Open the emulator's extended controls (three dots on the side)
2. Go to **Location** tab
3. Set a GPS location manually (e.g., 30.0444, 31.2357 for Cairo)
4. The driver's location will be written to Firestore and streamed to the customer in real time

### On a Physical Device:
1. Walk or drive with the app open as a driver
2. The geolocator package streams real GPS updates every 10 meters

---

## Known Limitations (Firebase Spark/Free Plan)

| Resource | Spark Limit | Impact |
|----------|-------------|--------|
| Firestore reads | 50K/day | Sufficient for testing; production needs Blaze |
| Firestore writes | 20K/day | Location tracking writes count here — limit test sessions |
| Storage | 5 GB total, 1 GB/day download | Sufficient for testing photos |
| Cloud Functions | **NOT available** on Spark | Push notifications (FCM via Cloud Functions) will NOT work without upgrading to Blaze plan |
| FCM (direct) | Unlimited | Device-to-device via FCM tokens works — but server-triggered notifications need Cloud Functions |
| Authentication | Unlimited | No limits on auth operations |

### Blaze Plan Note
Cloud Functions require the Blaze (pay-as-you-go) plan. However, the Blaze plan includes a generous free tier:
- 2 million Cloud Function invocations/month
- 5 GB of Firestore storage
- 1 GB of Cloud Storage

For development and small-scale testing, you will likely stay within the free tier even on Blaze.

---

## Build & Install Commands

```bash
# 1. Connect Firebase
flutterfire configure

# 2. Install dependencies
flutter pub get

# 3. Run in debug mode
flutter run

# 4. Build release APK
flutter build apk --release

# 5. Find the APK
# build/app/outputs/flutter-apk/app-release.apk

# 6. Install to connected device
adb install build/app/outputs/flutter-apk/app-release.apk
```
