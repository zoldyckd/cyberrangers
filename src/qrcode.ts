/// <reference types="@workadventure/iframe-api-typings" />

// Toggle this to quickly confirm the script is loaded on this map.
const DEBUG_SHOW_LOADED_ONCE = true;

let qrPopupRef: any | undefined;
let shownLoadedFlag = false;

function closeQrPopup() {
  try { qrPopupRef?.close?.(); } catch {}
  qrPopupRef = undefined;
}

function openQuestion() {
  closeQrPopup();
  console.log("[QRcode] openQuestion()");
  const html =
    "<h3>QR code on the wall</h3>" +
    "<p>You see a QR code stuck on the wall. Do you scan it?</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodePopup",
    html,
    [
      { label: "Yes — scan it", callback: showYes },
      { label: "No — don’t scan", callback: showNo },
      { label: "Close", callback: closeQrPopup }
    ]
  );
}

function showYes() {
  closeQrPopup();
  console.log("[QRcode] chose YES");
  const html =
    "<h3>Quishing (QR phishing)</h3>" +
    "<p><strong>Careful:</strong> scanning unknown QR codes can send you to a fake site to steal your logins, " +
    "trigger malicious downloads, or open payment pages. This technique is called <em>quishing</em>.</p>" +
    "<p><strong>Examples:</strong></p>" +
    "<ul>" +
      "<li>\"Campus Wi-Fi\" page that actually steals your credentials.</li>" +
      "<li>\"Free voucher\" QR that asks you to install a malicious app.</li>" +
    "</ul>" +
    "<p><strong>Safer habit:</strong> only scan trusted QRs, preview the URL, or type the official address yourself.</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodeYes",
    html,
    [
      { label: "Back", callback: openQuestion },
      { label: "OK", callback: closeQrPopup }
    ]
  );
}

function showNo() {
  closeQrPopup();
  console.log("[QRcode] chose NO");
  const html =
    "<h3>Good call</h3>" +
    "<p><strong>Correct.</strong> This kind of phishing via QR codes is called <em>quishing</em>. " +
    "If a code looks suspicious (or was stuck over an existing poster), don’t scan it. Navigate to the site yourself instead.</p>";

  qrPopupRef = WA.ui.openPopup(
    "QRcodeNo",
    html,
    [
      { label: "Back", callback: openQuestion },
      { label: "OK", callback: closeQrPopup }
    ]
  );
}

export function initQRCode() {
  WA.onInit().then(() => {
    console.log("[QRcode] WA ready. Subscribing to area 'QRcode'.");

    // Optional one-time "loaded" popup so you instantly know this script is running on this map.
    if (DEBUG_SHOW_LOADED_ONCE && !shownLoadedFlag) {
      shownLoadedFlag = true;
      try {
        WA.ui.openPopup("QRCodeLoaded", "QR script loaded ✔", [
          { label: "OK", callback: () => { try { WA.ui.closePopup("QRCodeLoaded"); } catch {} } }
        ]);
      } catch (e) {
        console.warn("[QRcode] test popup failed:", e);
      }
    }

    // Trigger on enter / close on leave
    WA.room.area.onEnter("QRcode").subscribe(() => {
      console.log("[QRcode] onEnter fired");
      openQuestion();
    });
    WA.room.area.onLeave("QRcode").subscribe(() => {
      console.log("[QRcode] onLeave fired");
      closeQrPopup();
    });
  });
}
