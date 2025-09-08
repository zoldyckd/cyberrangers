/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

const AREAS = {
  npc: "DefenderofMalware", // your Tiled area name
  clock: "clock",           // your existing clock area
};

const LINKS = {
  npcLearnMore: "https://seahyr.github.io/ICT302-Story/",
};

let currentPopup: any = undefined;   // used by the clock
let hintPopup: any = undefined;      // "Press SPACE to talk"
let talkPopup: any = undefined;      // NPC dialog

// Waiting for the API to be ready
WA.onInit()
  .then(() => {
    console.log("Scripting API ready");
    console.log("Player tags: ", WA.player.tags);

    /* -------- CLOCK AREA -------- */
    WA.room.area.onEnter(AREAS.clock).subscribe(() => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      currentPopup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
    });

    WA.room.area.onLeave(AREAS.clock).subscribe(closeClockPopup);

    /* -------- NPC HINT + INTERACT -------- */
    // show hint when close
    WA.room.area.onEnter(AREAS.npc).subscribe(() => {
      hintPopup = WA.ui.openPopup("hintDefender", "💬 Press SPACE to talk", []);
    });

    // clean up when walking away
    WA.room.area.onLeave(AREAS.npc).subscribe(() => {
      if (hintPopup) {
        hintPopup.close();
        hintPopup = undefined;
      }
      if (talkPopup) {
        talkPopup.close();
        talkPopup = undefined;
      }
    });

    // only open dialog when SPACE is pressed in the area
    WA.room.area.onInteract(AREAS.npc).subscribe(() => {
      if (hintPopup) {
        hintPopup.close();
        hintPopup = undefined;
      }
      talkPopup = WA.ui.openPopup(
        "malwarePopup",
        "I’m the Defender of Malware.\nWant to learn how malware works and how to stop it?",
        [
          {
            label: "Learn more",
            className: "primary",
            callback: () => {
              WA.nav.openTab(LINKS.npcLearnMore);
              if (talkPopup) talkPopup.close();
            },
          },
          {
            label: "Close",
            className: "secondary",
            callback: (p: any) => p.close(),
          },
        ]
      );
    });

    // Bootstraps the Scripting API Extra library
    bootstrapExtra()
      .then(() => {
        console.log("Scripting API Extra ready");
      })
      .catch((e) => console.error(e));
  })
  .catch((e) => console.error(e));

function closeClockPopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

export {};
