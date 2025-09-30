/// <reference types="@workadventure/iframe-api-typings" />

const AREA   = "instructions";        // Tiled area (Class: area)
const ANCHOR = "instructionsPopup";   // Rectangle object name in Tiled (popup anchor)
const DEBOUNCE_MS = 200;

let ref: any | undefined;
let lastToggle = 0;

// unique guard so we don't double-bind this module
const GUARD = "__BOUND_INSTRUCTIONS_GARDEN__";

export function initInstructions() {
  if ((window as any)[GUARD]) return;
  (window as any)[GUARD] = true;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      const now = Date.now();
      if (now - lastToggle < DEBOUNCE_MS) return;
      lastToggle = now;
      openPopup();
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      const now = Date.now();
      if (now - lastToggle < DEBOUNCE_MS) return;
      lastToggle = now;
      closePopup();
    });
  });
}

function openPopup() {
  // force-close any ghost instance before opening
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(
    ANCHOR,
    "🪧 Cyber Rangers HQ — There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!",
    [{ label: "Close", callback: () => closePopup() }] // SDK requires 3rd arg
  );
}

function closePopup() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
