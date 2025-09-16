let boardPopupRef: any | undefined;

export function initBoard() {
  WA.room.area.onEnter("board").subscribe(() => {
    if (boardPopupRef) boardPopupRef.close();

    const text = `<strong>Choose a portal to learn</strong><br/><br/>
💜 <b>Malware</b> — corrupt/spy/destroy<br/>
🔵 <b>Phishing</b> — fake messages steal secrets<br/>
🔴 <b>Identity Theft</b> — someone uses your identity<br/>
🟡 <b>Quishing</b> — QR codes leading to traps<br/>
💚 <b>Password Security</b> — strong & unique, add MFA`;

    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(() => {
    if (boardPopupRef) {
      boardPopupRef.close();
      boardPopupRef = undefined;
    }
  });
}
