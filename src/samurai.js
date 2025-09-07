let currentPopup;
WA.onInit().then(() => {
  console.log('WA ready (samurai.js)');
  WA.room.area.onEnter('npc_samurai').subscribe(() => {
    console.log('Entered npc_samurai');
    currentPopup = WA.ui.openPopup(
      'samuraiPopup',
      '🗡️ Defender of Malware: Stay vigilant, warrior!',
      [{ label: 'Got it!', callback: (p) => p.close() }]
    );
  });
  WA.room.area.onLeave('npc_samurai').subscribe(() => {
    if (currentPopup) { currentPopup.close(); currentPopup = undefined; }
  });
}).catch(console.error);
