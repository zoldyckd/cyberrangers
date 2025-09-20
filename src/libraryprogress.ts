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
let progressPopupRef: any | undefined;   // reserved for future use
let isTeleporting = false;               // block UI during room change

/* ---------- Action message control (no stacking) ---------- */
let lastActionMsg = "";
let hudTimer: number | undefined;

function nukeActionMessage() {
  const nuke = () => {
    try { (WA.ui as any).removeActionMessage?.(); } catch {}
    try { WA.ui.displayActionMessage({ message: "", callback: () => {} }); } catch {}
  };
  nuke();
  requestAnimationFrame?.(nuke);
  setTimeout(nuke, 60);
  setTimeout(nuke, 250);
}

/* ============ INIT ============ */
export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Arrive super clean in case previous room left residue
    nukeActionMessage();

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
        isTeleporting = true;          // ⛔ stop any new UI
        // close EVERYTHING before jumping
        closeGatePopup();
        closeProgressPopup();
        nukeActionMessage();
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

    // Safety on unload/refresh
    window.addEventListener("beforeunload", closeAllUi);
    window.addEventListener("unload", closeAllUi);
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
  nukeActionMessage();
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
  if (isTeleporting) return; // don’t spawn anything during room change

  const msg = `Progress: ${
    [
      goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
      goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
      goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
      goals.BrockZone     ? "✅ Brock"        : "⬜ Brock",
    ].join("   ")
  }`;

  // Deduplicate identical text (prevents stacking when multiple goals flip)
  if (msg === lastActionMsg) return;
  lastActionMsg = msg;

  // Debounce rapid updates (if goals flip in the same tick)
  if (hudTimer) clearTimeout(hudTimer);
  hudTimer = setTimeout(() => {
    try { (WA.ui as any).removeActionMessage?.(); } catch {}
    try { WA.ui.displayActionMessage({ message: msg, callback: () => {} }); } catch {}
  }, 0) as unknown as number;
}
