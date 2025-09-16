/// <reference types="@workadventure/iframe-api-typings" />

type Portal = {
  area: string;    // Tiled object name (Class = area)
  target: string;  // "map.tmj#spawnName"
  message: string; // On-screen prompt
};

const portals: Portal[] = [
  { area: "to-library",     target: "library.tmj#from-hall",    message: "Press SPACE to enter the Library" },
  { area: "to-hall",        target: "hall.tmj#from-library",    message: "Press SPACE to return to Hall" },
  { area: "to-computerLab", target: "computerlab.tmj#from-hall",message: "Press SPACE to enter the Computer Lab" },
  { area: "to-office",      target: "office.tmj#from-hall",     message: "Press SPACE to enter the Office" },
  { area: "to-canteen",     target: "canteen.tmj#from-hall",    message: "Press SPACE to enter the Canteen" },
  { area: "to-classroom",   target: "classroom.tmj#from-hall",  message: "Press SPACE to enter the Classroom" },
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
