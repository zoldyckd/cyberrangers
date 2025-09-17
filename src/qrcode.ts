/// <reference types="@workadventure/iframe-api-typings" />

type Btn = { label: string; callback: () => void };

let qrRef: any | undefined;
const safeClose = () => { try { qrRef?.close?.(); } catch {} qrRef = undefined; };

/* ---- Shim: use global openNpcPopup if it exists, otherwise use WA.ui.openPopup ---- */
function shimOpenNpcPopup(text: string, buttons: Btn[]) {
  // close previous so it doesn't stack
  safeClose();
  const mapped = (buttons || []).map((b) => ({
    label: b.label,
    callback: () => { safeClose(); try { b.callback(); } catch {} },
  }));
  qrRef = WA.ui.openPopup("QRcodePopup", text, mapped);
  return qrRef;
}
const openPopupFn: (text: string, buttons: Btn[]) => any =
  typeof (globalThis as any).openNpcPopup === "function"
    ? (text, buttons) => {
        // wrap the project’s helper to keep non-stacking behavior here too
        safeClose();
        qrRef = (globalThis as any).openNpcPopup(text, buttons);
        return qrRef;
      }
    : shimOpenNpcPopup;
/* ------------------------------------------------------------------------------- */

function askQuestion() {
  openPopupFn(
    "You saw a QR code on the wall. Do you scan it?",
    [
      { label: "Yes — scan it",  callback: explainYes },
      { label: "No — don’t scan", callback: explainNo },
      { label: "What is quishing?", callback: moreInfo }
    ]
  );
}

function explainYes() {
  openPopupFn(
    "⚠️ Quishing (QR phishing): Scanning unknown QR codes can send you to fake login pages, trigger malicious downloads, or open payment requests.\n\nExamples:\n• Fake \"Campus Wi-Fi\" login that steals your credentials\n• \"Free voucher\" QR that asks you to install a dodgy app\n\nSafer habit: Only scan trusted QRs, preview the link, or type the official URL yourself.",
    [
      { label: "Back", callback: askQuestion },
      { label: "OK",  callback: safeClose }
    ]
  );
}

function explainNo() {
  openPopupFn(
    "✅ Correct! Avoid scanning random QR codes. This method of phishing is called \"quishing\". If a code looks suspicious or is a sticker placed over a poster, don’t scan it—navigate to the site yourself.",
    [
      { label: "Back", callback: askQuestion },
      { label: "OK",  callback: safeClose }
    ]
  );
}

function moreInfo() {
  openPopupFn(
    "Quishing = QR + phishing. Attackers plant QR codes in public places or messages to lure you to malicious sites.\n\nTips:\n• Preview the URL before opening\n• Check the exact domain (not just the logo)\n• Never enter credentials after scanning an unknown QR",
    [
      { label: "Back",  callback: askQuestion },
      { label: "Close", callback: safeClose }
    ]
  );
}

export function initQRCode() {
  WA.onInit().then(() => {
    console.log("[qrcode] ready, listening for area 'QRcode'");
    WA.room.area.onEnter("QRcode").subscribe(askQuestion);
    WA.room.area.onLeave("QRcode").subscribe(safeClose);
  });
}
