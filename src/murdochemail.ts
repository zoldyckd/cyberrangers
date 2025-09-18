/// <reference types="@workadventure/iframe-api-typings" />

// IMPORTANT: In Tiled you must have ONE rectangle object named "MurdochEmailPopup".
// We reuse that same anchor for all dialog steps.
const POPUP_ANCHOR = "MurdochEmailPopup";

function askEmail() {
  console.log("[MurdochEmail] askEmail()");
  WA.ui.openPopup(
    POPUP_ANCHOR,
    "📧 Email says: \"Your university fees are overdue. Click here to pay immediately.\" What do you do?",
    [
      { label: "Click the link and pay",      callback: showClicked },
      { label: "Verify first (don't click)",  callback: showVerify  },
      { label: "See red flags",               callback: showFlags   },
      { label: "Close",                       callback: () => WA.ui.openPopup(POPUP_ANCHOR, "", []) }
    ]
  );
}

function showClicked() {
  console.log("[MurdochEmail] clicked()");
  WA.ui.openPopup(
    POPUP_ANCHOR,
    "⚠️ Risky. Classic phishing.\n\nWhat can happen?\n• Fake payment page steals your login or card\n• Malware prompts\n• \"Update details\" forms that harvest personal info\n\nSafer: never pay from email links. Open the official portal yourself.",
    [
      { label: "How to verify safely", callback: showVerify },
      { label: "Back",                 callback: askEmail   },
      { label: "OK",                   callback: () => WA.ui.openPopup(POPUP_ANCHOR, "", []) }
    ]
  );
}

function showVerify() {
  console.log("[MurdochEmail] verify()");
  WA.ui.openPopup(
    POPUP_ANCHOR,
    "✅ Correct.\n\nVerify steps:\n• Check the sender domain carefully\n• Preview the real link (hover/long-press)\n• Type the official portal URL or use your bookmark\n• Check balance inside the portal (not via the email link)\n• If unsure, contact the uni via the official helpdesk",
    [
      { label: "See red flags", callback: showFlags },
      { label: "Back",          callback: askEmail  },
      { label: "Close",         callback: () => WA.ui.openPopup(POPUP_ANCHOR, "", []) }
    ]
  );
}

function showFlags() {
  console.log("[MurdochEmail] flags()");
  WA.ui.openPopup(
    POPUP_ANCHOR,
    "Common red flags:\n• Urgent language / threats (\"immediately\", \"final notice\")\n• Look-alike sender domains\n• Links that don't match the uni's real domain\n• Attachments/QRs to \"pay faster\"\n• Requests for card/bank info or passwords via email",
    [
      { label: "Verify safely", callback: showVerify },
      { label: "Back",          callback: askEmail   },
      { label: "Close",         callback: () => WA.ui.openPopup(POPUP_ANCHOR, "", []) }
    ]
  );
}

export function initMurdochEmail() {
  WA.onInit().then(() => {
    console.log("[MurdochEmail] ready → listening for area 'MurdochEmail'");
    WA.room.area.onEnter("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onEnter");
      askEmail();
    });
    WA.room.area.onLeave("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onLeave");
      // hide by replacing with an empty popup on the same anchor
      WA.ui.openPopup(POPUP_ANCHOR, "", []);
    });
  });
}
