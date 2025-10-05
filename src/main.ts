/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";

// phishing - library room (imports kept)
import { initphishing_QRcode } from "./phishing_qrcode";
import { initphishing_MurdochEmail } from "./phishing_murdochemail";
import { initphishing_SMSphishing } from "./phishing_smsphishing";
import { initPhishingLibraryProgress } from "./phishing_libraryprogress";
import { initPhishingInstructions } from "./phishing_instructions";
import { initPhishingLibrarySpawnNote } from "./phishing_librarySpawnNote";
import { initPhishingBrock } from "./phishing_brock";

// garden / common features (imports kept)
import { initBillboard } from "./billboard";
import { initSpawnIntro } from "./spawnIntro";
import { initInstructions } from "./instructions";
import { initPoster } from "./poster";
import { initUsbDrive } from "./usbdrive";
import { initStickyNote } from "./stickynote";
import { initSafeInternetPractices } from "./instructions_safeinternetpractices";
import { initOfficeProgress } from "./officeprogress";

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // -------------------------
  // Always-on (safe anywhere)
  // -------------------------
  initClock();
  initBoard();
  initMarvie();

  // -------------------------
  // Detect map id reliably
  // priority: parse URL (works on play/workadventure pages) -> WA API fallback
  // -------------------------
  const mapId = await detectMapId();
  console.log("[Router] Detected mapId:", mapId);

  const isGarden  = mapId.includes("garden");
  const isLibrary = mapId.includes("library");
  const isCanteen = mapId.includes("canteen"); // placeholder for future

  // -------------------------
  // Map-specific inits (Option 1: central routing)
  // -------------------------
  if (isGarden) {
    console.log("[Router] Initializing garden features...");
    // keep these exact calls (you had them in your original file)
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    initOfficeProgress(); // move to other branch later if not a garden feature
  }
  else if (isLibrary) {
    console.log("[Router] Initializing library (phishing) features...");
    initphishing_QRcode();
    initphishing_MurdochEmail();
    initphishing_SMSphishing();
    initPhishingLibraryProgress();
    initPhishingInstructions();
    initPhishingLibrarySpawnNote();
    initPhishingBrock();
  }
  else if (isCanteen) {
    console.log("[Router] Initializing canteen features (none specified).");
    // add canteen-specific init() calls here as you build them
  }
  else {
    console.warn("[Router] Unknown map; only common features started. Add a branch for this map if you want map-specific inits.");
  }
});

/**
 * Return a reliable identifier for the current map (.tmj filename, lowercased).
 * - Primary: parse pathname/hash for *.tmj
 * - Fallback: WA.room.getTiledMap() (some WA versions expose .url or .name)
 */
async function detectMapId(): Promise<string> {
  try {
    // try to pick up the .tmj from the current URL (works reliably on play/workadventure pages)
    const full = decodeURIComponent(location.pathname + location.hash);
    const match = full.match(/\/([^\/?#]+\.tmj)/i);
    if (match && match[1]) return match[1].toLowerCase();
  } catch (e) {
    // ignore and fallback
  }

  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const raw = (tiled?.url ?? tiled?.name ?? "").toString();
    if (raw) return (raw.split("/").pop() || raw).toLowerCase();
  } catch (e) {
    // ignore
  }

  return ""; // unknown
}
