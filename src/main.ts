let action: any | undefined;
let npcPopup: any | undefined;

WA.room.area.onEnter("AssassinOfIDTheft").subscribe(() => {
  // TEMP: open quiz immediately so we know the zone works
  npcPopup = WA.ui.openPopup(
    "idTheftQuiz",
    "Question: Which is a common sign of identity theft?",
    [
      {
        label: "Unauthorized charges",
        callback: () => {
          npcPopup?.close();
          const ok = WA.ui.openPopup(
            "correct",
            "✅ Correct! Check statements regularly.",
            [{ label: "Close", callback: () => ok?.close() }]
          );
        },
      },
      {
        label: "Free pizza delivery",
        callback: () => {
          npcPopup?.close();
          const nope = WA.ui.openPopup(
            "wrong",
            "❌ Not this one. Try again!",
            [{ label: "Back", callback: () => nope?.close() }]
          );
        },
      },
    ]
  );
});

WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
  action?.close();
  action = undefined;
  npcPopup?.close();
  npcPopup = undefined;
});
