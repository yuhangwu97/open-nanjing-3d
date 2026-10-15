import * as THREE from 'three';
import {
  createSkyscraperCurtainWallTexture,
  createAncientLatticeWindowTexture,
  createShimmeringWaterTexture,
  createMingBrickWallTexture,
  createNanzhanRoofTexture,
  createNanzhanGoldLouverTexture,
  createNanzhanCenterGlassTexture,
  createKasayaCopperCanopyTexture,
  createManiDomeDiamondTexture
} from './textures.js';

export const wutongCrownMats = [
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.68 }),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.65 }),
      new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.70 }),
      new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.72 })
    ];
    export const cherryBlossomMat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
    export const whiteCherryBlossomMat = new THREE.MeshStandardMaterial({ color: 0xfff1f2, roughness: 0.55 });
    export const willowFoliageMat = new THREE.MeshStandardMaterial({ color: 0x65a30d, roughness: 0.75 });

export const yangtzeShimmerTex = createShimmeringWaterTexture('#0369a1', '#0284c7', 'rgba(254, 249, 195, 0.92)', 'rgba(125, 211, 252, 0.72)');
    export const lakeShimmerTex = createShimmeringWaterTexture('#0d9488', '#0284c7', 'rgba(254, 249, 195, 0.85)', 'rgba(153, 246, 228, 0.65)');
    const mingBrickWallTex = createMingBrickWallTexture();

    const skyCurtainBlueTex = createSkyscraperCurtainWallTexture('#0284c7', '#0369a1', '#e0f2fe', 'rgba(254, 249, 195, 0.85)');
    const skyCurtainZifengTex = createSkyscraperCurtainWallTexture('#0284c7', '#0369a1', '#e0f2fe', 'rgba(186, 230, 253, 0.90)');
    const skyCurtainCbdTex = createSkyscraperCurtainWallTexture('#1e293b', '#334155', '#cbd5e1', 'rgba(254, 240, 138, 0.82)');
    const ancientRedLatticeTex = createAncientLatticeWindowTexture('#991b1b', '#7f1d1d', '#fef08a');
    const jimingYellowLatticeTex = createAncientLatticeWindowTexture('#eab308', '#991b1b', '#fef9c3');

    export const mats = {
      sandboxBase: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.9 }),
      sandboxRim: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, metalness: 0.3 }),
      grassLand: new THREE.MeshStandardMaterial({ color: 0x2c472b, roughness: 0.92 }),
      islandGrass: new THREE.MeshStandardMaterial({ color: 0x365314, roughness: 0.88 }),
      whiteMarble: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.08 }),
      platformInlay: new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45 }),
      memorialGreyConcrete: new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.78, metalness: 0.08 }),
      memorialDarkSlate: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.82, metalness: 0.12 }),
      pebbleGravel: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.95 }),
      stepRiser: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.75 }),
      stepTread: new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.5 }),
      stepNosing: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      blueGlaze: new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.2, metalness: 0.28 }),
      greenGlaze: new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.2, metalness: 0.28 }),
      imperialYellowGlaze: new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.24,
        metalness: 0.35,
        emissive: new THREE.Color(0xa16207),
        emissiveIntensity: 0.14
      }),
      darkGreyTile: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.42, metalness: 0.15 }),
      goldTrim: new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.2,
        metalness: 0.85,
        emissive: new THREE.Color(0xb45309),
        emissiveIntensity: 0.18
      }),
      usnisaGoldCanopy: new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        roughness: 0.22,
        metalness: 0.88,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.28
      }),
      usnisaGoldWire: new THREE.MeshStandardMaterial({
        color: 0xfde68a,
        roughness: 0.18,
        metalness: 0.9,
        wireframe: true,
        emissive: new THREE.Color(0xf59e0b),
        emissiveIntensity: 0.35
      }),
      usnisaManiDome: new THREE.MeshStandardMaterial({
        color: 0xfef3c7,
        roughness: 0.16,
        metalness: 0.72,
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.15
      }),
      silverDome: new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.18, metalness: 0.68, side: THREE.DoubleSide }),
      palaceCream: new THREE.MeshStandardMaterial({ color: 0xfef3c7, roughness: 0.46 }),
      vermilionRed: new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.36 }),
      lighthouseRed: new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.3,
        emissive: new THREE.Color(0x991b1b),
        emissiveIntensity: 0.2
      }),
      aotiCrimsonArch: new THREE.MeshStandardMaterial({
        color: 0xe11d48,
        roughness: 0.25,
        metalness: 0.45,
        emissive: new THREE.Color(0x9f1239),
        emissiveIntensity: 0.32
      }),
      aotiTrackMat: new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 }),
      aotiTurfMat: new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }),
      qingaoGlassMat: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        map: skyCurtainBlueTex,
        roughness: 0.12,
        metalness: 0.82,
        emissive: new THREE.Color(0x0369a1),
        emissiveMap: skyCurtainBlueTex,
        emissiveIntensity: 0.35
      }),
      zahaWhiteFacade: new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.22,
        metalness: 0.3,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 0.08
      }),
      zahaDiagridWire: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.3,
        wireframe: true,
        emissive: new THREE.Color(0xe0f2fe),
        emissiveIntensity: 0.22
      }),
      stayCableMat: new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.82 }),
      redFlagMat: new THREE.MeshStandardMaterial({
        color: 0xdc2626,
        roughness: 0.35,
        emissive: new THREE.Color(0x991b1b),
        emissiveIntensity: 0.25
      }),
      redLantern: new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
        emissive: new THREE.Color(0xff4500),
        emissiveIntensity: 0.7
      }),
      warmWindowGlow: new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.3,
        emissive: new THREE.Color(0xf59e0b),
        emissiveIntensity: 0.45
      }),
      magnoliaLamp: new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: new THREE.Color(0xfef08a),
        emissiveIntensity: 0.55
      }),
      bridgeSteel: new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.5, metalness: 0.55 }),
      mingBrick: new THREE.MeshStandardMaterial({ color: 0x94a3b8, map: mingBrickWallTex, roughness: 0.78, metalness: 0.08 }),
      mingStoneBase: new THREE.MeshStandardMaterial({ color: 0x64748b, map: mingBrickWallTex, roughness: 0.75 }),
      bronze: new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.32, metalness: 0.7 }),
      darkDoor: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 }),
      asphaltRoad: new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 }),
      sacredWayStone: new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.75 }),
      treeTrunk: new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.92 }),
      pineBark: new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.95 }),
      pineNeedles: new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.82 }),
      cypressNeedles: new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.85 }),
      yangtzeWater: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        map: yangtzeShimmerTex,
        roughness: 0.10,
        metalness: 0.68,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x0284c7),
        emissiveMap: yangtzeShimmerTex,
        emissiveIntensity: 0.45
      }),
      lakeWater: new THREE.MeshStandardMaterial({
        color: 0x2dd4bf,
        map: lakeShimmerTex,
        roughness: 0.10,
        metalness: 0.62,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x0d9488),
        emissiveMap: lakeShimmerTex,
        emissiveIntensity: 0.38
      }),
      qinhuaiWater: new THREE.MeshStandardMaterial({
        color: 0x14b8a6,
        map: lakeShimmerTex,
        roughness: 0.12,
        metalness: 0.58,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0x0f766e),
        emissiveIntensity: 0.32
      }),
      zifengGlassMat: new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        map: skyCurtainZifengTex,
        roughness: 0.08,
        metalness: 0.86,
        emissive: new THREE.Color(0x0284c7),
        emissiveMap: skyCurtainZifengTex,
        emissiveIntensity: 0.52
      }),
      cbdGlassMat: new THREE.MeshStandardMaterial({
        color: 0xcbd5e1,
        map: skyCurtainCbdTex,
        roughness: 0.16,
        metalness: 0.78,
        emissive: new THREE.Color(0x334155),
        emissiveMap: skyCurtainCbdTex,
        emissiveIntensity: 0.42
      }),
      ancientLatticeMat: new THREE.MeshStandardMaterial({
        map: ancientRedLatticeTex,
        roughness: 0.36,
        emissive: new THREE.Color(0xf59e0b),
        emissiveIntensity: 0.18
      }),
      jimingWallMat: new THREE.MeshStandardMaterial({
        map: jimingYellowLatticeTex,
        roughness: 0.32,
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.22
      }),
      zifengFinMat: new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.15,
        metalness: 0.90,
        emissive: new THREE.Color(0x0284c7),
        emissiveIntensity: 0.28
      }),
      zifengCrownGlow: new THREE.MeshStandardMaterial({
        color: 0x7dd3fc,
        roughness: 0.08,
        metalness: 0.45,
        emissive: new THREE.Color(0x38bdf8),
        emissiveIntensity: 1.05
      }),
      hsrRedMat: new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.2, metalness: 0.6 }),
      hsrSilverMat: new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.18, metalness: 0.75 }),
      runwayAsphalt: new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.82 }),
      runwayGreenLight: new THREE.MeshBasicMaterial({ color: 0x22c55e }),
      runwayRedLight: new THREE.MeshBasicMaterial({ color: 0xef4444 }),
      volcanoCraterMat: new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.9 }),
      ancientBrickMat: new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.88 })
    };
