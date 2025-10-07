/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initSurvey() {
  WA.onInit().then(() => {
    console.log("[WA] Survey area ready");

    // Show popup when entering the area
    WA.room.area.onEnter("survey").subscribe(() => {
      // Check if CipherX is cleared first
      const bossCleared = localStorage.getItem("cr:goals:office");
      if (bossCleared && bossCleared.includes('"finalboss":true')) {
        openPopup();
      } else {
        showBlockedMessage();
      }
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("survey").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "surveyPopup",
    "📝 Final Step: Please proceed to complete the post-game survey to help us improve Cyber Rangers! Press SPACE to begin.",
    [
      {
        label: "Open Survey",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function showBlockedMessage() {
  closePopup();
  popupRef = WA.ui.openPopup(
    "surveyBlockedPopup",
    "🚫 You can’t proceed yet! Defeat CipherX first before you can access the survey.",
    [
      {
        label: "Okay",
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
