let boardPopupRef: any | undefined;

export function initBoard() {
  WA.room.area.onEnter("board").subscribe(() => {
    if (boardPopupRef) boardPopupRef.close();

    const text = [
      "Choose a portal to learn:",
      "💜 Malware — corrupt / spy / destroy",
      "🔵 Phishing — fake messages steal secrets",
      "🔴 Identity Theft — someone uses your identity",
      "🟡 Quishing — QR-code traps",
      "💚 Passwords — strong & unique, add MFA"
    ].join("\n"); // exactly one \n between lines

    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(() => {
    if (boardPopupRef) {
      boardPopupRef.close();
      boardPopupRef = undefined;
    }
  });
}
