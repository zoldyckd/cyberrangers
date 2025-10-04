/// <reference types="@workadventure/iframe-api-typings" />

let dismissed = false;
let spawnPopupRef: any | undefined;
let unSubMove: (() => void) | undefined;
let spawnX = 0;
let spawnY = 0;

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // capture spawn position (best effort)
    try {
      // Works on latest WA: either getPosition() or state.{x,y}
      const pos = (WA.player as any).getPosition?.() ?? WA.player.state;
      spawnX = pos.x ?? 0;
      spawnY = pos.y ?? 0;
    } catch {}

    // 1) lock movement BEFORE opening popup (eliminates the race)
    try { WA.controls.disablePlayerControls(); } catch {}

    // 2) open the popup immediately (no setTimeout)
    openSpawnIntro();

    // 3) movement guard in case a move sneaks in during load
    attachMovementGuard();
  });
}

function openSpawnIntro() {
  if (dismissed || spawnPopupRef) return;

  spawnPopupRef = WA.ui.openPopup(
    "spawnIntroPopup", // Tiled object name near spawn
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them. To begin, click 'Got it' to start moving!",
    [
      {
        label: "Got it",
        className: "primary",
        callback: () => safelyCloseSpawnIntro(),
      },
    ]
  );

  // Also allow ESC to dismiss (helps if mouse focus got weird)
  window.addEventListener("keydown", onEscOnce, { once: true });
}

function onEscOnce(e: KeyboardEvent) {
  if (e.key === "Escape") safelyCloseSpawnIntro();
}

function safelyCloseSpawnIntro() {
  try { spawnPopupRef?.close?.(); } catch {}
  spawnPopupRef = undefined;
  dismissed = true;

  // restore controls
  try { WA.controls.restorePlayerControls(); } catch {}

  // stop guarding movement
  try { unSubMove?.(); } catch {}
  unSubMove = undefined;
}

function attachMovementGuard() {
  // If your WA version uses an observable, use .subscribe() that returns an unsubscribe.
  // Some builds provide onPlayerMove(cb) returning an unsubscribe directly.
  const sub = (WA.player as any).onPlayerMove?.((_) => {
    if (!dismissed) {
      // If a move slipped in: cancel it and keep user at spawn.
      try { WA.controls.disablePlayerControls(); } catch {}
      try {
        // Best effort: teleport back if your build exposes this API
        (WA.player as any).teleport?.(spawnX, spawnY);
      } catch {}

      // If the popup lost its anchor for any reason, recreate it.
      if (!spawnPopupRef) {
        try { openSpawnIntro(); } catch {}
      }
    }
  });

  // normalize unsubscribe function
  unSubMove = typeof sub === "function" ? sub : undefined;
}
