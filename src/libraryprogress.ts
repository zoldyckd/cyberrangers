/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;   // matches Tiled name
  BrockZone: boolean;
};

const goals: Goals = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRcode: false,
  BrockZone: false,
};

const EXIT_AREA_NAME = "to-canteen";           // Class=area at stairs
const NEXT_ROOM = "canteen.tmj#spawn";         // adjust if needed
const PROG_POPUP_ID = "phishing_progress_popup"; // rectangle object in Tiled
const GATE_POPUP_ID = "phishing_gate_popup";     // rectangle object in Tiled

let gatePopupRef: any | undefined;
// track all progress popups so we can close them before navigation
let progressPopupRefs: any[] = [];

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // initial toast/popup
    showProgressPopup();

    // --- Eggs ---
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          showProgressPopup();
        }
      });
    });

    // --- NPC ---
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        showProgressPopup();
      }
    });

    // --- Exit gate ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        // close ALL UI before leaving so nothing carries to next map
        closeGatePopup();
        closeAllProgressPopups();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        const text = `🚧 Hold up!

You still need to complete:
• ${missingList().join("\n• ")}

Find all 3 easter eggs and talk to Brock before leaving.`;
        closeGatePopup(); // ensure single instance
        gatePopupRef = WA.ui.openPopup(GATE_POPUP_ID, text, [
          { label: "OK", className: "primary", callback: (p: any) => p.close() },
        ]);
      }
    });

    // Auto-close the “Hold up!” when stepping away from stairs
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });
  });
}

/* ---------- UI helpers ---------- */

function showProgressPopup() {
  const line = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock (NPC)"  : "⬜ Brock (NPC)",
  ].join("   ");

  const text = `Progress:  ${line}

Visit all 3 easter eggs and talk to Brock to unlock the exit.`;

  const ref = WA.ui.openPopup(PROG_POPUP_ID, text, []); // stacking by design
  progressPopupRefs.push(ref);
}

function closeAllProgressPopups() {
  for (const ref of progressPopupRefs) {
    try { ref?.close?.(); } catch {}
  }
  progressPopupRefs = [];
}

function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

/* ---------- Logic helpers ---------- */

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
