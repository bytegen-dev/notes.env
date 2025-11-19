import { storage } from "./storage";

/**
 * Resets the app to its initial state by clearing all data
 * This includes:
 * - All notes
 * - Setup status
 * - Passcode
 *
 * After reset, the user will see the splash screen again
 */
export const resetApp = async (): Promise<void> => {
  await storage.clearAllNotes();
  await storage.setHasSetup(false);
  await storage.clearPasscode();
  await storage.setLocked(false);
  await storage.setBiometricEnabled(false);
};
