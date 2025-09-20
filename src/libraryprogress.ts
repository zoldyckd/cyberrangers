/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  blackbibleppt: boolean;
  MurdochEmail: boolean;
  QRCode: boolean;
  BrockZone: boolean;
};

const goals: Goals = {
  blackbibleppt: false,
  MurdochEmail: false,
  QRCode: false,
  BrockZone: false,
};

const EXIT_AREA_NAME = "to-canteen";   // exit gate area
const NEXT_ROOM = "canteen.tmj#spawn"; // change if your spawn is named differently

export function initLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[LibraryProgress] ready");

    // --- Easter Eggs ---
    ["blackbibleppt", "MurdochEmail", "QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
    });

    // --- NPC ---
    WA.room.area.onEnter("BrockZone").subscribe(() => {
      if (!goals.BrockZone) {
        goals.BrockZone = true;
        notifyProgress();
      }
    });

    // --- Exit ---
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(() => {
      if (allDone()) {
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        WA.ui.openPopup(
          "phishing_gate_popup",
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 easter eggs and talk to Brock before leaving.`,
          [
            { label: "OK", className: "primary", callback: (p) => p.close() },
          ]
        );
      }
    });
  });
}

/* ---------- Helpers ---------- */
function allDone(): boolean {
  return goals.blackbibleppt && goals.MurdochEmail && goals.QRCode && goals.BrockZone;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.blackbibleppt) out.push("Black Bible Easter Egg");
  if (!goals.MurdochEmail) out.push("Murdoch Email Easter Egg");
  if (!goals.QRCode) out.push("QR Code Easter Egg");
  if (!goals.BrockZone) out.push("Talk to Brock (NPC)");
  return out;
}

function notifyProgress() {
  const done = [
    goals.blackbibleppt ? "✅ BlackBible" : "⬜ BlackBible",
    goals.MurdochEmail  ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.QRCode        ? "✅ QRCode" : "⬜ QRCode",
    goals.BrockZone     ? "✅ Brock" : "⬜ Brock",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${done}`,
    callback: () => {}, // no action
  });
}
