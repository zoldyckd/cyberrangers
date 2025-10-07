/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

/** Area: safeinternetpractices_fileuploads
 *  Anchor/Popup ID: safeinternetpractices_fileuploadsPopup
 */
export function initSafeInternetPracticesFileUploads() {
  WA.onInit().then(() => {
    console.log("[WA] Safe Internet Practices – File Uploads ready");

    // Show popup when entering the area
    WA.room.area.onEnter("safeinternetpractices_fileuploads").subscribe(() => openPopup());
    WA.room.area.onLeave("safeinternetpractices_fileuploads").subscribe(() => closePopup());
  });
}

function openPopup() {
  // prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "safeinternetpractices_fileuploadsPopup",
    "💬 Hey! Can you help me edit this PDF file? I found some free online tools that lets you upload and edit PDFs easily! What would you do? Press SPACE to help!",
    [
      {
        label: "Let’s see!",
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
