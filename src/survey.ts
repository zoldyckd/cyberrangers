/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initSurvey() {
  WA.onInit().then(() => {
    console.log("[WA] Survey area ready");

    // Show popup when entering the area
    WA.room.area.onEnter("survey").subscribe(() => {
      // gate check: require CipherX cleared first
      if (isCipherXCleared()) {
        openSurveyPopup();
      } else {
        openBlockedPopup();
      }
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("survey").subscribe(() => {
      closePopup();
    });
  });
}

function isCipherXCleared(): boolean {
  // Progress saved by progresschecker under cr:goals:office
  // Ensure your finalboss task key is "finalboss" in finalboss_progress.ts
  try {
    const raw = localStorage.getItem("cr:goals:office");
    if (!raw) return false;
    const goals = JSON.parse(raw);
    return goals["finalboss"] === true;
  } catch {
    return false;
  }
}

function openSurveyPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "surveyPopup",
    "📝 Final Step: Please proceed to complete the post-game survey to help us improve Cyber Rangers! Press SPACE to begin.",
    [
      {
        label: "Open Survey",
        className: "primary",
        callback: () => closePopup(), // you'll handle WA.ui.openWebsite elsewhere
      },
    ]
  );
}

function openBlockedPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "surveyBlockedPopup",
    "🚫 You can’t proceed yet! Defeat CipherX first before accessing the final survey.",
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
