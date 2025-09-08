/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

let currentPopup: any | undefined;

WA.onInit().then(async () => {
  console.log("WA ready. Player tags:", WA.player.tags);

  // (Optional) avoid unused import warning
  try { await bootstrapExtra(); } catch {}

  /** ---------- CLOCK (open-on-enter, close-on-leave) ---------- **/
  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    closePopup();
    currentPopup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });
  WA.room.area.onLeave("clock").subscribe(closePopup);

  /** ---------- NPC: AssassinOfIDTheft (same pattern as clock) ---------- **/
  const AREA = "AssassinOfIDTheft";              // your trigger area
  const ANCHOR = "NPCforIDTheft_Dialogue";       // your popup anchor

  WA.room.area.onEnter(AREA).subscribe(() => {
    console.log("[Assassin] onEnter");
    closePopup();
    currentPopup = WA.ui.openPopup(
      ANCHOR,
      "Which of the following is a common sign of identity theft?",
      [
        {
          label: "Unauthorized charges on your card",
          callback: () => {
            closePopup();
            currentPopup = WA.ui.openPopup(
              ANCHOR,
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
              ANCHOR,
              "❌ Not quite. Look for suspicious financial activity.",
              [{ label: "Try again", callback: closePopup }]
            );
          },
        },
      ]
    );
  });

  WA.room.area.onLeave(AREA).subscribe(() => {
    console.log("[Assassin] onLeave");
    closePopup();
  });
}).catch(console.error);

function closePopup() {
  if (currentPopup) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
