// src/libraryPptOnSpawn.ts
/// <reference types="@workadventure/iframe-api-typings" />

let shown = false;
let ref: any | undefined;

// Replace this with your exact PPT URL (the raw .pptx hosted on GH Pages)
const pptxUrl = "https://zoldyckd.github.io/cyberrangers/websitepopup/Phishing.pptx";
// Office embed viewer URL (uses embed.aspx)
const embedUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(pptxUrl)}`;

function openPPT() {
  if (shown) return;
  shown = true;

  try { ref?.close?.(); } catch {}

  ref = WA.ui.openPopup(
    "LibraryPPTPopup", // <-- must match a rectangle object name in your Tiled map
    "🎬 Intro Slides — a short guide for this room. Open the slides to learn what to do.",
    [
      {
        label: "Open",
        callback: () => {
          WA.ui.website.open({
            url: embedUrl,
		    position: { horizontal: "middle", vertical: "middle" }
            size: { width: "85%", height: "85%" },
            allow: true
          });
        }
      },
      { label: "Close", callback: () => {} }
    ]
  );
}

export function initLibraryPptOnSpawn() {
  WA.onInit().then(() => {
    // trigger when entering the area named "from-garden"
    WA.room.area.onEnter("from-garden").subscribe(openPPT);

    // safety: if player already inside the zone at load, try once after UI ready
    setTimeout(openPPT, 250);
  });
}
