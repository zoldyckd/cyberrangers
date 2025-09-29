/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

export function initphishing_MurdochEmail() {
  WA.onInit().then(() => {
    // When entering MurdochEmail area
    WA.room.area.onEnter("MurdochEmail").subscribe(() => {
      // Show popup preview
      try { previewRef?.close?.(); } catch {}
      previewRef = WA.ui.openPopup(
        "phishing_MurdochEmailPopup",
        "📧 You received an email that says: Your university fees are overdue. Click here to pay immediately. This looks suspicious... What would you do? Press Space to help!",
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

