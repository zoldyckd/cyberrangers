/// <reference types="@workadventure/iframe-api-typings" />

let ref: any | undefined;
let leaveSub: any | undefined;

function closeNote() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = undefined;
}

function openNote() {
  // open popup
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(
    "LibrarySpawnPopup",            // must match rectangle object in Tiled
    "📌 Please visit the signboard.",
    [{ label: "OK", callback: closeNote }]
  );

  // close it automatically when leaving the spawn area
  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = WA.room.area.onLeave("from-garden").subscribe(closeNote);

  // (optional) also auto-close after 5s if player doesn't move/click
  setTimeout(() => { closeNote(); }, 5000);
}

export function initLibrarySpawnNote() {
  WA.onInit().then(() => {
    // show when entering the spawn area (arriving from garden)
    WA.room.area.onEnter("from-garden").subscribe(openNote);

    // safety: if the player spawns already inside the area, show once
    setTimeout(() => {
      WA.player.getPosition().then(() => openNote());
    }, 250);
  });
}
