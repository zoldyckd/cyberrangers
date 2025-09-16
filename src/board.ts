let boardPopupRef: any | undefined;

export function initBoard() {
  WA.room.area.onEnter("board").subscribe(() => {
    if (boardPopupRef) boardPopupRef.close();

const text =
  "The bulletin board glows with strange energy.\r\n" +
  "Five portals shimmer before you — choose your path:\r\n\r\n" +
  "💜 Purple — Malware\r\nCorrupts, spies, and destroys systems.\r\n\r\n" +
  "🔵 Blue — Phishing\r\nFake messages trick you into giving secrets.\r\n\r\n" +
  "🔴 Red — Identity Theft\r\nYour name and identity stolen by others.\r\n\r\n" +
  "🟡 Yellow — Quishing\r\nQR codes that lead to hidden traps.\r\n\r\n" +
  "💚 Green — Password Security\r\nWeak keys fall, strong keys protect.\r\n\r\n" +
  "Choose wisely — each portal is a lesson in awareness.";  // 👈 CLOSES HERE

    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(() => {
    if (boardPopupRef) {
      boardPopupRef.close();
      boardPopupRef = undefined;
    }
  });
}
