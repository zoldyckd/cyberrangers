/// <reference types="@workadventure/iframe-api-typings" />

export function initBrockZone() {
  console.log("[BrockZone] init");

  // --- GLOBAL TEST (should show immediately anywhere) ---
  WA.ui.displayActionMessage({
    message: "Press SPACE (global test) → should open a popup",
    callback: () => {
      WA.ui.openPopup("debug", "Global SPACE works ✅", []);
    },
  });

  // --- AREA TEST (only inside BrockZone) ---
  WA.room.area.onEnter("BrockZone").subscribe(() => {
    console.log("[BrockZone] enter");
    WA.ui.displayActionMessage({
      message: "Press SPACE to talk to Brock 🧑‍💻",
      callback: () => {
        WA.ui.openPopup("brockDialogue", "Hello! I’m Brock. 🚀", []);
      },
    });
  });

  WA.room.area.onLeave("BrockZone").subscribe(() => {
    console.log("[BrockZone] leave");
    WA.ui.closeActionMessage();
  });
}
