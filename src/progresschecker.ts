/// <reference types="@workadventure/iframe-api-typings" />

/** Per-map config:
 *  - tasks: mark done when entering these areas
 *  - exitGate: when player enters this area, either move to nextRoom (if all done) or show a warning
 */
const MAP_CONFIG: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string }; // warnAnchorId optional
  }
> = {
  // ===== LIBRARY (Phishing) =====
  library: {
    tasks: [
      { key: "phishing_SMSphishing",  label: "SMS",          area: "phishing_SMSphishing" },
      { key: "phishing_MurdochEmail", label: "MurdochEmail", area: "phishing_MurdochEmail" },
      { key: "phishing_QRcode",       label: "QRcode",       area: "phishing_QRcode" },
      { key: "phishing_Brock",        label: "Brock",        area: "phishing_Brock" },
    ],
    exitGate: {
      area: "to-canteen",
      nextRoom: "canteen.tmj#from-library",
      // If you have a rectangle anchor in Tiled you want to use for the warning popup, put its name here:
      // warnAnchorId: "phishing_gate_popup",
    },
  },

  // ===== CANTEEN (Malware) — example, tweak as you add areas =====
  canteen: {
    tasks: [
      { key: "malware_instructions", label: "Slides", area: "malware_instructions" },
      // { key: "malware_usb", label: "USB", area: "malware_usb" },
      // { key: "malware_poster", label: "Poster", area: "malware_poster" },
      // { key: "malware_npc", label: "NPC", area: "malware_npc" },
    ],
    // exitGate: { area: "to-classroom", nextRoom: "classroom.tmj#from-canteen" },
  },
};

type Goals = Record<string, boolean>;
let goals: Goals = {};
let currentTasks: { key: string; label: string; area: string }[] = [];
let toastCooldown = 0;

export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = await getMapId();
    const cfg = MAP_CONFIG[mapId];
    if (!cfg) {
      console.log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    console.log("[ProgressChecker] Init for map:", mapId);
    currentTasks = cfg.tasks;
    goals = Object.fromEntries(currentTasks.map(t => [t.key, false]));

    // Task listeners
    currentTasks.forEach(t => {
      try {
        WA.room.area.onEnter(t.area).subscribe(() => {
          if (!goals[t.key]) {
            goals[t.key] = true;
            showProgress();
          }
        });
      } catch (e) {
        console.warn(`[ProgressChecker] area '${t.area}' not found on map '${mapId}'`, e);
      }
    });

    // Exit gate listener
    if (cfg.exitGate) {
      WA.room.area.onEnter(cfg.exitGate.area).subscribe(() => {
        if (allDone()) {
          // tiny delay to avoid UI race conditions
          setTimeout(() => WA.nav.goToRoom(cfg.exitGate!.nextRoom), 30);
        } else {
          const missing = missingList();
          // Try anchored popup if an anchor name was provided; otherwise use toast
          if (cfg.exitGate?.warnAnchorId) {
            try {
              WA.ui.openPopup(
                cfg.exitGate.warnAnchorId,
                `🚧 Hold up!\n\nYou still need to complete:\n• ${missing.join("\n• ")}\n\nFind all tasks in this room before leaving.`,
                [{ label: "OK", className: "primary", callback: p => p.close() }]
              );
              return;
            } catch {
              // fall through to toast
            }
          }
          WA.ui.displayActionMessage({
            message: `🚧 Hold up! Missing: ${missing.join(", ")}`,
            callback: () => {},
          });
        }
      });
    }

    // Optional: show initial empty progress shortly after load
    setTimeout(showProgress, 300);
  });
}

/** Optional external hook: mark a task done manually from other modules */
export function markTaskDone(taskKey: string) {
  if (taskKey in goals && !goals[taskKey]) {
    goals[taskKey] = true;
    showProgress();
  }
}

/* ----------------- internals ----------------- */
function allDone(): boolean {
  return currentTasks.every(t => goals[t.key]);
}

function missingList(): string[] {
  return currentTasks.filter(t => !goals[t.key]).map(t => t.label);
}

function showProgress() {
  const now = Date.now();
  if (now - toastCooldown < 150) return; // debounce
  toastCooldown = now;

  const line = currentTasks
    .map(t => (goals[t.key] ? `✅ ${t.label}` : `⬜ ${t.label}`))
    .join("   ");

  WA.ui.displayActionMessage({
    message: `Progress:  ${line}`,
    callback: () => {},
  });
}

/* mapId helper */
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
