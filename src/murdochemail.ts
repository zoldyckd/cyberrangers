/// <reference types="@workadventure/iframe-api-typings" />

let mailPopupRef: any | undefined;

function closeMailPopup() {
  try { mailPopupRef?.close?.(); } catch {}
  mailPopupRef = undefined;
}

function openMailPopup(id: string, text: string, buttons: {label: string; callback: () => void}[]) {
  closeMailPopup();
  mailPopupRef = WA.ui.openPopup(id, text, buttons);
  return mailPopupRef;
}

/* ----- Branches ----- */
function askEmailQuestion() {
  console.log("[MurdochEmail] askEmailQuestion()");
  openMailPopup(
    "MurdochEmailPopup",
    "📧 Email says: “Your university fees are overdue. Click here to pay immediately.” What do you do?",
    [
      { label: "Click the link and pay", callback: clickedLink },
      { label: "Verify first (don’t click)", callback: verifyFirst },
      { label: "See red flags", callback: showRedFlags },
      { label: "Close", callback: closeMailPopup },
    ]
  );
}

function clickedLink() {
  console.log("[MurdochEmail] clickedLink()");
  openMailPopup(
    "MurdochEmailClicked",
    "⚠️ Risky. Classic **phishing**.\n\nWhat can happen?\n• Fake payment page steals your login or card\n• Malware prompts\n• ‘Update details’ forms that harvest personal info\n\nSafe habit: never pay from email links. Open the official portal yourself.",
    [
      { label: "How to verify safely", callback: verifyFirst },
      { label: "Back", callback: askEmailQuestion },
      { label: "OK", callback: closeMailPopup },
    ]
  );
}

function verifyFirst() {
  console.log("[MurdochEmail] verifyFirst()");
  openMailPopup(
    "MurdochEmailVerify",
    "✅ Correct.\n\nVerify steps:\n• Check the sender domain carefully\n• Hover/long-press to preview real link\n• Type the official portal URL or use your bookmark\n• Check balance inside the portal (not via email link)\n• If unsure, contact the uni via the official helpdesk",
    [
      { label: "See red flags", callback: showRedFlags },
      { label: "Back", callback: askEmailQuestion },
      { label: "Close", callback: closeMailPopup },
    ]
  );
}

function showRedFlags() {
  console.log("[MurdochEmail] showRedFlags()");
  openMailPopup(
    "MurdochEmailFlags",
    "Common red flags:\n• Urgent language / threats (“immediately”, “final notice”)\n• Look-alike sender domains\n• Links that don’t match the uni’s real domain\n• Attachments/QRs to “pay faster”\n• Requests for card/bank info or passwords via email",
    [
      { label: "Verify safely", callback: verifyFirst },
      { label: "Back", callback: askEmailQuestion },
      { label: "Close", callback: closeMailPopup },
    ]
  );
}

/* ----- Init ----- */
export function initMurdochEmail() {
  WA.onInit().then(() => {
    console.log("[MurdochEmail] WA ready. Subscribing to area 'MurdochEmail'.");

    // One-time test popup so you know this script is loaded on this map
    try {
      WA.ui.openPopup("MurdochEmailLoaded", "Email scenario loaded ✔", [
        { label: "OK", callback: () => { try { (WA.ui as any).closePopup?.("MurdochEmailLoaded"); } catch {} } }
      ]);
    } catch (e) {
      console.warn("[MurdochEmail] test popup failed:", e);
    }

    WA.room.area.onEnter("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onEnter fired");
      askEmailQuestion();
    });
    WA.room.area.onLeave("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onLeave fired");
      closeMailPopup();
    });
  });
}
