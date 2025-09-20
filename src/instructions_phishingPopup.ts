/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let shownOnce = false;
let watchTimer: any | undefined;
let spawnX = 0;
let spawnY = 0;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Library spawn popup ready");

    // Show when spawning into the library at the from-garden tile
    WA.room.area.onEnter("from-garden").subscribe(() => {
      if (!shownOnce) openPopup();
    });

    // Close when leaving the tiny spawn area (primary path)
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  closePopup(); // safety
  // remember where we opened (pixel coords)
  spawnX = WA.player.position.x;
  spawnY = WA.player.position.y;

  popupRef = WA.ui.openPopup(
    "instructions_phishingPopup",
    "This room has 3 easter eggs. Explore the objects and talk to the NPC for more phishing insights before moving on.",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: (p) => {
          shownOnce = true; // only once per session
          p.close();
          stopWatch();
        },
      },
    ]
  );

  // Secondary path: auto-close once the player moves ~1 tile away
  startWatch();
}

function startWatch() {
  stopWatch();
  watchTimer = setInterval(() => {
    if (!popupRef) return;
    const dx = WA.player.position.x - spawnX;
    const dy = WA.player.position.y - spawnY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 20) {        // ≈ > 1 tile in 16px tilesets; adjust if you use 32px tiles -> use 36~40
      closePopup();
    }
  }, 120);
}

function stopWatch() {
  if (watchTimer) {
    clearInterval(watchTimer);
    watchTimer = undefined;
  }
}

function closePopup() {
  if (popupRef) {
    popupRef.close();
    popupRef = undefined;
  }
  stopWatch();
}
