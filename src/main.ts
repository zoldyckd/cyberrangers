/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

WA.onInit().then(async () => {
  console.log("WA ready");

  // Optional (keeps the “imported but not used” warning away)
  try {
    await bootstrapExtra();
    console.log("Extra API ready");
  } catch (e) {
    console.warn("bootstrapExtra failed (ok to ignore if not needed):", e);
  }

  /** ------------------ CLOCK AREA ------------------ **/
  // Tiled object/area name must be exactly "clock"
  let clockPopup: any | undefined;

  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    clockPopup = WA.ui.openPopup(
      "clockPopup",
      `It's ${hh}:${mm}`,
      [{ label: "Close", callback: () => clockPopup?.close() }]
    );
  });

  WA.room.area.onLeave("clock").subscribe(() => clockPopup?.close());

  /** --------- ASSASSIN OF ID THEFT QUIZ AREA --------- **/
  // Tiled object/area name must be exactly "AssassinOfIDTheft"
  let action: any | undefined;
  let npcPopup: any | undefined;

  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    // Show the "Press SPACE" hint and bind the callback
    action = WA.ui.displayActionMessage({
      message: "Press SPACE to talk to the Assassin of ID Theft",
      callback: () => {
        npcPopup = WA.ui.openPopup(
          "idTheftQuiz",
          "Question: Which is a common sign of identity theft?",
          [
            {
              label: "Unauthorized charges on your card",
              callback: () => {
                npcPopup?.close();
                const ok = WA.ui.openPopup(
                  "correctPopup",
                  "✅ Correct! Check your statements regularly.",
                  [{ label: "Close", callback: () => ok?.close() }]
                );
              },
            },
            {
              label: "Free pizza delivery",
              callback: () => {
                npcPopup?.close();
                const wrong = WA.ui.openPopup(
                  "wrongPopup",
                  "❌ Not quite. Try again!",
                  [{ label: "Back", callback: () => wrong?.close() }]
                );
              },
            },
          ]
        );
      },
    });
  });

  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
    action?.close();     // hides the SPACE hint
    action = undefined;
    npcPopup?.close();   // closes any open popup
    npcPopup = undefined;
  });
});
