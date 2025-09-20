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
let progressPopupRef: any | undefined;   // (reserved, unused for HUD popups)

/* ===== HUD (action message) controls ===== */
let lastHudMsg = "";
const SHOW_HUD_FROM_START = true; // set false if you only want it after 1st goal

function progressMsg(): string {
  return `Progress: ${
    [
      goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
      goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
      goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
      goals.BrockZone     ? "✅ Brock"        : "⬜ Brock",
    ].join("   ")
  }`;
}

function hideHud() {
  try { (WA.ui as any).removeActionMessage?.(); } catch {}
  try { WA.ui.displayActionMessage({ message: "", callback: () => {} }); } catch {}
}

function showHud(force = false) {
  const msg = progressMsg();
  if (!force && msg === lastHudMsg) return;           // dedupe identical content
  lastHudMsg = msg;
  // show exactly one HUD: remove first, then show
  try { (WA.ui as any).removeActionMessage?.(); } catch {}
  try { WA.ui.displayActionMessage({ message: msg, callback: () => {} }); } catch {}
}

/* ============ INIT ============ */
export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // arrive clean + (optional) show HUD immediately
    hideHud();
    if (SHOW_HUD_FROM_START) showHud(true);

    // Eggs
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          showHud();                  // update the ONE HUD
        }
      });
    });

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        showHud();                    // update the ONE HUD
      }
    });

    // Exit (enter)
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        // 🔒 kill everything before teleport so nothing follows to next map
        closeGatePopup();
        hideHud();
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

function closeAllUi() {
  closeGatePopup();
  hideHud(); // ensure no HUD leaks across maps
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
