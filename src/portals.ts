/// <reference types="@workadventure/iframe-api-typings" />

/* ---------- POPUP SAFETY LAYER ---------- */
// Track every popup that gets opened anywhere in your code.
const _openPopups: Array<ReturnType<typeof WA.ui.openPopup>> = [];
const _origOpenPopup = WA.ui.openPopup.bind(WA.ui);

// Monkey-patch openPopup so we can close everything later.
(WA.ui.openPopup as any) = (...args: Parameters<typeof WA.ui.openPopup>) => {
  const p = _origOpenPopup(...args);
  _openPopups.push(p);
  return p;
};

function closeAllPopups() {
  for (const p of _openPopups) {
    try { p.close(); } catch {}
  }
  _openPopups.length = 0;
}

function clearActionMessage() {
  // typings require callback
  WA.ui.displayActionMessage({ message: "", callback: () => {} });
}

/* ---------- PORTALS ---------- */
type Portal = { area: string; target: string; message: string };

const portals: Portal[] = [
  { area: "to-library",     target: "library.tmj#from-hall",    message: "Press SPACE to enter the Library where the Defender of Malware resides" },
  { area: "to-hall",        target: "hall.tmj#from-library",    message: "Press SPACE to return to the Gathering Hall" },
  { area: "to-computerLab", target: "computerlab.tmj#from-hall",message: "Press SPACE to enter the Computer Lab to learn about Password Security" },
  { area: "to-office",      target: "office.tmj#from-hall",     message: "Press SPACE to enter the Office to uncover Identity Theft" },
  { area: "to-canteen",     target: "canteen.tmj#from-hall",    message: "Press SPACE to enter the Canteen and spot Phishing scams" },
  { area: "to-classroom",   target: "classroom.tmj#from-hall",  message: "Press SPACE to enter the Classroom (Quishing / QR-code scams)" },
];

WA.onInit().then(() => {
  let armedArea: string | null = null; // prevent stacking when moving between areas quickly

  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      // Make sure nothing else is showing underneath
      closeAllPopups();
      clearActionMessage();

      armedArea = area;
      WA.ui.displayActionMessage({
        message,
        callback: () => {
          if (armedArea !== area) return; // user already walked out
          clearActionMessage();
          closeAllPopups();
          WA.nav.goToRoom(target);
        },
      });
    });

    WA.room.area.onLeave(area).subscribe(() => {
      if (armedArea === area) armedArea = null;
      clearActionMessage();
      // also close any accidental popups that might have opened at the edge
      closeAllPopups();
    });
  });
});

export {};
