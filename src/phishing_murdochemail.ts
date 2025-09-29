/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

export function initphishing_MurdochEmail() {
  WA.onInit().then(() => {
    // When entering MurdochEmail area
    WA.room.area.onEnter("phishing_MurdochEmail").subscribe(() => {
      // Show popup preview
      try { previewRef?.close?.(); } catch {}
      previewRef = WA.ui.openPopup(
        "phishing_MurdochEmailPopup",   // must match popup object in Tiled
        "📧 You received an email: “Your university fees are overdue. Click here to pay immediately.”\n\n⚠️ This looks suspicious... What would you do? Press SPACE to help!",
        [
          {
            label: "Got it",
            callback: () => {
              try { previewRef?.close?.(); } catch {}
            }
          }
        ]
      );
    });

    // When leaving MurdochEmail area
    WA.room.area.onLeave("phishing_MurdochEmail").subscribe(() => {
      try { previewRef?.close?.(); } catch {}
    });
  });
}
