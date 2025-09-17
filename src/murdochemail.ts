/// <reference types="@workadventure/iframe-api-typings" />

/*  murdochemail.ts
    Area name in Tiled:  MurdochEmail  (Class=area)
    Behavior: On enter → show email phishing scenario with Yes/No/Red Flags.
*/

type Btn = { label: string; callback: () => void };

let mailRef: any | undefined;
const safeClose = () => { try { mailRef?.close?.(); } catch {} mailRef = undefined; };

/* ---- Popup shim: use global openNpcPopup if present, else WA.ui.openPopup ---- */
function shimOpenPopup(text: string, buttons: Btn[]) {
  safeClose();
  const mapped = (buttons || []).map((b) => ({
    label: b.label,
    callback: () => { safeClose(); try { b.callback(); } catch {} },
  }));
  mailRef = WA.ui.openPopup("MurdochEmailPopup", text, mapped);
  return mailRef;
}

const openPopup: (text: string, buttons: Btn[]) => any =
  typeof (globalThis as any).openNpcPopup === "function"
    ? (text, buttons) => { safeClose(); mailRef = (globalThis as any).openNpcPopup(text, buttons); return mailRef; }
    : shimOpenPopup;
/* ----------------------------------------------------------------------------- */

function askQuestion() {
  openPopup(
    "📧 You receive an email: “Your university fees are overdue. Click here to pay immediately.” What do you do?",
    [
      { label: "Click the link and pay", callback: clickedLink },
      { label: "Verify first (don’t click)", callback: verifyFirst },
      { label: "See red flags", callback: showRedFlags },
    ]
  );
}

function clickedLink() {
  openPopup(
    "⚠️ Risky move. This is a classic PHISHING tactic.\n\nWhat could happen?\n• Fake payment page steals your credentials or card details\n• Malware/download prompts\n• ‘Update details’ forms that harvest personal info\n\nSafer next time: never pay from an email link. Go to the official portal using your own bookmark or by typing the address.",
    [
      { label: "How to verify safely", callback: verifyFirst },
      { label: "OK", callback: safeClose },
      { label: "Back", callback: askQuestion },
    ]
  );
}

function verifyFirst() {
  openPopup(
    "✅ Correct approach.\n\nQuick verification steps:\n• Check the sender address carefully (look-alike domains are common)\n• Hover/long-press links to preview the real URL\n• Type the official student/fees portal address yourself or use a saved bookmark\n• Check your account balance inside the portal—NOT via the email link\n• If unsure, contact the school via the official helpdesk listed on the website",
    [
      { label: "Show red flags", callback: showRedFlags },
      { label: "Back", callback: askQuestion },
      { label: "Close", callback: safeClose },
    ]
  );
}

function showRedFlags() {
  openPopup(
    "Common red flags in payment-due scams:\n• Urgent language / threats (\"immediately\", \"final notice\")\n• Sender domain that’s slightly off (extra words, misspellings)\n• Links that don’t match the university’s real domain\n• Attachments or QR codes to “pay faster”\n• Requests for card/bank info or passwords via email",
    [
      { label: "Verify safely", callback: verifyFirst },
      { label: "Back", callback: askQuestion },
      { label: "Close", callback: safeClose },
    ]
  );
}

export function initMurdochEmail() {
  WA.onInit().then(() => {
    console.log("[murdochemail] ready, listening for area 'MurdochEmail'");
    WA.room.area.onEnter("MurdochEmail").subscribe(askQuestion);
    WA.room.area.onLeave("MurdochEmail").subscribe(safeClose);
  });
}
