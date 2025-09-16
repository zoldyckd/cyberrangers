/// <reference types="@workadventure/iframe-api-typings" />

// SPACE-activated portals
type Portal = {
  area: string;    // Tiled object name (Class = area)
  target: string;  // "map.tmj#spawnName"
  message: string; // On-screen prompt
};

const portals: Portal[] = [
  { area: "to-library",      target: "library.tmj#from-hall",      message: "Press SPACE to enter the Library" },
  // Tip: if this is the return portal from Library -> Hall, consider spawn "from-library"
  { area: "to-hall",         target: "hall.tmj#from-library",      message: "Press SPACE to return to Hall" },

  // Make sure filenames match exactly (case-sensitive on web servers)
  { area: "to-computerLab",  target: "computerlab.tmj#from-hall",  message: "Press SPACE to enter the Computer Lab" },
  { area: "to-office",       target: "office.tmj#from-hall",       message: "Press SPACE to enter the Office" },
  { area: "to-canteen",      target: "canteen.tmj#from-hall",      message: "Press SPACE to enter the Canteen" },
  { area: "to-classroom",    target: "classroom.tmj#from-hall",    message: "Press SPACE to enter the Classroom" },
];

// Helper: safely clear the action message even if typings/runtime differ
function clearActionMessage() {
  const ui: any = WA.ui as any;
  if (ui && typeof ui.removeActionMessage === "function") {
    ui.removeActionMessage();
  } else {
    WA.ui.displayActionMessage({ message: "" });
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

export {}; // keep as a module
