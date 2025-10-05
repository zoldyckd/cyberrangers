/// <reference types="@workadventure/iframe-api-typings" />

let instructionPopupRef: any | undefined;

export function initInstructions() {
  WA.onInit().then(() => {
    const AREA = "instructions";
    const ANCHOR = "instructionsPopup";

    WA.room.area.onEnter(AREA).subscribe(() => {
      closeInstructionPopup();
      instructionPopupRef = WA.ui.openPopup(
        ANCHOR,
        "🧑‍🏫 Thank the heavens you’re here! Brave student, Murdoch University is under a Cyber Attack! We need your help to protect the school against evildoers who wish us harm. ➡️ Please proceed through the school and learn how you can help us! Controls: Use WASD/Arrow keys to move, and click to choose options.",
        [{ label: "Let's go!", className: "primary", callback: () => closeInstructionPopup() }]
      );
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closeInstructionPopup();
    });
  });
}

function closeInstructionPopup() {
  if (instructionPopupRef) {
    try { instructionPopupRef.close?.(); } catch {}
    instructionPopupRef = undefined;
  }
}
