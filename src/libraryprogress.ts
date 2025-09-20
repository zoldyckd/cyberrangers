/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;   // matches Tiled
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

let gatePopupRef: any | undefined;         // “Hold up!” popup
let progressPopupRef: any | undefined;     // persistent checklist (only opened after first tick)

/* ============ INIT ============ */
export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // --- Eggs ---
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => markDone(egg as keyof Goals));
    });

    // --- NPC ---
    WA.room.area.onEnter("BrockZone").subscribe(() => markDone("BrockZone"));

    // --- Exit (enter) ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        closeGatePopup();
        closeProgressPopup();   // ensure it disappears before next map
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

    // --- Exit (leave) → auto-dismiss the “Hold up!” popup ---
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });

    // Safety: if the page unloads (room change/refresh), close popups
    window.addEventListener("beforeunload", closeAllUi);
  });
}

/* ============ Progress handling ============ */
function markDone(key: keyof Goals) {
  if (goals[key]) return;
  goals[key] = true;
  openOrUpdateChecklist();
}

function openOrUpdateChecklist() {
  const lines = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock (NPC)"  : "⬜ Brock (NPC)",
  ];
  const body = `Phishing Room Progress

${lines.join("\n")}

Visit all 3 easter eggs and talk to Brock to unlock the exit.`;

  // Only create the popup after the first tick so it won't appear in other maps
  try { progressPopupRef?.close?.(); } catch {}
  progressPopupRef = WA.ui.openPopup("phishing_progress_popup", body, []);
}

/* ============ Close helpers ============ */
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
}

/* ============ Logic helpers ============ */
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
