/// <reference types="@workadventure/iframe-api-typings" />

let signPopupRef: any | undefined;

export function openInstructionsPopup() {
  closeInstructionsPopup(); // avoid duplicates

  signPopupRef = WA.ui.openPopup(
    "instructionsPopup",
    "🪧 Cyber Rangers HQ\n\nThere are 5 maps to explore and learn cybersecurity:\n• Phishing\n• Malware\n• Password Security\n• Safe Internet Practices\n• Identity Theft\n\nCheck the signage in every map for what to do. When you’re ready, head to the ladder beside the billboard to continue!",
    [
      {
        label: "Let’s go!",
        className: "primary",
        callback: (popup) => {
          try { popup.close?.(); } catch {}
          closeInstructionsPopup();
        },
      },
    ]
  );
}

export function closeInstructionsPopup() {
  if (signPopupRef) {
    try { signPopupRef.close?.(); } catch {}
    signPopupRef = undefined;
  }
}
