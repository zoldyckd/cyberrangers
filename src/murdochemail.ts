/// <reference types="@workadventure/iframe-api-typings" />

let mailPopupRef: any | undefined;
function closeMail() { try { mailPopupRef && mailPopupRef.close && mailPopupRef.close(); } catch {} mailPopupRef = undefined; }
function openMail(id: string, text: string, buttons: { label: string; callback: () => void }[]) {
  closeMail();
  mailPopupRef = WA.ui.openPopup(id, text, buttons);
}

/* ----- branches ----- */
function askEmail() {
  console.log("[MurdochEmail] askEmail()");
  openMail(
    "MurdochEmailPopup",
    "📧 Email says: \"Your university fees are overdue. Click here to pay immediately.\" What do you do?",
    [
      { label: "Click the link and pay",     callback: clickedLink },
      { label: "Verify first (don't click)", callback: verifyFirst },
      { label: "See red flags",              callback: showRedFlags },
      { label: "Close",                      callback: closeMail }
    ]
  );
}

function clickedLink() {
  console.log("[MurdochEmail] clickedLink()");
  openMail(
    "MurdochEmailClicked",
    "⚠️ Risky. Classic phishing.\n\nWhat can happen?\n• Fake payment page steals your login or card\n• Malware prompts\n• \"Update details\" forms that harvest personal info\n\nSafer: never pay from email links. Open the official portal yourself.",
    [
      { label: "How to verify safely", callback: verifyFirst },
      { label: "Back",                 callback: askEmail },
      { label: "OK",                   callback: closeMail }
    ]
  );
}

function verifyFirst() {
  console.log("[MurdochEmail] verifyFirst()");
  openMail(
    "MurdochEmailVerify",
    "✅ Correct.\n\nVerify steps:\n• Check the sender domain carefully\n• Hover/long-press to preview the real link\n• Type the official portal URL or use your bookmark\n• Check balance inside the portal (not via the email link)\n• If unsure, contact the uni via the official helpdesk",
    [
      { label: "See red flags", callback: showRedFlags },
      { label: "Back",          callback: askEmail },
      { label: "Close",         callback: closeMail }
    ]
  );
}

function showRedFlags() {
  console.log("[MurdochEmail] showRedFlags()");
  openMail(
    "MurdochEmailFlags",
    "Common red flags:\n• Urgent language / threats (\"immediately\", \"final notice\")\n• Look-alike sender domains\n• Links that don't match the uni's real domain\n• Attachments/QRs to \"pay faster\"\n• Requests for card/bank info or passwords via email",
    [
      { label: "Verify safely", callback: verifyFirst },
      { label: "Back",          callback: askEmail },
      { label: "Close",         callback: closeMail }
    ]
  );
}

/* ---*
