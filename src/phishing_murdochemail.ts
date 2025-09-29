/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "phishing_MurdochEmail";
const ANCHOR = "phishing_MurdochEmailPopup";

export function initphishing_MurdochEmail() {
  WA.onInit().then(() => {
    // Enter -> open (after closing any stray instance)
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "📧 You received an email: “Your university fees are overdue. Click here to pay immediately.”\n\n⚠️ This looks suspicious... What would you do? Press SPACE to help!",
        [
          {
            label: "Got it",
            callback: () => closePopup(),
          },
        ]
      );
    });

    // Leave -> always close and clear reference
    WA.room.area.onLeave(AREA).subscribe(() => {
      closePopup();
    });
  });
}

function closePopup() {
  try {
    if (previewRef) {
      previewRef.close?.();
      previewRef = undefined; // 🔑 make sure future cycles start clean
    }
  } catch {
    // ignore
    previewRef = undefined;
  }
}
