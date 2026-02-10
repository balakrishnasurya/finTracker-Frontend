# Debugging Spending Alert Email Trigger

## 🔍 What I Added

I've added comprehensive console logging throughout the spending alert system to help diagnose why the email isn't being triggered.

## 📊 Console Log Guide

When you run the app, you'll see logs with these prefixes:

### 1. **💰 Monthly Calculation Logs**

```
💰 [Alert Hook] Calculating monthly expenses for 2026-02
   Total transactions: X
   Transactions this month: Y
   Monthly total: ₹Z
```

**What to check:**

- Are there any transactions this month?
- Is the monthly total correct?
- Does the total match what you see on screen?

### 2. **🔧 Settings Loading**

```
🔧 [Alert Hook] Settings loaded: { monthlyLimit: 50000, email: "...", enabled: true }
```

**What to check:**

- Are settings loaded correctly?
- Is `enabled: true`?
- Is the `monthlyLimit` correct?
- Is the email valid?

### 3. **🔍 Trigger Condition Checks**

```
🔍 [Alert Hook] Checking conditions...
  - Alert Settings: {...}
  - Monthly Total: X
  - Already Triggered: false
```

Then you'll see one of these outcomes:

#### ❌ **Failure Cases:**

```
  ❌ No alert settings found
```

**Fix:** Go to Settings and save your alert configuration

```
  ❌ Alert is disabled
```

**Fix:** Toggle "Enable Alert" ON in Settings

```
  ❌ Monthly total (₹X) is below limit (₹Y)
```

**Fix:** Add more transactions or lower your limit for testing

```
  ❌ Alert already triggered in this session
```

**Info:** Close and reopen the app to reset

```
  ❌ Alert already sent this month
```

**Fix:** Clear the flag (see "Reset Testing" below)

#### ✅ **Success Case:**

```
  ✓ Alert enabled with limit: ₹50000
  ✓ Monthly total (₹60000) exceeds or equals limit (₹50000)
  ✅ ALL CONDITIONS MET - Sending alert email...
```

### 4. **📅 Month Check**

```
📅 [Storage] Checking if alert was sent:
   Current month: 2026-02
   Sent month: none
   Match: false
```

**What to check:**

- If "Sent month" matches "Current month", alert won't send again
- "none" means no alert sent yet this month

### 5. **📤 API Call**

```
📤 [API] Sending alert email...
   Amount: ₹50000
   Email: user@example.com
   URL: https://seal-app-wqxuo.ondigitalocean.app/send-alert
   Body: {"amount":50000,"email":"user@example.com"}
   Response status: 200
   Response OK: true
   ✅ Response: Email sent successfully
📧 Alert email sent successfully!
```

**What to check:**

- Does the API call succeed (status 200)?
- Is the response body correct?
- Any error messages?

## 🧪 Testing Steps

### Step 1: Check Settings

1. Open Settings screen
2. Toggle "Enable Alert" ON
3. Enter a monthly limit (e.g., ₹1000 for testing)
4. Enter valid email
5. Click "Save Alert Settings"
6. Check console for: `🔧 [Alert Hook] Settings loaded`

### Step 2: Add Transactions

1. Go to Home screen
2. Add transactions totaling MORE than your limit
3. Watch console for calculation logs
4. Check: `💰 [Alert Hook] ... Monthly total: ₹X`

### Step 3: Trigger Check

1. Refresh the home screen (pull to refresh)
2. Watch console for: `🔍 [Alert Hook] Checking conditions...`
3. Follow the condition checks
4. If all pass, watch for: `📤 [API] Sending alert email...`

## 🐛 Common Issues & Fixes

### Issue 1: "No alert settings found"

**Cause:** Settings not saved
**Fix:**

- Go to Settings → Spending Alert
- Enter limit and email
- Click "Save Alert Settings"

### Issue 2: "Monthly total is below limit"

**Cause:** Not enough transactions
**Fix:**

- Lower the limit in settings (e.g., ₹500)
- OR add more transactions

### Issue 3: "Alert already sent this month"

**Cause:** Alert was sent before
**Fix:** Clear AsyncStorage (see below)

### Issue 4: API Error

**Cause:** Network or backend issue
**Fix:**

- Check internet connection
- Verify backend URL is accessible
- Check API response in logs

## 🔄 Reset for Testing

To test multiple times in the same month, you need to clear the "sent" flag:

### Method 1: Via Code (Recommended)

Add this temporary button to Settings screen:

```tsx
<Button
  title="🧪 Reset Alert Flag (DEV)"
  onPress={async () => {
    await AsyncStorage.removeItem("@fintrackor_alert_sent_month");
    Alert.alert("Reset", "Alert flag cleared. You can trigger alert again.");
  }}
  variant="secondary"
/>
```

### Method 2: Clear All App Data

- iOS: Delete app and reinstall
- Android: Settings → Apps → FinTrackor → Clear Data

## 📋 Checklist

Before reporting an issue, verify:

- [ ] Alert is enabled in Settings
- [ ] Valid email is saved
- [ ] Monthly limit is set
- [ ] Monthly expenses >= limit
- [ ] Alert hasn't been sent this month
- [ ] Internet connection is active
- [ ] Console shows all logs
- [ ] No error messages in red

## 🎯 Expected Flow

```
1. Settings saved ✓
2. Transactions added ✓
3. Monthly total calculated ✓
4. Monthly total >= limit ✓
5. Alert enabled ✓
6. Not already sent ✓
7. API call made ✓
8. Email sent ✓
9. Flag marked ✓
10. Banner shown ✓
```

## 📞 What to Report

If still not working, share:

1. **All console logs** (copy/paste)
2. **Settings values** (limit, email, enabled status)
3. **Monthly total** from logs
4. **Number of transactions** this month
5. **API response** (if it gets that far)
6. **Error messages** (if any)

The detailed logs will show EXACTLY where it's failing! 🎯
