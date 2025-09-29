/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

/**
 * initphishing_QRcode
 * - Subscribes to onEnter/onLeave for likely area name variants (case differences).
 * - Opens popup anchored at "phishing_QRcodePopup".
 * - Ensures popup is closed on leave and when opening a new one.
 */
export function initphishing_QRcode() {
  WA.onInit().then(() => {
    // List area name variants to tolerate Tiled casing differences.
    // Keep this list short and remove extras once you confirm the exact name in Tiled.
    const areaNames = [
      "phishing_QRcode",
      "phishing_QRCode",
      "Phishing_QRcode",
      "Phishing_QRCode"
    ];

    areaNames.forEach((areaName) => {
      // onEnter -> open popup (close any existing first)
      WA.room.area.onEnter(areaName).subscribe(() => {
        console.log(`[QR] Entered area: ${areaName}`);
        try { previewRef?.close?.(); } catch (e) { console.warn("[QR] close error", e); }

        previewRef = WA.ui.openPopup(
          "phishing_QRcodePopup", // make sure this matches the Tiled popup object name
          "📷 You spot a poster in the library: “Free Wi-Fi for Students – Scan to connect.”\n\nScanning unknown QR codes can lead to fake login pages.\n\nWhat would you do? Press SPACE to help!",
          [
            {
              label: "Got it",
              callback: () => {
                try { previewRef?.close?.(); } catch (e) { console.warn("[QR] close error", e); }
              }
            }
          ]
        );
      });

      // onLeave -> close popup if it exists
      WA.room.area.onLeave(areaName).subscribe(() => {
        console.log(`[QR] Left area: ${areaName}`);
        try {
          if (previewRef) {
            previewRef.close?.();
            previewRef = undefined;
          }
        } catch (e) {
          console.warn("[QR] failed to close popup on leave", e);
          previewRef = undefined;
        }
      });
    });
  });
}
