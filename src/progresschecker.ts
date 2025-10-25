/// <reference types="@workadventure/iframe-api-typings" />
import { PHISHING_PROGRESS } from "./phishing_progress";
import { MALWARE_PROGRESS } from "./malware_progress";
import { PASSWORDSECURITY_PROGRESS } from "./passwordsecurity_progress";
import { IDTHEFT_PROGRESS } from "./idtheft_progress";
import { SAFEINTERNETPRACTICES_PROGRESS } from "./safeinternetpractices_progress";
import { FINALBOSS_PROGRESS } from "./finalboss_progress";

/* ------------ types (local to this file) ------------ */
type Task = { key: string; label: string; area: string };
type SingleMapConfig = {
  tasks: Task[];
  exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
};
type MapConfigRecord = Record<string, SingleMapConfig>;
type Goals = Record<string, boolean>;

/* ------------ merge per-room configs ------------ */
const MAP_CONFIG: MapConfigRecord = {
  ...PHISHING_PROGRESS,
  ...MALWARE_PROGRESS,
  ...PASSWORDSECURITY_PROGRESS,
  ...IDTHEFT_PROGRESS,
  ...SAFEINTERNETPRACTICES_PROGRESS,
  ...FINALBOSS_PROGRESS,
};

/* ------------ storage helpers ------------ */
const STORAGE_PREFIX = "cr:goals:";
const storageKey = (mapId: string) => `${STORAGE_PREFIX}${mapId}`;

function saveGoals(mapId: string, goals: Goals) {
  try { localStorage.setItem(storageKey(mapId), JSON.stringify(goals)); } catch {}
}
function loadGoals(mapId: string): Goals | null {
  try {
    const raw = localStorage.getItem(storageKey(mapId));
    return raw ? (JSON.parse(raw) as Goals) : null;
  } catch { return null; }
}
/** Remove goals from all *other* maps (prevents cross-map stacking). */
function clearOtherMaps(currentMapId: string) {
  try {
    const toDelete: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORAGE_PREFIX) && !k.endsWith(currentMapId)) toDelete.push(k);
    }
    toDelete.forEach(k => localStorage.removeItem(k));
  } catch {}
}

/* ------------ module state ------------ */
let goals: Goals = {};
let currentTasks: Task[] = [];
let toastCooldown = 0;

let gatePopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let gateCooldown = 0;
let exiting = false;
let initializedForMap = ""; // prevent double init if script persists

/* ------------ sidebar UI (right) ------------ */
const SIDEBAR_ID = "cr-progress-sidebar";

function ensureSidebar(tasks: Task[]) {
  if (document.getElementById(SIDEBAR_ID)) return;

  const host = document.createElement("div");
  host.id = SIDEBAR_ID;
  host.innerHTML = `
    <div class="ps-head">
      <span>Progress</span>
      <button class="ps-toggle" aria-label="Collapse">–</button>
    </div>
    <ul class="ps-list">
      ${tasks.map(t => `
        <li class="ps-item">
          <input id="ps-${t.key}" type="checkbox" />
          <label for="ps-${t.key}">${t.label}</label>
        </li>`).join("")}
    </ul>
  `;
  Object.assign(host.style, {
    position: "fixed",
    right: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    width: "220px",
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(42,60,255,.9)",
    color: "#fff",
    boxShadow: "0 10px 24px rgba(0,0,0,.25)",
    zIndex: "9999",
    pointerEvents: "auto",
    fontFamily: "Inter, system-ui, sans-serif",
  } as Partial<CSSStyleDeclaration>);

  const style = document.createElement("style");
  style.textContent = `
    #${SIDEBAR_ID} .ps-head{display:flex;justify-content:space-between;align-items:center;
      font-weight:600;margin-bottom:8px}
    #${SIDEBAR_ID} .ps-toggle{background:transparent;border:none;font-size:18px;cursor:pointer;color:#fff}
    #${SIDEBAR_ID}.is-collapsed .ps-list{display:none}
    #${SIDEBAR_ID} .ps-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px}
    #${SIDEBAR_ID} .ps-item{display:flex;align-items:center;gap:8px}
    #${SIDEBAR_ID} input[type="checkbox"]{width:16px;height:16px}
    @media (max-width: 900px){ #${SIDEBAR_ID}{right:8px;width:200px;padding:10px} }
  `;
  document.head.appendChild(style);

  const toggle = host.querySelector<HTMLButtonElement>(".ps-toggle")!;
  toggle.onclick = () => {
    const collapsed = host.classList.toggle("is-collapsed");
    toggle.textContent = collapsed ? "+" : "–";
  };

  document.body.appendChild(host);
}

function updateSidebar(goals: Goals) {
  const host = document.getElementById(SIDEBAR_ID);
  if (!host) return;
  for (const [k, v] of Object.entries(goals)) {
    const box = document.getElementById(`ps-${k}`) as HTMLInputElement | null;
    if (box) box.checked = !!v;
  }
}

function removeSidebar() {
  document.getElementById(SIDEBAR_ID)?.remove();
}

/* ------------ public API ------------ */
export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = (await getMapId()) || "";
    if (!mapId) {
      console.log("[ProgressChecker] No mapId resolved.");
      return;
    }
    if (initializedForMap === mapId) return;
    initializedForMap = mapId;

    const cfg = MAP_CONFIG[mapId];

    // Clean slate on map load
    hardCloseAllUi();
    clearOtherMaps(mapId);

    if (!cfg) {
      console.log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    console.log("[ProgressChecker] Init for map:", mapId);
    currentTasks = cfg.tasks;

    // Restore progress (clamped to current task keys)
    const restored = loadGoals(mapId);
    const defaultGoals = Object.fromEntries(currentTasks.map(t => [t.key, false]));
    goals = { ...defaultGoals, ...(restored ?? {}) };

    // Mount the sidebar once for this map
    ensureSidebar(currentTasks);
    updateSidebar(goals);

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
          try { localStorage.removeItem(storageKey(mapId)); } catch {}
          setTimeout(() => WA.nav.goToRoom(nextRoom), 40);
          return;
        }

        const now = Date.now();
        if (now - gateCooldown < 500) return; // debounce
        gateCooldown = now;

        const missing = missingList();
        if (warnAnchorId) {
          try {
            closeGatePopup();
            gatePopupRef = WA.ui.openPopup(
              warnAnchorId,
              `🚧 Hold up!\n\nYou still need to complete:\n• ${missing.join("\n• ")}\n\nFind all tasks in this room before leaving.`,
              [{ label: "Close", className: "primary", callback: () => closeGatePopup() }]
            );
            return;
          } catch {
            // fall back to toast
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

    // Initial reflect
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

/* ------------ internals ------------ */
function allDone(): boolean {
  return currentTasks.every(t => goals[t.key]);
}
function missingList(): string[] {
  return currentTasks.filter(t => !goals[t.key]).map(t => t.label);
}
function showProgress() {
  if (exiting) return;
  const now = Date.now();
  if (now - toastCooldown < 150) return; // debounce
  toastCooldown = now;

  // Ensure/refresh the right sidebar (no bottom toast)
  ensureSidebar(currentTasks);
  updateSidebar(goals);
}
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}
function hardCloseAllUi() {
  closeGatePopup();
  removeSidebar();
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
