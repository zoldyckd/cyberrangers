/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    // ------------------
    // Clock zone example
    // ------------------
    WA.room.area.onEnter("clock").subscribe(() => {
      const today = new Date();
      const time = today.getHours() + ":" + today.getMinutes();
      currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave("clock").subscribe(closePopup);

    // ============================
    // Defender of Malware NPC zone
    // ============================
    WA.room.area.onEnter("DefenderOfMalware").subscribe(() => {
      currentPopup = WA.ui.openPopup(
        "npcDialog",
        "Greetings, traveler! I protect this land from dangerous malware.\nDo you wish to learn more?",
        [
          {
            label: "Yes, tell me more",
            callback: (popup) => {
              popup.close();
              currentPopup = WA.ui.openPopup(
                "npcDialog2",
                "Always keep your software updated!\nAnd beware of suspicious emails.",
                [{ label: "Thanks!", callback: (p) => p.close() }]
              );
            },
          },
          {
            label: "Not now",
            callback: (popup) => {
              popup.close();
            },
          },
        ]
      );
    });

    WA.room.area.onLeave("DefenderOfMalware").subscribe(closePopup);

    // Scripting API Extra
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
