let boardPopupRef: any | undefined;

export function initBoard() {
  const close = () => {
    if (boardPopupRef) {
      boardPopupRef.close();
      boardPopupRef = undefined;
    }
  };

  WA.room.area.onEnter("board").subscribe(() => {
    close();
    const text =
      "The bulletin board hums with strange energy. Five portals shimmer before you—choose your path: 💜 Malware — malicious code that corrupts, spies, and destroys • 🔵 Phishing/Quishing — fake messages or QR Codes that trick you into giving secrets • 🔴 Identity Theft — criminals using your identity • 🟡 xxxxxxxxxxxx • 💚 Password Security — strong, unique passwords and MFA to protect your accounts.";
    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(close);
}
