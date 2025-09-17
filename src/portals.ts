/// <reference types="@workadventure/iframe-api-typings" />

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

function clearActionMessage() {
  WA.ui.displayActionMessage({ message: "", callback: () => {} });
}

WA.onInit().then(() => {
  let armedArea: string | null = null;
  let lastEnter = 0;
  const ENTER_DEBOUNCE_MS = 200;

  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      const now = Date.now();
      if (now - lastEnter < ENTER_DEBOUNCE_MS) return;  // avoid double-fires on overlap
      lastEnter = now;

      armedArea = area;
      WA.ui.displayActionMessage({
        message,
        callback: () => {
          if (armedArea !== area) return;   // walked out already
          clearActionMessage();
          WA.nav.goToRoom(target);
        },
      });
    });

    WA.room.area.onLeave(area).subscribe(() => {
      if (armedArea === area) armedArea = null;
      clearActionMessage();                 // walking away hides the prompt
    });
  });
});

export {};
