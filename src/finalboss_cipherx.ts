/// <reference types="@workadventure/iframe-api-typings" />

let bossPopupRef: any | undefined;

export function initFinalBossCipherX() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss CipherX ready");

    // Show hint when entering the area (but do NOT open yet)
    WA.room.area.onEnter("finalboss_cipherx").subscribe(() => {
      WA.ui.displayActionMessage({
        message: "Press SPACE to confront CipherX",
        callback: () => openPopup(),
      });
    });

    // Only open when player presses SPACE inside the area
    WA.room.area.onAction("finalboss_cipherx").subscribe(() => {
      openPopup();
    });

    // Close if player leaves the area
    WA.room.area.onLeave("finalboss_cipherx").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  closePopup();

  bossPopupRef = WA.ui.openPopup(
    "finalboss_cipherxPopup",
    "👾 So... you’ve made it through every challenge — phishing, malware, weak passwords, stolen identities. You’ve been a thorn in my plans for far too long!\n\nPress SPACE in the quiz area to face CipherX in the final showdown!",
    [
      {
        label: "I’m ready!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function closePopup() {
  if (bossPopupRef) {
    try { bossPopupRef.close?.(); } catch {}
    bossPopupRef = undefined;
  }
}
