let currentPopup: any | undefined;

export function initClock() {
  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");

    // close old popup if any
    if (currentPopup) currentPopup.close();

    // open new popup
    currentPopup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });

  WA.room.area.onLeave("clock").subscribe(() => {
    if (currentPopup) {
      currentPopup.close();
      currentPopup = undefined;
    }
  });
}
