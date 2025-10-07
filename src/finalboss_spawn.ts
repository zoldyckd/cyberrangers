/// <reference types="@workadventure/iframe-api-typings" />

let spawnPopupRef: any | undefined;

export function initFinalBossSpawn() {
  WA.onInit().then(() => {
    console.log("[WA] Final Boss spawn ready");

    WA.room.area.onEnter("finalboss_spawnPopup").subscribe(() => {
      openPopup();
    });

    WA.room.area.onLeave("finalboss_spawnPopup").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  closePopup();

  spawnPopupRef = WA.ui.openPopup(
    "finalboss_spawnPopup",
    "🏢 You’ve entered the main office… it feels quiet, too quiet. Something’s off — the source of all the attacks must be here. Move forward carefully.",
    [{ label: "Got it!", className: "primary", callback: () => closePopup() }]
  );
}

function closePopup() {
  if (spawnPopupRef) {
    try { spawnPopupRef.close?.(); } catch {}
    spawnPopupRef = undefined;
  }
}
