/// <reference types="@workadventure/iframe-api-typings" />

let spawnBound = false;         // hot-reload guard kept at module scope

export function initSpawnIntro() {
  if (spawnBound) return;
  spawnBound = true;

  const AREA_NAME = "spawnIntro";
  const POPUP_ANCHOR = "spawnIntroPopup";

  let ref: any | undefined;

  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA_NAME).subscribe(() => {
      open();
    });
    // no onLeave → only button closes it
  });

  function open() {
    if (ref) return;
    ref = WA.ui.openPopup(
      POPUP_ANCHOR,
      "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them.",
      [
        {
          label: "Got it",
          className: "primary",
          callback: () => close(),
        },
      ]
    );
  }

  function close() {
    try { ref?.close?.(); } catch {}
    ref = undefined;
  }
}
