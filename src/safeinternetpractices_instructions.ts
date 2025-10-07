/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initSafeInternetPracticesInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Safe Internet Practices instructions ready");

    WA.room.area.onEnter("safeinternetpractices_instructions").subscribe(() => openPopup());
    WA.room.area.onLeave("safeinternetpractices_instructions").subscribe(() => closePopup());
  });
}

function openPopup() {
  closePopup();
  popupRef = WA.ui.openPopup(
    "safeinternetpractices_instructionsPopup",
    "🏫 You’ve made it through 3 of the topics, well done! But there’s more we need to learn before we’re truly ready to defeat the malicious actors. Please press SPACE to talk to me before you explore the room!",
    [{ label: "Got it!", className: "primary", callback: () => closePopup() }]
  );
}

function closePopup() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}
