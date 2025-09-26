/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  poster: boolean;
  usbdrive: boolean;
  stickynote: boolean;
};

const goals: Goals = {
  poster: false,
  usbdrive: false,
  stickynote: false,
};

// Exit to next room
const EXIT_AREA_NAME = "to-hall";
const NEXT_ROOM = "hall.tmj#from-canteen";   // adjust filename if needed

export function initOfficeProgress() {
  WA.onInit().then(() => {
    console.log("[OfficeProgress] ready");

    // --- Easter Eggs ---
    ["poster", "usbdrive", "stickynote"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
    });

    // (Note) We don't count instructions_safeinternetpractices toward progress

    // --- Exit gate ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        WA.ui.openPopup(
          "safeinternet_gate_popup",
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 hidden clues before leaving.`,
          [{ label: "OK", className: "primary", callback: (p) => p.close() }]
        );
      }
    });
  });
}

/* ---------- Helpers ---------- */
function allDone(): boolean {
  return goals.poster && goals.usbdrive && goals.stickynote;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.poster) out.push("Old Security Poster");
  if (!goals.usbdrive) out.push("USB Drive");
  if (!goals.stickynote) out.push("Sticky Note");
  return out;
}

function notifyProgress() {
  const status = [
    goals.poster    ? "✅ Poster"    : "⬜ Poster",
    goals.usbdrive  ? "✅ USB"       : "⬜ USB",
    goals.stickynote? "✅ Sticky"    : "⬜ Sticky",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${status}`,
    callback: () => {},
  });
}
