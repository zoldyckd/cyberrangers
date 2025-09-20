/// <reference types="@workadventure/iframe-api-typings" />

let currentPopup: ReturnType<typeof WA.ui.openPopup> | undefined;

/** Open a popup, ensuring no other popup is on screen. */
export function openPopupOnce(
  id: string,
  text: string,
  buttons: Parameters<typeof WA.ui.openPopup>[2] = []
) {
  closePopup();
  currentPopup = WA.ui.openPopup(id, text, buttons);
  return currentPopup;
}

/** Close the currently open popup (if any). */
export function closePopup() {
  if (currentPopup) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

/** Helper: check if something is open. */
export function hasOpenPopup() {
  return !!currentPopup;
}
