/// <reference types="@workadventure/iframe-api-typings" />

let brockPopupRef: any | undefined;

export function initBrockZone() {
  const ANCHOR = "BrockZonePopup"; // must match the rectangle object in Tiled

  const close = () => {
    if (brockPopupRef) {
      brockPopupRef.close();
      brockPopupRef = undefined;
    }
  };

  // Debug: confirm this file actually ran
  console.log("[BrockZone] init");

  WA.room.area.onEnter("BrockZone").subscribe(() => {
    console.log("[BrockZone] enter");
    close();
    const text =
      "👋 I’m Brock — the NPC in charge of **Phishing & Quishing** here.\n\n" +
      "Phishing = fake emails/links/messages.\n" +
      "Quishing = phishing through QR codes.\n\n" +
      "Press **SPACE** to open my guide in the side panel.";
    brockPopupRef = WA.ui.openPopup(ANCHOR, text, []);
  });

  WA.room.area.onLeave("BrockZone").subscribe(() => {
    console.log("[BrockZone] leave");
    close();
  });
}
