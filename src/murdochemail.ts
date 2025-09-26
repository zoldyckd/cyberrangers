/// <reference types="@workadventure/iframe-api-typings" />

// One rectangle object in Tiled named exactly "MurdochEmailPopup".
const POPUP_ANCHOR = "MurdochEmailPopup";

type Btn = { label: string; callback: () => void };

let ref: any | undefined;
let btnSeq = 0; // unique ids per popup so listeners bind correctly

function renderHtml(text: string, buttons: Btn[]) {
  const thisSeq = ++btnSeq;
  const ids = buttons.map((_, i) => `gxbtn-${thisSeq}-${i}`);
  const html = `
  <style>
    .gx-wrap { max-width: 720px; }
    .gx-wrap p { margin: 0 0 12px 0; line-height: 1.35; }
    .gx-btns {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 6px;
    }
    .gx-btns button{
      flex:1 1 30%;
      min-width: 160px;
      padding: 8px 12px;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      white-space: normal;      /* allow wrapping */
      text-align: center;
    }
    .gx-btns button:hover{ opacity:.9; }
  </style>
  <div class="gx-wrap">
    <p>${text.replace(/\n/g, "<br/>")}</p>
    <div class="gx-btns">
      ${buttons.map((b, i) => `<button id="${ids[i]}">${b.label}</button>`).join("")}
    </div>
  </div>`;
  return { html, ids };
}

function show(text: string, buttons: Btn[]) {
  // close old so they don’t stack
  try { ref?.close?.(); } catch {}
  const { html, ids } = renderHtml(text, buttons);
  ref = WA.ui.openPopup(POPUP_ANCHOR, html, []); // buttons rendered by us

  // bind clicks
  ids.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id)?.addEventListener("click", () => {
        try { ref?.close?.(); } catch {}
        ref = undefined;
        try { buttons[i].callback(); } catch {}
      });
    }, 0);
  });
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
      { label: "Close",                       callback: hide        },
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
      { label: "OK",                   callback: hide       },
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
      { label: "Close",         callback: hide      },
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
      { label: "Close",         callback: hide       },
    ]
  );
}

/* ---- init ---- */
export function initMurdochEmail() {
  WA.onInit().then(() => {
    console.log("[MurdochEmail] ready → listening for area 'MurdochEmail'");
    WA.room.area.onEnter("MurdochEmail").subscribe(askEmail);
    WA.room.area.onLeave("MurdochEmail").subscribe(hide);
  });
}
