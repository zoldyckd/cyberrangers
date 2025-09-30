/// <reference types="@workadventure/iframe-api-typings" />

let instrBound = false;   // hot-reload guard

export function initInstructions() {
  if (instrBound) return;
  instrBound = true;

  const AREA_NAME = "instructions";
  const POPUP_ANCHOR = "instructionsPopup";
  const REOPEN_COOLDOWN_MS = 250;

  let ref: any | undefined;
  let inArea = false;
  let lastOpen = 0;
  let opening = false;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA_NAME).subscribe(() => {
      inArea = true;
      open();
    });

    WA.room.area.onLeave(AREA_NAME).subscribe(() => {
      inArea = false;
      close();
    });
  });

  function open() {
    const now = Date.now();
    if (opening || ref || !inArea || now - lastOpen < REOPEN_COOLDOWN_MS) return;

    opening = true;
    try { ref?.close?.(); } catch {}
    ref = undefined;

    try {
      ref = WA.ui.openPopup(
        POPUP_ANCHOR,
        "📜 Welcome! This signage explains what to do next. Read carefully, then walk away to close.",
        [
          {
            label: "Got it",
            className: "primary",
            callback: () => close(),
          },
        ]
      );
      lastOpen = now;
    } finally {
      opening = false;
    }
  }

  function close() {
    if (!ref) return;
    try { ref.close?.(); } catch {}
    ref = undefined;
  }
}
