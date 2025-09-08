/// <reference types="@workadventure/iframe-api-typings" />

let popup: any | undefined;

WA.onInit().then(() => {
  console.log("[WA] ready");

  /* ---------- CLOCK ---------- */
  WA.room.area.onEnter("clock").subscribe(() => {
    console.log("[clock] enter");
    closePopup();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    popup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []); // no buttons
  });
  WA.room.area.onLeave("clock").subscribe(() => {
    console.log("[clock] leave");
    closePopup();
  });

  /* ---------- ASSASSIN ---------- */
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] enter");
    openNpcPopup(
      "Which of the following is a common sign of identity theft?",
      [
        {
          label: "Unauthorized charges on your card",
          callback: () => {
            openNpcPopup("✅ Correct! Always review your statements.", []);
          },
        },
        {
          label: "Free pizza delivered to your door",
          callback: () => {
            openNpcPopup("❌ Not quite. Look for suspicious financial activity.", []);
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

function openNpcPopup(text: string, buttons: any[]) {
  closePopup();
  try {
    // Try anchored popup first (requires a rectangle named exactly NPCforIDTheft_Dialogue)
    popup = WA.ui.openPopup("NPCforIDTheft_Dialogue", text, buttons);
  } catch (e) {
    console.warn("Anchor not found; opening centered popup instead.", e);
    // Fallback: centered popup so you can keep testing even if the anchor is missing
    popup = WA.ui.openPopup("assassinCentered", text, buttons);
  }
}

function closePopup() {
  if (popup) {
    popup.close();
    popup = undefined;
  }
}

export {};
