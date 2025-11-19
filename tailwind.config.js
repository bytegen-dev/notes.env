/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Black and white theme
        background: {
          light: "#ffffff",
          dark: "#000000",
        },
        foreground: {
          light: "#000000",
          dark: "#ffffff",
        },
        card: {
          light: "#f5f5f5",
          dark: "#1a1a1a",
        },
        border: {
          light: "#e0e0e0",
          dark: "#333333",
        },
        accent: {
          DEFAULT: "#ffffff",
          light: "#000000",
          dark: "#ffffff",
        },
        muted: {
          light: "#999999",
          dark: "#666666",
        },
        destructive: "#ef4444",
      },
    },
  },
  plugins: [],
};
