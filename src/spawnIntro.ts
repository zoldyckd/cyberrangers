/// <reference types="@workadventure/iframe-api-typings" />

let dismissed = false;
let spawnPopupRef: any | undefined;
let unSubMove: (() => void) | undefined;

// remember spawn so we can snap back if a move slips in
let spawnX = 0;
let spawnY = 0;

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // capture initial position (best effort)
    try {
      const pos = (WA.player as any).getPosition?.() ?? WA.player.state;
      spawnX = pos?.x ?? 0;
      spawnY = pos?.y ?? 0;
    } catch {}

    // 1) lock controls BEFORE opening popup
    try { WA.controls.disablePlayerControls(); } catch {}

    // 2) open popup immediately
    openSpawnIntro();

    // 3) guard any movement during the intro
    attachMovementGuard();

    // 4) keyboard shortcuts to close (helps if button focus gets weird)
    window.addEventListener("keydown", onKeyClose);
  });
}

function openSpawnIntro() {
  if (dismissed || spawnPopupRef) return;

  spawnPopupRef = WA.ui.openPopup(
    "spawnIntroPopup", // must match a Tiled object near spawn
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them. To begin, click 'Got it' (or press Enter/Space) to start moving!",
    [
      {
        label: "Got it",
        className: "primary",
        callback: () => safelyCloseSpawnIntro(),
      },
    ]
  );
}

function onKeyClose(e: KeyboardEvent) {
  if (dismissed) return;
  const k = e.key;
  if (k === "Enter" || k === " " || k === "Escape") {
    e.preventDefault();
    safelyCloseSpawnIntro();
  }
}

function safelyCloseSpawnIntro() {
  try { spawnPopupRef?.close?.(); } catch {}
  spawnPopupRef = undefined;
  dismissed = true;

  try { WA.controls.restorePlayerControls(); } catch {}

  // stop guarding movement + keys
  try { unSubMove?.(); } catch {}
  unSubMove = undefined;
  window.removeEventListener("keydown", onKeyClose);
}

function attachMovementGuard() {
  // Type the callback param to avoid TS7006
  const sub = (WA.player as any).onPlayerMove?.((pos: { x: number; y: number }) => {
    if (dismissed) return;

    // If any movement sneaks in: re-lock, snap back, and ensure popup exists
    try { WA.controls.disablePlayerControls(); } catch {}
    try { (WA.player as any).teleport?.(spawnX, spawnY); } catch {}

    if (!spawnPopupRef) {
      try { openSpawnIntro(); } catch {}
    }
  });

  // Normalize unsubscribe
  unSubMove = typeof sub === "function" ? sub : undefined;
}
