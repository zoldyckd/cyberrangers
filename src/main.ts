/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

let popup: any;

WA.onInit().then(() => {
  // When player enters the zone, show the SPACE prompt
  WA.room.area.onEnter("DefenderOfMalware").subscribe(() => {
    WA.ui.displayActionMessage({
      message: "Press SPACE to talk to the Defender of Malware",
      callback: () => {
        // Open a popup with buttons (no explicit ButtonDescriptor type needed)
        popup = WA.ui.openPopup("defenderPopup", "Welcome, traveler!", [
          {
            label: "Open website",
            callback: () => {
              WA.nav.openTab("https://example.com");
              WA.ui.closePopup(); // optional
            },
          },
          {
            label: "Close",
            callback: () => WA.ui.closePopup(),
          },
        ]);
      },
    });
  });

  // Clean up when leaving the zone
  WA.room.area.onLeave("DefenderOfMalware").subscribe(() => {
    WA.ui.removeActionMessage();
    if (popup) WA.ui.closePopup();
  });
});
