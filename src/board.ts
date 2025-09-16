let boardPop: any | undefined;

export function initBoard() {
  const close = () => { boardPop?.close(); boardPop = undefined; };

  WA.room.area.onEnter("board").subscribe(() => {
    boardPop?.close();
    boardPop = WA.ui.openPopup("boardPopup",
      "The bulletin board glows with strange energy.\nChoose your path:",
      [
        { label: "💜  Malware — corrupts, spies, destroys", callback: close },
        { label: "🔵  Phishing — fake messages steal secrets", callback: close },
        { label: "🔴  Identity Theft — your name gets stolen", callback: close },
        { label: "🟡  Quishing — QR codes with hidden traps", callback: close },
        { label: "💚  Password Security — weak keys fall", callback: close },
      ]
    );
  });

  WA.room.area.onLeave("board").subscribe(close);
}
