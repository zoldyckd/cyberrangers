/// <reference types="@workadventure/iframe-api-typings" />

const AREA_NAME = "spawnIntro";        // Tiled object (Class: area)
const POPUP_ANCHOR = "spawnIntroPopup"; // Tiled popup anchor name

let ref: any | undefined;

// prevent duplicate subscriptions on hot-reload
if (!(window as any).__BOUND_SPAWN_INTRO__) {
  (window as any).__BOUND_SPAWN_INTRO__ = true;

  export function initSpawnIntro() {
    WA.onInit().then(() => {
      WA.room.area.onEnter(AREA_NAME).subscribe(() => {
        openSpawnIntro();
      });
      // 🚫 Removed onLeave handling, so popup stays until "Got it" is clicked
    });
  }
}

function openSpawnIntro() {
  if (ref) return; // already open

  ref = WA.ui.openPopup(
    POPUP_ANCHOR,
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them.",
    [
      {
        label: "Got it",
        className: "primary",
        callback: () => closeSpawnIntro(),
      },
    ]
  );
}

function closeSpawnIntro() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
