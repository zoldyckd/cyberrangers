/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

const AREAS = {
  npc: "DefenderofMalware", // exactly as in Tiled
  clock: "clock"            // optional: only if you created this area
};

const LINKS = {
  npcLearnMore: "https://seahyr.github.io/ICT302-Story/"
};

let hintPopup: any;
let talkPopup: any;
let clockPopup: any;

WA.onInit().then(() => {
  console.log("Scripting API ready");

  // --- NPC hint on enter ---
  WA.room.area.onEnter(AREAS.npc).subscribe(() => {
    hintPopup = WA.ui.openPopup("hintDefender", "💬 Press SPACE to talk", []);
  });

  // --- Clean up on leave ---
  WA.room.area.onLeave(AREAS.npc).subscribe(() => {
    if (hintPopup) { hintPopup.close(); hintPopup = undefined; }
    if (talkPopup) { talkPopup.close(); talkPopup = undefined; }
  });

  // --- Talk only when SPACE is pressed in the area ---
  WA.room.area.onInteract(AREAS.npc).subscribe(() => {
    if (hintPopup) { hintPopup.close(); hintPopup = undefined; }

    talkPopup = WA.ui.openPopup(
      "malwarePopup",
      "I’m the Defender of Malware.\nWant to learn how malware works and how to stop it?",
      [
        {
          label: "Learn more",
          c
