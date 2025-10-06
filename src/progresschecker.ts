/// <reference types="@workadventure/iframe-api-typings" />

/** Per-map config */
const MAP_CONFIG: Record<
  string,
  {
    tasks: { key: string; label: string; area: string }[];
    exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
  }
> = {
  // ===== LIBRARY (Phishing) =====
  library: {
    tasks: [
      { key: "phishing_SMSphishing",     label: "SMS",        area: "phishing_SMSphishing" },
      { key: "phishing_MurdochEmail",    label: "MurdochEmail", area: "phishing_MurdochEmail" },
      { key: "phishing_QRcode",          label: "QRcode",     area: "phishing_QRcode" },
      // 👇 replaced Brock with phishing_instructions
      { key: "phishing_instructions",    label: "PPT Slides", area: "phishing_instructions" },
    ],
    exitGate: {
      area: "to-canteen",
      nextRoom: "canteen.tmj#from-library",
      warnAnchorId: "phishing_gate_popup",
    },
  },

  // ===== CANTEEN (Malware) =====
  canteen: {
    tasks: [
      { key: "malware_instructions", label: "Slides",  area: "malware_instructions" },
      { key: "malware_discord",      label: "Discord", area: "malware_discord" },  // 👈 added
      // { key: "malware_usbdrive",  label: "USB",     area: "malware_usbdrive" },
      // { key: "malware_trojan",    label: "Trojan",  area: "malware_trojan" },
    ],
    // exitGate: { area: "to-classroom", nextRoom: "classroom.tmj#from-canteen" },
  },
};

type Task  = { key: string; label: string; area: string };
type Goals = Record<string, boolean>;

/* ----------------- storage helpers ----------------- */
const STORAGE_PREFIX = "cr:goals:"; // per-map namespace

function storageKey(mapId: string) {
  return `${STORAGE_PREFIX}${mapId}`;
}

function saveGoals(mapId: string, goals: Goals) {
  try { localStorage.setItem(storageKey(mapId), JSON.stringify(goals)); } catch {}
}

function loadGoals(mapId: string): Goals | null {
  try {
    const raw = localStorage.getItem(storageKey(mapId));
    if (!raw) return null;
    return JSON.parse(raw) as Goals;
  } catch { return null; }
}

/** Remove goals from all *other* maps (prevents cross-map stacking). */
function clearOtherMaps(currentMapId: string) {
  try {
    const toDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith(STORAGE_PREFIX) && !k.endsWith(currentMapId)) toDelete.push(k);
    }
    toDelete.forEach(k => localStorage.removeItem(k));
  } catch {}
}

/* ----------------- module state ----------------- */
let goals: Goals = {};
let currentTasks: Task[] = [];
let toastCooldown = 0;

let gatePopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let gateCooldown = 0;
let exiting = false;
let initializedForMap = ""; // prevents double init if the script persists

/* ----------------- API ----------------- */
export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = (await getMapId()) || "";
    if (!mapId) {
      console.log("[ProgressChecker] No mapId resolved.");
      return;
    }
    if (initializedForMap === mapId) {
      // already initialized for this map; avoid duplicate subscriptions
      return;
    }
    initializedForMap = mapId;

    const cfg = MAP_CONFIG[mapId];
    // Clean slate on map load: close lingering UI and purge other maps' progress
    hardCloseAllUi();
    clearOtherMaps(mapId);

    if (!cfg) {
      console.log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    console.log("[ProgressChecker] Init for map:", mapId);
    currentTasks = cfg.tasks;

    // Try to restore, but ensure we only keep keys that exist in this map's tasks
    const restored = loadGoals(mapId);
    const defaultGoals = Object.fromEntries(currentTasks.map(t => [t.key, false]));
    goals = { ...defaultGoals, ...(restored ?? {}) };

    // Safety: close UI on unload
    window.addEventListener("beforeunload", () => hardCloseAllUi(), { passive: true });

    // --- Task listeners ---
    currentTasks.forEach(t => {
      try {
        WA.room.area.onEnter(t.area).subscribe(() => {
          if (exiting) return;

          if (!goals[t.key]) {
            goals[t.key] = true;
            saveGoals(mapId, goals);
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

    // --- Exit gate listener ---
    if (cfg.exitGate) {
      const { area, nextRoom, warnAnchorId } = cfg.exitGate;

      WA.room.area.onEnter(area).subscribe(() => {
        if (exiting) return;

        if (allDone()) {
          exiting = true;
          hardCloseAllUi();
          try { WA.controls.disablePlayerControls(); } catch {}
          // Optional: clear this map's progress so coming back is fresh
          try { localStorage.removeItem(storageKey(mapId)); } catch {}
          setTimeout(() => WA.nav.goToRoom(nextRoom), 40);
          return;
        }

        const now = Date.now();
        if (now - gateCooldown < 500) return;
        gateCooldown = now;

        const missing = missingList();

        if (warnAnchorId) {
          try {
            closeGatePopup();
            gatePopupRef = WA.ui.openPopup(
              warnAnchorId,
              `🚧 Hold up!\n\nYou still need to complete:\n• ${missing.join("\n• ")}\n\nFind all tasks in this room before leaving.`,
              [
                {
                  label: "Close",
                  className: "primary",
                  callback: () => closeGatePopup(),
                },
              ]
            );
            return;
          } catch {
            // fall through to toast if anchor missing
          }
        }

        WA.ui.displayActionMessage({
          message: `🚧 Hold up! Missing: ${missing.join(", ")}`,
          callback: () => {},
        });
      });

      WA.room.area.onLeave(area).subscribe(() => {
        closeGatePopup();
        if (!exiting) gateCooldown = 0;
      });
    }

    // Show initial progress shortly after load
    setTimeout(() => { if (!exiting) showProgress(); }, 300);
  });
}

/** Optional external hook */
export function markTaskDone(taskKey: string) {
  if (exiting) return;
  if (taskKey in goals && !goals[taskKey]) {
    goals[taskKey] = true;
    const mapId = initializedForMap || "";
    if (mapId) saveGoals(mapId, goals);

    showProgress();

    if (allDone()) {
      WA.ui.displayActionMessage({
        message: "✅ All tasks done! You may proceed to the exit.",
        callback: () => {},
      });
    }
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
  if (exiting) return;

  const now = Date.now();
  if (now - toastCooldown < 150) return;
  toastCooldown = now;

  const line = currentTasks
    .map(t => (goals[t.key] ? `✅ ${t.label}` : `⬜ ${t.label}`))
    .join("   ");

  WA.ui.displayActionMessage({
    message: `Progress:  ${line}`,
    callback: () => {},
  });
}

function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}

function hardCloseAllUi() {
  closeGatePopup();
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
