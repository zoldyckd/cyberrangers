/// <reference types="@workadventure/iframe-api-typings" />

let popup: any | undefined;

WA.onInit().then(() => {
  // CLOCK — open on enter, close on leave
  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    closePopup();
    popup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });
  WA.room.area.onLeave("clock").subscribe(closePopup);

  // ASSASSIN — anchored to NPCforIDTheft_Dialogue
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    closePopup();
    popup = WA.ui.openPopup(
      "NPCforIDTheft_Dialogue",
      "Which of the following is a common sign of identity theft?",
      [
        {
          label: "Unauthorized charges",
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
          label: "Free pizza delivery",
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
  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(closePopup);
}).catch(console.error);

function closePopup() {
  if (popup) { popup.close(); popup = undefined; }
}
export {};
