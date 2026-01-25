# FinTrackor - Finance Tracking App 💰

A modern, full-featured finance tracking app built with React Native and Expo, featuring real-time backend API integration.

## Features ✨

- 📊 **Dashboard Overview** - View your financial summary at a glance
- 💰 **Income & Expense Tracking** - Add, edit, and manage transactions
- 📁 **Category Management** - Create custom categories with icons and colors
- 🔄 **Real-time Sync** - Backend API integration with offline support
- 🌓 **Dark Mode** - Automatic light/dark theme support
- 📱 **Pull-to-Refresh** - Manual data sync from backend
- 💾 **Offline Support** - Works without internet, syncs when online
- 🎨 **Modern UI** - Clean, professional finance-focused design

## Tech Stack 🛠️

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: React Context API
- **Navigation**: Expo Router (file-based routing)
- **Storage**: AsyncStorage (local caching)
- **API Integration**: RESTful API with custom HTTP client
- **Styling**: React Native StyleSheet

## Project Structure 📁

```
fintrackorApp/
├── app/                      # Screen components (file-based routing)
│   ├── (tabs)/              # Tab navigation screens
│   ├── categories/          # Category management screens
│   └── transactions/        # Transaction management screens
├── components/              # Reusable UI components
│   ├── ui/                  # Base UI components
│   ├── category-card.tsx
│   └── transaction-card.tsx
├── config/                  # Configuration files
│   ├── api.config.ts        # API endpoints
│   └── env.config.ts        # Environment variables
├── context/                 # React Context providers
│   └── finance-context.tsx  # Finance state management
├── hooks/                   # Custom React hooks
│   └── use-api.ts          # API operation hook
├── services/                # API service layer
│   └── api/
│       ├── http.client.ts   # HTTP client
│       ├── category.service.ts
│       └── transaction.service.ts
├── types/                   # TypeScript type definitions
│   ├── index.ts            # Core types
│   └── api.types.ts        # API types
├── utils/                   # Utility functions
│   ├── storage.ts          # Local storage helpers
│   └── logger.ts           # Logging utility
└── docs/                    # Documentation
    └── API_INTEGRATION.md   # API integration guide
```

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Install AsyncStorage**

   ```bash
   npm install @react-native-async-storage/async-storage
   ```

3. **Configure environment** (optional)

   Copy `.env.example` to `.env` and update values:

   ```bash
   cp .env.example .env
   ```

4. **Start the app**

   ```bash
   npm start
   ```

### Running on Different Platforms

- **iOS Simulator**: Press `i` in the terminal
- **Android Emulator**: Press `a` in the terminal
- **Expo Go**: Scan QR code with Expo Go app
- **Web**: Press `w` in the terminal

## API Integration 🔌

The app integrates with a backend API for data persistence:

**API Base URL**: `https://plankton-app-v4el9.ondigitalocean.app/api/v1`

### Available Endpoints

- `GET /categories` - Fetch all categories
- `POST /categories` - Create new category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /transactions` - Fetch all transactions
- `POST /transactions` - Create transaction
- `PUT /transactions/:id` - Update transaction
- `DELETE /transactions/:id` - Delete transaction

### Testing API

```bash
curl -X 'GET' \
  'https://plankton-app-v4el9.ondigitalocean.app/api/v1/categories' \
  -H 'accept: */*'
```

For detailed API integration documentation, see [API_INTEGRATION.md](./docs/API_INTEGRATION.md)

## Architecture 🏗️

The app follows industry-standard practices with a **modular, layered architecture**:

1. **Presentation Layer** (UI Components)
2. **Business Logic Layer** (Context & Hooks)
3. **Service Layer** (API Services)
4. **Data Layer** (HTTP Client & Storage)

### Key Patterns Used

- **Repository Pattern** - Abstracted data access
- **Singleton Pattern** - Shared service instances
- **Context Provider Pattern** - Global state management
- **Factory Pattern** - HTTP client configuration
- **Strategy Pattern** - Online/offline data handling

## Development 👨‍💻

### Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run on web
npm run lint       # Run ESLint
```

### Adding New Features

1. Create types in `types/`
2. Add API service in `services/api/`
3. Update context in `context/`
4. Create UI components in `components/`
5. Add screens in `app/`

### Code Style

- Use TypeScript for type safety
- Follow React hooks best practices
- Keep components small and focused
- Use meaningful variable names
- Document complex logic

## Features in Detail 📝

### Dashboard

- Total balance display (color-coded)
- Income vs Expense breakdown
- Recent transactions preview
- Quick action buttons
- Pull-to-refresh sync

### Category Management

- Create categories with custom icons and colors
- 12 icon options, 8 color presets
- Separate income/expense categories
- View transaction count per category
- Delete with cascade warning

### Transaction Management

- Add transactions with amount, description, date
- Select category from visual grid
- Filter by type (all/income/expense)
- Sort by date (newest first)
- View detailed transaction info

### Offline Support

- Local data caching with AsyncStorage
- Automatic sync when online
- Graceful degradation
- Pull-to-refresh manual sync

## Troubleshooting 🔧

### API Not Loading

1. Check internet connection
2. Verify API URL in `config/api.config.ts`
3. Check console logs for errors
4. Pull to refresh to retry

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --clear
```

### TypeScript Errors

```bash
# Restart TypeScript server in VSCode
Cmd+Shift+P > TypeScript: Restart TS Server
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements 🚀

- [ ] Charts and analytics
- [ ] Budget tracking
- [ ] Recurring transactions
- [ ] Export data (CSV/PDF)
- [ ] Multiple currency support
- [ ] Authentication & user accounts
- [ ] Push notifications
- [ ] Data backup & restore

## License 📄

This project is licensed under the MIT License.

## Support 💬

For issues and questions:

- Create an issue in the repository
- Check [API_INTEGRATION.md](./docs/API_INTEGRATION.md) for API docs
- Review code comments for implementation details

---

Made with ❤️ using React Native & Expo
