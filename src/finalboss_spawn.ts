/// <reference types="@workadventure/iframe-api-typings" />

let ref: any | undefined;
let leaveSub: any | undefined;
let shownOnce = false; // show only once per visit

const AREA = "from-computerlab";        // ← the AREA in Tiled
const ANCHOR = "finalboss_spawnPopup";  // ← the POPUP anchor rectangle

function closeNote() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = undefined;
}

function openNote() {
  if (shownOnce) return;
  shownOnce = true;

  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(
    ANCHOR,
    "🏢 You’ve entered the main office… it feels quiet, too quiet. Something’s off — the source of all the attacks must be here. Move forward carefully.",
    [{ label: "Got it!", className: "primary", callback: closeNote }]
  );

  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = WA.room.area.onLeave(AREA).subscribe(closeNote);

  // Optional auto-close after a few seconds
  setTimeout(() => closeNote(), 6000);
}

export function initFinalBossSpawn() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss spawn ready");

    // show when entering the spawn area
    WA.room.area.onEnter(AREA).subscribe(openNote);

    // safety: if player loads already inside the area, show once
    setTimeout(() => {
      WA.player.getPosition().then(() => openNote());
    }, 250);
  });
}
