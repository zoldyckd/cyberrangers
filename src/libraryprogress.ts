/// <reference types="@workadventure/iframe-api-typings" />

// zones (Class=area) in library.tmj:
// blackbibleppt, MurdochEmail, QRcode, BrockZone, to-canteen

type Keys = "blackbibleppt" | "MurdochEmail" | "QRcode" | "BrockZone";

const found: Record<Keys, boolean> = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRcode: false,
  BrockZone: false,
};

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[WA] Library progression system ready");

    // Easter eggs
    WA.room.area.onEnter("blackbibleppt").subscribe(() => mark("blackbibleppt"));
    WA.room.area.onEnter("MurdochEmail").subscribe(() => mark("MurdochEmail"));
    WA.room.area.onEnter("QRcode").subscribe(() => mark("QRcode"));

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => mark("BrockZone"));

    // Stairs gate
    WA.room.area.onEnter("to-canteen").subscribe(() => {
      if (allDone()) {
        WA.nav.goToRoom("canteen.tmj#from-library"); // adjust spawn anchor if needed
      } else {
        showBlockedPopup();
      }
    });
  });
}

function mark(key: Keys) {
  if (found[key]) return;
  found[key] = true;

  // Tiny feedback popup that auto-closes
  const popup = WA.ui.openPopup("progressHint", progressText(), []);
  setTimeout(() => popup.close(), 1200);
}

function allDone() {
  return found.blackbibleppt && found.MurdochEmail && found.QRcode && found.BrockZone;
}

function progressText() {
  const done = Number(found.blackbibleppt) + Number(found.MurdochEmail) + Number(found.QRcode) + Number(found.BrockZone);
  return `Progress: ${done}/4 — Find 3 easter eggs and talk to the NPC before moving on.`;
}

function showBlockedPopup() {
  WA.ui.openPopup(
    "stairsBlocked",
    "The stairs are locked. Discover all 3 easter eggs and speak to the NPC before moving on.",
    [{ label: "OK", className: "primary", callback: (popup) => popup.close() }]
  );
}
