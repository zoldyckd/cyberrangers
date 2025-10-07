/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initPasswordSecurityLMSAccount() {
  WA.onInit().then(() => {
    console.log("[WA] Password Security - LMS Account scenario ready");

    // Show popup when entering the area
    WA.room.area.onEnter("passwordsecurity_lmsaccount").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("passwordsecurity_lmsaccount").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "passwordsecurity_lmsaccountPopup",
    "👩‍💻 Your classmate Joyce says she forgot her LMS login and asks to borrow your account to check the quiz questions. What would you do? Press SPACE to help!",
    [
      {
        label: "Let's decide!",
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
