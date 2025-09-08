/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

/**
 * CONFIG – match these to your Tiled map.
 */
const AREAS = {
  npc: "DefenderofMalware",   // your NPC rectangle name in Tiled
  clock: "clock"              // your clock area name in Tiled (optional)
};

const LINKS = {
  npcLearnMore: "https://seahyr.github.io/ICT302-Story/"
};

let hintPopup: ReturnType<typeof WA.ui.openPopup> | undefined;
let talkPopup: ReturnType<typeof WA.ui.openPopup> | undefined;
let clockPopup: ReturnType<typeof WA.ui.openPopup> | undefined;

WA.onInit().then(() => {
  console.log("Scripting API ready");
  console.log("Player tags:", WA.player.tags);

  /* -----------------------------
   * NPC: show hint on enter, talk on SPACE
   * ----------------------------- */
  WA.room.area.onEnter(AREAS.npc).subscribe(() => {
    // Small, unobtrusive hint—closes on leave or on interact
    hintPopup = WA.ui.openPopup("hintDefender", "💬 Press SPACE to talk", []);
  });

  WA.room.area.onLeave(AREAS.npc).subscribe(() => {
    if (hintPopup) { hintPopup.close(); hintPopup = undefined; }
    if (talkPopup) { talkPopup.cl
