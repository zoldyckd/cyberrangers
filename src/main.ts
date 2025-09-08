/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;

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

  /** ----- NPC DIALOGUE (clock-style: open on enter, close on leave) ----- **/
  // Enter area named exactly "AssassinOfIDTheft"
  // Anchor popup to object named exactly "NPCforIDTheft_Dialogue"
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    closePopup(); // ensure only one popup at a time
    currentPopup = WA.ui.openPopup(
      "NPCforIDTheft_Dialogue",
      "Which of the following is a common sign of identity theft?",
      [
        {
          label: "Unauthorized charges on your card",
          callback: () => {
            closePopup();
            currentPopup = WA.ui.openPopup(
              "NPCforIDTheft_Dialogue",
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
              "NPCforIDTheft_Dialogue",
              "❌ Not quite. Look for suspicious financial activity.",
              [{ label: "Try again", callback: closePopup }]
            );
          },
        },
      ]
    );
  });

  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(closePopup);

  // Optional
  bootstrapExtra().then(() => {
    console.log("Scripting API Extra ready");
  }).catch(e => console.error(e));
}).catch(e => console.error(e));

function closePopup() {
  if (currentPopup) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
