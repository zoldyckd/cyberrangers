s/// <reference types="@workadventure/iframe-api-typings" />

let creditsPopupRef: any | undefined;
let creditsEnterSub: any | undefined;
let creditsLeaveSub: any | undefined;
let creditsInitialized = false;

const CREDITS_AREA   = "credits";       // Tiled area name (case-sensitive)
const CREDITS_ANCHOR = "creditsPopup";  // Tiled popup anchor object name

function closeCreditsPopup() {
  try { creditsPopupRef?.close?.(); } catch {}
  creditsPopupRef = undefined;
}

export function initCredits() {
  if (creditsInitialized) return;       // prevent double-binding
  creditsInitialized = true;

  WA.onInit().then(() => {
    try { creditsEnterSub?.unsubscribe?.(); } catch {}
    try { creditsLeaveSub?.unsubscribe?.(); } catch {}

    creditsEnterSub = WA.room.area.onEnter(CREDITS_AREA).subscribe(() => {
      console.log("[credits] enter");
      closeCreditsPopup();
      creditsPopupRef = WA.ui.openPopup(
        CREDITS_ANCHOR,
        "Team Credits (Cyber Rangers): Joyce Boey Yoke Leng, Rudolph Benjamin Maxwell, Tan Eng Kai, Alvin Teng You Rong, Seet He Ren",
        [{ label: "Close", className: "primary", callback: () => closeCreditsPopup() }]
      );
    });

    creditsLeaveSub = WA.room.area.onLeave(CREDITS_AREA).subscribe(() => {
      console.log("[credits] leave");
      closeCreditsPopup();
    });

    // Safety net: close the popup whenever the map changes or focus is lost
    WA.room.onLeaveLayer?.("**").subscribe?.(() => closeCreditsPopup());
    window.addEventListener("blur", closeCreditsPopup);
  });
}
