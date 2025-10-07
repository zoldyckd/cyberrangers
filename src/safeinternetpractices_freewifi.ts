/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

/** Area: safeinternetpractices_freewifi
 *  Anchor/Popup ID: safeinternetpractices_freewifiPopup
 */
export function initSafeInternetPracticesFreeWifi() {
  WA.onInit().then(() => {
    console.log("[WA] Safe Internet Practices – Free Wi-Fi ready");

    WA.room.area.onEnter("safeinternetpractices_freewifi").subscribe(() => openPopup());
    WA.room.area.onLeave("safeinternetpractices_freewifi").subscribe(() => closePopup());
  });
}

function openPopup() {
  // prevent stacking
  closePopup();

  popupRef = WA.ui.openPopup(
    "safeinternetpractices_freewifiPopup",
    "📶 In the hall, you spot a wall sign offering **Free Wi-Fi**. Nearby, you see open networks like “HallGuest” and “CampusFree”. How would you get online safely? Press SPACE to help!",
    [
      { label: "Got it", className: "primary", callback: () => closePopup() }
    ]
  );
}

function closePopup() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}
