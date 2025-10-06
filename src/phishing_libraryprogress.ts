/// <reference types="@workadventure/iframe-api-typings" />

type Goals = {
  phishing_SMSphishing: boolean;
  phishing_MurdochEmail: boolean;
  phishing_QRcode: boolean;
  BrockZone: boolean;
};

const goals: Goals = {
  phishing_SMSphishing: false,
  phishing_MurdochEmail: false,
  phishing_QRcode: false,
  BrockZone: false,
};

const EXIT_AREA_NAME = "to-canteen";   // exit gate area
const NEXT_ROOM = "canteen.tmj#from-library"; // change if your spawn is named differently

export function initPhishingLibraryProgress() {
  WA.onInit().then(() => {
    console.log("[PhishingLibraryProgress] ready");

    // --- Easter Eggs ---
    ["phishing_SMSphishing", "phishing_MurdochEmail", "phishing_QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
    });

    // --- NPC ---
    WA.room.area.onEnter("phishing_Brock").subscribe(() => {
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
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 phishing easter eggs and talk to Brock before leaving.`,
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
  return goals.phishing_SMSphishing && goals.phishing_MurdochEmail && goals.phishing_QRcode && goals.BrockZone;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.phishing_SMSphishing) out.push("SMS Phishing Easter Egg");
  if (!goals.phishing_MurdochEmail) out.push("Murdoch Email Easter Egg");
  if (!goals.phishing_QRcode) out.push("QR Code Easter Egg");
  if (!goals.BrockZone) out.push("Talk to Brock (NPC)");
  return out;
}

function notifyProgress() {
  const done = [
    goals.phishing_SMSphishing ? "✅ SMS" : "⬜ SMS",
    goals.phishing_MurdochEmail ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.phishing_QRcode ? "✅ QRcode" : "⬜ QRcode",
    goals.BrockZone ? "✅ Brock" : "⬜ Brock",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${done}`,
    callback: () => {}, // no action
  });
}
