/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initPasswordSecurityUnlockedPC() {
  WA.onInit().then(() => {
    console.log("[WA] Password Security - Unlocked PC scenario ready");

    // Show popup when entering the area
    WA.room.area.onEnter("passwordsecurity_unlockedpc").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("passwordsecurity_unlockedpc").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "passwordsecurity_unlockedpcPopup",
    "💻 You notice an unlocked PC with a teacher’s account signed in — an Excel sheet is open showing login details! What should you do? Press SPACE to help!",
    [
      {
        label: "I'll check!",
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
