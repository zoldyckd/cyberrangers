let boardPopupRef: any | undefined;

export function initBoard() {
  WA.room.area.onEnter("board").subscribe(() => {
    if (boardPopupRef) boardPopupRef.close();

const text = "The bulletin board glows with strange energy.\nFive portals shimmer before you — choose your path:\n\n" +
"💜 Purple — Malware\nCorrupts, spies, and destroys systems.\n\n" +
"🔵 Blue — Phishing\nFake messages trick you into giving secrets.\n\n" +
"🔴 Red — Identity Theft\nYour name and identity stolen by others.\n\n" +
"🟡 Yellow — Quishing\nQR codes that lead to hidden traps.\n\n" +
"💚 Green — Password Security\nWeak keys fall, strong keys protect.\n\n" +
"Choose wisely, traveler — each portal is a lesson in awareness.";   // 👈 CLOSES HERE

    boardPopupRef = WA.ui.openPopup("boardPopup", text, []);
  });

  WA.room.area.onLeave("board").subscribe(() => {
    if (boardPopupRef) {
      boardPopupRef.close();
      boardPopupRef = undefined;
    }
  });
}
