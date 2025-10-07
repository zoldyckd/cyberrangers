/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initSurvey() {
  WA.onInit().then(() => {
    console.log("[WA] Survey area ready");

    // Show hint when entering area (do NOT open yet)
    WA.room.area.onEnter("survey").subscribe(() => {
      WA.ui.displayActionMessage({
        message: "Press SPACE to open the Final Survey",
        callback: () => openPopup(),
      });
    });

    // Open popup only when SPACE is pressed
    WA.room.area.onAction("survey").subscribe(() => {
      openPopup();
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
    "📝 Final Step: Please complete the post-game survey to help us improve Cyber Rangers! Press SPACE in the popup to launch it.",
    [
      {
        label: "Open Survey",
        className: "primary",
        callback: () => {
          // use WA's built-in openWebsite for your survey
          WA.ui.openWebsite({
            url: "https://example.com/your-survey", // 🔗 replace with your survey link
            position: "center",
            size: { width: 80, height: 80 },
          });
          closePopup();
        },
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
