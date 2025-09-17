/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";   // 👈 import board feature

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // register features
  initClock();
  initBoard();   // 👈 call board feature
});
