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

// simple debounce to avoid spamming toasts
let toastCooldown = 0;

export function initPhishingLibraryProgress() {
  WA.onInit().then(async () => {
    console.log("[PhishingLibraryProgress] ready");

    // ✅ Hard-guard: only run this module in LIBRARY
    const mapId = await getMapId();
    if (mapId !== "library") {
      console.log("[PhishingLibraryProgress] skipped on non-library map:", mapId);
      return;
    }

    // --- Easter Eggs ---
    ["phishing_SMSphishing", "phishing_MurdochEmail", "phishing_QRcode"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress(); // toast only (no anchor)
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
    WA.room.area.onEnter(EXIT_AREA_NAME).subscribe(async () => {
      if (allDone()) {
        // small delay to let any UI settle before room switch
        setTimeout(() => WA.nav.goToRoom(NEXT_ROOM), 30);
      } else {
        // Try anchored popup if you have it; otherwise fallback to toast
        try {
          WA.ui.openPopup(
            "phishing_gate_popup", // <-- must be a rectangle object in Tiled
            `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 phishing easter eggs and talk to Brock before leaving.`,
            [{ label: "OK", className: "primary", callback: (p) => p.close() }]
          );
        } catch {
          WA.ui.displayActionMessage({
            message: `🚧 Hold up! Missing: ${missingList().join(", ")}`,
            callback: () => {},
          });
        }
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
  const now = Date.now();
  if (now - toastCooldown < 250) return; // debounce
  toastCooldown = now;

  const done = [
    goals.phishing_SMSphishing ? "✅ SMS" : "⬜ SMS",
    goals.phishing_MurdochEmail ? "✅ MurdochEmail" : "⬜ MurdochEmail",
    goals.phishing_QRcode ? "✅ QRcode" : "⬜ QRcode",
    goals.BrockZone ? "✅ Brock" : "⬜ Brock",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${done}`,
    callback: () => {}, // toast-style, auto-fades, nothing to close()
  });
}

// Minimal mapId detector (URL → Tiled map property)
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
