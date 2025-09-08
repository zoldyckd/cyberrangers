/// <reference types="@workadventure/iframe-api-typings" />

let popup: any | undefined;

WA.onInit().then(() => {
  console.log("[WA] ready");

  // CLOCK — open on enter, close on leave
  WA.room.area.onEnter("clock").subscribe(() => {
    console.log("[clock] enter");
    closePopup();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    popup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });
  WA.room.area.onLeave("clock").subscribe(() => {
    console.log("[clock] leave");
    closePopup();
  });

  // ASSASSIN — anchored to NPCforIDTheft_Dialogue, auto-close on leave
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] enter");
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
              []
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
              []
            );
          },
        },
      ]
    );
  });
  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] leave");
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
