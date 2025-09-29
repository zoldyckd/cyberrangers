/// <reference types="@workadventure/iframe-api-typings" />

let shown = false;
let ref: any | undefined;

function openNote() {
  if (shown) return;
  shown = true;

  try { ref?.close?.(); } catch {}

  ref = WA.ui.openPopup(
    "LibrarySpawnPopup",  // must match the object name in Tiled
    "📌 Please visit the signboard.",
    [{ label: "OK", callback: () => {} }]
  );
}

export function initLibrarySpawnNote() {
  WA.onInit().then(() => {
    WA.room.area.onEnter("from-garden").subscribe(openNote);
    setTimeout(openNote, 250); // safety net if already inside area on load
  });
}
