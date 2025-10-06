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

const EXIT_AREA_NAME = "to-canteen";                 // exit gate area
const NEXT_ROOM = "canteen.tmj#from-library";        // spawn in canteen

let progressRef: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initPhishingLibraryProgress() {
  WA.onInit().then(async () => {
    console.log("[PhishingLibraryProgress] ready");

    // ✅ Hard-guard: only run in LIBRARY
    const mapId = await getMapId();
    if (mapId !== "library") {
      console.log("[PhishingLibraryProgress] skipped on non-library map:", mapId);
      return;
    }

    // Safety: close UI if page/room unloads
    window.addEventListener("beforeunload", closeProgressUI);

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
        // ✅ Close any progress UI before room switch so it can't “follow” you
        closeProgressUI();
        WA.nav.goToRoom(NEXT_ROOM);
      } else {
        closeProgressUI(); // ensure only the gate popup is visible
        WA.ui.openPopup(
          "phishing_gate_popup",
          `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 phishing easter eggs and talk to Brock before leaving.`,
          [{ label: "OK", className: "primary", callback: (p) => p.close() }]
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
  // Show as a popup we control (so we can close it on exit)
  const done = [
    goals.phishing_SMSphishing ? "✅ SMS" : "⬜ SMS",
    goals.phishing_MurdochEmail ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.phishing_QRcode ? "✅ QRcode" : "⬜ QRcode",
    goals.BrockZone ? "✅ Brock" : "⬜ Brock",
  ].join("   ");

  closeProgressUI();
  progressRef = WA.ui.openPopup(
    "phishing_progressPopup",
    `Progress: ${done}`,
    [{ label: "Close", className: "primary", callback: closeProgressUI }]
  );
}

function closeProgressUI() {
  try { progressRef?.close?.(); } catch {}
  progressRef = undefined;
}

// Minimal, robust mapId detector (URL → Tiled map property)
async function getMapId(): Promise<string> {
  try {
    const m = decodeURIComponent(location.href).match(/\/([^\/?#]+)\.tmj/i);
    if (m?.[1]) return m[1].toLowerCase();
  } catch {}

  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const props = tiled?.properties as Array<{ name: string; value: any }> | undefined;
    const fromProp = props?.find(p => p?.name === "mapId")?.value;
    if (typeof fromProp === "string" && fromProp.trim()) return fromProp.trim().toLowerCase();
  } catch {}

  return "";
}
