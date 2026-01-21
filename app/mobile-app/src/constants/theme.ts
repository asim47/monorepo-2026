/**
 * APP THEME CONFIGURATION
 * 
 * Customize these colors to match your brand
 * Current colors are just placeholders - update them with your brand colors
 * 
 * Color scheme supports both light and dark modes
 * There are many other styling options available:
 * - [Nativewind](https://www.nativewind.dev/)
 * - [Tamagui](https://tamagui.dev/)
 * - [unistyles](https://reactnativeunistyles.vercel.app)
 */

import { Platform } from 'react-native';



export const Colors = {
  light: {
    text: "#2C3E63",              // Primary text color
    secondaryText: "#fff",        // Secondary text color (on dark backgrounds)
    tertiaryText: "#2D3450",     // Tertiary text color
    subtitleText: "#808898",      // Subtitle/caption text
    background: "#fff",           // Main background
    tint: "#68bbcf",             // Tint color
    primary: "#007AFF",           // Primary brand color - CUSTOMIZE THIS
    icon: "#687076",              // Default icon color
    grayText: "#B3B6C2",         // Gray text
    gray: "#b2b2b220",           // Gray background with opacity
    tabIconDefault: "#687076",    // Inactive tab icon
    tabIconSelected: "#007AFF",   // Active tab icon - matches primary
    inputBackground: "#F0F0F0",   // Input field background
    error: "#E74C3C",            // Error/danger color
    success: "#45B98F",          // Success color
    alertBackground: "#F0F0F0",   // Alert background
  },
  dark: {
    text: "#ECEDEE",              // Primary text for dark mode
    secondaryText: "#fff",        // Secondary text
    tertiaryText: "#A1A1A1",     // Tertiary text for dark mode
    subtitleText: "#9BA1A6",      // Subtitle/caption text
    background: "#151718",        // Main dark background
    tint: "#68bbcf",             // Tint color
    primary: "#0A84FF",           // Primary brand color for dark mode - CUSTOMIZE THIS
    icon: "#9BA1A6",              // Default icon color
    grayText: "#9BA1A6",         // Gray text
    gray: "#b2b2b220",           // Gray background with opacity
    tabIconDefault: "#9BA1A6",    // Inactive tab icon
    tabIconSelected: "#0A84FF",   // Active tab icon - matches primary
    inputBackground: "#1C1C1E",   // Input field background for dark mode
    error: "#FF453A",            // Error/danger color for dark mode
    success: "#45B98F",          // Success color
    alertBackground: "#1C1C1E",   // Alert background for dark mode
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
    helvetica: 'Helvetica',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
    helvetica: 'Helvetica',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
