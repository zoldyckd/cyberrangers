/// <reference types="@workadventure/iframe-api-typings" />

// --- Single-popup safety shim ---
// This intercepts WA.ui.openPopup so that any new popup will first close the one already shown.
let __currentPopup: ReturnType<typeof WA.ui.openPopup> | undefined;
const __origOpen = WA.ui.openPopup.bind(WA.ui);

(WA.ui.openPopup as any) = (...args: Parameters<typeof WA.ui.openPopup>) => {
  try { __currentPopup?.close(); } catch {}
  __currentPopup = __origOpen(...args);
  return __currentPopup;
};

// -------------------------------------------------
// rest of your imports and main.ts code
// -------------------------------------------------
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { initClock } from "./clock";
import { initBoard } from "./board";
import { initMarvie } from "./marvie";
import { initQRCode } from "./qrcode";
import { initMurdochEmail } from "./murdochemail";
import { initBrockZone } from "./BrockZone";
import { initBillboard } from "./billboard";
import { initInstructions } from "./instructions";
import { initPhishingInstructions } from "./instructions_phishingPopup";
import { initLibraryProgress } from "./libraryprogress";

console.log("Script started");

WA.onInit().then(async () => {
  console.log("Scripting API ready");
  await bootstrapExtra();

  // register features
  initClock();
  initBoard();
  initMarvie();
  initQRCode();
  initMurdochEmail();
  initBrockZone();
  initBillboard();
  initInstructions();
  initPhishingInstructions();
  initLibraryProgress();
});
