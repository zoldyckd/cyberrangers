/// <reference types="@workadventure/iframe-api-typings" />

/** Per-map config:
 *  - tasks: mark done when entering these areas
 *  - exitGate: when player enters this area, either move to nextRoom (if all done) or show a warning
 */
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
      { key: "phishing_SMSphishing",  label: "SMS",          area: "phishing_SMSphishing" },
      { key: "phishing_MurdochEmail", label: "MurdochEmail", area: "phishing_MurdochEmail" },
      { key: "phishing_QRcode",       label: "QRcode",       area: "phishing_QRcode" },
      { key: "phishing_Brock",        label: "Brock",        area: "phishing_Brock" },
    ],
    exitGate: {
      area: "to-canteen",
      nextRoom: "canteen.tmj#from-library",
      warnAnchorId: "phishing_gate_popup", // Tiled rectangle anchor for popup
    },
  },

  // ===== CANTEEN (Malware) — add more as you build =====
  canteen: {
    tasks: [
      { key: "malware_instructions", label: "Slides", area: "malware_instructions" },
      // { key: "malware_usb",     label: "USB",    area: "malware_usb" },
      // { key: "malware_poster",  label: "Poster", area: "malware_poster" },
      // { key: "malware_npc",     label: "NPC",    area: "malware_npc" },
    ],
    // exitGate: { area: "to-classroom", nextRoom: "classroom.tmj#from-canteen" },
  },
};

type Task = { key: string; label: string; area: string };
type Goals = Record<string, boolean>;

let goals: Goals = {};
let currentTasks: Task[] = [];
let toastCooldown = 0;

// Gate state (prevents stacking)
let gatePopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let gateCooldown = 0;
let exiting = false; // blocks UI while navigating to next room

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

    // Safety: ensure popups close on unload
    window.addEventListener("beforeunload", () => hardCloseAllUi(), { passive: true });

    // --- Task listeners ---
    currentTasks.forEach(t => {
      try {
        WA.room.area.onEnter(t.area).subscribe(() => {
          if (exiting) return; // ignore late events while leaving

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

    // --- Exit gate listener (single-instance, anchored, no stacking) ---
    if (cfg.exitGate) {
      const { area, nextRoom, warnAnchorId } = cfg.exitGate;

      // Enter gate
      WA.room.area.onEnter(area).subscribe(() => {
        if (exiting) return; // already leaving

        if (allDone()) {
          exiting = true;
          hardCloseAllUi();                 // nuke any lingering popups
          try { WA.controls.disablePlayerControls(); } catch {}
          setTimeout(() => WA.nav.goToRoom(nextRoom), 40); // tiny delay for UI stability
          return;
        }

        const now = Date.now();
        if (now - gateCooldown < 500) return; // debounce rapid re-fires
        gateCooldown = now;

        const missing = missingList();

        if (warnAnchorId) {
          try {
            closeGatePopup(); // ensure singleton
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

      // Leave gate — close lingering popup & allow re-entry (if not exiting)
      WA.room.area.onLeave(area).subscribe(() => {
        closeGatePopup();
        if (!exiting) gateCooldown = 0;
      });
    }

    // Show initial empty progress shortly after load
    setTimeout(() => { if (!exiting) showProgress(); }, 300);
  });
}

/** Optional external hook: mark a task done manually from other modules */
export function markTaskDone(taskKey: string) {
  if (exiting) return;
  if (taskKey in goals && !goals[taskKey]) {
    goals[taskKey] = true;
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
  if (exiting) return; // don't spam while leaving

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
