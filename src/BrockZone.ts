/// <reference types="@workadventure/iframe-api-typings" />

let brockPopup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initBrockZone() {
  console.log("[BrockZone] init");

  const open = () => {
    close();
    brockPopup = WA.ui.openPopup(
      "brockDialogue",
      "Psst! I’m Brock, your cyber sidekick! 🕵️‍♂️\n\n" +
      "People get phished when they rush…\n" +
      "Free bubble tea for life? 🍵👀 Tempting.\n" +
      "A text that you’ve won a spaceship? 🚀 Even more tempting.\n\n" +
      "Rule #1: If it sounds too good to be true, it probably is!",
      []
    );
  };

  const close = () => {
    if (brockPopup) {
      brockPopup.close();
      brockPopup = undefined;
    }
  };

  WA.room.area.onEnter("BrockZone").subscribe(open);
  WA.room.area.onLeave("BrockZone").subscribe(close);
}
