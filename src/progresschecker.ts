/// <reference types="@workadventure/iframe-api-typings" />
import { PHISHING_PROGRESS } from "./phishing_progress";
import { MALWARE_PROGRESS } from "./malware_progress";
import { PASSWORDSECURITY_PROGRESS } from "./passwordsecurity_progress";
import { IDTHEFT_PROGRESS } from "./idtheft_progress";
import { SAFEINTERNETPRACTICES_PROGRESS } from "./safeinternetpractices_progress";
import { FINALBOSS_PROGRESS } from "./finalboss_progress";

/* ------------ types ------------ */
type Task = { key: string; label: string; area: string };
type SingleMapConfig = {
  tasks: Task[];
  exitGate?: { area: string; nextRoom: string; warnAnchorId?: string };
};
type MapConfigRecord = Record<string, SingleMapConfig>;
type Goals = Record<string, boolean>;

/* ------------ config merge ------------ */
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
let gatePopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
let gateCooldown = 0;
let exiting = false;
let initializedForMap = "";

let hudEl: HTMLDivElement | null = null;
let hudCssInjected = false;
let hudVisible = true;
let renderRetryTimer: number | null = null;

// @ts-ignore – optional debug flag
const DEBUG = (window as any).__CR_DEBUG__ === true;

/* ------------ public API ------------ */
export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = (await getMapId()) || "";
    if (!mapId) {
      log("[ProgressChecker] No mapId resolved.");
      return;
    }
    if (initializedForMap === mapId) return;
    initializedForMap = mapId;

    const cfg = MAP_CONFIG[mapId];

    hardCloseAllUi();
    clearOtherMaps(mapId);

    if (!cfg) {
      log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    log("[ProgressChecker] Init for map:", mapId);
    currentTasks = cfg.tasks;

    const restored = loadGoals(mapId);
    const defaultGoals = Object.fromEntries(currentTasks.map(t => [t.key, false]));
    goals = { ...defaultGoals, ...(restored ?? {}) };

    window.addEventListener("beforeunload", () => hardCloseAllUi(), { passive: true });

    // Task listeners
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

    // Exit gate
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
        if (now - gateCooldown < 500) return;
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
          } catch { /* fall back to toast */ }
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

    // Initial paint (with retries in case DOM not ready yet)
    scheduleRenderRetries();
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

/** Non-blocking HUD + safe fallback */
function showProgress() {
  const ok = renderHud();
  if (!ok) {
    // Fallback so you still see progress while we sort out the HUD
    const line = currentTasks.map(t => (goals[t.key] ? `✅ ${t.label}` : `⬜ ${t.label}`)).join("   ");
    WA.ui.displayActionMessage({ message: `Progress:  ${line}`, callback: () => {} });
  }
}

/* ------------ Gate popup + cleanup ------------ */
function closeGatePopup() {
  try { gatePopupRef?.close?.(); } catch {}
  gatePopupRef = undefined;
}
function hardCloseAllUi() {
  closeGatePopup();
  destroyHud();
  stopRenderRetries();
}

/* ------------ HUD helpers ------------ */
function ensureHud(): boolean {
  if (!document || !document.body) return false;

  if (!hudCssInjected) {
    const style = document.createElement("style");
    style.id = "cr-progress-hud-style";
    style.textContent = `
#cr-progress-hud {
  position: fixed;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 240px;
  max-width: 36vw;
  background: rgba(22,24,40,0.85);
  color: #fff;
  font-family: system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  font-size: 14px;
  line-height: 1.35;
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  z-index: 1000000;
  pointer-events: none;
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
#cr-progress-hud .hdr {
  opacity: .85;
  text-transform: uppercase;
  letter-spacing: .06em;
  font-size: 11px;
  margin-bottom: 8px;
}
#cr-progress-hud .item {
  display: grid;
  grid-template-columns: 18px 1fr;
  align-items: center;
  gap: 8px;
  margin: 6px 0;
  opacity: .9;
}
#cr-progress-hud .box {
  width: 14px; height: 14px; border-radius: 4px;
  border: 2px solid rgba(255,255,255,.55);
  display: inline-block;
}
#cr-progress-hud .item.done .box {
  border-color: transparent;
  background: #4ade80;
  box-shadow: inset 0 0 0 2px rgba(0,0,0,.15);
}
#cr-progress-hud .label { user-select: none; }
@media (max-width: 900px) {
  #cr-progress-hud { right: 8px; width: 54vw; font-size: 13px; }
}
`;
    document.head.appendChild(style);
    hudCssInjected = true;
  }

  if (!hudEl) {
    hudEl = document.createElement("div");
    hudEl.id = "cr-progress-hud";
    hudEl.style.display = hudVisible ? "block" : "none";
    document.body.appendChild(hudEl);
  }
  return true;
}

function renderHud(): boolean {
  if (exiting) return true; // nothing to show, but not an error
  if (!ensureHud()) {
    log("[ProgressChecker] HUD skipped (body not ready yet).");
    return false;
  }
  const html = [
    `<div class="hdr">Progress</div>`,
    ...currentTasks.map(t => {
      const done = !!goals[t.key];
      return `<div class="item ${done ? "done" : ""}">
        <span class="box"></span>
        <span class="label">${t.label}</span>
      </div>`;
    }),
  ].join("");
  if (hudEl) hudEl.innerHTML = html;
  return true;
}

function destroyHud() {
  try { hudEl?.remove(); } catch {}
  hudEl = null;
}

/* Retry rendering a few times after load in case WA/DOM mounts slowly */
function scheduleRenderRetries() {
  let tries = 0;
  const max = 20;         // ~4s total
  stopRenderRetries();
  renderRetryTimer = window.setInterval(() => {
    tries++;
    const ok = renderHud();
    if (ok || tries >= max) stopRenderRetries();
  }, 200);
}
function stopRenderRetries() {
  if (renderRetryTimer !== null) {
    window.clearInterval(renderRetryTimer);
    renderRetryTimer = null;
  }
}

/* Optional: press P to hide/show */
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "p") {
    hudVisible = !hudVisible;
    if (hudEl) hudEl.style.display = hudVisible ? "block" : "none";
  }
});

/* ------------ mapId helper ------------ */
async function getMapId(): Promise<string> {
  try {
    const m = decodeURIComponent(location.href).match(/\/([^\/?#]+)\.tmj/i);
    if (m?.[1]) return m[1].toLowerCase();
  } catch {}
  try {
    const tiled: any = await (WA.room as any).getTiledMap?.();
    const props = tiled?.properties as Array<{ name: string; value: any }> | undefined;
    const fromProp = props?.find(p => p?.name === "mapId")?.value;
    if (typeof fromProp === "string" && fromProp.trim()) return fromProp.trim().toLowerCase();
  } catch {}
  return "";
}

/* ------------ tiny logger ------------ */
function log(...args: any[]) {
  if (DEBUG) console.log(...args);
}
