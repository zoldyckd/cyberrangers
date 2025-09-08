/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let actionHandle: any = undefined;

WA.onInit().then(() => {
  console.log("Scripting API ready");
  console.log("Player tags: ", WA.player.tags);

  /** ---------- CLOCK (unchanged) ---------- **/
  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    currentPopup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });
  WA.room.area.onLeave("clock").subscribe(closePopup);

  /** ----- ASSASSIN OF ID THEFT (anchored popup) ----- **/
  // Area the player steps into:
  const AREA_NAME = "AssassinOfIDTheft";
  // Object in Tiled where the popup should appear:
  const POPUP_ANCHOR_ID = "NPCforIDTheft_Dialogue";

  WA.room.area.onEnter(AREA_NAME).subscribe(() => {
    actionHandle = WA.ui.displayActionMessage({
      message: "Press SPACE to talk to the Assassin of ID Theft",
      callback: () => {
        closePopup(); // ensure only one popup at a time

        currentPopup = WA.ui.openPopup(
          POPUP_ANCHOR_ID, // << anchor popup to the Tiled object with this exact name
          "Which of the following is a common sign of identity theft?",
          [
            {
              label: "Unauthorized charges on your card",
              callback: () => {
                closePopup();
                currentPopup = WA.ui.openPopup(
                  POPUP_ANCHOR_ID,
                  "✅ Correct! Always review your statements.",
                  [{ label: "Close", callback: closePopup }]
                );
              },
            },
            {
              label: "Free pizza delivered to your door",
              callback: () => {
                closePopup();
                currentPopup = WA.ui.openPopup(
                  POPUP_ANCHOR_ID,
                  "❌ Not quite. Look for suspicious financial activity.",
                  [
                    {
                      label: "Try again",
                      callback: () => {
                        closePopup();
                        // reopen the question at the same anchor
                        currentPopup = WA.ui.openPopup(
                          POPUP_ANCHOR_ID,
                          "Which of the following is a common sign of identity theft?",
                          [
                            {
                              label: "Unauthorized charges on your card",
                              callback: () => {
                                closePopup();
                                currentPopup = WA.ui.openPopup(
                                  POPUP_ANCHOR_ID,
                                  "✅ Correct! Always review your statements.",
                                  [{ label: "Close", callback: closePopup }]
                                );
                              },
                            },
                            { label: "Close", callback: closePopup },
                          ]
                        );
                      },
                    },
                    { label: "Close", callback: closePopup },
                  ]
                );
              },
            },
          ]
        );
      },
    });
  });

  WA.room.area.onLeave(AREA_NAME).subscribe(() => {
    actionHandle?.close();
    actionHandle = undefined;
    closePopup();
  });

  bootstrapExtra().then(() => {
    console.log("Scripting API Extra ready");
  }).catch(e => console.error(e));
}).catch(e => console.error(e));

function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
