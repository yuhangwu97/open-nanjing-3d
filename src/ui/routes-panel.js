import * as THREE from 'three';

export function setupRoutes(scene, SPOTS_DB, ROUTES_DB, onSelectSpot, onOverview, ctx) {
  const routeCurveGroup = new THREE.Group();
  scene.add(routeCurveGroup);

  let routePulseMeshes = [];
  let activeRouteCurve = null;
  let currentRouteId = 'all';
  let showRoute3DLines = false;

  const routePanelEl = document.getElementById('route-panel');

  function setRoutePanelOpen(open) {
    if (routePanelEl) routePanelEl.classList.toggle('panel-hidden-left', !open);
  }

  function rebuild3DRouteSpline(routeId, render3DLine = showRoute3DLines) {
    while (routeCurveGroup.children.length > 0) {
      routeCurveGroup.remove(routeCurveGroup.children[0]);
    }
    routePulseMeshes = [];
    activeRouteCurve = null;

    if (!routeId || routeId === 'none' || !ROUTES_DB[routeId]) {
      setRoutePanelOpen(false);
      if (ctx && ctx.updatePinRouteBadges) ctx.updatePinRouteBadges([]);
      return;
    }

    const route = ROUTES_DB[routeId];
    const stops = route.stops;

    const shouldDraw3DSpline = render3DLine && (routeId !== 'all') && stops.length >= 2;
    if (shouldDraw3DSpline) {
      const curvePts = [];
      for (let i = 0; i < stops.length; i++) {
        const pA = SPOTS_DB[stops[i]].routeNodePos.clone();
        curvePts.push(pA);
        if (i < stops.length - 1) {
          const pB = SPOTS_DB[stops[i + 1]].routeNodePos.clone();
          const mid = pA.clone().lerp(pB, 0.5);
          const dist = pA.distanceTo(pB);
          mid.y = Math.max(pA.y, pB.y) + Math.min(36, 12 + dist * 0.055);
          curvePts.push(mid);
        }
      }
      activeRouteCurve = new THREE.CatmullRomCurve3(curvePts);

      const coreTube = new THREE.Mesh(
        new THREE.TubeGeometry(activeRouteCurve, stops.length * 20, 0.95, 8, false),
        new THREE.MeshBasicMaterial({ color: route.color })
      );
      const haloTube = new THREE.Mesh(
        new THREE.TubeGeometry(activeRouteCurve, stops.length * 20, 2.2, 8, false),
        new THREE.MeshBasicMaterial({ color: route.color, transparent: true, opacity: 0.28 })
      );
      routeCurveGroup.add(coreTube, haloTube);

      stops.forEach((sKey) => {
        const np = SPOTS_DB[sKey].routeNodePos;
        const groundRing = new THREE.Mesh(
          new THREE.RingGeometry(4.5, 6.8, 28),
          new THREE.MeshBasicMaterial({ color: route.color, side: THREE.DoubleSide, transparent: true, opacity: 0.78 })
        );
        groundRing.rotation.x = -Math.PI / 2;
        groundRing.position.set(np.x, 1.2, np.z);
        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, np.y, 8),
          new THREE.MeshBasicMaterial({ color: route.color, transparent: true, opacity: 0.45 })
        );
        beam.position.set(np.x, np.y * 0.5, np.z);
        routeCurveGroup.add(groundRing, beam);
      });

      const pulseCount = Math.max(6, stops.length);
      const pulseGeo = new THREE.SphereGeometry(2.1, 12, 12);
      const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let p = 0; p < pulseCount; p++) {
        const pm = new THREE.Mesh(pulseGeo, pulseMat);
        routeCurveGroup.add(pm);
        routePulseMeshes.push({ mesh: pm, offset: p / pulseCount });
      }
    }

    const titleEl = document.getElementById('route-title');
    const subTitleEl = document.getElementById('route-subtitle');
    const badgeEl = document.getElementById('route-badge');
    const tipEl = document.getElementById('route-tip');
    if (titleEl) titleEl.textContent = route.title;
    if (subTitleEl) subTitleEl.textContent = route.subtitle;
    if (badgeEl) badgeEl.textContent = `${stops.length} 站`;
    if (tipEl) tipEl.innerHTML = route.tip;

    const listEl = document.getElementById('route-steps-list');
    if (listEl) {
      listEl.innerHTML = '';
      stops.forEach((spotKey, idx) => {
        const spot = SPOTS_DB[spotKey];
        const item = document.createElement('div');
        item.className = 'flex items-center justify-between p-2 rounded-xl cursor-pointer transition border bg-slate-800/70 border-slate-700/70 text-slate-300 hover:bg-slate-700/80';
        item.innerHTML = `
          <div class="flex items-center gap-2 min-w-0">
            <span class="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-extrabold text-[11px] flex items-center justify-center shrink-0">${idx + 1}</span>
            <span class="text-sm shrink-0">${spot.icon}</span>
            <div class="truncate">
              <div class="font-semibold text-xs truncate">${spot.name}</div>
              <div class="text-[10px] text-slate-400">${spot.duration} · ${spot.badge}</div>
            </div>
          </div>
          <span class="text-[10px] text-amber-300 font-medium shrink-0 ml-1">飞往 ➔</span>
        `;
        item.addEventListener('click', () => onSelectSpot(spotKey));
        listEl.appendChild(item);
      });
    }

    if (ctx && ctx.updatePinRouteBadges) ctx.updatePinRouteBadges(stops);
  }

  // Bind top route pills
  document.querySelectorAll('.route-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.route-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRouteId = btn.dataset.route;
      showRoute3DLines = (currentRouteId !== 'none' && currentRouteId !== 'all');
      rebuild3DRouteSpline(currentRouteId, showRoute3DLines);

      if (currentRouteId === 'night' && ctx && ctx.applyEnvironmentMode) {
        ctx.applyEnvironmentMode('night');
      }
      if (onOverview) onOverview();
    });
  });

  const toggleBtn = document.getElementById('btn-toggle-route-panel');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isHidden = routePanelEl.classList.contains('panel-hidden-left');
      setRoutePanelOpen(isHidden);
    });
  }

  const hideBtn = document.getElementById('btn-hide-route-panel');
  if (hideBtn) hideBtn.addEventListener('click', () => setRoutePanelOpen(false));

  if (ctx && ctx.addUpdater) {
    ctx.addUpdater((dt, elapsed) => {
      if (activeRouteCurve && routePulseMeshes.length > 0) {
        routePulseMeshes.forEach(item => {
          const u = (item.offset + elapsed * 0.075) % 1.0;
          const pt = activeRouteCurve.getPointAt(u);
          item.mesh.position.copy(pt);
        });
      }
    });
  }

  return {
    setRoutePanelOpen,
    rebuild3DRouteSpline,
    getCurrentRouteId: () => currentRouteId
  };
}
