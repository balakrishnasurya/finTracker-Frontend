# API Integration Documentation

## Overview

The FinTrackor app integrates with a RESTful backend API following industry-standard practices with a modular, maintainable architecture.

## Architecture

### Layer Structure

```
┌─────────────────────────────────────┐
│         UI Components               │
│  (React Native Screens & Components)│
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Context Layer                 │
│  (finance-context.tsx)              │
│  - State Management                 │
│  - Business Logic                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Service Layer                  │
│  (category.service.ts)              │
│  (transaction.service.ts)           │
│  - API Calls                        │
│  - Data Transformation              │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       HTTP Client                   │
│  (http.client.ts)                   │
│  - Network Requests                 │
│  - Error Handling                   │
│  - Logging                          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Backend API                    │
│  https://plankton-app-v4el9...      │
└─────────────────────────────────────┘
```

## Project Structure

```
fintrackorApp/
├── config/
│   ├── api.config.ts          # API endpoints & configuration
│   └── env.config.ts          # Environment variables
├── services/
│   └── api/
│       ├── http.client.ts     # HTTP client wrapper
│       ├── category.service.ts # Category API operations
│       ├── transaction.service.ts # Transaction API operations
│       └── index.ts           # Service exports
├── types/
│   ├── index.ts               # Core type definitions
│   └── api.types.ts           # API request/response types
├── context/
│   └── finance-context.tsx    # Global state with API integration
├── hooks/
│   └── use-api.ts             # Custom hook for API operations
└── utils/
    ├── storage.ts             # Local storage (offline support)
    └── logger.ts              # Logging utility
```

## Key Features

### 1. **Modular Architecture**

- Separation of concerns (UI, Business Logic, API, Storage)
- Easy to test and maintain
- Reusable services across the app

### 2. **Type Safety**

- Full TypeScript support
- API response types
- DTO (Data Transfer Object) types
- Runtime type validation

### 3. **Error Handling**

- Centralized error handling in HTTP client
- User-friendly error messages
- Automatic retry logic
- Graceful degradation

### 4. **Offline Support**

- Local storage fallback using AsyncStorage
- Sync when connection is restored
- Cached data for offline viewing

### 5. **Logging**

- Configurable logging levels
- API request/response logging
- Performance monitoring
- Error tracking

## API Services

### Category Service

```typescript
import { categoryService } from "@/services/api";

// Get all categories
const categories = await categoryService.getCategories();

// Get category by ID
const category = await categoryService.getCategoryById("123");

// Create category
const newCategory = await categoryService.createCategory({
  name: "Groceries",
  icon: "🛒",
  color: "#10B981",
  type: "expense",
});

// Update category
const updated = await categoryService.updateCategory("123", {
  name: "Food & Groceries",
});

// Delete category
await categoryService.deleteCategory("123");
```

### Transaction Service

```typescript
import { transactionService } from "@/services/api";

// Get all transactions
const transactions = await transactionService.getTransactions();

// Get transaction by ID
const transaction = await transactionService.getTransactionById("456");

// Create transaction
const newTransaction = await transactionService.createTransaction({
  amount: 50.0,
  categoryId: "123",
  description: "Grocery shopping",
  date: "2026-01-24",
  type: "expense",
});

// Update transaction
const updated = await transactionService.updateTransaction("456", {
  amount: 55.0,
});

// Delete transaction
await transactionService.deleteTransaction("456");
```

## Configuration

### API Configuration (`config/api.config.ts`)

```typescript
export const API_CONFIG = {
  BASE_URL: "https://plankton-app-v4el9.ondigitalocean.app/api/v1",
  TIMEOUT: 10000, // 10 seconds
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
};
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://plankton-app-v4el9.ondigitalocean.app/api/v1
EXPO_PUBLIC_API_TIMEOUT=10000
EXPO_PUBLIC_API_LOGGING=true
```

## Usage in Components

### Using Context (Recommended)

```typescript
import { useFinance } from '@/context/finance-context';

export default function MyScreen() {
  const {
    categories,
    transactions,
    isLoading,
    error,
    refreshData,
    addCategory
  } = useFinance();

  // All API calls are handled by the context
  const handleCreate = async () => {
    await addCategory({
      name: 'New Category',
      icon: '💰',
      color: '#10B981',
      type: 'income'
    });
  };

  return (
    // Your UI
  );
}
```

### Using Custom Hook

```typescript
import { useApi } from '@/hooks/use-api';
import { categoryService } from '@/services/api';

export default function MyComponent() {
  const { data, loading, error, execute } = useApi({
    onSuccess: (data) => console.log('Success:', data),
    onError: (error) => console.error('Error:', error)
  });

  const loadCategories = async () => {
    await execute(() => categoryService.getCategories());
  };

  return (
    // Your UI
  );
}
```

## Error Handling

The app implements multiple layers of error handling:

1. **HTTP Client Level**: Network errors, timeouts, HTTP status codes
2. **Service Level**: Data transformation errors, validation
3. **Context Level**: State management errors, fallback to local storage
4. **UI Level**: User-friendly error messages

### Example Error Handling

```typescript
try {
  await categoryService.createCategory(data);
} catch (error) {
  if (error.statusCode === 401) {
    // Handle authentication error
  } else if (error.statusCode === 0) {
    // Handle offline error
  } else {
    // Handle other errors
  }
}
```

## Testing the API Integration

### 1. Test Category Fetch

```bash
curl -X 'GET' \
  'https://plankton-app-v4el9.ondigitalocean.app/api/v1/categories' \
  -H 'accept: */*'
```

### 2. Test in App

1. Open the app
2. Pull down to refresh on the home screen
3. Check the console for API logs
4. Try creating a new category
5. Verify data syncs with backend

## Offline Support

The app maintains local storage as a cache:

1. **On App Launch**: Fetches from API, falls back to local storage
2. **On User Action**: Tries API first, falls back to local-only operation
3. **On Refresh**: Force fetches from API
4. **On Reconnect**: Automatically syncs with backend

## Best Practices Followed

1. ✅ **Single Responsibility**: Each service handles one domain
2. ✅ **Dependency Injection**: Services use constructor injection
3. ✅ **Error Boundaries**: Multiple layers of error handling
4. ✅ **Type Safety**: Full TypeScript coverage
5. ✅ **Logging**: Centralized logging for debugging
6. ✅ **Configuration Management**: Environment-based config
7. ✅ **Separation of Concerns**: UI, Business Logic, API separated
8. ✅ **Singleton Pattern**: Shared service instances
9. ✅ **Repository Pattern**: Abstracted data access
10. ✅ **Graceful Degradation**: Offline fallback

## Future Enhancements

- [ ] Request caching with TTL
- [ ] Optimistic UI updates
- [ ] Retry logic with exponential backoff
- [ ] Request queuing for offline operations
- [ ] WebSocket support for real-time updates
- [ ] Authentication & authorization
- [ ] Request interceptors for tokens
- [ ] Response pagination
- [ ] Data synchronization conflict resolution

## Troubleshooting

### API Not Responding

1. Check internet connection
2. Verify API_BASE_URL in config
3. Check console logs for errors
4. Test API endpoint directly with curl

### Data Not Syncing

1. Check if offline mode is active
2. Pull to refresh to force sync
3. Clear app cache and restart
4. Check API logs for error codes

### TypeScript Errors

1. Ensure all types are imported correctly
2. Run `npm install` to update dependencies
3. Restart TypeScript server in VSCode

## Support

For issues related to:

- **Backend API**: Contact backend team
- **App Integration**: Check this documentation
- **Bugs**: Create an issue in the repository
