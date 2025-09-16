/// <reference types="@workadventure/iframe-api-typings" />

// Define your SPACE-activated portals here.
type Portal = {
  area: string;        // Tiled object name (Class=area)
  target: string;      // "map.tmj#spawnName"
  message: string;     // Prompt shown to the player
};

const portals: Portal[] = [
  { area: "to-library", target: "library.tmj#from-hall",   message: "Press SPACE to enter the Library" },
  { area: "to-hall",    target: "hall.tmj#from-hall",   message: "Press SPACE to return to Hall" },
  { area: "to-computerLab",    target: "computerlab.tmj#from-hall",   message: "Press SPACE to enter the Computer Lab" },
  { area: "to-office",    target: "office.tmj#from-hall",   message: "Press SPACE to enter the Office" },
  { area: "to-canteen",    target: "canteen.tmj#from-hall",   message: "Press SPACE to enter the Canteen" },
  { area: "to-classroom",    target: "classroom.tmj#from-hall",   message: "Press SPACE to enter the Classroom" },
  // add more as needed...
];

WA.onInit().then(() => {
  portals.forEach(({ area, target, message }) => {
    WA.room.area.onEnter(area).subscribe(() => {
      WA.ui.displayActionMessage({
        message,
        callback: () => WA.nav.goToRoom(target),
      });
    });
    WA.room.area.onLeave(area).subscribe(() => {
      WA.ui.removeActionMessage();
    });
  });
});

export {}; // keep this as a module
