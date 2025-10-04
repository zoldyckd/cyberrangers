/// <reference types="@workadventure/iframe-api-typings" />

let dismissed = false;
let spawnPopupRef: any | undefined;

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // tiny delay to avoid races with other initializers
    setTimeout(openSpawnIntro, 60);
  });
}

function openSpawnIntro() {
  if (dismissed || spawnPopupRef) return;

  // prevent the player from walking away and "detaching" the popup anchor
  try { WA.controls.disablePlayerControls(); } catch {}

  // IMPORTANT: make sure the anchor name below matches a Tiled object
  // that exists at spawn and stays loaded (e.g., an object near spawn).
  spawnPopupRef = WA.ui.openPopup(
    "spawnIntroPopup",
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them. To begin, click 'Got it' to start moving!",
    [
      {
        label: "Got it",
        className: "primary",
        callback: () => {
          safelyCloseSpawnIntro();
        },
      },
    ]
  );

  // optional: allow ESC to dismiss as well (no external file needed)
  window.addEventListener("keydown", onEscOnce, { once: true });
}

function onEscOnce(e: KeyboardEvent) {
  if (e.key === "Escape") safelyCloseSpawnIntro();
}

function safelyCloseSpawnIntro() {
  try { spawnPopupRef?.close?.(); } catch {}
  spawnPopupRef = undefined;
  dismissed = true;
  try { WA.controls.restorePlayerControls(); } catch {}
}
