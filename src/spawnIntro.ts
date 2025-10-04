/// <reference types="@workadventure/iframe-api-typings" />

let dismissed = false;
let closeModal: (() => void) | undefined;

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // small delay avoids races with other initializers
    setTimeout(openSpawnIntroModal, 80);
  });
}

function openSpawnIntroModal() {
  if (dismissed || closeModal) return;

  // disable movement while intro is shown (optional but prevents weird races)
  try { WA.controls.disablePlayerControls(); } catch {}

  const text =
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them.";

  // Modal is HUD-based, not tied to a Tiled object — won’t break when you move.
  closeModal = WA.ui.modal.openModal({
    title: "Welcome to Cyber Rangers",
    text,
    acceptText: "Got it",
    // optional: let ESC close too
    escapable: true,
    onAccept: () => {
      safelyClose();
    },
    onClose: () => {
      // if user closes via ESC or X, treat as dismissed too
      safelyClose();
    },
  });
}

function safelyClose() {
  try { closeModal?.(); } catch {}
  closeModal = undefined;
  dismissed = true;
  try { WA.controls.restorePlayerControls(); } catch {}
}
