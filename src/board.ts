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
      "The bulletin board hums with strange energy. Five portals shimmer before you—choose your path: 💜 Malware — malicious code that corrupts, spies, and destroys • 🔵 Phishing — fake messages that trick you into giving secrets • 🔴 Identity Theft — criminals using your identity • 🟡 Quishing — QR codes that lead to hidden traps • 💚 Password Security — strong, unique passwords and MFA to protect your accounts.";
    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(close);
}
