/// <reference types="@workadventure/iframe-api-typings" />

let brockPopupRef: any | undefined;

export function initBrockZone() {
  const ANCHOR = "BrockZonePopup"; // 👈 must match the rectangle object name in Tiled

  const close = () => {
    if (brockPopupRef) {
      brockPopupRef.close();
      brockPopupRef = undefined;
    }
  };

  WA.room.area.onEnter("BrockZone").subscribe(() => {
    close();
    const text =
      "Brock: Hey there! Please don't go! Are you sure you have all things about phishing understood?";
    brockPopupRef = WA.ui.openPopup(ANCHOR, text, []); // 👈 use the anchor
  });

  WA.room.area.onLeave("BrockZone").subscribe(close);
}
