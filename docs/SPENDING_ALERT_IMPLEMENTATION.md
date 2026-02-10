# Monthly Spending Alert Feature - Implementation Documentation

## 📋 Overview

This feature allows users to set a monthly spending limit and receive an email alert when their expenses reach or exceed that limit. The alert is sent automatically once per month when the threshold is crossed.

## 🏗️ Architecture

### Files Created/Modified

1. **`utils/spending-alert.ts`** - Core alert logic and API integration
2. **`hooks/use-spending-alert.ts`** - React hook for monitoring spending
3. **`app/(tabs)/settings.tsx`** - Settings UI for configuring alerts
4. **`app/(tabs)/index.tsx`** - Home screen with alert monitoring

## 🔧 Implementation Details

### 1. Storage Layer (`utils/spending-alert.ts`)

**AsyncStorage Keys:**

- `@fintrackor_alert_settings` - Stores alert configuration
- `@fintrackor_alert_sent_month` - Tracks last alert sent (format: "YYYY-MM")

**Key Functions:**

- `saveAlertSettings()` - Persists alert configuration
- `loadAlertSettings()` - Retrieves saved settings
- `getCurrentMonthKey()` - Generates current month identifier
- `hasAlertBeenSentThisMonth()` - Checks if alert already sent
- `markAlertAsSent()` - Records alert as sent for current month
- `sendAlertEmail()` - Calls backend API to send email
- `isValidEmail()` - Validates email format

**API Integration:**

```typescript
POST https://seal-app-wqxuo.ondigitalocean.app/send-alert
Headers:
  Content-Type: application/json
  accept: */*
Body:
  {
    "amount": 10000,
    "email": "example@gmail.com"
  }
```

### 2. Monitoring Hook (`hooks/use-spending-alert.ts`)

**Purpose:** Automatically monitors transactions and triggers alerts

**Key Features:**

- Calculates monthly expenses from transaction data
- Loads alert settings from AsyncStorage
- Monitors spending in real-time
- Triggers alert when threshold is crossed
- Prevents duplicate alerts per month

**Algorithm:**

```typescript
1. Load alert settings on mount
2. Calculate monthly total when transactions change
3. Check conditions:
   - Alert enabled?
   - Monthly total >= limit?
   - Not already triggered this session?
   - Not already sent this month?
4. If all pass → Send email & mark as sent
```

### 3. Settings UI (`app/(tabs)/settings.tsx`)

**UI Components:**

- Enable/Disable toggle (Switch)
- Monthly Limit input (numeric, INR currency)
- Email input (validated)
- Save button (emerald primary, disabled until valid)

**Validation:**

- Amount must be > 0
- Email must match regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Both fields required when alert is enabled

**User Flow:**

1. User toggles "Enable Alert" on
2. Enters monthly limit (e.g., 50000)
3. Enters email address
4. Clicks "Save Alert Settings"
5. Success confirmation dialog shown

### 4. Home Screen Integration (`app/(tabs)/index.tsx`)

**Features:**

- Imports and uses `useSpendingAlert()` hook
- Displays alert banner when email is sent
- Banner auto-dismisses after 5 seconds
- Refreshes alert settings on pull-to-refresh

**Alert Banner:**

- Amber/yellow theme (`#FEF3C7` light, `#7C2D12` dark)
- Shows: "Spending Alert Sent!"
- Displays limit amount and email address
- Non-blocking UI element

## 🛡️ Edge Cases Handled

### 1. **Duplicate Prevention**

- **Problem:** User opens app multiple times, could trigger multiple emails
- **Solution:**
  - Check `alertSentForMonth` flag in AsyncStorage
  - Only send if current month key doesn't match stored month
  - Session-level flag prevents multiple triggers in single app session

### 2. **Month Boundary**

- **Problem:** Alert should reset when month changes
- **Solution:**
  - Month key format: "YYYY-MM" (e.g., "2026-02")
  - Automatically resets when month changes
  - No manual reset needed

### 3. **API Failure**

- **Problem:** Network errors, backend unavailable
- **Solution:**
  - Try-catch blocks around API calls
  - Don't mark as sent if API fails
  - Will retry on next app open when conditions still met
  - Console logs for debugging

### 4. **Invalid Transaction Dates**

- **Problem:** Malformed dates could crash calculation
- **Solution:**
  - Try-catch around date parsing
  - `isNaN()` check on parsed dates
  - Filter out invalid transactions
  - Continues with valid transactions only

### 5. **Partial Form Completion**

- **Problem:** User enters amount but not email (or vice versa)
- **Solution:**
  - Save button disabled until both fields valid
  - Real-time validation feedback
  - Clear error messages under each field

### 6. **Settings Not Saved**

- **Problem:** User enables alert but doesn't save
- **Solution:**
  - Alert only triggers if settings exist in AsyncStorage
  - Toggle alone doesn't activate feature
  - Must click "Save Alert Settings"

### 7. **Email Format Validation**

- **Problem:** User enters invalid email
- **Solution:**
  - Regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - Inline error message
  - Submit button disabled

### 8. **Currency Formatting**

- **Problem:** Large numbers hard to read
- **Solution:**
  - Use `toLocaleString("en-IN")` for Indian formatting
  - Displays as: ₹50,000 instead of ₹50000
  - Consistent with app's currency display

### 9. **Dark Mode Support**

- **Problem:** Alert banner needs to be visible in both themes
- **Solution:**
  - Color variants for light/dark modes
  - Amber theme works well in both
  - High contrast maintained

### 10. **First-Time Users**

- **Problem:** No settings exist, monitoring runs anyway
- **Solution:**
  - Null checks on `alertSettings`
  - Guard clauses return early if settings missing
  - No errors or crashes if not configured

## 🎯 Testing Scenarios

### Manual Testing Checklist

1. **Settings Configuration:**
   - [ ] Toggle alert on/off
   - [ ] Enter valid amount
   - [ ] Enter invalid amount (0, negative, text)
   - [ ] Enter valid email
   - [ ] Enter invalid email
   - [ ] Save button disabled when invalid
   - [ ] Save button enabled when valid
   - [ ] Success alert shown on save

2. **Alert Triggering:**
   - [ ] Add transactions to reach limit
   - [ ] Verify banner appears on home screen
   - [ ] Check email received
   - [ ] Restart app - should NOT send again
   - [ ] Add more transactions - should NOT send again
   - [ ] Change system date to next month
   - [ ] Add transactions - SHOULD send again

3. **Edge Cases:**
   - [ ] Disable alert - banner should not appear
   - [ ] Clear app data - settings should reset
   - [ ] Poor network - should handle gracefully
   - [ ] Invalid transaction dates - should calculate correctly
   - [ ] Theme switching - banner should be visible

## 📊 Data Flow

```
User Input (Settings)
    ↓
AsyncStorage (Persist Settings)
    ↓
useSpendingAlert Hook (Monitor)
    ↓
Calculate Monthly Total (Finance Context)
    ↓
Check Conditions (Threshold, Month, Sent Flag)
    ↓
Send Alert API (Backend)
    ↓
Mark as Sent (AsyncStorage)
    ↓
Show Banner (Home Screen)
```

## 🚀 Usage Example

```typescript
// In any component that needs to monitor spending
import { useSpendingAlert } from "@/hooks/use-spending-alert";

function MyComponent() {
  const { monthlyTotal, alertSettings, isAlertTriggered } = useSpendingAlert();

  // Monthly total is automatically calculated
  console.log("Current month spending:", monthlyTotal);

  // Alert settings loaded from storage
  console.log("Limit:", alertSettings?.monthlyLimit);

  // Alert status
  console.log("Alert sent this month:", isAlertTriggered);
}
```

## 🔐 Security Considerations

1. **Email Privacy:**
   - Stored in AsyncStorage (device-only)
   - Not transmitted except to alert API
   - User controls their own data

2. **API Security:**
   - Uses HTTPS endpoint
   - No sensitive data in payload
   - Rate limiting handled by backend

3. **Input Sanitization:**
   - Email validation prevents injection
   - Amount parsing prevents NaN errors
   - Trim whitespace from inputs

## 🎨 UI Design Compliance

All UI elements follow the app's design system:

- **Colors:** Emerald primary (`#10B981`), Amber alerts (`#F59E0B`)
- **Border Radius:** 16px for cards, 12px for inputs/buttons
- **Typography:** System fonts with appropriate weights
- **Spacing:** 16px padding, consistent margins
- **Dark Mode:** Full theme support with appropriate colors
- **Accessibility:** 44px minimum touch targets, proper contrast

## 📝 Future Enhancements

1. **Multiple Alert Thresholds:**
   - Warning at 50%, 75%, 100%
   - Different notification types

2. **Alert History:**
   - View past alerts sent
   - Monthly spending trends

3. **Custom Alert Messages:**
   - User-defined email content
   - Personalized subject lines

4. **SMS/Push Notifications:**
   - Alternative to email
   - More immediate alerts

5. **Category-Specific Alerts:**
   - Alert for specific spending categories
   - Food, Transport, Entertainment limits

## 🐛 Debugging

**Console Logs:**

- Alert sent: "📧 Monthly spending alert email sent successfully"
- Month key: Current month in YYYY-MM format
- API errors: Full error stack trace

**AsyncStorage Inspection:**

```typescript
import AsyncStorage from "@react-native-async-storage/async-storage";

// Check settings
AsyncStorage.getItem("@fintrackor_alert_settings").then(console.log);

// Check sent month
AsyncStorage.getItem("@fintrackor_alert_sent_month").then(console.log);
```

## ✅ Conclusion

The Monthly Spending Alert feature is fully implemented with:

- ✅ Settings UI with validation
- ✅ AsyncStorage persistence
- ✅ Monthly expense calculation
- ✅ Alert trigger logic with deduplication
- ✅ API integration with error handling
- ✅ UX enhancements (banner, auto-dismiss)
- ✅ Comprehensive edge case handling
- ✅ Design system compliance
- ✅ Dark mode support

The feature is production-ready and handles all specified requirements and edge cases.
