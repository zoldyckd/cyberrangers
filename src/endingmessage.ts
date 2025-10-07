/// <reference types="@workadventure/iframe-api-typings" />

let endPopupRef: any | undefined;

export function initEndingMessage() {
  WA.onInit().then(() => {
    console.log("[WA] Ending message ready");

    WA.room.area.onEnter("endingmessage").subscribe(() => {
      openPopup();
    });

    WA.room.area.onLeave("endingmessage").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  closePopup();

  endPopupRef = WA.ui.openPopup(
    "endingmessagePopup",
    "🏆 Congratulations, Cyber Ranger! You’ve defeated CipherX and restored peace to Murdoch University. Thanks to your actions, students can now browse, click, and share safely once again. Please move to the right towards the stairs and complete the survey. ",
    [{ label: "Finish!", className: "primary", callback: () => closePopup() }]
  );
}

function closePopup() {
  if (endPopupRef) {
    try { endPopupRef.close?.(); } catch {}
    endPopupRef = undefined;
  }
}
