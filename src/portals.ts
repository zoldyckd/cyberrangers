/// <reference types="@workadventure/iframe-api-typings" />

/* ---------- UTIL ---------- */
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
  // Track whether the player is currently inside any portal area.
  let insidePortal = false;
  let armedArea: string | null = null;
  let lastEnter = 0;
  const ENTER_DEBOUNCE_MS = 200;

  // --- Hard kill-switch: if we are not inside a portal, auto-close any popups that other code opened.
  // Runs very lightly; only acts when needed.
