import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { mats } from './core/materials.js';
import { buildSandboxTableBase } from './core/terrain.js';
import { buildYangtzeRiver } from './core/yangtze.js';
import { setupTraffic } from './core/traffic.js';
import {
  setupLighting,
  setupSkyClouds,
  buildLeafParticles,
  applyEnvironmentMode
} from './core/environment.js';

import { SPOTS_DB } from './data/spots.js';
import { ROUTES_DB } from './data/routes.js';
import { loadAllLandmarks } from './landmarks/index.js';

import { setupMapPins } from './ui/pins.js';
import { setupRoutes } from './ui/routes-panel.js';
import { setupGuideDrawer } from './ui/guide-drawer.js';
import { setupWalkthrough } from './ui/walkthrough.js';
import { setupEnvControls } from './ui/env-controls.js';

// ============================================================================
// 1. 初始化 Three.js 场景、相机、渲染器与控制器
// ============================================================================
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xfde68a);
scene.fog = new THREE.FogExp2(0xfef3c7, 0.00078);

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 4500);
camera.position.set(10, 690, 1045);

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
container.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.055;
controls.maxPolarAngle = Math.PI / 2 - 0.015;
controls.target.set(-55, 8, 70);

// ============================================================================
// 2. 动画调度中心与上下文对象 (App Context)
// ============================================================================
const updaters = [];
let camTween = null;
let currentSpotId = 'zhongshan';

const ctx = {
  scene,
  camera,
  renderer,
  controls,
  mats,
  SPOTS_DB,
  ROUTES_DB,
  addUpdater(fn) {
    if (typeof fn === 'function') updaters.push(fn);
  },
  stopTween() {
    camTween = null;
  },
  applyEnvironmentMode(mode) {
    applyEnvironmentMode(mode);
  }
};

controls.addEventListener('start', () => {
  if (walkthroughCtrl) walkthroughCtrl.setPlaying(false);
  camTween = null;
});

// ============================================================================
// 3. 构建核心环境、地形、水系与交通
// ============================================================================
setupLighting(scene);
buildSandboxTableBase(scene, mats);
buildYangtzeRiver(scene, mats, ctx);
setupSkyClouds(scene, ctx);
buildLeafParticles(scene, ctx);
setupTraffic(scene, mats, ctx);

// ============================================================================
// 4. 加载全域 22 大地标 3D 模型
// ============================================================================
loadAllLandmarks(scene, ctx);

// ============================================================================
// 5. 相机平滑飞行控制 (Camera Flight Animation)
// ============================================================================
function flyToCamera(targetPos, targetLook) {
  if (walkthroughCtrl) walkthroughCtrl.setPlaying(false);
  camTween = {
    startPos: camera.position.clone(),
    endPos: new THREE.Vector3(...targetPos),
    startLook: controls.target.clone(),
    endLook: new THREE.Vector3(...targetLook),
    progress: 0
  };
}

function selectSpotAndOpenGuide(spotId, customViewIdx = -1) {
  currentSpotId = spotId;
  if (pinsCtrl) pinsCtrl.setPinActive(spotId);
  if (guideCtrl) guideCtrl.showSpotGuide(spotId, customViewIdx);
  if (routesCtrl) routesCtrl.setRoutePanelOpen(false);
}

function goToFullSandboxOverview() {
  flyToCamera([10, 690, 1045], [10, 8, 45]);
  if (guideCtrl) guideCtrl.setGuideDrawerOpen(false);
  if (routesCtrl) routesCtrl.setRoutePanelOpen(false);
  if (pinsCtrl) pinsCtrl.setPinActive(null);
}

// ============================================================================
// 6. UI 系统绑定与交互
// ============================================================================
const pinsCtrl = setupMapPins(camera, SPOTS_DB, (spotId, viewIdx) => {
  selectSpotAndOpenGuide(spotId, viewIdx);
});
ctx.updatePinRouteBadges = (stops) => pinsCtrl.updatePinRouteBadges(stops);

const guideCtrl = setupGuideDrawer(SPOTS_DB, ROUTES_DB, (camPos, camLook) => {
  flyToCamera(camPos, camLook);
}, selectSpotAndOpenGuide);

const routesCtrl = setupRoutes(
  scene,
  SPOTS_DB,
  ROUTES_DB,
  (spotId) => selectSpotAndOpenGuide(spotId),
  goToFullSandboxOverview,
  ctx
);

const walkthroughCtrl = setupWalkthrough(camera, controls, ctx);
setupEnvControls(applyEnvironmentMode, (visible) => pinsCtrl.setPinsVisible(visible));

const overviewBtn = document.getElementById('btn-sandbox-overview');
if (overviewBtn) overviewBtn.addEventListener('click', goToFullSandboxOverview);

function stepRouteSpot(delta) {
  const currentRouteId = routesCtrl ? routesCtrl.getCurrentRouteId() : 'all';
  const route = ROUTES_DB[currentRouteId] || ROUTES_DB.all;
  const list = route.stops;
  let idx = list.indexOf(currentSpotId);
  if (idx === -1) idx = 0;
  else idx = (idx + delta + list.length) % list.length;
  selectSpotAndOpenGuide(list[idx]);
}

const prevBtn = document.getElementById('btn-prev-spot');
const nextBtn = document.getElementById('btn-next-spot');
if (prevBtn) prevBtn.addEventListener('click', () => stepRouteSpot(-1));
if (nextBtn) nextBtn.addEventListener('click', () => stepRouteSpot(1));

// 点击画布空白处收起路线面板
let pointerDownPos = { x: 0, y: 0 };
renderer.domElement.addEventListener('pointerdown', (e) => {
  pointerDownPos = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener('pointerup', (e) => {
  const moveDist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y);
  if (moveDist < 4 && routesCtrl) {
    routesCtrl.setRoutePanelOpen(false);
  }
});

// ============================================================================
// 7. 动画主循环 (60FPS Main Loop)
// ============================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.1);
  const elapsed = clock.getElapsedTime();

  // 执行所有注册的动态更新器
  for (let i = 0; i < updaters.length; i++) {
    updaters[i](dt, elapsed);
  }

  // 更新相机飞行动画
  if (camTween) {
    camTween.progress += dt * 1.45;
    const t = Math.min(1, camTween.progress);
    const ease = 1 - Math.pow(1 - t, 3);
    camera.position.lerpVectors(camTween.startPos, camTween.endPos, ease);
    controls.target.lerpVectors(camTween.startLook, camTween.endLook, ease);
    if (t >= 1) camTween = null;
  }

  controls.update();
  if (pinsCtrl) pinsCtrl.update3DMapPins();
  renderer.render(scene, camera);
}

// 窗口尺寸自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 初始化默认全览路线并启动主循环
routesCtrl.rebuild3DRouteSpline('all', false);
goToFullSandboxOverview();
animate();

console.log('🌟 Open Nanjing 3D (南京全域景点 3D 沙盘) 初始化成功！欢迎在 GitHub 提交 PR 共建更多金陵地标。');
