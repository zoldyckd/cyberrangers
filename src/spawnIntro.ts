function attachMovementGuard() {
  // We don't need the callback param; omit it to satisfy TS/ESLint.
  const sub = (WA.player as any).onPlayerMove?.(() => {
    if (dismissed) return;

    // If any movement sneaks in: re-lock, snap back, and ensure popup exists
    try { WA.controls.disablePlayerControls(); } catch {}
    try { (WA.player as any).teleport?.(spawnX, spawnY); } catch {}

    if (!spawnPopupRef) {
      try { openSpawnIntro(); } catch {}
    }
  });

  // Normalize unsubscribe
  unSubMove = typeof sub === "function" ? sub : undefined;
}
