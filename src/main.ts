/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";
import { initProgressChecker } from "./progresschecker";


// phishing - library room
import { initphishing_QRcode } from "./phishing_qrcode";
import { initphishing_MurdochEmail } from "./phishing_murdochemail";
import { initphishing_SMSphishing } from "./phishing_smsphishing";
import { initPhishingLibraryProgress } from "./phishing_libraryprogress";
import { initPhishingInstructions } from "./phishing_instructions";
import { initPhishingLibrarySpawnNote } from "./phishing_librarySpawnNote";
import { initPhishingBrock } from "./phishing_brock";

// garden / common features
import { initBillboard } from "./billboard";
import { initSpawnIntro } from "./spawnIntro";
import { initInstructions } from "./instructions";
import { initPoster } from "./poster";
import { initUsbDrive } from "./usbdrive";
import { initStickyNote } from "./stickynote";
import { initSafeInternetPractices } from "./instructions_safeinternetpractices";
import { initOfficeProgress } from "./officeprogress";

// canteen - malware room
import { initMalwareInstructions } from "./malware_instructions";

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // ------------------------------------------
  // Always-on (safe anywhere)
  // ------------------------------------------
  initClock();
  initBoard();
  initMarvie();

  // ✅ Progress checker (auto-guards by mapId)
  initProgressChecker();
  
  // ------------------------------------------
  // Map detection (robust): URL -> WA API -> Tiled map property `mapId`
  // ------------------------------------------
  const mapId = await detectMapId();
  console.log("[Router] mapId =", mapId || "(unknown)");

  if (mapId === "garden") {
    console.log("[Router] Initializing GARDEN features…");
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    initOfficeProgress(); // keep here only if garden has the required objects
  }
  else if (mapId === "library") {
    console.log("[Router] Initializing LIBRARY (Phishing) features…");
    initphishing_QRcode();
    initphishing_MurdochEmail();
    initphishing_SMSphishing();
    initPhishingLibraryProgress();
    initPhishingInstructions();
    initPhishingLibrarySpawnNote();
    initPhishingBrock();
  }
  else if (mapId === "canteen") {
    console.log("[Router] Initializing CANTEEN (Malware) features…");
    initMalwareInstructions();
  }
  else {
    console.warn(
      "[Router] Unknown map; only common features started. " +
      "Set a Tiled Map Property `mapId` (string) to enable map-specific inits."
    );
  }
});

/**
 * Return the current map id as a lowercase string.
 * Order:
 *  1) Parse full URL for *.tmj (works when available)
 *  2) WA API getTiledMap().url/name (if provided by this WA version)
 *  3) Tiled Map Property: `mapId` (add it in Tiled: Map -> Properties)
 */
async function detectMapId(): Promise<string> {
  // 1) Try URL
  try {
    const full = decodeURIComponent(window.location.href);
    const m = full.match(/\/([^\/?#]+)\.tmj/i);
    if (m?.[1]) return m[1].toLowerCase(); // e.g., "garden", "library", "canteen"
  } catch {}

  // 2) Try WA API (may not expose url/name on some builds)
  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const raw = (tiled?.url ?? tiled?.name ?? "").toString();
    if (raw) {
      const base = (raw.split("/").pop() || raw).toLowerCase();
      if (base.endsWith(".tmj")) return base.replace(/\.tmj$/, "");
      return base; // sometimes returns plain name without .tmj
    }
    // 3) Try Tiled Map Property: mapId
    const props = tiled?.properties as Array<{ name: string; value: any }> | undefined;
    const fromProp = props?.find(p => p?.name === "mapId")?.value;
    if (typeof fromProp === "string" && fromProp.trim()) {
      return fromProp.trim().toLowerCase();
    }
  } catch {}

  return "";
}
