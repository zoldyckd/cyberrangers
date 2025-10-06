/// <reference types="@workadventure/iframe-api-typings" />

/** Configure tasks per map.
 * key  : internal id (also used as Goals key)
 * label: shown to the player
 * area : Tiled area name to mark a task as done when entered
 */
const MAP_CONFIG: Record<string, { tasks: { key: string; label: string; area: string }[] }> = {
  library: {
    tasks: [
      { key: "phishing_SMSphishing",    label: "SMS",          area: "phishing_SMSphishing" },
      { key: "phishing_MurdochEmail",   label: "MurdochEmail", area: "phishing_MurdochEmail" },
      { key: "phishing_QRcode",         label: "QRcode",       area: "phishing_QRcode" },
      { key: "phishing_Brock",          label: "Brock",        area: "phishing_Brock" },
    ],
  },

  // ✏️ CANTEEN EXAMPLE (rename areas to your real ones)
  canteen: {
    tasks: [
      // Replace these with your actual area names for the malware room:
      { key: "malware_instructions", label: "Slides", area: "malware_instructions" },
      // { key: "malware_usbBait",      label: "USB",    area: "malware_usbBait" },
      // { key: "malware_poster",       label: "Poster", area: "malware_poster" },
      // { key: "malware_npc",          label: "NPC",    area: "malware_npc" },
    ],
  },
};

type Goals = Record<string, boolean>;
let goals: Goals = {};
let toastCooldown = 0;

/** Public init */
export function initProgressChecker() {
  WA.onInit().then(async () => {
    const mapId = await getMapId();
    const cfg = MAP_CONFIG[mapId];
    if (!cfg) {
      console.log("[ProgressChecker] No config for map:", mapId);
      return;
    }

    console.log("[ProgressChecker] Init for map:", mapId);
    goals = Object.fromEntries(cfg.tasks.map(t => [t.key, false]));

    // Subscribe per-task area listeners
    cfg.tasks.forEach(t => {
      try {
        WA.room.area.onEnter(t.area).subscribe(() => {
          if (!goals[t.key]) {
            goals[t.key] = true;
            showProgress(cfg.tasks);
          }
        });
      } catch (e) {
        console.warn(`[ProgressChecker] area '${t.area}' not found on map '${mapId}'`, e);
      }
    });

    // Optional: show empty progress once on map load
    setTimeout(() => showProgress(cfg.tasks), 300);
  });
}

/** Optional helper if you want to mark tasks from *other* scripts */
export function markTaskDone(taskKey: string) {
  if (taskKey in goals && !goals[taskKey]) {
    goals[taskKey] = true;
    // find the current map's tasks to render labels in order
    getMapId().then(mapId => {
      const cfg = MAP_CONFIG[mapId];
      if (cfg) showProgress(cfg.tasks);
    });
  }
}

function showProgress(tasks: { key: string; label: string }[]) {
  const now = Date.now();
  if (now - toastCooldown < 200) return; // debounce
  toastCooldown = now;

  const line = tasks
    .map(t => (goals[t.key] ? `✅ ${t.label}` : `⬜ ${t.label}`))
    .join("   ");

  WA.ui.displayActionMessage({
    message: `Progress:  ${line}`,
    callback: () => {},
  });
}

/* -------- mapId helpers -------- */
async function getMapId(): Promise<string> {
  // URL hint
  try {
    const m = decodeURIComponent(location.href).match(/\/([^\/?#]+)\.tmj/i);
    if (m?.[1]) return m[1].toLowerCase();
  } catch {}
  // Tiled property fallback
  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const props = tiled?.properties as Array<{ name: string; value: any }> | undefined;
    const fromProp = props?.find(p => p?.name === "mapId")?.value;
    if (typeof fromProp === "string" && fromProp.trim()) return fromProp.trim().toLowerCase();
  } catch {}
  return "";
}
