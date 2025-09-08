/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(() => {
  console.log("Scripting API ready");

  let popup: any;
  let action: any;

  // When player enters the AssassinOfIDTheft area
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    // Show the SPACE interaction prompt
    action = WA.ui.displayActionMessage({
      message: "Press SPACE to talk to the Assassin of ID Theft",
      callback: () => {
        popup = WA.ui.openPopup("npcPopup", "I guard against ID Theft!", [
          {
            label: "Learn more",
            callback: () => {
              WA.nav.openTab("https://example.com");
              popup.close();
            },
          },
          {
            label: "Close",
            callback: () => popup.close(),
          },
        ]);
      },
    });
  });

  // When player leaves the area
  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
    if (action) {
      action.close(); // closes the action message
      action = undefined;
    }
    if (popup) {
      popup.close(); // closes popup if still open
      popup = undefined;
    }
  });

  // Optional: enable extra API features
  bootstrapExtra().then(() => console.log("Extra API ready"));
});
