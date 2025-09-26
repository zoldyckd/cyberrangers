/// <reference types="@workadventure/iframe-api-typings" />

const POPUP_ANCHOR = "instructions_safeinternetpracticesPopup";
let ref: any | undefined;

function show(text: string) {
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(POPUP_ANCHOR, text, []);
}
function hide() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
}

export function initSafeInternetPractices() {
  WA.room.area.onEnter("instructions_safeinternetpractices").subscribe(() => {
    show(
      "🛡️ Welcome to the Safe Internet Practices office!\n\n" +
      "• Explore the room and look for hidden clues (poster, USB drive, sticky note).\n" +
      "• Read your character’s thoughts and the narrator’s tips.\n" +
      "• Learn to: think before you click, protect passwords, and avoid risky devices.\n\n" +
      "When you’re done, proceed to the exit to continue your mission."
    );
  });
  WA.room.area.onLeave("instructions_safeinternetpractices").subscribe(hide);
}
