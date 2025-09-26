/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  poster: boolean;
  usbdrive: boolean;
  stickynote: boolean;
  AmeliaZone: boolean;
};

const goals: Goals = {
  poster: false,
  usbdrive: false,
  stickynote: false,
  AmeliaZone: false,
};

const EXIT_AREA_NAME = "to-hall";                 // the area in Tiled
const NEXT_ROOM = "hall.tmj#from-canteen";        // adjust filename if needed

export function initOfficeProgress() {
  WA.onInit().then(() => {
    console.log("[OfficeProgress] ready");

    // --- Easter Eggs ---
    ["poster", "usbdrive", "stickynote"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        console.log(`[OfficeProgress] ENTER ${egg}`);
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
    });

    // --- NPC ---
    WA.room.area.onEnter("AmeliaZone").subscribe(() => {
      console.log("[OfficeProgress] ENTER AmeliaZone");
      if (!goals.AmeliaZone) {
        goals.AmeliaZone = true;
        notifyProgress();
      }
    });

    // --- Exit ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      console.log("[OfficeProgress] ENTER EXIT, allDone =", allDone());
      if (allDone()) {
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        WA.ui.openPopup(
          "safeinternet_gate_popup",
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 clues and talk to Amelia before leaving.`,
          [{ label: "OK", className: "primary", callback: (p) => p.close() }]
        );
      }
    });
  });
}

/* ---------- Helpers ---------- */
function allDone(): boolean {
  return goals.poster && goals.usbdrive && goals.stickynote && goals.AmeliaZone;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.poster) out.push("Old Security Poster");
  if (!goals.usbdrive) out.push("USB Drive");
  if (!goals.stickynote) out.push("Sticky Note");
  if (!goals.AmeliaZone) out.push("Talk to Amelia (NPC)");
  return out;
}

function notifyProgress() {
  const status = [
    goals.poster ? "✅ Poster" : "⬜ Poster",
    goals.usbdrive ? "✅ USB" : "⬜ USB",
    goals.stickynote ? "✅ Sticky" : "⬜ Sticky Note",
    goals.AmeliaZone ? "✅ Amelia" : "⬜ Amelia",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${status}`,
    callback: () => {},
  });
}
