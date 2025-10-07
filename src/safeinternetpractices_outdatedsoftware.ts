/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

/** Area: safeinternetpractices_outdatedsoftware
 *  Anchor/Popup ID: safeinternetpractices_outdatedsoftwarePopup
 */
export function initSafeInternetPracticesOutdatedSoftware() {
  WA.onInit().then(() => {
    console.log("[WA] Safe Internet Practices – Outdated Software ready");

    // Show popup when entering the area
    WA.room.area.onEnter("safeinternetpractices_outdatedsoftware").subscribe(() => openPopup());
    WA.room.area.onLeave("safeinternetpractices_outdatedsoftware").subscribe(() => closePopup());
  });
}

function openPopup() {
  // Prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "safeinternetpractices_outdatedsoftwarePopup",
    "🧑‍💻 You saw a laptop on the floor, you picked it up and open your browser to check your bank account, but a message appears saying your browser needs an update. What will you do? Press SPACE to help!",
    [
      {
        label: "Let’s decide!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function closePopup() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}
