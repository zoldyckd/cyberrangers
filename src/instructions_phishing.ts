/// <reference types="@workadventure/iframe-api-typings" />
/**
 * Opens a popup when entering the area "instructions_phishing"
 * and closes it when leaving. The popup id is "instructions_phishingPopup".
 */

let instructionsPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;

function closeInstructionsPopup() {
  try {
    if (instructionsPopupRef) {
      (instructionsPopupRef as any).close?.();
      instructionsPopupRef = undefined;
    }
  } catch {
    instructionsPopupRef = undefined;
  }
}

const INSTRUCTIONS_TEXT = `
Welcome to the Phishing Room.

There are 3 hidden easter eggs in this room—can you find them all?
Before you leave, talk to the NPC to learn more in-depth about phishing:
how attackers trick you, and simple steps to stay safe.

Quick tips:
• Check sender addresses closely.
• Don’t click unknown links or scan random QR codes.
• Never share passwords or sensitive info over chat/email.

Good luck and stay curious!
`;

export function initInstructionsPhishing() {
  WA.room.area.onEnter("instructions_phishing").subscribe(() => {
    closeInstructionsPopup();
    instructionsPopupRef = WA.ui.openPopup(
      "instructions_phishingPopup",
      INSTRUCTIONS_TEXT,
      [] // no buttons; walking away closes it
    );
    console.log("[instructions_phishing] opened");
  });

  WA.room.area.onLeave("instructions_phishing").subscribe(() => {
    closeInstructionsPopup();
    console.log("[instructions_phishing] closed (leave)");
  });
}
