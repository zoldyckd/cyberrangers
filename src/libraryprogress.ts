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

// UI refs we actively manage
let gatePopupRef: any | undefined;        // “Hold up!” popup
let progressPopupRef: any | undefined;    // Checklist popup we open/update here only

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Eggs
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          openOrUpdateChecklist();       // <-- open/update ONE popup we can later close
        }
      });
    });

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        openOrUpdateChecklist();
      }
    });

    // Exit (enter)
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        // close any lingering UI before teleport
        closeGatePopup();
        closeProgressPopup();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        closeGatePopup(); // avoid stacking
        gatePopupRef = WA.ui.openPopup(
          "phishing_gate_popup", // must exist as a rectangle object in Tiled
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 easter eggs and talk to Brock before leaving.`,
          [{ label: "OK", className: "primary", callback: (p: any) => p.close() }]
        );
      }
    });

    // Exit (leave) → auto-dismiss the “Hold up!” popup
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });

    // Safety: close on unload/room change
    window.addEventListener("beforeunload", () => {
      closeGatePopup();
      closeProgressPopup();
    });
  });
}

/* ---------- Checklist popup (single, reusable) ---------- */
function openOrUpdateChecklist() {
  const body = buildChecklistText();

  // Reuse a single popup so it doesn't stack and we can close it on teleport
  try { progressPopupRef?.close?.(); } catch {}
  progressPopupRef = WA.ui.openPopup(
    "phishing_progress_popup",  // add a tiny rectangle object with this name in the map
    body,
    [] // no buttons; purely informational
  );
}

function buildChecklistText(): string {
  const lines = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock (NPC)"  : "⬜ Brock (NPC)",
  ];
  return `Phishing Room Progress

${lines.join("\n")}

Visit all 3 easter eggs and talk to Brock to unlock the exit.`;
}

/* ---------- Close helpers ---------- */
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

function closeProgressPopup() {
  try { progressPopupRef?.close?.(); } catch {}
  progressPopupRef = undefined;
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
