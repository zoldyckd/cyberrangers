// src/billboard.ts
let billboardPopupRef: ReturnType<typeof WA.ui.openPopup> | undefined;

function closeBillboardPopup() {
  if (billboardPopupRef) {
    billboardPopupRef.close();
    billboardPopupRef = undefined;
  }
}

export function initBillboard() {
  // 👇 "billboard" must match the Name of your rectangle object in Tiled
  WA.room.area.onEnter("billboard").subscribe(() => {
    closeBillboardPopup();
    billboardPopupRef = WA.ui.openPopup(
      "billboardPopup", // popup id (can be anything, doesn’t need to match Tiled)
      "📜 The community billboard\n\n➡️ Move towards the ladder on the right and begin your adventure!",
      [] // no buttons
    );
  });

  WA.room.area.onLeave("billboard").subscribe(() => {
    closeBillboardPopup();
  });
}
