/// <reference types="@workadventure/iframe-api-typings" />

type Btn = { label: string; callback: () => void };

let qrRef: any | undefined;
let seq = 0;
const safeClose = () => { try { qrRef?.close?.(); } catch {} qrRef = undefined; };

/* ---- HTML renderer with proportional buttons ---- */
function renderHtml(text: string, buttons: Btn[]) {
  const thisSeq = ++seq;
  const ids = buttons.map((_, i) => `qrbtn-${thisSeq}-${i}`);
  const html = `
  <style>
    .gx-wrap { max-width: 720px; }
    .gx-wrap p { margin: 0 0 12px 0; line-height: 1.35; }
    .gx-btns {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      justify-content: space-between;
    }
    .gx-btns button{
      flex:1 1 30%;
      min-width: 160px;
      padding: 8px 12px;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      white-space: normal;
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

/* ---- Open popup (non-stacking) using our renderer ---- */
function openPopup(text: string, buttons: Btn[]) {
  safeClose();
  const { html, ids } = renderHtml(text, buttons);
  qrRef = WA.ui.openPopup("QRcodePopup", html, []);
  ids.forEach((id, i) => {
    setTimeout(() => {
      document.getElementById(id)?.addEventListener("click", () => {
        safeClose();
        try { buttons[i].callback(); } catch {}
      });
    }, 0);
  });
}

/* ---- branches ---- */
function askQuestion() {
  openPopup(
    "You saw a QR code on the wall. CLAIM YOUR FREE POKEMON PACKS HERE!! Do you scan it?",
    [
      { label: "Yes",                  callback: explainYes },
      { label: "No",                   callback: explainNo },
      { label: "What is quishing?",    callback: moreInfo  },
    ]
  );
}

function explainYes() {
  openPopup(
    "⚠️ Quishing (QR phishing): Scanning unknown QR codes can send you to fake login pages, trigger malicious downloads, or open payment requests.\n\nExamples:\n• Fake \"Campus Wi-Fi\" login that steals your credentials\n• \"Free voucher\" QR that asks you to install a dodgy app.\n\nSafer habit: Only scan trusted QRs, preview the link, or type the official URL yourself.",
    [
      { label: "Back", callback: askQuestion },
      { label: "OK",   callback: safeClose   },
    ]
  );
}

function explainNo() {
  openPopup(
    "✅ Correct! Avoid scanning random QR codes. This method of phishing is called \"quishing\". If a code looks suspicious or is a sticker placed over a poster, don’t scan it—navigate to the site yourself.",
    [
      { label: "Back", callback: askQuestion },
      { label: "OK",   callback: safeClose   },
    ]
  );
}

function moreInfo() {
  openPopup(
    "Quishing = QR + phishing. Attackers plant QR codes in public places or messages to lure you to malicious sites.\n\nTips:\n• Preview the URL before opening\n• Check the exact domain (not just the logo)\n• Never enter credentials after scanning an unknown QR",
    [
      { label: "Back",  callback: askQuestion },
      { label: "Close", callback: safeClose   },
    ]
  );
}

/* ---- init ---- */
export function initQRCode() {
  WA.onInit().then(() => {
    console.log("[qrcode] ready, listening for area 'QRcode'");
    WA.room.area.onEnter("QRcode").subscribe(askQuestion);
    WA.room.area.onLeave("QRcode").subscribe(safeClose);
  });
}
