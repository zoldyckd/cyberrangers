/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;
let dismissed = false;     // prevent re-open while still in the area
let inside = false;        // track whether we are inside the area
let leaveTimer: any;       // debounce close

export function initInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Instructions ready");

    // Open ONLY when entering the area
    WA.room.area.onEnter("instructions").subscribe(() => {
      console.log("[WA] enter instructions");
      inside = true;
      clearTimeout(leaveTimer);
      if (!dismissed) openInstructions();
    });

    // Close (debounced) when leaving the area
    WA.room.area.onLeave("instructions").subscribe(() => {
      console.log("[WA] leave instructions");
      inside = false;
      clearTimeout(leaveTimer);
      leaveTimer = setTimeout(() => {
        if (!inside) {
          dismissed = false; // allow showing again next time you come back
          closeInstructions();
        }
      }, 150);
    });

    // ⛔ Remove the unconditional open-on-load; it causes “flash & disappear”
    // openInstructions();
  });
}

function openInstructions() {
  // prevent duplicates
  closeInstructions();

  popupRef = WA.ui.openPopup(
    "instructionsPopup",
    "👋 Welcome Ranger! Use the Arrow Keys or WASD to move around. Walk close to objects such as signs, boards, or NPCs to interact with them. Sometimes you will need to press SPACE to open a dialogue or a side panel with more details. Explore the garden and see what you can discover! REMEMBER! Check the signboard for more info.",
    [
      {
        label: "Let's go!",
        className: "primary",
        // Use the popup argument that WA passes to the callback
        callback: (popup) => {
          dismissed = true;
          try { popup.close?.(); } catch {}
          closeInstructions(); // also close our stored ref defensively
        },
      },
    ]
  );
}

function closeInstructions() {
  if (popupRef) {
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
