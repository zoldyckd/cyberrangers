/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";
import { initphishing_QRcode } from "./phishing_qrcode";   // 👈 add this
import { initphishing_MurdochEmail } from "./phishing_murdochemail";   // 👈 add this
import { initBrockZone } from "./BrockZone";   // 👈 add this
import { initBillboard } from "./billboard";   // 👈 add this
import { initSpawnIntro } from "./spawnIntro";
import { initInstructions } from "./instructions";   // 👈 add this
import { initInstructionsPhishing } from "./instructions_phishing";   // 👈 add this
import { initLibraryProgress } from "./libraryprogress";   // 👈 add this
import { initPoster } from "./poster";
import { initUsbDrive } from "./usbdrive";
import { initStickyNote } from "./stickynote";
import { initSafeInternetPractices } from "./instructions_safeinternetpractices";
import { initOfficeProgress } from "./officeprogress";
import { initLibrarySpawnNote } from "./librarySpawnNote";
import { initphishing_SMSphishing } from "./phishing_smsphishing";




console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // register features
  initClock();
  initBoard();
  initMarvie();
  initphishing_QRcode();                       // 👈 and call it
  initphishing_MurdochEmail();
  initBrockZone();
  initBillboard();
  initSpawnIntro();
  initInstructions();
  initInstructionsPhishing();
  initLibraryProgress();
  initPoster();
  initUsbDrive();
  initStickyNote();
  initSafeInternetPractices();
  initOfficeProgress();
  initLibrarySpawnNote();
  initphishing_SMSphishing();
});
