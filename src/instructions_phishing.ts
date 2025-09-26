/// <reference types="@workadventure/iframe-api-typings" />

let instructionsPhishingPopupRef: any | undefined;

export function initInstructionsPhishing() {
  WA.onInit().then(() => {
    console.log("[WA] Phishing Instructions ready");

    // Open when entering the spawn area
    WA.room.area.onEnter("from-garden").subscribe(() => {
      openPhishingInstructions();
    });

    // Close as soon as you leave the spawn area
    WA.room.area.onLeave("from-garden").subscribe(() => {
      closePhishingInstructions();
    });

    // If the map loads with the player already inside "from-garden",
    // onEnter might not fire—open once on load as a safety.
    // (If not inside, the close() below is harmless.)
    openPhishingInstructions();
    // Immediately close if we’re not actually in the area after load
    // so there’s no stray popup when spawning elsewhere.
    setTimeout(() => {
      // Walk a step to trigger onEnter next time; this just ensures no duplicate stays.
      closePhishingInstructions();
    }, 1);
  });
}

function openPhishingInstructions() {
  // prevent duplicates
  if (instructionsPhishingPopupRef) {
    instructionsPhishingPopupRef.close();
    instructionsPhishingPopupRef = undefined;
  }

  instructionsPhishingPopupRef = WA.ui.openPopup(
    "instructions_phishingPopup", // popup ID (can be different from area name)
    "🧑‍💻 Welcome to the Phishing Room!\n\nThere are 3 hidden easter eggs in this room — can you find them all?\n\nBefore you leave, talk to the NPC to learn more in-depth about phishing:\n- How attackers trick you\n- How to spot scams\n- Simple steps to stay safe\n\nGood luck and stay curious!",
    [] // no buttons; leaving the area will close it
  );
}

function closePhishingInstructions() {
  if (instructionsPhishingPopupRef) {
    instructionsPhishingPopupRef.close?.();
    instructionsPhishingPopupRef = undefined;
  }
}
