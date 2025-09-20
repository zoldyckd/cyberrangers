/// <reference types="@workadventure/iframe-api-typings" />

/**
 * libraryprogress.ts
 * Gates the exit until all tasks are done and shows a permanent progress checklist.
 *
 * Areas on the map (Class = area, Name must match exactly):
 *  - blackbibleppt   (egg)
 *  - MurdochEmail    (egg)
 *  - QRcode          (egg)
 *  - BrockZone       (NPC)
 *  - to-canteen      (exit gate area)
 *
 * Popup objects (Rectangle objects you add in Tiled):
 *  - phishing_gate_popup   (for the "Hold up!" message at the stairs)
 */

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

const PROG_PANEL_ID = "phishing_progress_panel"; // panel id (no need to exist in Tiled)
const GATE_POPUP_ID = "phishing_gate_popup";     // must exist in Tiled as a rectangle object

let progressPanelRef: any | undefined;  // permanent checklist
let gatePopupRef: any | undefined;      // "Hold up!" popup (reused)

/* -------------------- Public init -------------------- */
export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Show the permanent checklist once at start
    openOrUpdateChecklist();

    /* ---- Eggs ---- */
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          openOrUpdateChecklist();
        }
      });
    });

    /* ---- NPC ---- */
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        openOrUpdateChecklist();
      }
    });

    /* ---- Exit gate ---- */
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        closeGatePopup();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        const text = `🚧 Hold up!

You still need to complete:
• ${missingList().join("\n• ")}

Find all 3 easter eggs and talk to Brock before leaving.`;

        // Reuse the same popup (no stacking)
        closeGatePopup();
        gatePopupRef = WA.ui.openPopup(GATE_POPUP_ID, text, [
          { label: "OK", className: "primary", callback: (p: any) => p.close() },
        ]);
      }
    });

    // Auto-dismiss the gate popup when the player steps away from the stairs
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });
  });
}

/* -------------------- Checklist panel -------------------- */
function openOrUpdateChecklist() {
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
      // Prefer panel (persistent). If your WA version only supports URL, keep using popup fallback below.
      progressPanelRef = (WA.ui as any).openPanel?.(PROG_PANEL_ID, html);
      if (!progressPanelRef) throw new Error("openPanel unavailable");
    } else {
      // Update content without creating a new UI element
      (progressPanelRef.update ?? progressPanelRef.setContent ?? (() => { throw new Error("no update method"); }))(html);
    }
  } catch {
    // Fallback: keep a single popup open and refresh it when goals change
    try { (progressPanelRef as any)?.close?.(); } catch {}
    progressPanelRef = WA.ui.openPopup("phishing_progress_popup", stripHtml(html), []);
  }
}

// Very small helper to strip tags if we fall back to popup text
function stripHtml(s: string) {
  return s.replace(/<[^>]*>/g, "");
}

/* -------------------- Gate popup helpers -------------------- */
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

/* -------------------- Logic helpers -------------------- */
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
