/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let enterSub: any | undefined;
let leaveSub: any | undefined;
let initialized = false;

const AREA   = "billboard";       // Tiled area name (case-sensitive)
const ANCHOR = "billboardPopup";  // Tiled popup anchor object name

function closePopup() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}

export function initBillboard() {
  if (initialized) return;        // prevent double-binding
  initialized = true;

  WA.onInit().then(() => {
    try { enterSub?.unsubscribe?.(); } catch {}
    try { leaveSub?.unsubscribe?.(); } catch {}

    enterSub = WA.room.area.onEnter(AREA).subscribe(() => {
      console.log("[billboard] enter");
      closePopup();
      popupRef = WA.ui.openPopup(
        ANCHOR,
        "📜 The community billboard\n\n➡️ Move towards the ladder on the right and begin your adventure!",
        [{ label: "Close", className: "primary", callback: () => closePopup() }]
      );
    });

    leaveSub = WA.room.area.onLeave(AREA).subscribe(() => {
      console.log("[billboard] leave");
      closePopup();
    });

    // Safety net: close the popup whenever the map changes or focus is lost
    WA.room.onLeaveLayer?.("**").subscribe?.(() => closePopup());
    window.addEventListener("blur", closePopup);
  });
}
