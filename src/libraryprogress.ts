/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;   // matches your Tiled name exactly
  BrockZone: boolean;
};

const goals: Goals = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRcode: false,
  BrockZone: false,
};

const EXIT_AREA_NAME = "to-canteen";         // MUST be a Class=area, not a Portal
const NEXT_ROOM = "canteen.tmj#spawn";       // adjust if your spawn name differs

let progressPopupRef: any | undefined;       // persistent checklist popup
let gatePopupRef: any | undefined;           // reuse gate popup so it doesn't stack

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Open the persistent checklist once
    openOrUpdateChecklist();

    // --- Easter Eggs ---
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          openOrUpdateChecklist();
        }
      });
    });

    // --- NPC ---
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        openOrUpdateChecklist();
      }
    });

    // --- Exit gate at the stairs ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        closeGatePopup();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        const text = `🚧 Hold up!

You still need to complete:
• ${missingList().join("\n• ")}

Find all 3 easter eggs and talk to Brock before leaving.`;
        closeGatePopup();
        gatePopupRef = WA.ui.openPopup("phishing_gate_popup", text, [
          { label: "OK", className: "primary", callback: (p) => p.close() },
        ]);
      }
    });

    // NEW: auto-dismiss the "Hold up!" message when leaving the stairs area
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });
  });
}

/* ---------- Checklist popup ---------- */
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

  try { progressPopupRef?.close?.(); } catch {}
  progressPopupRef = WA.ui.openPopup("phishing_progress_popup", body, []);
}

function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

/* ---------- Helpers ---------- */
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
