/// <reference types="@workadventure/iframe-api-typings" />

// You must have ONE rectangle object in Tiled named exactly "MurdochEmailPopup".
const POPUP_ANCHOR = "MurdochEmailPopup";

let ref: any | undefined;

function show(text: string, buttons: { label: string; callback: () => void }[]) {
  // Close any existing popup so they don't stack behind each other
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(POPUP_ANCHOR, text, buttons);
}

function hide() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
}

/* ---- branches ---- */
function askEmail() {
  console.log("[MurdochEmail] askEmail()");
  show(
    "📧 Email says: \"Your university fees are overdue. Click here to pay immediately.\" What do you do?",
    [
      { label: "Click the link and pay",      callback: showClicked },
      { label: "Verify first (don't click)",  callback: showVerify  },
      { label: "See red flags",               callback: showFlags   },
      { label: "Close",                       callback: hide }
    ]
  );
}

function showClicked() {
  console.log("[MurdochEmail] clicked()");
  show(
    "⚠️ Risky. Classic phishing.\n\nWhat can happen?\n• Fake payment page steals your login or card\n• Malware prompts\n• \"Update details\" forms that harvest personal info\n\nSafer: never pay from email links. Open the official portal yourself.",
    [
      { label: "How to verify safely", callback: showVerify },
      { label: "Back",                 callback: askEmail   },
      { label: "OK",                   callback: hide       }
    ]
  );
}

function showVerify() {
  console.log("[MurdochEmail] verify()");
  show(
    "✅ Correct.\n\nVerify steps:\n• Check the sender domain carefully\n• Preview the real link (hover/long-press)\n• Type the official portal URL or use your bookmark\n• Check balance inside the portal (not via the email link)\n• If unsure, contact the uni via the official helpdesk",
    [
      { label: "See red flags", callback: showFlags },
      { label: "Back",          callback: askEmail  },
      { label: "Close",         callback: hide      }
    ]
  );
}

function showFlags() {
  console.log("[MurdochEmail] flags()");
  show(
    "Common red flags:\n• Urgent language / threats (\"immediately\", \"final notice\")\n• Look-alike sender domains\n• Links that don't match the uni's real domain\n• Attachments/QRs to \"pay faster\"\n• Requests for card/bank info or passwords via email",
    [
      { label: "Verify safely", callback: showVerify },
      { label: "Back",          callback: askEmail   },
      { label: "Close",         callback: hide       }
    ]
  );
}

/* ---- init ---- */
export function initMurdochEmail() {
  WA.onInit().then(() => {
    console.log("[MurdochEmail] ready → listening for area 'MurdochEmail'");
    WA.room.area.onEnter("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onEnter");
      askEmail();
    });
    WA.room.area.onLeave("MurdochEmail").subscribe(() => {
      console.log("[MurdochEmail] onLeave");
      hide();
    });
  });
}
