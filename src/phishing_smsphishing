/// <reference types="@workadventure/iframe-api-typings" />

let smsPreviewRef: any | undefined;

export function initPhishing_SMSphishing() {
  WA.onInit().then(() => {
    // When entering SMSphishing area
    WA.room.area.onEnter("Phishing_SMSphishing").subscribe(() => {
      // Show popup preview
      try { smsPreviewRef?.close?.(); } catch {}
      smsPreviewRef = WA.ui.openPopup(
        "Phishing_SMSphishingPopup",
        "📱 You received an SMS: “URGENT: Your bank account has been locked. Verify now to avoid service interruption. Click the link to confirm your identity.”\n\nSMS messages like this often try to rush you into action. What would you do? Press Space to help!",
        [
          {
            label: "Got it",
            callback: () => {
              try { smsPreviewRef?.close?.(); } catch {}
            }
          }
        ]
      );
    });

    // When leaving SMSphishing area
    WA.room.area.onLeave("Phishing_SMSphishing").subscribe(() => {
      try { smsPreviewRef?.close?.(); } catch {}
    });
  });
}
