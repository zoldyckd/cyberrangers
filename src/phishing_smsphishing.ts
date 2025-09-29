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
        "📱 You received an SMS: “URGENT: Your bank account has been locked. Verify now to avoid service interruption.”\n\n⚠️ Messages like this try to rush you. What would you do? Press SPACE to help!",
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
