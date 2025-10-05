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

  // -------- Common / safe everywhere --------
  initClock();
  initBoard();
  initMarvie();

  // -------- Figure out which map we're on --------
  const tiled = await WA.room.getTiledMap(); // <-- correct API
  // Some WA versions expose .url, some only .name — grab whichever exists.
  const raw = ((tiled as any)?.url ?? (tiled as any)?.name ?? "").toString();
  const mapId = (raw.split("/").pop() || raw).toLowerCase();
  console.log("Detected map:", mapId, raw);

  const isGarden  = mapId.includes("garden");
  const isLibrary = mapId.includes("library");
  const isCanteen = mapId.includes("canteen"); // placeholder for future

  // -------- Garden (garden.tmj) --------
  if (isGarden) {
    console.log("Initializing garden features...");
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    initOfficeProgress(); // keep here only if its anchors/areas exist in garden
  }
  // -------- Library (library.tmj) --------
  else if (isLibrary) {
    console.log("Initializing library (phishing) features...");
    initphishing_QRcode();
    initphishing_MurdochEmail();
    initphishing_SMSphishing();
    initPhishingLibraryProgress();
    initPhishingInstructions();
    initPhishingLibrarySpawnNote();
    initPhishingBrock();
  }
  // -------- Other maps (extend as needed) --------
  else if (isCanteen) {
    console.log("Initializing canteen features...");
    // add canteen inits here
  } else {
    console.log("Unknown map; only common features initialized.");
  }
});
