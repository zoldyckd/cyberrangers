/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";
import { initQRCode } from "./qrcode";
import { initMurdochEmail } from "./murdochemail";   // 👈 add this

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  initClock();
  initBoard();
  initMarvie();
  initQRCode();
  initMurdochEmail();                                   // 👈 and call it
  console.log("[main] inits done");
});
