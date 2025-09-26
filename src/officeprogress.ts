/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

type Goals = {
  poster: boolean;
  usbdrive: boolean;
  stickynote: boolean;
  AmeliaZone: boolean;     // NPC
};

const goals: Goals = {
  poster: false,
  usbdrive: false,
  stickynote: false,
  AmeliaZone: false,
};

// Exit config
const EXIT_AREA_NAMES = ["to-hall", "to-hall-gate"]; // we listen to both, use whichever you have
const NEXT_ROOM = "hall.tmj#from-canteen";           // change if your filename differs

let exitPortal: any | undefined;

export function initOfficeProgress() {
  WA.onInit().then(async () => {
    console.log("[OfficeProgress] init");

    // Scripting extra lets us control portals safely
    try {
      await bootstrapExtra();
      exitPortal = WA.room.getPortal("to-hall");
      if (exitPortal) {
        exitPortal.setTarget(null);
        console.log("[OfficeProgress] Found portal 'to-hall' → locked (target cleared)");
      } else {
        console.log("[OfficeProgress] No portal named 'to-hall' (good, using area gate)");
      }
    } catch (e) {
      console.warn("[OfficeProgress] bootstrapExtra/getPortal not available:", e);
    }

    // --- Easter Eggs ---
    ["poster", "usbdrive", "stickynote"].forEach((egg) => {
      WA.room.area.onEnter(egg).subscribe(() => {
        console.log(`[OfficeProgress] ENTER ${egg}`);
        if (!goals[egg as keyof Goals]) {
          goals[egg as keyof Goals] = true;
          notifyProgress();
        }
      });
      WA.room.area.onLeave(egg).subscribe(() => {
        console.log(`[OfficeProgress] LEAVE ${egg}`);
      });
    });

    // --- NPC (counts towards progress) ---
    WA.room.area.onEnter("AmeliaZone").subscribe(() => {
      console.log("[OfficeProgress] ENTER AmeliaZone");
      if (!goals.AmeliaZone) {
        goals.AmeliaZone = true;
        notifyProgress();
      }
    });
    WA.room.area.onLeave("AmeliaZone").subscribe(() => {
      console.log("[OfficeProgress] LEAVE AmeliaZone");
    });

    // --- Exit gate(s) ---
    EXIT_AREA_NAMES.forEach((name) => {
      WA.room.area.onEnter(name).subscribe(() => {
        console.log(`[OfficeProgress] ENTER ${name} | allDone=${allDone()}`);
        if (allDone()) {
          try { exitPortal?.setTarget(NEXT_ROOM); } catch {}
          WA.nav.goToRoom(NEXT_ROOM);
        } else {
          WA.ui.openPopup(
            "safeinternet_gate_popup",
            `🚧 Hold up!\n\nYou still need to complete:\n• ${missingList().join("\n• ")}\n\nFind all 3 clues and talk to Amelia before leaving.`,
            [{ label: "OK", className: "primary", callback: (p) => p.close() }]
          );
        }
      });
    });

    // Helpful: tell the player their starting status
    notifyProgress();
  });
}

/* ---------- Helpers ---------- */
function allDone(): boolean {
  return goals.poster && goals.usbdrive && goals.stickynote && goals.AmeliaZone;
}

function missingList(): string[] {
  const out: string[] = [];
  if (!goals.poster) out.push("Old Security Poster");
  if (!goals.usbdrive) out.push("USB Drive");
  if (!goals.stickynote) out.push("Sticky Note");
  if (!goals.AmeliaZone) out.push("Talk to Amelia (NPC)");
  return out;
}

function notifyProgress() {
  const status = [
    goals.poster ? "✅ Poster" : "⬜ Poster",
    goals.usbdrive ? "✅ USB" : "⬜ USB",
    goals.stickynote ? "✅ Sticky" : "⬜ Sticky",
    goals.AmeliaZone ? "✅ Amelia" : "⬜ Amelia",
  ].join("   ");

  WA.ui.displayActionMessage({
    message: `Progress: ${status}`,
    callback: () => {},
  });
}
