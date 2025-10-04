/// <reference types="@workadventure/iframe-api-typings" />

let spawnPopupRef: any | undefined;
let leaveSub: any | undefined;
let dismissed = false;

function closeSpawnIntro() {
  try { spawnPopupRef?.close?.(); } catch {}
  spawnPopupRef = undefined;

  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = undefined;

  dismissed = true;
  try { WA.controls.restorePlayerControls(); } catch {}
}

function openSpawnIntro() {
  if (dismissed) return;
  try { spawnPopupRef?.close?.(); } catch {}

  // lock movement until user acknowledges
  try { WA.controls.disablePlayerControls(); } catch {}

  spawnPopupRef = WA.ui.openPopup(
    "spawnIntroPopup", // make sure this matches your Tiled object
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them. To begin, click 'Got it' to start moving!",
    [
      {
        label: "Got it",
        className: "primary",
        callback: closeSpawnIntro,
      },
    ]
  );

  // close automatically when leaving the spawn area
  try { leaveSub?.unsubscribe?.(); } catch {}
  leaveSub = WA.room.area.onLeave("spawn-area").subscribe(closeSpawnIntro);

  // allow ESC to dismiss too
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") closeSpawnIntro();
  }, { once: true });
}

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // show popup once when entering spawn area
    WA.room.area.onEnter("spawn-area").subscribe(openSpawnIntro);

    // if already inside area when spawning, show once
    setTimeout(() => {
      WA.player.getPosition().then(() => openSpawnIntro());
    }, 250);
  });
}
