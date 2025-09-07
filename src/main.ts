/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    // Clock popup (your existing one)
    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave('clock').subscribe(closePopup);

    // NEW: Samurai NPC popup
    WA.room.area.onEnter('npc_samurai').subscribe(() => {
        currentPopup = WA.ui.openPopup(
            "samuraiPopup",
            "🗡️ Defender of Malware: Stay vigilant, warrior! The digital world is full of threats.",
            [
                {
                    label: "Got it!",
                    callback: (popup) => {
                        popup.close();
                    }
                }
            ]
        );
    });

    WA.room.area.onLeave('npc_samurai').subscribe(closePopup);

    // Bootstraps the Scripting API Extra
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};
