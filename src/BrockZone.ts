/// <reference types="@workadventure/iframe-api-typings" />

let brockPopup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initBrockZone() {
  console.log("[BrockZone] init (SPACE to talk)");

  const lines = [
    "Psst! I’m Brock, your cyber sidekick! 🕵️‍♂️\n\nFree bubble tea for life? 🍵👀 Tempting.\nA text saying you’ve won a spaceship? 🚀 Even more tempting.\n\nRule #1: If it sounds too good to be true, it probably is!",
    "Heads up! 🎣 Phishers love urgency:\n“Verify in 10 minutes or lose access!”\nBreathe. Hover links. Check the sender. Then decide.",
    "Mini-quiz: Which is safer?\nA) bit.ly/freestuff\nB) Go to the official site yourself.\n(Answer: Always B 😎)"
  ];

  const openDialogue = () => {
    closeDialogue();
    const text = lines[Math.floor(Math.random() * lines.length)];
    brockPopup = WA.ui.openPopup("brockDialogue", text, []);
  };

  const closeDialogue = () => {
    if (brockPopup) {
      brockPopup.close();
      brockPopup = undefined;
    }
  };

  // When player steps into BrockZone, show SPACE prompt
  WA.room.area.onEnter("BrockZone").subscribe(() => {
    WA.ui.displayActionMessage({
      message: "Press SPACE to talk to Brock 🧑‍💻",
      callback: () => {/// <reference types="@workadventure/iframe-api-typings" />

let brockPopup: ReturnType<typeof WA.ui.openPopup> | undefined;

export function initBrockZone() {
  console.log("[BrockZone] init (SPACE to talk)");

  const lines = [
    "Psst! I’m Brock, your cyber sidekick! 🕵️‍♂️\n\nFree bubble tea for life? 🍵👀 Tempting.\nA text saying you’ve won a spaceship? 🚀 Even more tempting.\n\nRule #1: If it sounds too good to be true, it probably is!",
    "Heads up! 🎣 Phishers love urgency:\n“Verify in 10 minutes or lose access!”\nBreathe. Hover links. Check the sender. Then decide.",
    "Mini-quiz: Which is safer?\nA) bit.ly/freestuff\nB) Go to the official site yourself.\n(Answer: Always B 😎)"
  ];

  const showDialogue = () => {
    closeDialogue();
    const text = lines[Math.floor(Math.random() * lines.length)];
    brockPopup = WA.ui.openPopup("brockDialogue", text, []);
  };

  const closeDialogue = () => {
    if (brockPopup) {
      brockPopup.close();
      brockPopup = undefined;
    }
  };

  WA.room.area.onEnter("BrockZone").subscribe(() => {
    WA.ui.displayActionMessage({
      message: "Press SPACE to talk to Brock 🧑‍💻",
      callback: () => {
        console.log("[BrockZone] SPACE pressed → talking");
        showDialogue();
      },
    });
  });

  WA.room.area.onLeave("BrockZone").subscribe(() => {
    WA.ui.removeActionMessage();
    closeDialogue();
  });
}

        console.log("[BrockZone] SPACE pressed → talk");
        openDialogue();
      },
    });
  });

  // Remove prompt + close popup when leaving
  WA.room.area.onLeave("BrockZone").subscribe(() => {
    WA.ui.removeActionMessage();
    closeDialogue();
  });
}
