/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let shownOnce = false;
let watchTimer: any | undefined;
let spawnX = 0;
let spawnY = 0;

// Adjust if your tiles are 32x32 (use ~36–40 instead of 20)
const CLOSE_DISTANCE_PX = 36;

export function initPhishingInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Library spawn popup ready");

    WA.room.area.onEnter("from-garden").subscribe(() => {
      if (!shownOnce) openPopup();
    });

    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePopup();
    });
  });
}

async function openPopup() {
  closePopup(); // safety

  // remember where we opened (pixel coords)
  const pos = await WA.player.getPosition();
  spawnX = pos.x;
  spawnY = pos.y;

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

  startWatch();
}

function startWatch() {
  stopWatch();
  watchTimer = setInterval(async () => {
    if (!popupRef) return;
    const pos = await WA.player.getPosition();
    const dx = pos.x - spawnX;
    const dy = pos.y - spawnY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > CLOSE_DISTANCE_PX) {
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
