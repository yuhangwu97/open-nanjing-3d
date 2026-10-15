import * as THREE from 'three';
import { mats, wutongCrownMats } from './materials.js';
import { autumnGolds } from './constants.js';

let currentScene, hemiLight, sunLight, cloudMatGlobal, leafMat;
const nightPointLights = [];
const summerGreens = [0x15803d, 0x16a34a, 0x166534, 0x14532d];

export function setupLighting(scene) {
  currentScene = scene;
    hemiLight = new THREE.HemisphereLight(0xfffbeb, 0x365314, 0.8);
    scene.add(hemiLight);

    sunLight = new THREE.DirectionalLight(0xfffbeb, 1.55);
    sunLight.position.set(220, 310, 210);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 20;
    sunLight.shadow.camera.far = 2600;
    const sb = 1050;
    sunLight.shadow.camera.left = -sb;
    sunLight.shadow.camera.right = sb;
    sunLight.shadow.camera.top = sb;
    sunLight.shadow.camera.bottom = -sb;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 夜景专属点光源组（同步适配 21 大地标新坐标）
    const nightPointLights = [];
    function addNightGlowLight(x, y, z, colorHex, distance = 110, intensity = 0) {
      const pl = new THREE.PointLight(colorHex, intensity, distance);
      pl.position.set(x, y, z);
      scene.add(pl);
      nightPointLights.push(pl);
    }
    addNightGlowLight(145, 16, 195, 0xff7700, 140, 0);    // 夫子庙秦淮河与天下文枢大广场暖橙灯火
    addNightGlowLight(205, 42, 545, 0xfbbf24, 155, 0);    // 牛首山佛顶宫金顶圣光
    addNightGlowLight(-145, 36, -315, 0xfef08a, 150, 0);  // 长江大桥玉兰花灯
    addNightGlowLight(-145, 28, -5, 0xf43f5e, 135, 0);    // 南京奥体中心双红拱夜景（右移至 X=-145）
    addNightGlowLight(-195, 52, 140, 0x38bdf8, 155, 0);   // 南京青奥双塔霓虹
    addNightGlowLight(-292, 25, 140, 0x38bdf8, 130, 0);   // 南京眼步行桥与江心洲霓虹
    addNightGlowLight(-382, 42, 215, 0xe0f2fe, 145, 0);   // 长江五桥独柱索塔景观灯
    addNightGlowLight(-265, 28, 374, 0xfef08a, 125, 0);   // 鱼嘴湿地灯塔航标灯
    addNightGlowLight(395, 18, 165, 0xfbbf24, 135, 0);    // 南京博物院老大殿暖光
    addNightGlowLight(265, 98, 85, 0x38bdf8, 185, 0);     // 紫峰大厦450米蓝宝石玻璃蓝点光源（移至夫子庙与明孝陵中间 X=265,Z=85）
    addNightGlowLight(105, 32, -245, 0xfbbf24, 135, 0);   // 古鸡鸣寺药师佛塔暖金佛光（移至玄武湖左后方 X=105,Z=-245）
    addNightGlowLight(225, 22, -165, 0x38bdf8, 155, 0);   // 玄武湖五洲夜景（右移至 X=225,Z=-165）
    addNightGlowLight(395, 24, -14, 0xfbbf24, 140, 0);    // 明孝陵方城明楼暖金灯火
    addNightGlowLight(790, 48, -415, 0xf97316, 165, 0);   // 栖霞山太虚亭与古栖霞寺红枫暖光
    addNightGlowLight(0, 30, 365, 0xfbbf24, 175, 0);      // 南京南站C位平挑金色屋檐暖金灯火
    addNightGlowLight(-635, 30, 95, 0x38bdf8, 145, 0);    // 南京青奥体育馆江鸥展翅流光
    addNightGlowLight(-10, 20, 215, 0xf59e0b, 130, 0);    // 南京城墙·中华门瓮城亮化
    addNightGlowLight(-820, 72, -60, 0x34d399, 165, 0);   // 老山国家森林公园状元塔灯光
    addNightGlowLight(455, 38, 405, 0xfbbf24, 140, 0);    // 方山定林寺斜塔暖光
    addNightGlowLight(-315, 25, 620, 0x60a5fa, 180, 0);   // 南京禄口国际机场T1/T2与助航灯

  return { hemiLight, sunLight, nightPointLights };
}

export function buildLeafParticles(scene, ctx) {
    // ============================================================================
    // 12. 全局金陵深秋落叶粒子系统与构建函数统一调用
    // ============================================================================
    const LEAF_COUNT = 1600;
    const leafGeo = new THREE.BufferGeometry();
    const leafPosArr = new Float32Array(LEAF_COUNT * 3);
    const leafColArr = new Float32Array(LEAF_COUNT * 3);
    const leafVel = [];

    const leafPalette = [
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xd97706),
      new THREE.Color(0xfbbf24),
      new THREE.Color(0xea580c)
    ];

    for (let i = 0; i < LEAF_COUNT; i++) {
      leafPosArr[i * 3] = (Math.random() - 0.5) * 660;
      leafPosArr[i * 3 + 1] = Math.random() * 88 + 2;
      leafPosArr[i * 3 + 2] = (Math.random() - 0.5) * 600;

      const c = leafPalette[i % leafPalette.length];
      leafColArr[i * 3] = c.r;
      leafColArr[i * 3 + 1] = c.g;
      leafColArr[i * 3 + 2] = c.b;

      leafVel.push({
        vy: 0.06 + Math.random() * 0.08,
        freq: 1.1 + Math.random() * 1.8,
        amp: 0.04 + Math.random() * 0.06,
        phase: Math.random() * Math.PI * 2
      });
    }

    leafGeo.setAttribute('position', new THREE.BufferAttribute(leafPosArr, 3));
    leafGeo.setAttribute('color', new THREE.BufferAttribute(leafColArr, 3));

    leafMat = new THREE.PointsMaterial({
      size: 1.15,
      vertexColors: true,
      transparent: true,
      opacity: 0.88
    });

    const leafParticles = new THREE.Points(leafGeo, leafMat);
    scene.add(leafParticles);


  scene.add(leafGroup);

  if (ctx && ctx.addUpdater) {
    ctx.addUpdater((dt, elapsed) => {
      const pos = leafGeo.attributes.position.array;
      for (let i = 0; i < LEAF_COUNT; i++) {
        const idx = i * 3;
        const v = leafVel[i];
        pos[idx] += Math.sin(elapsed * v.freq + v.phase) * v.amp;
        pos[idx + 1] -= v.vy;
        pos[idx + 2] += Math.cos(elapsed * v.freq * 0.8 + v.phase) * (v.amp * 0.7);
        if (pos[idx + 1] < 0.5) {
          pos[idx + 1] = 85 + Math.random() * 15;
          pos[idx] = (Math.random() - 0.5) * 660;
        }
      }
      leafGeo.attributes.position.needsUpdate = true;
    });
  }

  return { leafMat, leafGroup };
}

    // ============================================================================
export function buildSkyClouds(scene) {
      const animatedClouds = [];
      const cloudGroup = new THREE.Group();
      cloudMatGlobal = new THREE.MeshStandardMaterial({
        color: 0xfffbeb,
        roughness: 0.90,
        metalness: 0.0,
        transparent: true,
        opacity: 0.88,
        emissive: new THREE.Color(0xfef3c7),
        emissiveIntensity: 0.25
      });
      const cloudBellyMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0,
        roughness: 0.95,
        metalness: 0.0,
        transparent: true,
        opacity: 0.78,
        emissive: new THREE.Color(0xcbd5e1),
        emissiveIntensity: 0.12
      });

      const puffGeo = new THREE.IcosahedronGeometry(1.0, 2);

      // 确定性伪随机发生器，生成完全打破网格排列、错落有致、忽大忽小、忽高忽低的 28 团自然体积云！
      function seededRand(seed) {
        const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
        return x - Math.floor(x);
      }

      // 28 朵高低错落、大小悬殊的云团配置（涵盖低空山间云雾 Y=118、中空积云 Y=155~195、高空巨型云团 Y=215~265）
      const irregularClouds = [
        // 远山与江面低空轻云小絮 (Small low-altitude wisps)
        { x: -720, y: 122, z: -180, sc: 0.52, stretchX: 1.4, puffs: 5, speed: 4.2 },
        { x: -585, y: 116, z: 65,   sc: 0.48, stretchX: 1.5, puffs: 4, speed: 3.9 },
        { x: 295,  y: 126, z: -175, sc: 0.58, stretchX: 1.3, puffs: 5, speed: 4.0 },
        { x: 355,  y: 118, z: -140, sc: 0.45, stretchX: 1.6, puffs: 4, speed: 4.5 },
        { x: -285, y: 132, z: 295,  sc: 0.55, stretchX: 1.3, puffs: 5, speed: 3.8 },
        { x: 155,  y: 128, z: 455,  sc: 0.62, stretchX: 1.2, puffs: 6, speed: 3.7 },
        // 中空蓬松积云群 (Medium cumulus clouds at varied heights & irregular positions)
        { x: -810, y: 168, z: -380, sc: 1.18, stretchX: 1.1, puffs: 8, speed: 2.8 },
        { x: -490, y: 152, z: -290, sc: 0.92, stretchX: 1.3, puffs: 7, speed: 3.2 },
        { x: -165, y: 184, z: -340, sc: 1.35, stretchX: 1.0, puffs: 9, speed: 2.6 },
        { x: 75,   y: 148, z: -215, sc: 0.85, stretchX: 1.4, puffs: 6, speed: 3.4 },
        { x: 445,  y: 174, z: -310, sc: 1.28, stretchX: 1.1, puffs: 8, speed: 2.9 },
        { x: -415, y: 192, z: -45,  sc: 1.12, stretchX: 1.2, puffs: 7, speed: 3.0 },
        { x: -85,  y: 162, z: -95,  sc: 0.78, stretchX: 1.5, puffs: 6, speed: 3.6 },
        { x: 215,  y: 198, z: 35,   sc: 1.42, stretchX: 1.0, puffs: 9, speed: 2.5 },
        { x: 530,  y: 158, z: 115,  sc: 0.96, stretchX: 1.3, puffs: 7, speed: 3.1 },
        { x: -690, y: 186, z: 265,  sc: 1.24, stretchX: 1.1, puffs: 8, speed: 2.7 },
        { x: -115, y: 154, z: 210,  sc: 0.72, stretchX: 1.4, puffs: 5, speed: 3.7 },
        { x: 265,  y: 176, z: 285,  sc: 1.15, stretchX: 1.2, puffs: 8, speed: 2.9 },
        { x: -420, y: 164, z: 485,  sc: 1.05, stretchX: 1.2, puffs: 7, speed: 3.2 },
        { x: 35,   y: 188, z: 540,  sc: 1.32, stretchX: 1.1, puffs: 8, speed: 2.6 },
        // 高空巨型层积云团与砧状云海 (Large high-altitude majestic cloud banks)
        { x: -640, y: 242, z: -155, sc: 2.15, stretchX: 1.35, puffs: 11, speed: 1.9 },
        { x: -240, y: 258, z: -185, sc: 2.45, stretchX: 1.45, puffs: 12, speed: 1.7 },
        { x: 185,  y: 235, z: -265, sc: 1.95, stretchX: 1.25, puffs: 10, speed: 2.1 },
        { x: -510, y: 228, z: 145,  sc: 1.88, stretchX: 1.30, puffs: 10, speed: 2.2 },
        { x: -15,  y: 262, z: 95,   sc: 2.35, stretchX: 1.40, puffs: 12, speed: 1.8 },
        { x: 420,  y: 248, z: 195,  sc: 2.10, stretchX: 1.30, puffs: 11, speed: 2.0 },
        { x: -215, y: 238, z: 420,  sc: 1.92, stretchX: 1.25, puffs: 10, speed: 2.1 },
        { x: 340,  y: 252, z: 495,  sc: 2.25, stretchX: 1.38, puffs: 11, speed: 1.85 }
      ];

      irregularClouds.forEach((cfg, idx) => {
        const cloud = new THREE.Group();
        for (let p = 0; p < cfg.puffs; p++) {
          const r1 = seededRand(idx * 31 + p * 7);
          const r2 = seededRand(idx * 47 + p * 13);
          const r3 = seededRand(idx * 73 + p * 19);
          const angle = (p / cfg.puffs) * Math.PI * 2 + r1 * 1.2;
          const dist = p === 0 ? 0 : (6 + r2 * 14);
          const px = Math.cos(angle) * dist * cfg.stretchX;
          const pz = Math.sin(angle) * dist * 0.78;
          const py = p === 0 ? 2.2 : (r3 - 0.42) * 5.8;

          const rx = (p === 0 ? 15 : 8 + r1 * 8) * (1 + (cfg.stretchX - 1) * 0.35);
          const ry = (p === 0 ? 7.5 : 4.2 + r2 * 4.5);
          const rz = (p === 0 ? 12 : 7 + r3 * 6.5);

          // 上层受光亮白云团
          const topPuff = new THREE.Mesh(puffGeo, cloudMatGlobal);
          topPuff.position.set(px, py, pz);
          topPuff.scale.set(rx, ry, rz);
          topPuff.rotation.set(r1 * 0.5, r2 * Math.PI, r3 * 0.4);
          cloud.add(topPuff);

          // 底部暗部体积阴影层，让每朵云富有立体明暗体积感
          if (p % 2 === 0) {
            const bellyPuff = new THREE.Mesh(puffGeo, cloudBellyMat);
            bellyPuff.position.set(px + 1.2, py - ry * 0.38, pz + 0.8);
            bellyPuff.scale.set(rx * 0.92, ry * 0.65, rz * 0.90);
            cloud.add(bellyPuff);
          }
        }

        cloud.scale.setScalar(cfg.sc);
        cloud.rotation.y = (seededRand(idx * 19) - 0.5) * 0.65;
        cloud.position.set(cfg.x, cfg.y, cfg.z);
        cloudGroup.add(cloud);
        animatedClouds.push({ mesh: cloud, baseY: cfg.y, speed: cfg.speed, phase: idx * 1.3 });
      });

      scene.add(cloudGroup);
      return { cloudMat: cloudMatGlobal, animatedClouds };
    }

    // 统一的 3D 实体城市路网 CITY_ROAD_SEGMENTS（含中央双黄线柏油机动车道与两侧浅灰人行道）
    const CITY_ROAD_SEGMENTS = [
      // (1) 中央路—中山路—中华路南北历史中轴干道（长江大桥南引桥 -> 纪念馆北侧 -> 新街口 -> 中华门西侧 -> 南京南站北广场）
      { p1: new THREE.Vector3(-145, 0, -165), p2: new THREE.Vector3(-12,  0, -155), carCount: 6, speed: 22, pedCount: 6 },
      { p1: new THREE.Vector3(-12,  0, -155), p2: new THREE.Vector3(-12,  0, 195),  carCount: 10, speed: 24, pedCount: 10 },
      { p1: new THREE.Vector3(-12,  0, 195),  p2: new THREE.Vector3(-42,  0, 310),  carCount: 6, speed: 23, pedCount: 6 },
      // (2) 中山东路—博爱路东西皇城大轴线（奥体东侧 -> 新街口 -> 紫峰大厦北侧 -> 南京博物院前广场 -> 美龄宫南侧）
      { p1: new THREE.Vector3(-75,  0, 25),   p2: new THREE.Vector3(345,  0, 25),   carCount: 14, speed: 25, pedCount: 12 },
      { p1: new THREE.Vector3(345,  0, 25),   p2: new THREE.Vector3(345,  0, 165),  carCount: 6, speed: 22, pedCount: 6 },
      { p1: new THREE.Vector3(345,  0, 125),  p2: new THREE.Vector3(505,  0, 125),  carCount: 6, speed: 22, pedCount: 6 },
      // (3) 水西门大街—玄武大道东西干线（连接纪念馆南侧、奥体东北侧与钟山北麓）
      { p1: new THREE.Vector3(-115, 0, -82),  p2: new THREE.Vector3(345,  0, -82),  carCount: 10, speed: 25, pedCount: 8 },
      { p1: new THREE.Vector3(345,  0, -265), p2: new THREE.Vector3(790,  0, -315), carCount: 10, speed: 26, pedCount: 8 },
      // (4) 夫子庙—紫峰—中华门景观大道（连接中华门北侧、夫子庙天下文枢大广场与紫峰大厦南侧）
      { p1: new THREE.Vector3(-42,  0, 145),  p2: new THREE.Vector3(345,  0, 145),  carCount: 10, speed: 22, pedCount: 10 },
      // (5) 河西新城江东中路南北纵轴大道（从纪念馆南侧 Z=-82 向南延伸至 Z=285，避开纪念馆与奥体中心）
      { p1: new THREE.Vector3(-75,  0, -82),  p2: new THREE.Vector3(-75,  0, 285),  carCount: 14, speed: 26, pedCount: 10 },
      // (6) 江山大街—宏运大道东西干线（五桥东引桥 X=-200 -> 南京南站北侧 Z=285 -> 江宁方山北侧）
      { p1: new THREE.Vector3(-200, 0, 215),  p2: new THREE.Vector3(-42,  0, 285),  carCount: 6, speed: 24, pedCount: 6 },
      { p1: new THREE.Vector3(-42,  0, 285),  p2: new THREE.Vector3(415,  0, 355),  carCount: 12, speed: 25, pedCount: 8 },
      // (7) 江北新区浦滨路干线（长江大桥北引桥 -> 老山东麓 -> 青奥体育馆东侧 -> 五桥西引桥 X=-565）
      { p1: new THREE.Vector3(-145, 0, -485), p2: new THREE.Vector3(-565, 0, -180), carCount: 8, speed: 25, pedCount: 6 },
      { p1: new THREE.Vector3(-565, 0, -180), p2: new THREE.Vector3(-565, 0, 215),  carCount: 10, speed: 24, pedCount: 8 },
      // (8) 机场高速与牛首大道干线（南京南站南侧 -> 禄口国际机场 & 牛首山圣境）
      { p1: new THREE.Vector3(0,    0, 445),  p2: new THREE.Vector3(-315, 0, 565),  carCount: 10, speed: 28, pedCount: 6 },
      { p1: new THREE.Vector3(0,    0, 445),  p2: new THREE.Vector3(175,  0, 515),  carCount: 8, speed: 26, pedCount: 6 }
    ];



export function setupSkyClouds(scene, ctx) {
  const result = buildSkyClouds(scene);
  if (result && result.cloudMat) cloudMatGlobal = result.cloudMat;
  if (ctx && ctx.addUpdater && result && result.animatedClouds) {
    ctx.addUpdater((dt, elapsed) => {
      result.animatedClouds.forEach(cl => {
        cl.mesh.position.x += cl.speed * dt;
        cl.mesh.position.y = cl.baseY + Math.sin(elapsed * 0.45 + cl.phase) * 1.2;
        if (cl.mesh.position.x > 760) cl.mesh.position.x = -760;
      });
    });
  }
  return result;
}

export function applyEnvironmentMode(mode, targetScene) {
  const scene = targetScene || currentScene;
  if (!scene) return;
  ['btn-env-autumn', 'btn-env-summer', 'btn-env-night'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.toggle('active', id === `btn-env-${mode}`);
  });

      if (mode === 'autumn') {
        wutongCrownMats.forEach((m, i) => m.color.setHex(autumnGolds[i]));
        if (cloudMatGlobal) { cloudMatGlobal.color.setHex(0xfffbeb); cloudMatGlobal.emissive.setHex(0xfef3c7); cloudMatGlobal.opacity = 0.86; }
        scene.background.setHex(0xfde68a);
        scene.fog.color.setHex(0xfef3c7);
        hemiLight.intensity = 0.8;
        sunLight.intensity = 1.55;
        sunLight.color.setHex(0xfffbeb);
        leafMat.opacity = 0.88;
        mats.redLantern.emissiveIntensity = 0.6;
        mats.warmWindowGlow.emissiveIntensity = 0.35;
        mats.magnoliaLamp.emissiveIntensity = 0.45;
        mats.usnisaGoldCanopy.emissiveIntensity = 0.28;
        mats.usnisaGoldWire.emissiveIntensity = 0.35;
        mats.aotiCrimsonArch.emissiveIntensity = 0.3;
        mats.qingaoGlassMat.emissiveIntensity = 0.35;
        mats.zifengGlassMat.emissiveIntensity = 0.48;
        mats.cbdGlassMat.emissiveIntensity = 0.42;
        mats.ancientLatticeMat.emissiveIntensity = 0.18;
        mats.jimingWallMat.emissiveIntensity = 0.22;
        nightPointLights.forEach(pl => (pl.intensity = 0));
      } else if (mode === 'summer') {
        wutongCrownMats.forEach((m, i) => m.color.setHex(summerGreens[i]));
        if (cloudMatGlobal) { cloudMatGlobal.color.setHex(0xffffff); cloudMatGlobal.emissive.setHex(0xe0f2fe); cloudMatGlobal.opacity = 0.90; }
        scene.background.setHex(0xdbeafe);
        scene.fog.color.setHex(0xdbeafe);
        hemiLight.intensity = 0.84;
        sunLight.intensity = 1.6;
        sunLight.color.setHex(0xffffff);
        leafMat.opacity = 0.2;
        mats.redLantern.emissiveIntensity = 0.4;
        mats.warmWindowGlow.emissiveIntensity = 0.25;
        mats.magnoliaLamp.emissiveIntensity = 0.3;
        mats.usnisaGoldCanopy.emissiveIntensity = 0.18;
        mats.usnisaGoldWire.emissiveIntensity = 0.22;
        mats.aotiCrimsonArch.emissiveIntensity = 0.2;
        mats.qingaoGlassMat.emissiveIntensity = 0.28;
        mats.zifengGlassMat.emissiveIntensity = 0.38;
        mats.cbdGlassMat.emissiveIntensity = 0.32;
        mats.ancientLatticeMat.emissiveIntensity = 0.15;
        mats.jimingWallMat.emissiveIntensity = 0.18;
        nightPointLights.forEach(pl => (pl.intensity = 0));
      } else if (mode === 'night') {
        if (cloudMatGlobal) { cloudMatGlobal.color.setHex(0x1e293b); cloudMatGlobal.emissive.setHex(0x0f172a); cloudMatGlobal.opacity = 0.45; }
        scene.background.setHex(0x060c18);
        scene.fog.color.setHex(0x060c18);
        hemiLight.intensity = 0.24;
        sunLight.intensity = 0.3;
        sunLight.color.setHex(0x60a5fa);
        leafMat.opacity = 0.35;
        mats.redLantern.emissiveIntensity = 2.5;
        mats.warmWindowGlow.emissiveIntensity = 1.9;
        mats.magnoliaLamp.emissiveIntensity = 2.6;
        mats.usnisaGoldCanopy.emissiveIntensity = 1.45;
        mats.usnisaGoldWire.emissiveIntensity = 1.8;
        mats.aotiCrimsonArch.emissiveIntensity = 1.6;
        mats.qingaoGlassMat.emissiveIntensity = 1.5;
        mats.zahaWhiteFacade.emissiveIntensity = 0.45;
        mats.goldTrim.emissiveIntensity = 0.9;
        mats.zifengGlassMat.emissiveIntensity = 1.45;
        mats.zifengFinMat.emissiveIntensity = 1.1;
        mats.zifengCrownGlow.emissiveIntensity = 2.6;
        mats.cbdGlassMat.emissiveIntensity = 1.35;
        mats.ancientLatticeMat.emissiveIntensity = 1.25;
        mats.jimingWallMat.emissiveIntensity = 1.15;
        nightPointLights.forEach(pl => (pl.intensity = 2.9));
      }
    }

