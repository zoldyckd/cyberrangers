/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";

//phishing - library room
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

  // -----------------------
  // SAFE / common features
  // These are map-agnostic utilities that are safe to run everywhere.
  // (keep these always initialized)
  // -----------------------
  initClock();
  initBoard();
  initMarvie();

  // -----------------------
  // Determine which map we're on (exact Tiled `.tmj` filename)
  // -----------------------
  const mapUrl = await WA.room.getTiledMapURL();
  console.log("Loaded map:", mapUrl);

  // Helper booleans for readability
  const isGarden = mapUrl?.includes("garden.tmj");
  const isLibrary = mapUrl?.includes("library.tmj");
  const isCanteen = mapUrl?.includes("canteen.tmj"); // example if you add later
  // add more maps here if needed

  // -----------------------
  // GARDEN (garden.tmj) inits
  // -----------------------
  if (isGarden) {
    console.log("Initializing garden features...");
    initBillboard();
    initSpawnIntro();
    initInstructions();
    initPoster();
    initUsbDrive();
    initStickyNote();
    initSafeInternetPractices();
    // If officeprogress has anchors in garden, keep it; otherwise move to the appropriate map branch.
    initOfficeProgress();
  }

  // -----------------------
  // LIBRARY (library.tmj) inits - phishing related
  // -----------------------
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

  // -----------------------
  // CANTEEN / OTHER maps (example branch you can expand)
  // -----------------------
  else if (isCanteen) {
    console.log("Initializing canteen features...");
    // add inits for canteen here when ready
  }

  // -----------------------
  // FALLBACK: Unknown map — do not initialize map-specific features.
  // -----------------------
  else {
    console.log(
      "Map not matched. Only common features initialized. Add a branch for this map in main.ts to run additional inits."
    );
  }
});
