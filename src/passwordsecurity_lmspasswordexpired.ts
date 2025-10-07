/// <reference types="@workadventure/iframe-api-typings" />

let popupRef: any | undefined;

export function initPasswordSecurityLMSPasswordExpired() {
  WA.onInit().then(() => {
    console.log("[WA] Password Security - LMS Password Expired scenario ready");

    // Show popup when entering the area
    WA.room.area.onEnter("passwordsecurity_lmspasswordexpired").subscribe(() => {
      openPopup();
    });

    // Close popup when leaving the area
    WA.room.area.onLeave("passwordsecurity_lmspasswordexpired").subscribe(() => {
      closePopup();
    });
  });
}

function openPopup() {
  // Prevent duplicates
  closePopup();

  popupRef = WA.ui.openPopup(
    "passwordsecurity_lmspasswordexpiredPopup",
    "🔑 Your LMS password has just expired! The system is asking you to create a new one. How will you choose your new password? Press SPACE to help!",
    [
      {
        label: "Let's find out!",
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
