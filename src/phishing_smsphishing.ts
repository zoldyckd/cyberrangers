/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "phishing_SMSphishing";
const ANCHOR = "phishing_SMSphishingPopup";

export function initphishing_SMSphishing() {
  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "🔗 You received a message: “Your Murdoch account needs verification! Click here: https://tinyurl.com/murdoch-reset. Shortened links can hide where they actually lead. Always check the real destination before clicking! What would you do? Press SPACE to help!",
        [{ label: "Got it", callback: () => closePopup() }]
      );
    });

    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) {
      previewRef.close?.();
      previewRef = undefined; // important!
    }
  } catch {
    previewRef = undefined;
  }
}
