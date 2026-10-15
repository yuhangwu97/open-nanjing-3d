export function setupGuideDrawer(SPOTS_DB, ROUTES_DB, onFlyTo, onSelectSpot) {
  const guideDrawerEl = document.getElementById('guide-drawer');
  let isGuideTextCollapsed = false;

  function setGuideDrawerOpen(open) {
    if (guideDrawerEl) guideDrawerEl.classList.toggle('panel-hidden-right', !open);
  }

  function showSpotGuide(spotId, customViewIdx = -1) {
    const spot = SPOTS_DB[spotId];
    if (!spot) return;

    setGuideDrawerOpen(true);

    const iconEl = document.getElementById('guide-icon');
    const nameEl = document.getElementById('guide-name');
    const durEl = document.getElementById('guide-duration');
    const ticketEl = document.getElementById('guide-ticket');
    const timeEl = document.getElementById('guide-besttime');
    const tipsEl = document.getElementById('guide-tips');
    const tagsBox = document.getElementById('guide-tags');
    const hlBox = document.getElementById('guide-highlights');
    const walkBox = document.getElementById('mausoleum-walk-box');

    if (iconEl) iconEl.textContent = spot.icon;
    if (nameEl) nameEl.textContent = spot.name;
    if (durEl) durEl.textContent = spot.duration;
    if (ticketEl) ticketEl.textContent = spot.ticket;
    if (timeEl) timeEl.textContent = spot.bestTime;
    if (tipsEl) tipsEl.innerHTML = spot.tips;

    if (tagsBox) {
      tagsBox.innerHTML = spot.tags.map(t =>
        `<span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">${t}</span>`
      ).join('');
    }

    if (hlBox) {
      hlBox.innerHTML = spot.highlights.map(h => `<li>${h}</li>`).join('');
    }

    if (walkBox) {
      walkBox.style.display = (spotId === 'zhongshan') ? 'flex' : 'none';
    }

    const camBtnsBox = document.getElementById('guide-camera-btns');
    if (camBtnsBox) {
      camBtnsBox.innerHTML = '';
      spot.subViews.forEach((sv, idx) => {
        const b = document.createElement('button');
        b.className = `subview-btn ${idx === customViewIdx ? 'active' : ''}`;
        b.textContent = sv.label;
        b.addEventListener('click', () => {
          camBtnsBox.querySelectorAll('.subview-btn').forEach(el => el.classList.remove('active'));
          b.classList.add('active');
          if (onFlyTo) onFlyTo(sv.cam, sv.look);
        });
        camBtnsBox.appendChild(b);
      });
    }

    const targetView = customViewIdx >= 0 && spot.subViews[customViewIdx]
      ? spot.subViews[customViewIdx]
      : spot.defaultCam;
    if (onFlyTo) onFlyTo(targetView.cam, targetView.look);
  }

  const closeBtn = document.getElementById('btn-close-guide');
  if (closeBtn) closeBtn.addEventListener('click', () => setGuideDrawerOpen(false));

  const toggleTextBtn = document.getElementById('btn-toggle-guide-text');
  const collapsibleBody = document.getElementById('guide-collapsible-body');
  if (toggleTextBtn && collapsibleBody) {
    toggleTextBtn.addEventListener('click', () => {
      isGuideTextCollapsed = !isGuideTextCollapsed;
      collapsibleBody.classList.toggle('hidden', isGuideTextCollapsed);
      toggleTextBtn.textContent = isGuideTextCollapsed ? '展开详情' : '精简';
    });
  }

  return {
    setGuideDrawerOpen,
    showSpotGuide
  };
}
