let boardPopupRef: any | undefined;

export function initBoard() {
  // Trigger area name in Tiled must be exactly: "board"
  WA.room.area.onEnter("board").subscribe(() => {
    // close existing, if any
    if (boardPopupRef) boardPopupRef.close();

    const text =
`The bulletin board before you hums with strange energy. Five shimmering portals glow across its surface—paths of knowledge disguised as trials. The choice is yours, traveler…

💜 Purple Portal — Malware
“Hidden programs that corrupt, spy, and destroy. Learn how shadows slip into your system.”

🔵 Blue Portal — Phishing
“Impostors mimic voices of trust to lure you into surrendering secrets.”

🔴 Red Portal — Identity Theft
“When your name, your life, your very self is stolen and worn by another.”

🟡 Yellow Portal — Quishing
“QR-code trickery that hides traps behind innocent squares.”

💚 Green Portal — Password Security
“The keys to your digital kingdom. Strong or weak, they decide your fate.”

Choose carefully. Each portal
