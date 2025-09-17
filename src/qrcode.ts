/// <reference types="@workadventure/iframe-api-typings" />

let qrPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;

function closeQrPopup() {
  try {
    qrPopupRef?.close?.();
  } catch { /* ignore */ }
  qrPopupRef = undefined;
}

function openQuestion() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodePopup",
    "<h3>QR code on the wall</h3><p>You see a QR code stuck on the wall. Do you scan it?</p>",
    [
      {
        label: "Yes — scan it",
        callback: () => showYesBranch(),
      },
      {
        label: "No — don’t scan",
        callback: () => showNoBranch(),
      },
      {
        label: "More info",
        callback: () => showMoreInfo(),
      },
    ]
  );
}

function showYesBranch() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodeYes",
    `
    <h3>Quishing (QR phishing)</h3>
    <p><strong>Careful!</strong> Scanning unknown QR codes can send you to a fake site to steal your logins,
    trigger malicious downloads, or open payment pages. This attack is called <em>quishing</em>.</p>
    <ul>
      <li>Fake campus "Wi-Fi login" page that captures your Murdoch credentials.</li>
      <li>“Free voucher” QR that installs a malicious APK/profile.</li>
    </ul>
    <p>Verify the source, preview links, and type official URLs yourself.</p>
    `,
    [
      {
        label: "Go to phishing lesson",
        callback: () => {
          // change this to your actual map / anchor if needed
          try {
            WA.nav.openUrl("phishing.tmj#spawn");
          } catch { /* ignore if you just want to keep it local */ }
          closeQrPopup();
        },
      },
      {
        label: "Back",
        callback: () => openQuestion(),
      },
      {
        label: "Close",
        callback: () => closeQrPopup(),
      },
    ]
  );
}

function showNoBranch() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodeNo",
    `
    <h3>Good call</h3>
    <p><strong>Correct.</strong> This method of phishing is known as <em>quishing</em>.
    If a QR looks official but you’re unsure, don’t scan — type the site address manually or use a trusted bookmark.</p>
    `,
    [
      {
        label: "OK",
        callback: () => closeQrPopup(),
      },
      {
        label: "More info",
        callback: () => showMoreInfo(),
      },
    ]
  );
}

function showMoreInfo() {
  closeQrPopup();
  qrPopupRef = WA.ui.openPopup(
    "QRcodeMore",
    `
    <h3>How quishing tricks you</h3>
    <ul>
      <li>Attackers place fake QR stickers over real posters/menus.</li>
      <li>QRs in emails/DMs promise gifts or urgent bill payments.</li>
      <li>Some scanners auto-open links — always preview first.</li>
    </ul>
    <p><strong>Protect yourself:</strong> scan only trusted QRs, preview the URL, check for HTTPS and the exact domain, and never enter credentials from a QR you don’t trust.</p>
    `,
    [
      { label: "Back", callback: () => openQuestion() },
      { label: "Close", callback: () => closeQrPopup() },
    ]
  );
}

export function initQRCode() {
  WA.onInit().then(() => {
    // Enter = ask the question; Leave = close to avoid stacking
    WA.room.area.onEnter("QRcode").subscribe(() => openQuestion());
    WA.room.area.onLeave("QRcode").subscribe(() => closeQrPopup());
  });
}
