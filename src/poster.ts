/// <reference types="@workadventure/iframe-api-typings" />

const POPUP_ANCHOR = "posterPopup";
let ref: any | undefined;

function show(text: string) {
  try { ref?.close?.(); } catch {}
  ref = WA.ui.openPopup(POPUP_ANCHOR, text, []);
}

function hide() {
  try { ref?.close?.(); } catch {}
  ref = undefined;
}

export function initPoster() {
  WA.room.area.onEnter("poster").subscribe(() => {
    show(
      "🪧 You notice a faded poster: \"Think Before You Click! Your Cyber Kingdom Depends On It.\"\n\n" +
      "💭 You: (to yourself) 'Think before you click.' That's a good motto.\n\n" +
      "📢 Narrator: Always pause before clicking unknown links. Your vigilance protects your cyber kingdom!"
    );
  });
  WA.room.area.onLeave("poster").subscribe(hide);
}
