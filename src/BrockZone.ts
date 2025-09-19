/// <reference types="@workadventure/iframe-api-typings" />

let brockPopupRef: any | undefined;

export function initBrockZone() {
  const close = () => {
    if (brockPopupRef) {
      brockPopupRef.close();
      brockPopupRef = undefined;
    }
  };

  // Auto popup when player enters BrockZone
  WA.room.area.onEnter("BrockZone").subscribe(() => {
    close();
    const text =
      "Brock: Hey there, ranger!\n" +
      "I’ve opened a panel with extra info. Have a look — and come back if you need help.";
    brockPopupRef = WA.ui.openPopup("brockPopup", text, []);
  });

  // Close popup when leaving the zone
  WA.room.area.onLeave("BrockZone").subscribe(close);
}
