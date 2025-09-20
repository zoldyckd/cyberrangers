/// <reference types="@workadventure/iframe-api-typings" />

// Track which objectives are completed
let found = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRcode: false,
  BrockZone: false,
};

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[WA] Library progression system ready");

    // Easter egg triggers
    WA.room.area.onEnter("blackbibleppt").subscribe(() => mark("blackbibleppt"));
    WA.room.area.onEnter("MurdochEmail").subscribe(() => mark("MurdochEmail"));
    WA.room.area.onEnter("QRcode").subscribe(() => mark("QRcode"));

    // NPC trigger
    WA.room.area.onEnter("BrockZone").subscribe(() => mark("BrockZone"));

    // Stairs gate
    WA.room.area.onEnter("to-canteen").subscribe(() => {
      if (allDone()) {
        WA.nav.goToRoom("canteen.tmj#from-library"); // 👈 adjust spawn point name if needed
      } else {
        showBlockedPopup();
      }
    });
  });
}

function mark(key: keyof typeof found) {
  if (found[key]) return;
  found[key] = true;
  const p = WA.ui.openPopup(
    "progressHint",
    progressText(),
    []
  );
  setTimeout(() => p.close(), 1200); // auto close after 1.2s
}

function allDone() {
  return found.blackbibleppt && found.MurdochEmail && found.QRcode && found.BrockZone;
}

function progressText() {
  const done = Object.values(found).filter(Boolean).length;
  return `Progress: ${done}/4 — Find 3 easter eggs and talk to the NPC before moving on.`;
}

function showBlockedPopup() {
  const p = WA.ui.openPopup(
    "stairsBlocked",
    "The stairs are blocked. You must discover all 3 easter eggs and talk to the NPC before moving on.",
    [{ label: "OK", className: "primary", callback: (pop) => pop.close() }]
  );
}
