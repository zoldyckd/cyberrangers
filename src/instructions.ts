/// <reference types="@workadventure/iframe-api-typings" />

const AREA = "GardenInstructions";              // area name in garden.tmj
const ANCHOR = "garden_instructions_popup";     // rectangle object in garden.tmj

let ref: any | undefined;

export function initGardenInstructions() {
  WA.onInit().then(() => {
    console.log("[GardenInstructions] ready");

    WA.room.area.onEnter(AREA).subscribe(() => openPopup());
    WA.room.area.onLeave(AREA).subscribe(() => closePopup());
  });
}

function openPopup() {
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(
    ANCHOR,
    "🏫 Cyber Rangers HQ — There are 5 maps to explore and learn cybersecurity: Phishing, Malware, Password Security, Safe Internet Practices, Identity Theft. Check the signage in every map for what to do. When you're ready, head to the ladder beside the billboard to continue!",
    [
      {
        label: "Close",
        className: "primary",
        callback: (popup) => {
          try { popup.close?.(); } catch {}
          closePopup();
        }
      }
    ]
  );
}

function closePopup() {
  if (!ref) return;
  try { ref.close?.(); } catch {}
  ref = undefined;
}
