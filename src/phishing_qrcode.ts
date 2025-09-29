/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

export function initphishing_QRcode() {
  WA.onInit().then(() => {
    // Enter QR code area
    WA.room.area.onEnter("phishing_QRcode").subscribe(() => {
      try { previewRef?.close?.(); } catch {}
      previewRef = WA.ui.openPopup(
        "phishing_QRcodePopup", // anchor must match the popup object in Tiled
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

    // Leave QR code area
    WA.room.area.onLeave("phishing_QRcode").subscribe(() => {
      try { previewRef?.close?.(); } catch {}
      previewRef = undefined;
    });
  });
}
