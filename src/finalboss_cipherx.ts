/// <reference types="@workadventure/iframe-api-typings" />

let bossPopupRef: any | undefined;

export function initFinalBossCipherX() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss CipherX ready");

    WA.room.area.onEnter("finalboss_cipherx").subscribe(() => {
      openPopup();
    });

    WA.room.area.onLeave("finalboss_cipherx").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  closePopup();

  bossPopupRef = WA.ui.openPopup(
    "finalboss_cipherxPopup",
    "👾 *CipherX appears before you.*\n\n“So... you’ve made it through every challenge — phishing, malware, weak passwords, stolen identities. You’ve been a thorn in my plans for far too long!”\n\nPress SPACE to face CipherX in the final showdown quiz!",
    [{ label: "I’m ready!", className: "primary", callback: () => closePopup() }]
  );
}

function closePopup() {
  if (bossPopupRef) {
    try { bossPopupRef.close?.(); } catch {}
    bossPopupRef = undefined;
  }
}
