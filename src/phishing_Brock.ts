/// <reference types="@workadventure/iframe-api-typings" />

let brockPopupRef: any | undefined;

export function initPhishingBrock() {
  const ANCHOR = "phishing_BrockPopup"; // must match the popup object in Tiled

  const close = () => {
    if (brockPopupRef) {
      brockPopupRef.close();
      brockPopupRef = undefined;
    }
  };

  // When entering Brock’s area
  WA.room.area.onEnter("phishing_Brock").subscribe(() => {
    close();
    const text =
      "🧑‍🏫 Brock: Hey there! Before you move on, have you checked out all the phishing clues? Make sure you’ve seen the email, QR code, and SMS examples — they’ll help you spot scams in the future!";
    brockPopupRef = WA.ui.openPopup(ANCHOR, text, [
      {
        label: "Got it!",
        callback: () => close(),
      },
    ]);
  });

  // When leaving Brock’s area
  WA.room.area.onLeave("phishing_Brock").subscribe(close);
}
