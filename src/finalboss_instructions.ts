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

  popupRef = WA.ui.openPopup(
    "finalboss_instructionsPopup",
    `
      🧑‍🏫 <b>Professor Byte:</b><br><br>
      "Welcome to the <b>Final Challenge</b>, Cyber Ranger!<br><br>
      Your mission in this room is simple:<br>
      • Find <b>CipherX</b> hidden somewhere in this map.<br>
      • Once you’ve completed the challenge,<br>
      proceed to the <b>stairs</b> to finish your mission.<br><br>
      Good luck — this is where everything you’ve learned comes together!"
    `,
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
