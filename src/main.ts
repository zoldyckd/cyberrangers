/// <reference types="@workadventure/iframe-api-typings" />

let popup: any | undefined;

WA.onInit().then(() => {
  console.log("[WA] ready");

  /* ---------- CLOCK (no Close button) ---------- */
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

  /* ---------- NPC (STEP A: sanity-test, unanchored) ---------- */
  // When this works, replace with the anchored block below.
  WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
    console.log("[assassin] enter");
    closePopup();
    popup = WA.ui.openPopup("assassinTest", "HELLO from Assassin zone (test)", []); // simple centered popup
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
