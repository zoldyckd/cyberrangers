/// <reference types="@workadventure/iframe-api-typings" />
/**
 * instructions_phishing.ts
 *
 * - Opens popup "instructions_phishingPopup" when player enters the Tiled area named "instructions_phishing"
 * - Closes the popup when the player leaves the area to avoid stacking
 *
 * Usage: import { initInstructionsPhishing } from "./instructions_phishing";
 *        call initInstructionsPhishing() inside WA.onInit().then(...)
 */

let instructionsPopupRef: any | undefined;

function closeInstructionsPopup() {
  try {
    if (instructionsPopupRef) {
      // some WA runtimes expose a close() method on popup refs
      if (typeof instructionsPopupRef.close === "function") {
        instructionsPopupRef.close();
      } else {
        // fallback: attempt to call .destroy or ignore if not available
        if (typeof instructionsPopupRef.destroy === "function") {
          instructionsPopupRef.destroy();
        }
      }
    }
  } catch (err) {
    // safe swallow so closing never breaks the app
    console.warn("[instructions_phishing] error while closing popup:", err);
  } finally {
    instructionsPopupRef = undefined;
  }
}

const INSTRUCTIONS_TEXT = `
Welcome to the Phishing Room.

There are 3 hidden easter eggs in this room — can you find them all?
Before you leave, talk to the NPC to learn more in-depth about phishing:
how attackers trick you, and simple steps you can take to stay safe.

Quick tips:
• Check sender addresses closely.
• Don’t click unknown links or scan random QR codes.
• Never share passwords or sensitive info over chat/email.

Find the NPC, complete the mini-lesson, then collect the 3 easter eggs. Good luck!
`;

/**
 * Register enter/leave handlers for the "instructions_phishing" area.
 */
export function initInstructionsPhishing() {
  // defensive: make sure WA API exists
  if (typeof WA === "undefined" || !WA.room || !WA.room.area || !WA.ui) {
    console.warn("[instructions_phishing] WorkAdventure API not available yet.");
    return;
  }

  // onEnter -> open popup (close first to avoid stacking)
  WA.room.area.onEnter("instructions_phishing").subscribe(() => {
    closeInstructionsPopup();

    try {
      // Passing an empty buttons array means no buttons; walking away will close it.
      instructionsPopupRef = WA.ui.openPopup(
        "instructions_phishingPopup",
        INSTRUCTIONS_TEXT,
        []
      );
      console.log("[instructions_phishing] popup opened");
    } catch (err) {
      console.error("[instructions_phishing] failed to open popup:", err);
    }
  });

  // onLeave -> close popup
  WA.room.area.onLeave("instructions_phishing").subscribe(() => {
    closeInstructionsPopup();
    console.log("[instructions_phishing] popup closed (leave)");
  });
}
