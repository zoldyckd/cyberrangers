/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

export function initphishing_QRcode() {
  WA.onInit().then(() => {
    // When entering QRcode area
    WA.room.area.onEnter("phishing_QRcode").subscribe(() => {
      // Show popup preview
      try { previewRef?.close?.(); } catch {}
      previewRef = WA.ui.openPopup(
        "phishing_QRcodePopup",
        "📷 You spot a poster in the library: “Free Wi-Fi for Students – Scan to connect.”\n\nScanning unknown QR codes can lead to fake login pages.\n\nWhat would you do? Press SPACE to help!",
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

    // When leaving QRcode area
    WA.room.area.onLeave("phishing_QRcode").subscribe(() => {
      try { previewRef?.close?.(); } catch {}
    });
  });
}
