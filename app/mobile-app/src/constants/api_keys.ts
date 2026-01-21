// ============================================
// API Configuration
// ============================================

/**
 * MOCK MODE TOGGLE
 * Set to true to use mock data (no backend required)
 * Set to false to use real API endpoints
 */
export const USE_MOCK_API = true;

/**
 * API BASE URL
 * Update this with your backend API URL
 * This is only used when USE_MOCK_API = false
 */
export const API_URL = USE_MOCK_API 
  ? '' 
  : (process.env.EXPO_PUBLIC_BACKEND_URL || 'https://your-api-url.com/api/v1');

/**
 * GOOGLE MAPS API KEY
 * Required for map features
 * Get your key from: https://console.cloud.google.com/
 */
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '__ADD_YOUR_GOOGLE_MAPS_API_KEY_HERE__';

/**
 * GOOGLE OAUTH CREDENTIALS
 * Required for Google Sign-In
 * Get from: https://console.cloud.google.com/apis/credentials
 */
export const GOOGLE_OAUTH_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || '__ADD_YOUR_GOOGLE_OAUTH_CLIENT_ID__';

/**
 * Google OAuth Web Client ID (required for @react-native-google-signin, idToken on Android)
 * Same as or from: https://console.cloud.google.com/apis/credentials (OAuth 2.0 Web client)
 */
export const GOOGLE_OAUTH_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_WEB_CLIENT_ID || '__ADD_YOUR_GOOGLE_OAUTH_WEB_CLIENT_ID__';

/**
 * Google OAuth iOS Client ID (for @react-native-google-signin on iOS)
 * From: https://console.cloud.google.com/apis/credentials (iOS OAuth client)
 */
export const GOOGLE_OAUTH_IOS_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_IOS_CLIENT_ID || '__ADD_YOUR_GOOGLE_OAUTH_IOS_CLIENT_ID__';
