/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";

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

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // ------------------------------------------
  // Common utilities (safe on every map)
  // ------------------------------------------
  initClock();
  initBoard();
  initMarvie();

  // ------------------------------------------
  // Detect which map we are currently on
  // ------------------------------------------
  const mapId = await detectMapId();
  console.log("[Router] Detected mapId:", mapId);

  const isGarden  = mapId.includes("garden");
  const isLibrary = mapId.includes("library");
  const isCanteen = mapId.includes("canteen"); // placeholder for future maps

  // ------------------------------------------
  // GARDEN MAP
  // ------------------------------------------
  if (isGarden) {
    console.log("[Router] Initializing GARDEN features...");
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    initOfficeProgress(); // keep here if garden objects exist
  }

  // ------------------------------------------
  // LIBRARY MAP (Phishing room)
  // ------------------------------------------
  else if (isLibrary) {
    console.log("[Router] Initializing LIBRARY (Phishing) features...");
    initphishing_QRcode();
    initphishing_MurdochEmail();
    initphishing_SMSphishing();
    initPhishingLibraryProgress();
    initPhishingInstructions();
    initPhishingLibrarySpawnNote();
    initPhishingBrock();
  }

  // ------------------------------------------
  // CANTEEN MAP (future)
  // ------------------------------------------
  else if (isCanteen) {
    console.log("[Router] Initializing CANTEEN features...");
    // add future canteen init calls here
  }

  // ------------------------------------------
  // FALLBACK
  // ------------------------------------------
  else {
    console.warn(
      "[Router] Unknown map; only common features started. " +
      "Add a branch for this map in main.ts if you need custom features."
    );
  }
});

/**
 * Return the current map’s filename (e.g., 'garden.tmj') reliably.
 * - First try parsing the browser URL (works for play.workadventu.re/_/ links)
 * - Fallback to WA API (.url or .name from getTiledMap)
 */
async function detectMapId(): Promise<string> {
  try {
    // Primary: parse full URL
    const full = decodeURIComponent(window.location.href);
    console.log("[Router] Full URL:", full);

    const match = full.match(/\/([^\/?#]+\.tmj)/i);
    if (match && match[1]) {
      console.log("[Router] Matched map file:", match[1]);
      return match[1].toLowerCase();
    }
  } catch (e) {
    console.warn("[Router] URL parse failed:", e);
  }

  // Fallback to WA API (depends on WA version)
  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const raw = (tiled?.url ?? tiled?.name ?? "").toString();
    console.log("[Router] WA API map info:", raw);
    if (raw) return (raw.split("/").pop() || raw).toLowerCase();
  } catch (e) {
    console.warn("[Router] WA API fallback failed:", e);
  }

  return "";
}
