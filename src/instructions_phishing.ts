/// <reference types="@workadventure/iframe-api-typings" />
/**
 * instructions_phishing.ts
 *
 * - Opens the popup with id "instructions_phishingPopup" when player enters
 *   the tiled object named "instructions_phishing" (class = area).
 * - Closes the popup when the player leaves the area to avoid stacking.
 *
 * Usage: import and call initInstructionsPhishing() from your main.ts
 */

let instructionsPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;

/**
 * Close the currently open instructions popup (if any).
 */
function closeInstructionsPopup() {
  try {
    if (instructionsPopupRef) {
      // some WA environments expose .close() on popup refs
      if (typeof (instructionsPopupRef as any).close === "function") {
        (instructionsPopupRef as any).close();
      } else {
        // fallback: try the global closePopup helper if you have one
        // (leave this fallback harmless if not defined)
        if (typeof (window as any).closePopup === "function") {
          (window as any).closePopup(instructionsPopupRef);
        }
      }
    }
  } catch (e) {
    console.warn("Error closing instructions popup:", e);
  } finally {
    instructionsPopupRef = undefined;
  }
}

/**
 * The text shown in the popup. Edit to taste.
 * Using a template string preserves newlines for easy pasting.
 */
const INSTRUCTIONS_TEXT = `
Welcome to the Phishing Room.

This room contains 3 hidden easter eggs — look closely and explore every corner.
Before you leave, find and speak with the NPC to learn more in-depth about phishing: what it looks like, how attackers try to trick you, and simple steps you can take to stay safe.

Quick tips from the NPC:
• Check sender addresses closely — small changes can be a giveaway.
• Don’t click links or scan QR codes from unknown sources.
• Never share passwords or sensitive info over email or chat.

Find the NPC, complete the mini-lesson, then collect the 3 easter eggs. Good luck — and stay curious!
`;

/**
 * Register area enter/leave handlers.
 * Tiled object name expected: "instructions_phishing" (class area)
 * Tiled popup object id expected: "instructions_phishingPopup"
 */
export function initInstructionsPhishing() {
  // Ensure WA API is available
  if (!WA || !WA.room || !WA.room.area || !WA.ui) {
    console.warn("WorkAdventure API not ready or available (initInstructionsPhishing).");
    return;
  }

  // When player enters the area
  WA.room.area.onEnter("instructions_phishing").subscribe(() => {
    // close any existing instructions popup first to avoid stacking
    closeInstructionsPopup();

    try {
      // Open popup. Use the same id as your popup object in Tiled.
      // No buttons passed -> popup will be informational and rely on walking away to close.
      instructionsPopupRef = WA.ui.openPopup("instructions_phishingPopup", INSTRUCTIONS_TEXT, []);
      console.log("[instructions_phishing] popup opened");
    } catch (err) {
      console.error("Failed to open instructions_phishingPopup:", err);
    }
  });

  // When player leaves the area
  WA.room.area.onLeave("instructions_phishing").subscribe(() => {
    closeInstructionsPopup();
    console.log("[instructions_phishing] popup closed (onLeave)");
  });

  // Optional: also close popup on disconnect/room change to be safe
  WA.room.onDisconnect?.subscribe?.(() => {
    closeInstructionsPopup();
  });
}
