/// <reference types="@workadventure/iframe-api-typings" />

/**
 * - Tracks 3 eggs + NPC
 * - Shows a stacking "goal panel" (popup) each time progress updates
 * - Auto-closes the "Hold up!" popup when you step off the stairs
 * - Cleans up ALL goal popups right before teleport so nothing carries over
 * - If the progress popup anchor object doesn't exist, falls back to a toast
 */

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRcode: boolean;   // matches your Tiled name
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

// Popup anchor IDs (Rectangle objects in Tiled). GATE is required; PROG is optional.
const GATE_POPUP_ID = "phishing_gate_popup";
const PROG_POPUP_ID = "phishing_progress_popup";
// If PROG_POPUP_ID is missing, we'll try these alternates before falling back to a toast:
const ALT_PROG_POPUP_IDS = ["instructions_phishingPopup", "MurdochEmailPopup"];

let gatePopupRef: any | undefined;
let progressPopupRefs: any[] = []; // store all goal popups to close before navigation

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // Initial panel/ toast
    showProgressPanel();

    // Eggs
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          showProgressPanel();
        }
      });
    });

    // NPC
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        showProgressPanel();
      }
    });

    // Exit gate (stairs)
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        // Clean UI BEFORE teleport, so nothing follows you
        closeGatePopup();
        closeAllProgressPanels();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        const text = `🚧 Hold up!

You still need to complete:
• ${missingList().join("\n• ")}

Find all 3 easter eggs and talk to Brock before leaving.`;

        closeGatePopup(); // ensure single instance
        gatePopupRef = openPopupSafe(GATE_POPUP_ID, text, [
          { label: "OK", className: "primary", callback: (p: any) => p.close() },
        ]);
      }
    });

    // Auto-close the Hold up! when stepping away from the stairs area
    WA.room.area.onLeave(EXIT_AREA_NAME).subscribe(() => {
      closeGatePopup();
    });
  });
}

/* ---------------- UI helpers ---------------- */

function showProgressPanel() {
  const line = [
    goals.blackbibleppt ? "✅ BlackBible"   : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRcode        ? "✅ QRcode"       : "⬜ QRcode",
    goals.BrockZone     ? "✅ Brock (NPC)"  : "⬜ Brock (NPC)",
  ].join("   ");

  const text = `Progress:  ${line}

Visit all 3 easter eggs and talk to Brock to unlock the exit.`;

  // Try preferred anchor; if missing, try alternates; else fall back to a toast
  const ref =
    openPopupSafe(PROG_POPUP_ID, text, []) ||
    tryAlternates(ALT_PROG_POPUP_IDS, text) ||
    (WA.ui.displayActionMessage({ message: text, callback: () => {} }), undefined);

  if (ref) progressPopupRefs.push(ref); // only track actual popups (not toasts)
}

function tryAlternates(ids: string[], text: string) {
  for (const id of ids) {
    const ref = openPopupSafe(id, text, []);
    if (ref) return ref;
  }
  return undefined;
}

function openPopupSafe(id: string, text: string, buttons: any[]) {
  try {
    return WA.ui.openPopup(id, text, buttons);
  } catch {
    // The anchor object probably doesn't exist on this map; ignore and fall back.
    return undefined;
  }
}

function closeAllProgressPanels() {
  for (const ref of progressPopupRefs) {
    try { ref?.close?.(); } catch {}
  }
  progressPopupRefs = [];
}

function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

/* ---------------- Logic helpers ---------------- */

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
