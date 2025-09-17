export function initQRCode() {
  WA.onInit().then(() => {
    console.log("[qrcode] armed for area 'QRcode'");

    WA.room.area.onEnter("QRcode").subscribe(() => {
      console.log("[qrcode] onEnter fired");
      // visible proof in-game:
      try { WA.chat.sendChatMessage("entered QRcode ✅", "system"); } catch {}
      // your popup:
      WA.ui.openPopup("QRcodePopup",
        "You saw a QR code on the wall. Do you scan it?",
        [
          { label: "Yes — scan it",  callback: () => WA.ui.openPopup("qrYes",
            "⚠️ Quishing: fake logins, malware, payment pages.\nSafer: only scan trusted QRs; preview the link; type the official URL.",
            [{ label: "Back", callback: () => {} }]) },
          { label: "No — don’t scan", callback: () => WA.ui.openPopup("qrNo",
            "✅ Correct. This phishing method is called ‘quishing’. Navigate to the site yourself instead.",
            [{ label: "OK", callback: () => {} }]) }
        ]
      );
    });

    WA.room.area.onLeave("QRcode").subscribe(() => {
      console.log("[qrcode] onLeave fired");
    });
  });
}
