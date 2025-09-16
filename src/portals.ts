/// <reference types="@workadventure/iframe-api-typings" />

type Portal = {
  area: string;    // Tiled object name (Class = area)
  target: string;  // "map.tmj#spawnName"
  message: string; // On-screen prompt
};

// --- YOUR PORTALS ---
const portals: Portal[] = [
  { area: "to-library",     target: "library.tmj#from-hall",    message: "Press SPACE to enter the Library where the Defender of Malware resides" },
  { area: "to-hall",        target: "hall.tmj#from-library",    message: "Press SPACE to return to the Gathering Hall" },
  { area: "to-computerLab", target: "computerlab.tmj#from-hall",message: "Press SPACE to enter the Computer Lab to learn about Password Security" },
  { area: "to-office",      target: "office.tmj#from-hall",     message: "Press SPACE to enter the Office to uncover Identity Theft" },
  { area: "to-canteen",     target: "canteen.tmj#from-hall",    message: "Press SPACE to enter the Canteen and spot Phishing scams" },
  { area: "to-classroom",   target: "classroom.tmj#from-hall",  message: "Press SPACE to enter the Classroom (Quishing / QR-code scams)" },
];

// --- SAFETY HELPERS ---
let openPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;
function closeAnyPopup() {
  try { openPopupRef?.close(); } catch {}
  openPopupRef = undefined;
}

function clearActionMessage() {
  // typings require a callback
  WA.ui.displayActionMessage({ message: "", callback: () => {} });
}

// If you also use openPopup elsewhere, export a helper they can call:
export function registerExternalPopup(p: ReturnType<typeof WA.ui.openPopup>) {
  // track external popups so portals can close them on enter
  openPopupRef = p;
}

// --- PORTAL WIRING ---
WA.onInit().then(() => {
  let armedArea: string | null = null; // avoid stacking prompts

  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      // prevent overlap with other UI
      closeAnyPopup();
      clearActionMessage();

      armedArea = area;
      WA.ui.displayActionMessage({
        message,
        callback: () => {
          if (armedArea !== area) return; // ignore if player already left
          clearActionMessage();
          // extra safety: close popups before teleport
          closeAnyPopup();
          WA.nav.goToRoom(target);
        },
      });
    });

    WA.room.area.onLeave(area).subscribe(() => {
      if (armedArea === area) armedArea = null;
      clearActionMessage();
    });
  });
});

export {};
