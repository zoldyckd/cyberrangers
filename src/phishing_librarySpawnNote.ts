/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

function closeNote() {
  try { popupRef?.close?.(); } catch {}
  popupRef = undefined;
}

function openNote() {
  if (popupRef) return; // don't stack popups
  popupRef = WA.ui.openPopup(
    "phishing_librarySpawnPopup",   // anchor ID in Tiled
    "📌 Please visit the signboard.",
    [
      {
        label: "OK",
        callback: closeNote
      }
    ]
  );
}

export function initPhishingLibrarySpawnNote() {
  WA.onInit().then(() => {
    // open popup when entering area
    WA.room.area.onEnter("from-garden").subscribe(openNote);

    // close popup when leaving area
    WA.room.area.onLeave("from-garden").subscribe(closeNote);
  });
}
