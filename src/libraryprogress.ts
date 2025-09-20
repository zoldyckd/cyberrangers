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
let progressPopupRef: any | undefined;   // (reserved if you later use a popup)
let isTeleporting = false;               // NEW: block new UI during room change

/* ===== NEW: action message dedupe/debounce ===== */
let lastActionMessage = "";
let notifyTimer: number | undefined;

/* ===== helper to hide the bottom action panel (displayActionMessage) =====
   Some WA builds leave a visual residue. We clear it now, next frame,
   and after a short delay to force a repaint. */
function hideActionMessage() {
  const nuke = () => {
    try { (WA.ui as any).removeActionMessage?.(); } catch {}
    try { WA.ui.displayActionMessage({ message: "", callback: () => {} }); } catch {}
  };
  nuke();
  try { (window as any).requestAnimationFrame?.(nuke); } catch {}
  setTimeout(nuke, 60);
  setTimeout(nuke, 250);
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
        isTeleporting = true;           // NEW: freeze any new UI
        closeGatePopup();
        closeProgressPopup();
        hideActionMessage();            // kill action bar cleanly
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
  hideActionMessage(); // also clear on unload/refresh
}

/* unchanged */
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

/* ===== NEW: safe, deduped progress HUD ===== */
function notifyProgress() {
  if (isTeleporting) return; // don’t spawn UI while leaving the room

  const msg =
    `Progress: ${
      [
        goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
        goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
        goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
        goals.BrockZone     ? "✅ Brock"        : "⬜ Brock",
      ].join("   ")
    }`;

  // dedupe: if nothing changed, don’t re-render a new HUD
  if (msg === lastActionMessage) return;
  lastActionMessage = msg;

  // debounce: collapse rapid successive updates into one render
  if (notifyTimer) clearTimeout(notifyTimer);
  notifyTimer = setTimeout(() => {
    try { (WA.ui as any).removeActionMessage?.(); } catch {}
    try { WA.ui.displayActionMessage({ message: msg, callback: () => {} }); } catch {}
  }, 0) as unknown as number;
}
