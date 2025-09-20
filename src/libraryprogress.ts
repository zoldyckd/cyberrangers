/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;   // 👈 matches Tiled
  BrockZone: boolean;
};

const goals: Goals = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRcode: false,
  BrockZone: false,
};

const EXIT_AREA_NAME = "to-canteen";
const NEXT_ROOM = "canteen.tmj#spawn";

let gatePopupRef: any | undefined;       // “Hold up!” popup
let progressPopupRef: any | undefined;   // progress popup (if you open one elsewhere)

/* ===== NEW: helper to hide the bottom action panel (displayActionMessage) ===== */
function hideActionMessage() {
  try {
    // If available on your WA version:
    (WA.ui as any).removeActionMessage?.();
  } catch { /* ignore */ }
  try {
    // Fallback: overwrite with empty text to clear it.
    WA.ui.displayActionMessage({ message: "", callback: () => {} });
  } catch { /* ignore */ }
}

/* ============ INIT ============ */
export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Eggs
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
    });

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        notifyProgress();
      }
    });

    // Exit (enter)
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        // 🔒 close any lingering UI before teleport
        closeGatePopup();
        closeProgressPopup();
        hideActionMessage(); // NEW: kill the action panel before changing map
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        closeGatePopup(); // avoid stacking
        gatePopupRef = WA.ui.openPopup(
          "phishing_gate_popup",
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 easter eggs and talk to Brock before leaving.`,
          [{ label: "OK", className: "primary", callback: (p: any) => p.close() }]
        );
      }
    });

    // Exit (leave) → auto-dismiss the “Hold up!” popup
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });

    // Safety: if the page unloads (room change, refresh), close popups
    window.addEventListener("beforeunload", closeAllUi);
  });
}

/* ============ HELPERS ============ */
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

function closeProgressPopup() {
  try { progressPopupRef?.close?.(); } catch {}
  progressPopupRef = undefined;
}

function closeAllUi() {
  closeGatePopup();
  closeProgressPopup();
  hideActionMessage(); // NEW: also clear on unload/refresh just in case
}

function allDone(): boolean {
  return goals.blackbibleppt && goals.MurdochEmail && goals.QRcode && goals.BrockZone;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.blackbibleppt) out.push("Black Bible Easter Egg");
  if (!goals.MurdochEmail)  out.push("Murdoch Email Easter Egg");
  if (!goals.QRcode)        out.push("QR Code Easter Egg");
  if (!goals.BrockZone)     out.push("Talk to Brock (NPC)");
  return out;
}

function notifyProgress() {
  const done = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock"        : "⬜ Brock",
  ].join("   ");
  WA.ui.displayActionMessage({ message: `Progress: ${done}`, callback: () => {} });
}
