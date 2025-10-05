/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";

//phishing - library room
import { initphishing_QRcode } from "./phishing_qrcode";
import { initphishing_MurdochEmail } from "./phishing_murdochemail";   // 👈 add this
import { initphishing_SMSphishing } from "./phishing_smsphishing";
import { initPhishingLibraryProgress } from "./phishing_libraryprogress";
import { initPhishingInstructions } from "./phishing_instructions";
import { initPhishingLibrarySpawnNote } from "./phishing_librarySpawnNote";
import { initPhishingBrock } from "./phishing_brock";


import { initBillboard } from "./billboard";   // 👈 add this
import { initSpawnIntro } from "./spawnIntro";
import { initInstructions } from "./instructions";   // 👈 add this
import { initPoster } from "./poster";
import { initUsbDrive } from "./usbdrive";
import { initStickyNote } from "./stickynote";
import { initSafeInternetPractices } from "./instructions_safeinternetpractices";
import { initOfficeProgress } from "./officeprogress";



console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // register features
  initClock();
  initBoard();
  initMarvie();
  
  //phishing - library room
  initphishing_QRcode();                       // 👈 and call it
  initphishing_MurdochEmail();
  initphishing_SMSphishing();
  initPhishingLibraryProgress();
  initPhishingInstructions();
  initPhishingLibrarySpawnNote();
  initPhishingBrock();


  initBillboard();
  initSpawnIntro();
  initInstructions();
  initPoster();
  initUsbDrive();
  initStickyNote();
  initSafeInternetPractices();
  initOfficeProgress();
});
