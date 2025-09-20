/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;
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

const PROG_PANEL_ID = "phishing_progress_panel"; // panel id (no need in Tiled)
const GATE_POPUP_ID = "phishing_gate_popup";     // must exist in Tiled

let progressPanelRef: any | undefined;
let gatePopupRef: any | undefined;

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Show permanent checklist once
    updateChecklist();

    // Eggs
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          updateChecklist();
        }
      });
    });

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        updateChecklist();
      }
    });

    // Exit
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
        gatePopupRef = WA.ui.openPopup(GATE_POPUP_ID, text, [
          { label: "OK", className: "primary", callback: (p: any) => p.close() },
        ]);
      }
    });

    // Auto-close the "Hold up!" when stepping away
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });
  });
}

/* -------- Checklist as permanent panel -------- */
function updateChecklist() {
  const lines = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock (NPC)"  : "⬜ Brock (NPC)",
  ];

  const html = `
    <div style="font-family: system-ui, Arial, sans-serif; font-size: 14px; color: white; padding: 10px;">
      <div style="font-weight:600; margin-bottom:6px;">Progress</div>
      ${lines.map((l) => `<div>${l}</div>`).join("")}
      <div style="margin-top:8px; opacity:.8;">
        Visit all 3 easter eggs and talk to Brock to unlock the exit.
      </div>
    </div>
  `;

  try {
    if (!progressPanelRef) {
      progressPanelRef = (WA.ui as any).openPanel(PROG_PANEL_ID, html);
    } else {
      progressPanelRef.update(html);
    }
  } catch (e) {
    console.error("[LibraryProgress] Panel not supported in this WA version", e);
  }
}

/* -------- Gate popup helpers -------- */
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

/* -------- Logic helpers -------- */
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
