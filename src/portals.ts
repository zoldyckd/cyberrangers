/// <reference types="@workadventure/iframe-api-typings" />

/* ---------- POPUP GUARD (only during portal prompts) ---------- */
const _origOpenPopup = WA.ui.openPopup.bind(WA.ui);
let portalArmed: string | null = null;

// If a portal message is active, immediately close any popup that
// some other script tries to open (prevents the “Close” bar).
(WA.ui.openPopup as any) = (...args: Parameters<typeof WA.ui.openPopup>) => {
  const p = _origOpenPopup(...args);
  if (portalArmed) {
    try { p.close(); } catch {}
    return p;
  }
  return p;
};

function clearActionMessage() {
  WA.ui.displayActionMessage({ message: "", callback: () => {} });
}

/* ---------- PORTALS (action message only) ---------- */
type Portal = { area: string; target: string; message: string };

const portals: Portal[] = [
  { area: "to-library",     target: "library.tmj#from-hall",     message: "Press SPACE to enter the Library where the Defender of Malware resides" },
  { area: "to-hall",        target: "hall.tmj#from-library",     message: "Press SPACE to return to the Gathering Hall" },
  { area: "to-computerLab", target: "computerlab.tmj#from-hall", message: "Press SPACE to enter the Computer Lab to learn about Password Security" },
  { area: "to-office",      target: "office.tmj#from-hall",      message: "Press SPACE to enter the Office to uncover Identity Theft" },
  { area: "to-canteen",     target: "canteen.tmj#from-hall",     message: "Press SPACE to enter the Canteen and spot Phishing scams" },
  { area: "to-classroom",   target: "classroom.tmj#from-hall",   message: "Press SPACE to enter the Classroom (Quishing / QR-code scams)" },
];

WA.onInit().then(() => {
  let lastEnter = 0;
  const ENTER_DEBOUNCE_MS = 200;

  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      const now = Date.now();
      if (now - lastEnter < ENTER_DEBOUNCE_MS) return;
      lastEnter = now;

      portalArmed = area;                     // guard ON
      WA.ui.displayActionMessage({
        message,
        callback: () => {
          if (portalArmed !== area) return;   // walked out already
          clearActionMessage();
          portalArmed = null;                 // guard OFF before nav
          WA.nav.goToRoom(target);
        },
      });
    });

    WA.room.area.onLeave(area).subscribe(() => {
      if (portalArmed === area) portalArmed = null; // guard OFF
      clearActionMessage();
    });
  });
});

export {};
