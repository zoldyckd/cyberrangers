/// <reference types="@workadventure/iframe-api-typings" />

const POPUP_ANCHOR = "stickynotePopup";
let ref: any | undefined;

function show(text: string) {
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(POPUP_ANCHOR, text, []);
}
function hide() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
}

export function initStickyNote() {
  WA.room.area.onEnter("stickynote").subscribe(() => {
    show(
      "📝 A sticky note is stuck to the monitor: “Email PW: P@ssw0rd123”.\n\n" +
      "💭 You: Wah… someone actually wrote their password here.\n\n" +
      "📢 Narrator: Don’t write passwords on paper or share them. Use a password manager, " +
      "create unique passphrases, and always enable MFA (multi-factor authentication)."
    );
  });
  WA.room.area.onLeave("stickynote").subscribe(hide);
}
