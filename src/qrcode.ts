/// <reference types="@workadventure/iframe-api-typings" />

let qrPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;

function closeQrPopup() {
  try { qrPopupRef?.close?.(); } catch {}
  qrPopupRef = undefined;
}

function openQuestion() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodePopup",
    "<h3>QR code on the wall</h3><p>You see a QR code stuck on the wall. Do you scan it?</p>",
    [
      { label: "Yes — scan it", callback: showYes },
      { label: "No — don’t scan", callback: showNo },
      { label: "Close", callback: closeQrPopup },
    ]
  );
}

function showYes() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodeYes",
    `
    <h3>Quishing (QR phishing)</h3>
    <p><strong>Careful:</strong> scanning unknown QR codes can send you to a fake site to steal your logins,
    trigger malicious downloads, or open payment pages. This technique is called <em>quishing</em>.</p>
    <p><strong>Examples:</strong></p>
    <ul>
      <li>“Campus Wi-Fi” page that actually steals your credentials.</li>
      <li>“Free voucher” QR that asks you to install a malicious app.</li>
    </ul>
    <p><strong>Safer habit:</strong> only scan trusted QRs, preview the URL, or type the official address yourself.</p>
    `,
    [
      { label: "OK", callback: closeQrPopup },
      { label: "Back", callback: openQuestion },
    ]
  );
}

function showNo() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodeNo",
    `
    <h3>Good cal
