import * as THREE from 'three';

export function setupMapPins(camera, SPOTS_DB, onSelectSpot) {
  const pinsContainer = document.getElementById('map-pins-container');
  const pinDomMap = {};
  let pinsVisible = true;

  const PIN_BG_THEMES = {
    laoshan: 'background: rgba(6, 78, 59, 0.90); border-color: #34d399;',
    zhongshan: 'background: rgba(6, 78, 59, 0.90); border-color: #34d399;',
    qixiashan: 'background: rgba(153, 27, 27, 0.92); border-color: #fb923c;',
    jiming: 'background: rgba(161, 98, 7, 0.92); border-color: #fde047;',
    xuanwu: 'background: rgba(12, 74, 110, 0.90); border-color: #38bdf8;',
    fangshan: 'background: rgba(6, 78, 59, 0.90); border-color: #34d399;',
    bridge: 'background: rgba(30, 58, 138, 0.90); border-color: #60a5fa;',
    fifthbridge: 'background: rgba(30, 58, 138, 0.90); border-color: #60a5fa;',
    yuzui: 'background: rgba(153, 27, 27, 0.90); border-color: #fca5a5;',
    qingao: 'background: rgba(3, 105, 161, 0.90); border-color: #7dd3fc;',
    aoti: 'background: rgba(136, 19, 55, 0.90); border-color: #fda4af;',
    qingao_arena: 'background: rgba(3, 105, 161, 0.90); border-color: #7dd3fc;',
    zifeng: 'background: rgba(3, 105, 161, 0.92); border-color: #38bdf8;',
    nanzhan: 'background: rgba(120, 53, 15, 0.90); border-color: #fbbf24;',
    lukou_airport: 'background: rgba(30, 64, 175, 0.90); border-color: #93c5fd;',
    fuzimiao: 'background: rgba(124, 45, 18, 0.90); border-color: #fdba74;',
    citywall: 'background: rgba(68, 64, 60, 0.92); border-color: #d6d3d1;',
    mingxiaoling: 'background: rgba(120, 53, 15, 0.90); border-color: #fcd34d;',
    meiling: 'background: rgba(6, 95, 70, 0.90); border-color: #6ee7b7;',
    nanbo: 'background: rgba(124, 45, 18, 0.90); border-color: #fcd34d;',
    niushoushan: 'background: rgba(113, 63, 18, 0.92); border-color: #fde047;',
    memorial: 'background: rgba(51, 65, 85, 0.92); border-color: #cbd5e1;'
  };

  if (pinsContainer) {
    pinsContainer.innerHTML = '';
    Object.values(SPOTS_DB).forEach(spot => {
      const pinEl = document.createElement('div');
      pinEl.className = 'map-pin';
      const pinStyle = PIN_BG_THEMES[spot.id] || '';
      pinEl.innerHTML = `
        <div class="map-pin-inner" style="${pinStyle}">
          <span class="map-pin-order">1</span>
          <span class="text-xs">${spot.icon}</span>
          <span class="text-[11px] font-semibold text-white">${spot.name.split(' ')[0]}</span>
        </div>
        <div class="map-pin-stem"></div>
      `;
      pinEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (onSelectSpot) onSelectSpot(spot.id);
      });
      pinsContainer.appendChild(pinEl);
      pinDomMap[spot.id] = { el: pinEl, pos: spot.pinPos };
    });

    // 额外添加【🏝️ 江心洲生态科技岛】专属3D悬浮岛标
    const jxzPinEl = document.createElement('div');
    jxzPinEl.className = 'map-pin';
    jxzPinEl.innerHTML = `
      <div class="map-pin-inner" style="border-color: #34d399; background: rgba(6, 78, 59, 0.85);">
        <span class="text-xs">🏝️</span>
        <span class="text-[11px] font-semibold text-emerald-200">江心洲生态科技岛</span>
      </div>
      <div class="map-pin-stem"></div>
    `;
    jxzPinEl.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSelectSpot) onSelectSpot('fifthbridge', 1);
    });
    pinsContainer.appendChild(jxzPinEl);
    pinDomMap['__jiangxinzhou_tag'] = { el: jxzPinEl, pos: new THREE.Vector3(-362, 26, 140) };
  }

  function updatePinRouteBadges(routeStops) {
    Object.keys(pinDomMap).forEach(spotKey => {
      const pinObj = pinDomMap[spotKey];
      const idx = routeStops.indexOf(spotKey);
      const orderEl = pinObj.el.querySelector('.map-pin-order');
      if (idx !== -1) {
        pinObj.el.classList.add('in-route');
        if (orderEl) orderEl.textContent = idx + 1;
      } else {
        pinObj.el.classList.remove('in-route');
      }
    });
  }

  function update3DMapPins() {
    if (!pinsVisible) return;
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;

    Object.values(pinDomMap).forEach(item => {
      const proj = item.pos.clone().project(camera);
      if (proj.z > 1 || proj.z < -1) {
        item.el.style.opacity = '0';
        item.el.style.pointerEvents = 'none';
        return;
      }
      const x = proj.x * halfW + halfW;
      const y = -(proj.y * halfH) + halfH;
      item.el.style.opacity = '1';
      item.el.style.pointerEvents = 'auto';
      item.el.style.left = `${x}px`;
      item.el.style.top = `${y}px`;
    });
  }

  function setPinActive(spotId) {
    Object.keys(pinDomMap).forEach(k => {
      pinDomMap[k].el.classList.toggle('active', k === spotId);
    });
  }

  function setPinsVisible(v) {
    pinsVisible = v;
    if (pinsContainer) pinsContainer.style.display = pinsVisible ? 'block' : 'none';
  }

  return {
    update3DMapPins,
    updatePinRouteBadges,
    setPinActive,
    setPinsVisible,
    isVisible: () => pinsVisible
  };
}
