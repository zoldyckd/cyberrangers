/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let enterSub: any | undefined;
let leaveSub: any | undefined;
let initialized = false;

const AREA   = "billboard";       // Tiled area name
const ANCHOR = "billboardPopup";  // Tiled object name used as popup anchor

function closePopup() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}

export function initBillboard() {
  if (initialized) return;      // prevent double-binding
  initialized = true;

  WA.onInit().then(() => {
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      try {
        popupRef = WA.ui.openPopup(
          ANCHOR,
          "📜 The community billboard\n\n➡️ Move towards the ladder on the right and begin your adventure!",
          [{ label: "Close", className: "primary", callback: () => closePopup() }]
        );
      } catch { /* ignore */ }
    });

    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}
