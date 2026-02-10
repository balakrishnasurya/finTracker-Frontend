# FinTrackor App UI Description

This document provides a detailed overview of the User Interface (UI) design, including layout, colors, typography, icons, and components used in the FinTrackor application.

## 1. Design System & Colors

The application follows a modern, clean design system with support for both Light and Dark themes.

### Brand Colors

- **Primary:** `#10B981` (Emerald Green) - Used for primary actions, active tabs, and success states.
- **Secondary:** `#3B82F6` (Blue) - Used for secondary buttons and informational badges.
- **Danger/Expense:** `#EF4444` (Red) - Used for expense amounts, remove actions, and alert states.
- **Streak/Accent:** `#F59E0B` (Amber/Yellow) - Used for motivation and gamification elements (Streaks).

### Theme Colors

| Element               | Light Mode           | Dark Mode            |
| :-------------------- | :------------------- | :------------------- |
| **Background (Main)** | `#F3F4F6` (Gray-100) | `#111827` (Gray-900) |
| **Surface/Card**      | `#FFFFFF`            | `#1F2937` (Gray-800) |
| **Text (Primary)**    | `#111827`            | `#F9FAFB`            |
| **Text (Secondary)**  | `#6B7280`            | `#9CA3AF`            |
| **Border/Divider**    | `#E5E7EB`            | `#374151`            |
| **Tab Bar BG**        | `#FFFFFF`            | `#1F2937`            |

## 2. Layout & Structure

### Navigation

- **Root Navigation:** `Stack` navigator with modal presentation for forms (New Transaction, Categories).
- **Tab Navigation:** Bottom Tab Bar with 4 main sections:
  - **Home (index):** Finance overview and recent activity.
  - **Chat (explore):** AI Assistant interface.
  - **Split (split):** Group expense management.
  - **Settings:** App configuration and user profile.
- **Tab Bar Styling:**
  - **Active Color:** `#10B981` (Emerald Green).
  - **Icon Size:** `28px` for tab icons.
  - **Haptic Feedback:** Light impact feedback on iOS when tabs are pressed.

### Common Layout Patterns

- **Screen Padding:** Standard `20px` padding on main ScrollViews.
- **Header Sections:**
  - **Top Padding:** `60px` on iOS, `40px` on Android.
  - **Bottom Margin:** `28px` below headers.
- **Cards:**
  - **Border Radius:** `16px`.
  - **Shadows:** Subtle offset `(0, 2)`, opacity `0.1`, radius `8`.
  - **Elevation:** `3` (Android).
  - **Padding:** Standard `16px` internal padding.
- **Section Spacing:** `24px` - `32px` between major sections.
- **Footer Padding:** `20px` horizontal, `32px` bottom for fixed footers.

## 3. Typography

- **Fonts:** System default sans-serif (Inter/Roboto/SF Pro).
- **Header Styles:**
  - **Main Title:** `32px`, Weight `800` (Extra Bold), letter-spacing `-0.5`.
  - **Section Title:** `20px`, Weight `700` (Bold).
  - **Balance Amount:** `42px`, Weight `700`.
- **Body Styles:**
  - **Standard Text:** `14px` - `15px`.
  - **Secondary/Date:** `12px` - `13px`.
  - **Weights:** `400` (Regular), `500` (Medium), `600` (Semi-bold).

## 4. Icons & Symbols

### System Icons

- **Framework:** Using `IconSymbol` (SF Symbols compatible) at `28px` for tabs.
  - Home: `house.fill`
  - Chat: `message.fill` / `sparkles`
  - Split: `call.split`
  - Settings: `gearshape.fill`
- **Additional Icons:** Arrow up (`arrow.up`) for send buttons, checkmark for success states.

### Category Icons System

- **Type:** Emoji-based for visual appeal and universal recognition.
- **Available Icons:** 🏠 (Home), 🍕 (Food), 🚗 (Transport), 💼 (Business), 🎮 (Entertainment), 🏥 (Healthcare), 📚 (Education), ✈️ (Travel), 🛍️ (Shopping), 💰 (Finance), 📱 (Technology), ⚡ (Utilities).
- **Icon Containers:**
  - **Large:** `48x48px` with `12px` border radius.
  - **Medium:** `40x40px` with `10px` border radius.
  - **Background:** `20%` opacity of category's primary color.
- **Selection Grid:** `56x56px` buttons with `28px` emoji size for creation forms.

### Payment Type Icons

- **Cash:** 💵, **UPI:** 📱, **Card:** 💳, **Others:** 🔄
- **Grid Layout:** 4 columns with emoji + label vertically stacked.

### Predefined Category Mappings

- **Healthcare:** 💊 (Medicine), 💪 (Fitness), 💅 (Personal Care)
- **Travel:** ✈️ (Travel), ⛽ (Fuel)
- **Food:** 🍕 (Food & Drinks), 🛒 (Groceries)
- **Lifestyle:** 🛍️ (Shopping), 🎮 (Entertainment)
- **Utilities:** 📄 (Bills), 🏠 (Rent), 💳 (Credit)

## 5. Interaction Patterns

### Haptic Feedback

- **Tab Navigation:** Light impact feedback on iOS when tabs are pressed.
- **Implementation:** Uses Expo Haptics with `ImpactFeedbackStyle.Light`.

### Animations

- **Success Modals:** Spring animation with friction `8`, tension `40`.
- **Scale Animations:** From `0.3` to `1.0` for modal appearances.
- **Transform Effects:** `1.1x` scale on active color selection.

### Loading States

- **Buttons:** ActivityIndicator replacement with theme-appropriate colors.
- **Chat:** ActivityIndicator for message sending states.
- **Screens:** Full-screen loading with centered spinner and descriptive text.

### Refresh Control

- **Pull-to-Refresh:** Available on main scrollable screens.
- **Tint Colors:** Emerald-themed (`#10B981` light, `#059669` dark).

## 6. UI Components

### Buttons

- **Shape:** Rounded corners with `12px` border radius.
- **Height:** Minimum `44px` for touch accessibility.
- **Variants:**
  - **Primary:** Green background (`#10B981` / `#059669`), white text.
  - **Secondary:** Blue background (`#3B82F6` / `#2563EB`), white text.
  - **Danger:** Red background (`#EF4444` / `#DC2626`), white text.
- **Sizes:** Small (`8px` padding), Medium (`12px` padding), Large (`16px` padding).

### Form Inputs

- **Shape:** `12px` border radius with `1px` border.
- **Background:** Light Gray (`#F9FAFB`) in light mode, Dark Gray (`#374151`) in dark mode.
- **Padding:** `16px` horizontal, `12px` vertical.
- **Labels:** `14px`, Weight `600`, positioned above input with `8px` margin.
- **Typography:** `16px` input text size.
- **Placeholder:** Theme-appropriate gray text.
- **Errors:** Red text (`#EF4444`) below input with `4px` top margin, red border state.
- **Focus State:** Border color changes to primary color.

### Selection Grid Components

#### Category Selection

- **Grid Layout:** 4 columns (`23%` width each) with `8px` gap.
- **Item Styling:**
  - **Size:** Minimum `90px` height.
  - **Padding:** `10px`.
  - **Active State:** Emerald border (`2px`) with light emerald background.
  - **Icon Container:** `40x40px` with `10px` border radius.
  - **Typography:** `11px`, Weight `600`, center-aligned.

#### Payment Type Selection

- **Grid Layout:** 4 equal columns with `8px` gap.
- **Button Styling:**
  - **Height:** Minimum `70px`.
  - **Content:** Vertical stack of `24px` emoji + `12px` label.
  - **Active State:** Light emerald background with emerald border.

#### Icon Selection (Category Creation)

- **Grid Layout:** Flexible wrap with `12px` gaps.
- **Button Size:** `56x56px` with `12px` border radius.
- **Icon Size:** `28px` emoji.
- **Active State:** Light emerald background with emerald border.

#### Color Selection

- **Grid Layout:** Flexible wrap with `12px` gaps.
- **Button Size:** `48x48px` circular.
- **Colors Available:** 8 predefined colors (Red, Amber, Emerald, Blue, Purple, Pink, Teal, Orange).
- **Active State:** White border (`3px`) with `1.1x` scale transform.

### Home Screen Layout

- **Structure:** Vertical ScrollView with distinct sections.
- **Header Statistics:**
  - **Balance Card:** Center-aligned with `24px` vertical padding.
  - **Main Amount:** `42px`, Weight `700`, colored based on type.
  - **Prediction Card:** Horizontal split layout with divider.
  - **Prediction Values:** `16px` text with `12px` labels.
- **Quick Actions:** Horizontal button row with `12px` gap.
- **Transaction List:** Vertical cards with `12px` bottom margin.
- **Empty States:**
  - **Icon:** `48px` emoji.
  - **Title:** `16px`, Weight `600`.
  - **Subtitle:** `14px` with reduced opacity.
  - **Padding:** `32px` vertical in card.

### Modal & Form Patterns

#### Standard Modal Layout

- **Presentation:** Modal stack navigation.
- **Header:** `40px` top padding, `32px` title font, Weight `700`.
- **Content Area:** Card-based sections with `20px` margin bottom.
- **Footer:** Fixed bottom with horizontal button layout.
- **Button Spacing:** `8px` margin between buttons.

#### Form Validation

- **Required Fields:** Red asterisk (`*`) in labels.
- **Validation Messages:** Red text (`#EF4444`) below inputs.
- **Submit State:** Disabled state with loading indicator.
- **Success Feedback:** Modal with animation and auto-dismiss.

### Data Display Patterns

#### Currency Formatting

- **Locale:** Indian Rupees (`en-IN`, `INR`).
- **Display:** Always negative for expenses (e.g., `-₹500.00`).
- **Color:** Red (`#EF4444`) for expense amounts.

#### Date Formatting

- **Format:** `MMM dd, yyyy` (e.g., "Jan 15, 2024").
- **Input Format:** `YYYY-MM-DD` for form fields.
- **Timestamps:** 12-hour format with AM/PM for chat messages.

#### List Sorting

- **Transactions:** Most recent first (descending by date).
- **Categories:** Alphabetical order within types.

## 7. Accessibility & Touch Targets

### Touch Target Sizing

- **Minimum Height:** `44px` for all interactive elements.
- **Tab Buttons:** Enhanced with haptic feedback component.
- **Card Touchables:** `0.7` opacity on press (`activeOpacity`).
- **Button Press:** `0.8` opacity for primary actions.

### Accessibility Features

- **Color Contrast:** High contrast ratios maintained across themes.
- **Font Scaling:** System font scaling supported.
- **Screen Reader:** Proper labeling with descriptive text.
- **Keyboard Navigation:** Standard platform navigation patterns.

### Platform Adaptations

- **Status Bar:** Auto-style based on theme.
- **Keyboard Avoidance:**
  - iOS: `padding` behavior with `90px` offset.
  - Android: `height` behavior.
- **Safe Area:** Consistent handling across iOS notch variations.

### Chat Interface

- **Headers:** Icons with sparkles symbol, `32px` size, emerald colored.
- **Input Container:**
  - **Border Radius:** `24px`.
  - **Border:** `1px` with theme-appropriate color.
  - **Padding:** `16px` horizontal, `8px` vertical.
  - **Shadow:** Subtle elevation with `(0, 2)` offset.
- **Chat Bubbles:**
  - **Max Width:** `80%` of screen width.
  - **Border Radius:** `16px` with `4px` tail on appropriate corner.
  - **User Bubbles:** Emerald background (`#10B981`), white text, right-aligned.
  - **AI Bubbles:** Theme-colored background, left-aligned.
  - **Spacing:** `16px` margin bottom between bubbles.
  - **Typography:** `15px` font size, `20px` line height.
- **Send Button:**
  - **Size:** `36x36px` circular.
  - **Active State:** Emerald background with white arrow icon.
  - **Inactive State:** Gray background (`#9CA3AF`) with reduced opacity.
  - **Animation:** Spring animation with loading indicator.

### Transaction Cards

- **Structure:** Horizontal layout with left/right sections.
- **Left Section:**
  - **Icon Container:** `40x40px` with `10px` border radius.
  - **Text Stack:** Description (`15px`, Weight `600`) + Date (`12px`).
  - **Spacing:** `12px` margin between icon and text.
- **Right Section:**
  - **Amount:** `16px`, Weight `700`, negative formatting.
  - **Color:** Red (`#EF4444`) for all expenses.
  - **Margin:** `8px` left margin from content.
- **Card Spacing:** `12px` bottom margin between cards.

### Category Grid

- **Layout:** 4 columns per row (`25%` width) with `6px` padding.
- **Item Styling:**
  - **Card Height:** Minimum `100px`.
  - **Icon Container:** `48x48px` with `12px` border radius.
  - **Category Name:** `11px`, Weight `600`, `2` lines max, `14px` line height.
  - **Spacing:** `8px` between icon and text.

### Streak Card & Badge

#### Streak Badge (Header)

- **Background:** Yellow (`#FEF3C7`) with golden border (`#FCD34D`).
- **Size:** Minimum `90px` width with `14px` horizontal padding.
- **Content:** Fire emoji (`32px`) + count (`24px`, Weight `800`) + label (`10px`, uppercase).
- **Shadow:** Amber glow effect with multiple shadow properties.

#### Streak Card (Full)

- **Header:** Fire emoji (`28px`) + title (`20px`, Weight `700`).
- **Content Layout:** Two stat boxes with vertical divider.
- **Statistics:**
  - **Current Streak:** `36px`, Weight `700`, emerald (`#10B981`).
  - **Longest Streak:** `36px`, Weight `700`, amber (`#F59E0B`).
  - **Labels:** `14px`, Weight `600`, gray text.
  - **Subtexts:** `12px`, lighter gray.
- **Divider:** `1px` width, `60px` height, gray background.
- **Footer:** Border top with italicized timestamp (`12px`).

## 8. Advanced Styling Details

### Shadow & Elevation System

#### Cards

- **Shadow Color:** `#000` (black).
- **Offset:** `(0, 2)` - no horizontal, 2px vertical.
- **Opacity:** `0.1` for subtle depth.
- **Radius:** `8px` blur radius.
- **Android Elevation:** `3` for material design consistency.

#### Floating Elements (Modals, Success)

- **Shadow Color:** `#000`.
- **Offset:** `(0, 10)` for pronounced floating effect.
- **Opacity:** `0.3` for stronger presence.
- **Radius:** `20px` for soft, diffused shadow.
- **Android Elevation:** `10` for maximum depth.

#### Streak Badge Special Effects

- **Shadow Color:** `#F59E0B` (amber) for glow effect.
- **Offset:** `(0, 4)` vertical.
- **Opacity:** `0.3` with `8px` radius.
- **Android Elevation:** `6`.

### Border Radius Hierarchy

- **Cards & Major Containers:** `16px`.
- **Buttons & Form Inputs:** `12px`.
- **Icon Containers (Large):** `12px`.
- **Icon Containers (Medium):** `10px`.
- **Chat Input & Special Elements:** `24px`.
- **Profile Avatars:** `26px` (52px diameter / 2).
- **Color Selection Buttons:** `24px` (fully circular).
- **Success Modal Container:** `24px`.

### Letter Spacing & Typography Details

- **Main Titles:** `-0.5` letter spacing for tighter, modern look.
- **Subtitles:** `0.3` letter spacing for improved readability.
- **Prediction Labels:** `0.5` letter spacing with uppercase transform.
- **Font Weights:** 400 (Regular), 500 (Medium), 600 (Semi-bold), 700 (Bold), 800 (Extra Bold).

### Opacity & State Management

- **Disabled Elements:** `0.4` opacity reduction.
- **Secondary Text:** `0.8` opacity for subtitles.
- **Inactive States:** `0.6` opacity for secondary information.
- **Press States:** `0.7` activeOpacity for cards, `0.8` for buttons.
- **Placeholder Text:** Theme-specific opacity with appropriate contrast.

### Color Alpha Variations

- **Category Backgrounds:** Primary color + `20%` opacity (e.g., `#10B98120`).
- **Active Selection States:** Primary color + `10%` opacity for backgrounds.
- **Modal Overlays:** Black (`#000`) at `50%` opacity (`rgba(0, 0, 0, 0.5)`).
- **User Message Timestamps:** White at `70%` opacity (`rgba(255, 255, 255, 0.7)`).
