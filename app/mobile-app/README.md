# Expo Starter Template

A modern, production-ready Expo React Native starter template with authentication, maps, chat, and filtering features. Built with TypeScript, React Query, Zustand, and mock API services for rapid development.

## ✨ Features

### 🔐 Authentication System
- Email/OTP authentication flow
- Social login ready (Google, Apple)
- JWT token management with automatic refresh
- Secure token storage
- Auth state management with Zustand

### 🗺️ Maps Integration
- React Native Maps with Google Maps
- Location-based item discovery
- Map and list view toggle
- User location tracking
- Distance calculations

### 💬 Chat/Messaging
- Conversation list
- Real-time messaging UI
- Message history
- User-to-user communication

### 🔍 Search & Filters
- Advanced filtering system
- Category filters
- Price range filters
- Feature-based filters
- Radius-based search
- Multiple sort options

### 🎨 UI/UX
- Modern, clean design
- Dark mode support
- Smooth animations
- Bottom sheet modals
- Custom components library
- Responsive layouts

### 🛠️ Development Features
- **Mock API Services** - Start developing immediately without a backend
- TypeScript throughout
- React Query for data fetching
- Zustand for state management
- Expo Router (file-based routing)
- Form validation with Zod
- Comprehensive error handling

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (optional, for quick testing on physical devices)

## 🚀 Quick Start

### 1. Install Dependencies

From the monorepo root:
```bash
npm install
```

Or from the mobile app directory:
```bash
cd app/mobile-app
npm install
```

### 2. Configure the App

Update these files with your app details:

**`app.json`**
- Change app name, slug, and bundle identifiers
- Add your Google Maps API key
- Add your OAuth credentials

**`src/constants/api_keys.ts`**
- Set `USE_MOCK_API = false` when you have a backend
- Set `EXPO_PUBLIC_BACKEND_URL` in `.env` (or edit `API_URL`) for the API base URL
- Set `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` and `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` for Maps and Google Sign-In

**`src/constants/theme.ts`**
- Customize colors to match your brand
- Update primary color and accent colors

### 3. Run the App

From monorepo root:
```bash
npm run dev:mobile
```

Or from mobile app directory:
```bash
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go for physical device

## 📱 App Structure

```
src/
├── app/                      # Expo Router pages (file-based routing)
│   ├── _layout.tsx          # Root layout
│   ├── login.tsx            # Login screen
│   ├── register.tsx         # Registration screen
│   ├── verifyOtp.tsx        # OTP verification
│   ├── onboarding.tsx       # Onboarding flow
│   └── (home)/              # Authenticated routes
│       ├── _layout.tsx      # Tab navigation
│       ├── index.tsx        # Home/Map screen
│       ├── items.tsx        # Items list screen
│       ├── chat.tsx         # Chat screen
│       └── settings.tsx     # Settings screen
│
├── components/              # React components
│   ├── Items/              # Items feature components
│   │   ├── ListView.tsx
│   │   ├── MapView.tsx
│   │   ├── FiltersSheet.tsx
│   │   └── ItemDetailsSheet.tsx
│   ├── Login/              # Login components
│   ├── Register/           # Registration components
│   ├── VerifyOtp/          # OTP verification
│   ├── chat/               # Chat components
│   ├── common/             # Reusable UI components
│   │   ├── PrimaryButton.tsx
│   │   ├── TextInput.tsx
│   │   ├── BottomSheet.tsx
│   │   ├── Dropdown.tsx
│   │   └── ...
│   └── ...
│
├── services/               # API services
│   └── mock/              # Mock API services
│       ├── auth.mock.ts   # Mock authentication
│       ├── items.mock.ts  # Mock items data
│       ├── chat.mock.ts   # Mock chat data
│       ├── user.mock.ts   # Mock user data
│       └── filters.mock.ts
│
├── store/                 # State management (Zustand)
│   └── auth/             # Auth store
│
├── context/              # React Context providers
│   ├── BottomSheetContext.tsx
│   └── TestStateContext.tsx
│
├── helpers/              # Helper functions
│   ├── ApiRequestHandler.ts
│   ├── localStorage.ts
│   ├── Logger.ts
│   └── utils.ts
│
├── hooks/                # Custom React hooks
│   ├── useColorScheme.ts
│   ├── useThemeColor.ts
│   └── ...
│
├── validators/           # Zod validation schemas
│   ├── auth/
│   └── items/
│
├── constants/            # App constants
│   ├── api_keys.ts      # API configuration
│   ├── theme.ts         # Theme colors
│   └── fonts.ts
│
└── assets/              # Static assets
    ├── images/
    ├── icons/
    └── fonts/
```

## 🔄 Mock API vs Real API

The template comes with **mock API services** so you can start developing immediately without a backend.

### Using Mock APIs (Default)

By default, `USE_MOCK_API = true` in `src/constants/api_keys.ts`.

**Mock Authentication:**
- Email: `demo@example.com`
- Password: Any (for demo)
- OTP: `123456`

**Mock Features:**
- Pre-populated items with locations
- Sample chat conversations
- Mock user profiles
- Simulated network delays for realistic testing

### Switching to Real API

When your backend is ready:

1. **Update configuration:**
   ```typescript
   // src/constants/api_keys.ts
   export const USE_MOCK_API = false;
   // API_URL uses process.env.EXPO_PUBLIC_BACKEND_URL, or set it explicitly
   ```
   And in `.env`: `EXPO_PUBLIC_BACKEND_URL=https://your-api.com/api/v1`

2. **Update hooks to use real API:**
   
   Replace mock service calls with `apiRequest`:
   
   ```typescript
   // Before (Mock)
   import { mockGetNearbyItems } from '@/services/mock/items.mock';
   queryFn: () => mockGetNearbyItems(params)
   
   // After (Real API)
   import { apiRequest } from '@/helpers/ApiRequestHandler';
   queryFn: () => apiRequest({ url: '/items', method: 'GET', params })
   ```

3. **Update types if needed:**
   
   The mock types are generic - update them to match your API responses:
   ```typescript
   // src/components/Items/types.ts
   export type Item = {
     // Update with your API's item structure
   };
   ```

## 🎨 Customization Guide

### Branding

1. **App Name & Identifiers**
   - Update `app.json`: name, slug, bundle identifiers
   - Update `app/mobile-app/package.json`: name field

2. **Colors**
   - Edit `src/constants/theme.ts`
   - Update `primary` color to your brand color
   - Customize light/dark mode colors

3. **Logo & Icons**
   - Replace `src/assets/images/icon.png`
   - Replace `src/assets/images/splash.png`
   - Update `src/assets/images/logo.png`

4. **Fonts**
   - Add custom fonts to `src/assets/fonts/`
   - Update `app.json` fonts configuration
   - Update `src/constants/fonts.ts`

### Adding Features

#### Add a New Screen

1. Create file in `src/app/(home)/yourscreen.tsx`
2. Add tab in `src/app/(home)/_layout.tsx`
3. Create components in `src/components/YourFeature/`

#### Add a New API Endpoint

1. Create mock service: `src/services/mock/yourfeature.mock.ts`
2. Create hooks: `src/components/YourFeature/yourfeature.hooks.ts`
3. Use in components with React Query

#### Add Form Validation

1. Create schema: `src/validators/yourfeature/schema.validations.ts`
2. Use with form library (React Hook Form recommended)

## 🔐 Authentication Flow

```
Login Screen
    ├─> Enter email
    ├─> Send OTP (mock: always 123456)
    └─> Verify OTP Screen
            ├─> Enter OTP
            ├─> Verify & get tokens
            └─> Navigate to Home (authenticated)

Register Screen
    ├─> Enter details
    ├─> Submit registration
    └─> Verify OTP Screen (same flow)

Social Auth
    ├─> Google/Apple Sign In
    ├─> Get tokens
    └─> Navigate to Home
```

## 🗺️ Maps Setup

### Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project
3. Enable **Maps SDK for Android** and **Maps SDK for iOS**
4. Create credentials (API Key)
5. Add to `app.json` and `src/constants/api_keys.ts`

### Testing Maps

- **iOS Simulator**: Works out of the box
- **Android Emulator**: Make sure Google Play Services is installed
- **Physical Device**: Requires valid API key

## 📦 Dependencies

### Core
- `expo` - Expo framework
- `react-native` - React Native
- `expo-router` - File-based routing
- `react` - React library

### State & Data
- `zustand` - State management
- `@tanstack/react-query` - Data fetching & caching
- `zod` - Schema validation
- `react-hook-form` - Form management

### UI & Navigation
- `react-native-maps` - Maps integration
- `react-native-reanimated` - Animations
- `react-native-gesture-handler` - Gestures
- `@gorhom/bottom-sheet` - Bottom sheets
- `react-native-safe-area-context` - Safe area handling

### Utilities
- `axios` - HTTP client
- `expo-location` - Location services
- `expo-font` - Custom fonts
- `moment` - Date handling

## 🚢 Building for Production

### Development Build

```bash
cd app/mobile-app

# iOS
expo run:ios

# Android
expo run:android
```

### Production Build with EAS

1. **Install EAS CLI:**
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS:**
   ```bash
   eas build:configure
   ```

3. **Build:**
   ```bash
   # Android
   eas build --platform android --profile production

   # iOS
   eas build --platform ios --profile production
   ```

4. **Submit to Stores:**
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## 🧪 Testing

### Manual Testing Checklist

- [ ] Login with email/OTP (use OTP: 123456)
- [ ] Register new account
- [ ] View items in list mode
- [ ] View items in map mode
- [ ] Apply filters
- [ ] View item details
- [ ] Open chat
- [ ] Send message
- [ ] Update settings/profile
- [ ] Logout and login again
- [ ] Test on iOS and Android
- [ ] Test light and dark modes

### Automated Testing

Add your tests to:
- `__tests__/` - Jest tests
- Use React Native Testing Library
- Test components, hooks, and utilities

## 📝 Environment Variables

Create `.env` (optional; `src/constants/api_keys.ts` can use defaults):

```env
EXPO_PUBLIC_BACKEND_URL=https://your-api.com/api/v1
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
```

`API_URL` in `api_keys.ts` uses `process.env.EXPO_PUBLIC_BACKEND_URL` when `USE_MOCK_API` is false.

## 🐛 Troubleshooting

### Metro Bundler Issues
```bash
npm start -- --clear
```

### iOS Pods Issues
```bash
cd ios && pod install && cd ..
```

### Android Build Issues
```bash
cd android && ./gradlew clean && cd ..
```

### Cache Issues
```bash
rm -rf node_modules
npm install
expo start --clear
```

## 📚 Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native](https://reactnative.dev/)
- [React Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🤝 Contributing

This is a template project. Feel free to customize it for your needs!

## 📄 License

MIT - This is a starter template, use it however you want!

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Run the app and test with mock data
3. ⬜ Customize branding (colors, logo, name)
4. ⬜ Update app.json with your details
5. ⬜ Build your features
6. ⬜ Connect to your backend API
7. ⬜ Test on real devices
8. ⬜ Build and deploy!

---

**Happy coding! 🚀**

For questions or issues, refer to the Expo documentation or React Native community resources.
