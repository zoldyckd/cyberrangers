/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initInstructions() {
  WA.onInit().then(() => {
    console.log("[WA] Garden intro ready");

    // Open once as soon as this map loads
    // Small delay avoids race with other initializers
    setTimeout(openIntro, 50);

    // Optional: if your code navigates with WA.nav.goToRoom(), you can
    // defensively close before leaving the map:
    WA.ui.onChatMessage?.((msg) => {}); // no-op: keeps WA types happy in some setups
    // (You can also call closeIntro() right before any goToRoom in your code.)
  });
}

function openIntro() {
  closeIntro(); // prevent duplicates

  popupRef = WA.ui.openPopup(
    "instructionsPopup",
    "👋 Welcome Ranger! Use the Arrow Keys or WASD to move around. Walk close to objects such as signs, boards, or NPCs to interact with them. Sometimes you will need to press SPACE to open a dialogue or a side panel with more details. Explore the garden and see what you can discover! REMEMBER! Check the signboard for more info.",
    [
      {
        label: "Let's go!",
        className: "primary",
        callback: (popup) => {
          try { popup.close?.(); } catch {}
          closeIntro();
        },
      },
    ]
  );
}

function closeIntro() {
  if (popupRef) {
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
