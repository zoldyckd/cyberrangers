/// <reference types="@workadventure/iframe-api-typings" />

type Portal = {
  area: string;    // Tiled object name (Class = area)
  target: string;  // "map.tmj#spawnName"
  message: string; // On-screen prompt
};

const portals: Portal[] = [
  { area: "to-library",     target: "library.tmj#from-hall",    message: "Press SPACE to enter the Library where the Defender of Malware resides" },
  { area: "to-hall",        target: "hall.tmj#from-library",    message: "Press SPACE to return to the Gathering Hall " },
  { area: "to-computerLab", target: "computerlab.tmj#from-hall",message: "Press SPACE to enter the Computer Lab to learn about Password Security" },
  { area: "to-office",      target: "office.tmj#from-hall",     message: "Press SPACE to enter the Office to uncover the dangers of Identity Theft" },
  { area: "to-canteen",     target: "canteen.tmj#from-hall",    message: "Press SPACE to enter the Canteen and learn how to spot Phishing Scams" },
  { area: "to-classroom",   target: "classroom.tmj#from-hall",  message: "Press SPACE to enter the Classroom to explore the risks of QR Code scams (Quishing)" },
];

function clearActionMessage() {
  const ui: any = WA.ui as any;
  if (ui && typeof ui.removeActionMessage === "function") {
    ui.removeActionMessage();
  } else {
    // Typings require `callback`, so give a no-op.
    WA.ui.displayActionMessage({ message: "", callback: () => {} });
  }
}

WA.onInit().then(() => {
  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      WA.ui.displayActionMessage({
        message,
        callback: () => WA.nav.goToRoom(target),
      });
    });
    WA.room.area.onLeave(area).subscribe(() => {
      clearActionMessage();
    });
  });
});

export {};
