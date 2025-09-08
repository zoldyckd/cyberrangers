/// <reference types="@workadventure/iframe-api-typings" />

let popup: any | undefined;

WA.onInit().then(() => {
  console.log("[WA] ready. registering handlers...");

  // ---------- CLOCK ----------
  WA.room.area.onEnter("clock").subscribe(() => {
    console.log("[clock] onEnter");
    closePopup();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    popup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, [
      { label: "Close", callback: closePopup },
    ]);
  });

  WA.room.area.onLeave("clock").subscribe(() => {
    console.log("[clock] onLeave");
    closePopup();
  });

  // ---------- NPC (open-on-enter, anchored like clock) ----------
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] onEnter");
    closePopup();
    popup = WA.ui.openPopup(
      "NPCforIDTheft_Dialogue",
      "Which of the following is a common sign of identity theft?",
      [
        {
          label: "Unauthorized charges on your card",
          callback: () => {
            closePopup();
            popup = WA.ui.openPopup(
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
            popup = WA.ui.openPopup(
              "NPCforIDTheft_Dialogue",
              "❌ Not quite. Look for suspicious financial activity.",
              [{ label: "Try again", callback: closePopup }]
            );
          },
        },
      ]
    );
  });

  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] onLeave");
    closePopup();
  });
}).catch(console.error);

function closePopup() {
  if (popup) {
    popup.close();
    popup = undefined;
  }
}

export {};
