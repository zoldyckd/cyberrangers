/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initFinalBossCipherX() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss CipherX ready");

    // Show popup when entering the area
    WA.room.area.onEnter("finalboss_cipherx").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("finalboss_cipherx").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "finalboss_cipherxPopup",
    "👾 So... you’ve made it through every challenge — phishing, malware, weak passwords, stolen identities. You’ve been a thorn in my plans for far too long! Press SPACE to face CipherX in the final showdown quiz!",
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
  if (popupRef) {
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
