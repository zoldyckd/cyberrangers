/// <reference types="@workadventure/iframe-api-typings" />

let spawnPopupRef: any | undefined;

export function initSpawnIntro() {
  WA.onInit().then(() => {
    // small delay avoids races with other initializers
    setTimeout(openSpawnIntro, 50);
  });
}

function openSpawnIntro() {
  closeSpawnIntro(); // prevent duplicates

  spawnPopupRef = WA.ui.openPopup(
    "spawnIntroPopup",
    "👋 Welcome! Use the Arrow Keys or WASD to move. Explore the map and look for the wooden signage for guidance. Tip: Walk close to objects (signs, boards, NPCs) to interact with them.",
    [
      {
        label: "Got it",
        className: "primary",
        callback: (popup) => {
          try { popup.close?.(); } catch {}
          closeSpawnIntro();
        },
      },
    ]
  );
}

function closeSpawnIntro() {
  if (spawnPopupRef) {
    try { spawnPopupRef.close?.(); } catch {}
    spawnPopupRef = undefined;
  }
}

// make sure there's also a default export so either import style will work:
export default { initSpawnIntro };
