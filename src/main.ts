/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log("Script started successfully");

let currentPopup: any = undefined;
let idQuizPopup: any = undefined;

// Clock popup helper
function closePopup() {
  if (currentPopup !== undefined) {
    currentPopup.close();
    currentPopup = undefined;
  }
}

// Quiz result helper
function showIdResult(correct: boolean) {
  if (idQuizPopup) idQuizPopup.close();
  idQuizPopup = WA.ui.openPopup(
    "idTheftResult",
    correct
      ? "✅ Correct! Use a phone number you found yourself (bank website/card). Freeze cards, change passwords, and enable 2FA."
      : "❌ Not safe. Never follow links or send ID to unknown senders. Verify via official channels only.",
    [{ label: "Got it", className: "primary", callback: (p: any) => p.close() }]
  );
}

// Waiting for the API to be ready
WA.onInit().then(() => {
  console.log("Scripting API ready");
  console.log("Player tags: ", WA.player.tags);

  // CLOCK AREA
  WA.room.area.onEnter("clock").subscribe(() => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    currentPopup = WA.ui.openPopup("clockPopup", `It's ${hh}:${mm}`, []);
  });
  WA.room.area.onLeave("clock").subscribe(closePopup);

  // ID THEFT QUIZ (SPACE to interact)
  WA.room.area.onAction("AssassinOfIDTheft").subscribe(() => {
    const actions: ButtonDescriptor[] = [
      {
        label: "Contact your bank using the official number",
        className: "primary",
        callback: () => showIdResult(true),
      },
      {
        label: "Click the link in the email/SMS to verify",
        className: "warning",
        callback: () => showIdResult(false),
      },
      {
        label: "Send your NRIC/passport photo to the sender",
        className: "error",
        callback: () => showIdResult(false),
      },
    ];

    if (idQuizPopup) idQuizPopup.close();
    idQuizPopup = WA.ui.openPopup(
      "idTheftQuiz",
      "🕵️ ID Theft: What’s the BEST first step if you suspect someone is using your identity?",
      actions
    );
  });

  WA.room.area.onLeave("AssassinOfIDTheft").subscribe(() => {
    if (idQuizPopup) {
      idQuizPopup.close();
      idQuizPopup = undefined;
    }
  });

  // Extra library
  bootstrapExtra()
    .then(() => console.log("Scripting API Extra ready"))
    .catch((e) => console.error(e));
}).catch((e) => console.error(e));

export {};
