export function setupEnvControls(applyEnvMode, onTogglePins) {
  const btnAutumn = document.getElementById('btn-env-autumn');
  const btnSummer = document.getElementById('btn-env-summer');
  const btnNight = document.getElementById('btn-env-night');
  const btnPins = document.getElementById('btn-toggle-pins');
  const btnImmersive = document.getElementById('btn-immersive');
  const exitImmersiveBtn = document.getElementById('btn-exit-immersive');

  if (btnAutumn) btnAutumn.addEventListener('click', () => applyEnvMode('autumn'));
  if (btnSummer) btnSummer.addEventListener('click', () => applyEnvMode('summer'));
  if (btnNight) btnNight.addEventListener('click', () => applyEnvMode('night'));

  let pinsActive = true;
  if (btnPins) {
    btnPins.addEventListener('click', () => {
      pinsActive = !pinsActive;
      btnPins.classList.toggle('active', pinsActive);
      if (onTogglePins) onTogglePins(pinsActive);
    });
  }

  function toggleImmersiveCleanMode(forceState) {
    const next = typeof forceState === 'boolean' ? forceState : !document.body.classList.contains('immersive-clean');
    document.body.classList.toggle('immersive-clean', next);
    if (exitImmersiveBtn) exitImmersiveBtn.classList.toggle('hidden', !next);
  }

  if (btnImmersive) btnImmersive.addEventListener('click', () => toggleImmersiveCleanMode(true));
  if (exitImmersiveBtn) exitImmersiveBtn.addEventListener('click', () => toggleImmersiveCleanMode(false));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'h' || e.key === 'H') toggleImmersiveCleanMode();
  });

  return {
    toggleImmersiveCleanMode
  };
}
