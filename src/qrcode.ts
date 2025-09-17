/// <reference types="@workadventure/iframe-api-typings" />

let qrPopupRef: any | undefined;

function closeQrPopup() {
  try { qrPopupRef?.close?.(); } catch { /* ignore */ }
  qrPopupRef = undefined;
}

function openQuestion() {
  closeQrPopup();
  const html =
    "<h3>QR code on the wall</h3>" +
    "<p>You see a QR code stuck on the wall. Do you scan it?</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodePopup",
    html,
    [
      { label: "Yes — scan it", callback: showYes },
      { label: "No — don’t scan", callback: showNo },
      { label: "Close", callback: closeQrPopup },
    ]
  );
}

function showYes() {
  closeQrPopup();
  const html =
    "<h3>Quishing (QR phishing)</h3>" +
    "<p><strong>Careful:</strong> scanning unknown QR codes can send you to a fake site to steal your logins, " +
    "trigger malicious downloads, or open payment pages. This technique is called <em>quishing</em>.</p>" +
    "<p><strong>Examples:</strong></p>" +
    "<ul>" +
    "<li>“Campus Wi-Fi” page that actually steals your credentials.</li>" +
    "<li>“Free voucher” QR that asks you to install a malicious app.</li>" +
    "</ul>" +
    "<p><strong>Safer habit:</strong> only scan trusted QRs, preview the URL, or type the official address yourself.</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodeYes",
    html,
    [
      { label: "OK", callback: closeQrPopup },
      { label: "Back", callback: openQuestion },
    ]
  );
}

function showNo() {
  closeQrPopup();
  const html =
    "<h3>Good call</h3>" +
    "<p><strong>Correct.</strong> This kind of phishing via QR codes is called <em>quishing</em>. " +
    "If a code looks suspicious (or was stuck over an existing poster), don’t scan it. Navigate to the site yourself instead.</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodeNo",
    html,
    [
      { label: "OK", callback: closeQrPopup },
      { label: "Back", callback: openQuestion },
    ]
  );
}

export function initQRCode() {
  WA.onInit().then(() => {
    WA.room.area.onEnter("QRcode").subscribe(openQuestion);
    WA.room.area.onLeave("QRcode").subscribe(closeQrPopup);
  });
}
