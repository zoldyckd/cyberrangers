/// <reference types="@workadventure/iframe-api-typings" />

/**
 * qrcode.ts
 *
 * Behavior:
 * - When a player enters the Tiled area named "QRcode" we show a single interactive popup.
 * - Popup asks "Do you scan it?" with Yes / No / More Info options.
 * - Yes -> shows explanation about quishing, examples, and a button to "Go to Phishing room" (developer can point to phishing map).
 * - No  -> shows a short confirmation message and safe tips.
 *
 * Notes:
 * - This script tries to avoid popup stacking by keeping one popup reference and closing it before opening a new one.
 * - If your WorkAdventure API differs slightly, adjust the open/close calls (I've included fallbacks).
 */

let qrPopupRef: any | undefined;

function closeQrPopup() {
  if (!qrPopupRef) return;
  try {
    // Preferred: popupRef may have close()
    if (typeof qrPopupRef.close === "function") {
      qrPopupRef.close();
    } else {
      // Fallback to WA.ui.closePopup if available
      if (typeof (WA as any).ui?.closePopup === "function") {
        (WA as any).ui.closePopup(qrPopupRef);
      }
    }
  } catch (e) {
    // ignore errors closing
  }
  qrPopupRef = undefined;
}

// Helper to open a popup and save the reference
function openQrPopup(id: string, html: string, buttons: any[] = []) {
  closeQrPopup();
  try {
    // Typical signature: WA.ui.openPopup(id, html, buttons)
    qrPopupRef = (WA as any).ui.openPopup(id, html, buttons);
    return qrPopupRef;
  } catch (e) {
    console.error("[qrcode] openPopup failed", e);
    // last resort: try openPopup without buttons
    try {
      qrPopupRef = (WA as any).ui.openPopup(id, html, []);
      return qrPopupRef;
    } catch (e2) {
      console.error("[qrcode] fallback openPopup failed", e2);
    }
  }
  return undefined;
}

// Content helpers produce HTML strings (simple markup)
function initialHtml() {
  return `
    <div style="max-width:350px">
      <h3>QR code on the wall</h3>
      <p>You see a QR code stuck on the wall. Do you scan it?</p>
    </div>
  `;
}

function yesHtml() {
  return `
    <div style="max-width:420px">
      <h3>Quishing (QR Phishing)</h3>
      <p><strong>Yes —</strong> scanning unknown QR codes can be dangerous. This is a known attack called <em>quishing</em> (QR + phishing).</p>

      <p><strong>What can happen</strong>:</p>
      <ul>
        <li>The QR opens a malicious website that asks for credentials.</li>
        <li>It can download malware or invite you to install a fake app.</li>
        <li>It may auto-start actions (e.g., open payment pages) on your device.</li>
      </ul>

      <p><strong>Simple examples</strong>:</p>
      <ol>
        <li>Fake wifi login page that steals your email/password.</li>
        <li>Payment page that asks you to "confirm" a transaction you didn't initiate.</li>
      </ol>

      <p>Always verify QR sources. If unsure, don't scan.</p>
    </div>
  `;
}

function noHtml() {
  return `
    <div style="max-width:350px">
      <h3>Good call</h3>
      <p><strong>No —</strong> you are correct. Scanning unknown QR codes is risky. This phishing vector is commonly called <em>quishing</em>.</p>
      <p>Tip: If a QR code looks official but you still suspect it, type the official URL yourself instead of scanning.</p>
    </div>
  `;
}

function moreInfoHtml() {
  return `
    <div style="max-width:420px">
      <h3>Learn more about quishing</h3>
      <p>Quishing uses QR codes to trick victims into visiting malicious pages. Attackers may:</p>
      <ul>
        <li>Place fake QR stickers above legitimate ones (e.g., restaurant menus).</li>
        <li>Send QR images in messages claiming to be a voucher or gift.</li>
      </ul>
      <p><strong>How to protect yourself:</strong></p>
      <ul>
        <li>Only scan QR codes from trusted sources.</li>
        <li>Use phone preview before opening links (many scanners show the link first).</li>
        <li>Don’t enter credentials unless you confirmed the URL is correct.</li>
      </ul>
    </div>
  `;
}

// Call this in your main import (or export and call from main.ts)
export function initQRCode() {
  WA.onInit().then(() => {
    console.log("[qrcode] scripting API ready");

    // When player enters the 'QRcode' area
    WA.room.area.onEnter("QRcode").subscribe(() => {
      // Build buttons. Typical button object: { label: "Yes", value: "yes" }
      const buttons = [
        { label: "Yes — Scan it", value: "yes" },
        { label: "No — Don't scan", value: "no" },
        { label: "More info", value: "more" }
      ];

      // Open initial popup
      const ref = openQrPopup("QRCodePopup", initialHtml(), buttons);

      // Listen for button clicks on that popup (API varies by WA version).
      // We attempt two possible hooks:
      try {
        // If popupRef has onChoice or onButton or onClose event
        if (ref && typeof ref.onChoice === "function") {
          ref.onChoice((choice: any) => handleChoice(choice));
        } else if ((WA as any).ui && typeof (WA as any).ui.onPopupAnswer === "function") {
          // hypothetical global hook: ui.onPopupAnswer(popupId, handler)
          (WA as any).ui.onPopupAnswer("QRCodePopup", (choice: any) => handleChoice(choice));
        } else {
          // Fallback: some versions return a Promise-like object where .then receives the value.
          if (ref && typeof ref.then === "function") {
            ref.then((val: any) => handleChoice(val));
          }
        }
      } catch (e) {
        console.warn("[qrcode] button hook not found. Buttons may not work depending on WA API version.", e);
      }
    });

    // close popup when leaving the area
    WA.room.area.onLeave("QRcode").subscribe(() => {
      closeQrPopup();
    });
  }).catch((e) => {
    console.error("[qrcode] WA.onInit error", e);
  });

  // handler for choices - centralised so other branches can reuse
  function handleChoice(choice: any) {
    // choice may be an object or string depending on API. Normalize:
    const value = (choice && choice.value) ? choice.value : (typeof choice === "string" ? choice : undefined);

    if (!value) {
      // best-effort: if popup returned the label text
      const raw = String(choice).toLowerCase();
      if (raw.includes("yes")) return showYesBranch();
      if (raw.includes("no")) return showNoBranch();
      if (raw.includes("more")) return showMoreInfo();
      return;
    }

    if (value === "yes") {
      showYesBranch();
    } else if (value === "no") {
      showNoBranch();
    } else if (value === "more") {
      showMoreInfo();
    } else {
      // unknown - close
      closeQrPopup();
    }
  }

  function showYesBranch() {
    // after showing the explanation, provide a button to go to phishing room (developer can change map)
    const buttons = [
      { label: "Go to Phishing room (learn)", value: "goto_phishing" },
      { label: "Back", value: "back_to_q" }
    ];
    openQrPopup("QRCodeYes", yesHtml(), buttons);

    // try hooking result
    try {
      if (qrPopupRef && typeof qrPopupRef.onChoice === "function") {
        qrPopupRef.onChoice((c: any) => {
          const v = (c && c.value) ? c.value : String(c || "").toLowerCase();
          if (v === "goto_phishing") {
            // Example: teleport the player or open a portal. Change the map/anchor string to yours.
            try {
              WA.nav.openUrl("phishing.tmj#spawnName"); // if you want to navigate to a different map
            } catch (e) {
              console.warn("[qrcode] nav openUrl failed - change to your desired behavior", e);
            }
            closeQrPopup();
          } else if (v === "back_to_q" || v === "back") {
            // reopen initial question
            openQrPopup("QRCodePopup", initialHtml(), [
              { label: "Yes — Scan it", value: "yes" },
              { label: "No — Don't scan", value: "no" },
              { label: "More info", value: "more" }
            ]);
          }
        });
      }
    } catch (e) {
      // ignore hook errors
    }
  }

  function showNoBranch() {
    const buttons = [
      { label: "OK", value: "ok" }
    ];
    openQrPopup("QRCodeNo", noHtml(), buttons);
    // clicking OK just closes popup
    try {
      if (qrPopupRef && typeof qrPopupRef.onChoice === "function") {
        qrPopupRef.onChoice(() => closeQrPopup());
      }
    } catch (e) {}
  }

  function showMoreInfo() {
    const buttons = [
      { label: "Back", value: "back" },
      { label: "Close", value: "close" }
    ];
    openQrPopup("QRCodeMore", moreInfoHtml(), buttons);
    try {
      if (qrPopupRef && typeof qrPopupRef.onChoice === "function") {
        qrPopupRef.onChoice((c: any) => {
          const v = (c && c.value) ? c.value : String(c || "").toLowerCase();
          if (v === "back") {
            openQrPopup("QRCodePopup", initialHtml(), [
              { label: "Yes — Scan it", value: "yes" },
              { label: "No — Don't scan", value: "no" },
              { label: "More info", value: "more" }
            ]);
          } else {
            closeQrPopup();
          }
        });
      }
    } catch (e) {}
  }
}
