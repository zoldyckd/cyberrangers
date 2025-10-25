/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initFinalBossInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss instructions ready");

    // Show popup when entering the instructions area
    WA.room.area.onEnter("finalboss_instructions").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("finalboss_instructions").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  const playerName = WA.player.name || "Cyber Ranger";

  popupRef = WA.ui.openPopup(
    "finalboss_instructionsPopup",
    `🧑‍🏫 Welcome to the Final Challenge, ${playerName}!
Your mission in this room is simple: Find CipherX, defeat him and proceed to the stairs to finish. Good luck! This is where everything you've learned comes together!`,
    [
      {
        label: "Got it!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function closePopup() {
  if (popupRef) {
    try {
      popupRef.close?.();
    } catch {}
    popupRef = undefined;
  }
}
