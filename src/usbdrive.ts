/// <reference types="@workadventure/iframe-api-typings" />

const POPUP_ANCHOR = "usbdrivePopup";
let ref: any | undefined;

function show(text: string) {
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(POPUP_ANCHOR, text, []);
}
function hide() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
}

export function initUsbDrive() {
  WA.room.area.onEnter("usbdrive").subscribe(() => {
    show(
      "💾 You spot a random USB drive on the floor.\n\n" +
      "💭 You: Should I plug this into a PC and see what's inside?\n\n" +
      "📢 Narrator: Never plug in unknown USBs. They can hide malware that runs automatically. " +
      "If you find one in real life, hand it to IT/Security instead of investigating it yourself."
    );
  });
  WA.room.area.onLeave("usbdrive").subscribe(hide);
}
