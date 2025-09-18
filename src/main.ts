/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";
import { initQRCode } from "./qrcode";   // 👈 add this
import { initMurdochEmail } from "./murdochemail";   // 👈 add this
import { initBrockZone } from "./BrockZone";   // 👈 add this



console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // register features
  initClock();
  initBoard();
  initMarvie();
  initQRCode();                       // 👈 and call it
  initMurdochEmail();
  initBrockZone();
});
