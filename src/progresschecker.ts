/// <reference types="@workadventure/iframe-api-typings" />

/** Per-map config */
const MAP_CONFIG: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
    /** Optional: anchor name for the progress popup to avoid stacking */
    progressAnchorId?: string;
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
      warnAnchorId: "phishing_gate_popup",
    },
    // 👇 Optional. If you add a small rectangle named "progress_anchor" in library.tmj
    progressAnchorId: "progress_anchor",
  },

  // ===== CANTEEN (Malware) — edit as you add areas =====
  canteen: {
    tasks: [
      { key: "malware_instructions", label: "Slides", area: "malware_instructions" },
      // { key: "malware_usb", label: "USB", area: "malware_usb" },
      // { key: "malware_poster", label: "Poster", area: "malware_poster" },
      // { key: "malware_npc", label: "NPC", area: "malware_npc" },
    ],
    // progressAnchorId: "progress_anchor",              // (optional)
    // exitGate: { area: "to-classroom", nextRoom: "classroom.tmj#from-canteen" },
  },
};

type Task = { key: string; label: string; area: string };
type Goals = Record<string, boolean>;

let goals: Goals = {};
let currentTasks: Task[] = [];
let mapCfg: (typeof MAP_CONFIG)[string] | undefined;

// ----- Single-instance PROGRESS popup / toast -----
let progressRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let lastProgressLine = "";
let lastProgressAt = 0;

// ----- Single-instance GATE popup -----
let gatePopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let gateCooldown = 0;

export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = await getMapId();
    mapCfg = MAP_CONFIG[mapId];
    if (!mapCfg) {
      console.log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    console.log("[ProgressChecker] Init for map:", mapId);
    currentTasks = mapCfg.tasks;
    goals = Object.fromEntries(currentTasks.map(t => [t.key, false]));

    // ---- Task listeners
    currentTasks.forEach(t => {
      try {
        WA.room.area.onEnter(t.area).subscribe(() => {
          if (!goals[t.key]) {
            goals[t.key] = true;
            showProgress();

            if (allDone()) {
              WA.ui.displayActionMessage({
                message: "✅ All tasks done! You may proceed to the exit.",
                callback: () => {},
              });
            }
          }
        });
      } catch (e) {
        console.warn(`[ProgressChecker] area '${t.area}' not found on this map`, e);
      }
    });

    // ---- Exit gate
    if (mapCfg.exitGate) {
      const { area, nextRoom, warnAnchorId } = mapCfg.exitGate;

      WA.room.area.onEnter(area).subscribe(() => {
        if (allDone()) {
          setTimeout(() => WA.nav.goToRoom(nextRoom), 30);
          return;
        }

        const now = Date.now();
        if (now - gateCooldown < 500) return;
        gateCooldown = now;

        const missing = missingList();

        if (warnAnchorId) {
          try {
            try { gatePopupRef?.close?.(); } catch {}
            gatePopupRef = WA.ui.openPopup(
              warnAnchorId,
              `🚧 Hold up!\n\nYou still need to complete:\n• ${missing.join("\n• ")}\n\nFind all tasks in this room before leaving.`,
              [
                {
                  label: "Close",
                  className: "primary",
                  callback: () => { try { gatePopupRef?.close?.(); } catch {} gatePopupRef = undefined; },
                },
              ]
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
      });

      WA.room.area.onLeave(area).subscribe(() => {
        try { gatePopupRef?.close?.(); } catch {}
        gatePopupRef = undefined;
      });
    }

    // Initial render
    setTimeout(showProgress, 250);

    // Cleanup on unload
    window.addEventListener("beforeunload", () => {
      try { progressRef?.close?.(); } catch {}
      try { gatePopupRef?.close?.(); } catch {}
    });
  });
}

/** Mark task from other scripts if needed */
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

/** Single-instance progress: updates if text changed, otherwise no-op */
function showProgress() {
  const line = currentTasks
    .map(t => (goals[t.key] ? `✅ ${t.label}` : `⬜ ${t.label}`))
    .join("   ");

  // avoid spamming if nothing changed
  const now = Date.now();
  if (line === lastProgressLine && now - lastProgressAt < 1500) return;
  lastProgressLine = line;
  lastProgressAt = now;

  // Prefer anchored popup if configured (stable, non-stacking)
  if (mapCfg?.progressAnchorId) {
    try {
      try { progressRef?.close?.(); } catch {}
      progressRef = WA.ui.openPopup(
        mapCfg.progressAnchorId,
        `Progress:  ${line}`,
        [
          {
            label: "Close",
            className: "primary",
            callback: () => { try { progressRef?.close?.(); } catch {} progressRef = undefined; },
          },
        ]
      );
      return;
    } catch {
      // fall back to toast if anchor missing
    }
  }

  // Toast fallback (no anchor). Debounced by change detection above.
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
