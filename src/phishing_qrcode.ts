/// <reference types="@workadventure/iframe-api-typings" />

let previewRef: any | undefined;

const AREA   = "phishing_QRcode";
const ANCHOR = "phishing_QRcodePopup";

export function initphishing_QRcode() {
  WA.onInit().then(() => {
    WA.room.area.onEnter(AREA).subscribe(() => {
      closePopup();
      previewRef = WA.ui.openPopup(
        ANCHOR,
        "📷 You spot a poster in the library: “Free Wi-Fi for Students – Scan to connect.”\n\nScanning unknown QR codes can lead to fake login pages.\n\nWhat would you do? Press SPACE to help!",
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
