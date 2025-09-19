/// <reference types="@workadventure/iframe-api-typings" />

let brockPopup: any | undefined;

export function initBrockZone() {
  WA.room.area.onEnter("BrockZone").subscribe(() => {
    console.log("[BrockZone] entered");

    // Close previous popup if still open
    closeBrockPopup();

    // Show dialogue popup
    brockPopup = WA.ui.openPopup(
      "brockPopup",
      "Hey there! I’m Brock.\nCheck out the panel on the side for more info.",
      []
    );
  });

  WA.room.area.onLeave("BrockZone").subscribe(() => {
    console.log("[BrockZone] left");
    closeBrockPopup();
  });
}

function closeBrockPopup() {
  if (brockPopup) {
    brockPopup.close();
    brockPopup = undefined;
  }
}
