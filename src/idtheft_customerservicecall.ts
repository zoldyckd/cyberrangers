/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initIDTheftCustomerServiceCall() {
  WA.onInit().then(() => {
    console.log("[WA] ID Theft - Customer Service Call ready");

    // Show popup when entering the area
    WA.room.area.onEnter("idtheft_customerservicecall").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("idtheft_customerservicecall").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicate popups
  closePopup();

  popupRef = WA.ui.openPopup(
    "idtheft_customerservicecallPopup",
    "📞 You notice a phone lying on the floor and decide to pick it up. As soon as you do, you receive a call — the person on the other end claims to be a bank representative who somehow knows your name and partial account number. Press SPACE to find out what happens next!",
    [
      {
        label: "Got it!",
        className: "primary",
        callback: () => closePopup(),
      },
    ]
  );
}

function closePopup() {
  if (popupRef) {
    try { popupRef.close?.(); } catch {}
    popupRef = undefined;
  }
}
