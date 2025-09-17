/// <reference types="@workadventure/iframe-api-typings" />

let marviePopupRef: any | undefined;

function closeMarviePopup() {
  if (marviePopupRef) {
    try { marviePopupRef.close?.(); } catch {}
    marviePopupRef = undefined;
  }
}

function getMessageForZone(): string {
  try {
    const obj = (WA.room as any).object?.get?.("MarvieZone");
    if (obj && obj.properties) {
      const props = obj.properties;
      if (Array.isArray(props)) {
        const p = props.find((x: any) => x.name === "marvieMessage" || x.name === "marviePopup");
        if (p?.value) return String(p.value);
      } else if (props.marvieMessage) {
        return String(props.marvieMessage);
      }
    }
  } catch {}
  return [
    "👋 Hi — I'm Marvie.",
    "",
    "Welcome to the Room of Malware",
	"Do you think you can find the 3 easter eggs around the map?",
    "Tip: Check the walls, the chairs or the floor for suspicious objects.",
  ].join("\n");
}

export function initMarvie() {
  console.log("[Marvie] init");

  WA.room.area.onEnter("MarvieZone").subscribe(() => {
    closeMarviePopup();
    const message = getMessageForZone();
    marviePopupRef = WA.ui.openPopup("marviePopup", message, [
      { label: "Got it", callback: () => closeMarviePopup() },
    ]);
  });

  WA.room.area.onLeave("MarvieZone").subscribe(() => {
    closeMarviePopup();
  });
}
