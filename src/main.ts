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

  // Common / safe everywhere
  initClock();
  initBoard();
  initMarvie();

  // --- Robust map detection ---
  const mapId = (await detectMapId()).toLowerCase();
  console.log("[Router] Detected mapId:", mapId);

  const isGarden  = mapId.includes("garden");
  const isLibrary = mapId.includes("library");
  const isCanteen = mapId.includes("canteen"); // extend later

  if (isGarden) {
    console.log("[Router] Init: garden");
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    initOfficeProgress(); // keep only if its anchors/areas exist on garden
  }
  else if (isLibrary) {
    console.log("[Router] Init: library (phishing)");
    initphishing_QRcode();
    initphishing_MurdochEmail();
    initphishing_SMSphishing();
    initPhishingLibraryProgress();
    initPhishingInstructions();
    initPhishingLibrarySpawnNote();
    initPhishingBrock();
  }
  else if (isCanteen) {
    console.log("[Router] Init: canteen");
    // add canteen inits here
  }
  else {
    console.warn("[Router] Unknown map; only common features initialized.");
  }
});

/** Finds the current .tmj file name reliably. */
async function detectMapId(): Promise<string> {
  // 1) Primary: parse it from the WorkAdventure play URL (always present)
  try {
    const full = decodeURIComponent(window.location.pathname + window.location.hash);
    const m = full.match(/\/([^\/?#]+\.tmj)/i);
    if (m && m[1]) return m[1];
  } catch {}

  // 2) Fallback to WA API (varies by WA version)
  try {
    const tiled: any = await WA.room.getTiledMap?.();
    const raw = (tiled?.url ?? tiled?.name ?? "").toString();
    if (raw) return raw.split("/").pop() || raw;
  } catch {}

  return ""; // unknown
}
