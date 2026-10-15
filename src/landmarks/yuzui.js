import * as THREE from 'three';
import { mats, wutongCrownMats, lakeShimmerTex } from '../core/materials.js';
import {
  sharedGeos,
  createChineseRoof,
  createBalustradeSegment,
  createWutongTree,
  createChinesePine,
  createCeremonialCypress,
  createWeepingWillow,
  createCherryTree,
  createRedMapleTree,
  createLushGreenTree,
  createNiushouLushTree,
  createExactBridgeApproachRamp,
  createCurvedTriangularPrism
} from '../core/geo-builder.js';
import {
  ZX_OFFSET_X,
  STAIR_START_Z,
  STAIR_END_Z,
  STAIR_START_Y,
  STAIR_END_Y,
  MEILING_CENTER_Z,
  getAxisElevation,
  getStairHalfWidth,
  getPurpleMountainHeight
} from '../core/constants.js';
import {
  createMingXiaolingPlaqueTexture,
  createJimingPlaqueTexture
} from '../core/textures.js';

export default {
  id: 'yuzui',
  name: '鱼嘴湿地公园',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 6.4 地标三：【南京鱼嘴湿地公园】（X = -255, Z = 365，放大 1.15x，100% 完整露出）
      // -------------------------------------------------------------------------
      const yuzuiGroup = new THREE.Group();
      const YX = -255, YZ = 365;
      yuzuiGroup.position.set(YX, 0, YZ);
      yuzuiGroup.scale.setScalar(1.15);

      const yuzuiParkBase = new THREE.Mesh(
        new THREE.BoxGeometry(56, 0.9, 68),
        new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.85 })
      );
      yuzuiParkBase.position.set(14, 0.45, 0);
      yuzuiParkBase.receiveShadow = true;
      yuzuiGroup.add(yuzuiParkBase);

      const spitShape = new THREE.Shape();
      spitShape.moveTo(-14, 28);
      spitShape.quadraticCurveTo(6, 26, 38, 22);
      spitShape.lineTo(38, -28);
      spitShape.quadraticCurveTo(6, -24, -13, -12);
      spitShape.closePath();

      const spitGeo = new THREE.ExtrudeGeometry(spitShape, { depth: 1.35, bevelEnabled: true, bevelThickness: 0.4, bevelSize: 0.8 });
      spitGeo.rotateX(Math.PI / 2);
      const spitLand = new THREE.Mesh(spitGeo, mats.islandGrass);
      spitLand.position.y = 1.3;
      spitLand.receiveShadow = true;
      yuzuiGroup.add(spitLand);

      const tipPlaza = new THREE.Mesh(new THREE.CylinderGeometry(9.6, 11.0, 1.8, 28), mats.platformInlay);
      tipPlaza.position.set(-9, 0.9, 8);
      tipPlaza.receiveShadow = true;
      yuzuiGroup.add(tipPlaza);

      const lighthouse = new THREE.Group();
      lighthouse.position.set(-9, 1.75, 8);

      const lhBase = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 2.0, 20), mats.whiteMarble);
      lhBase.position.y = 1.0;
      lighthouse.add(lhBase);

      const bandHeights = 3.2;
      for (let b = 0; b < 6; b++) {
        const rBot = 2.2 - b * 0.14;
        const rTop = 2.2 - (b + 1) * 0.14;
        const isRed = b % 2 === 1;
        const band = new THREE.Mesh(
          new THREE.CylinderGeometry(rTop, rBot, bandHeights, 20),
          isRed ? mats.lighthouseRed : mats.whiteMarble
        );
        band.position.y = 2.0 + b * bandHeights + bandHeights / 2;
        band.castShadow = true;
        lighthouse.add(band);
      }

      const topY = 2.0 + 6 * bandHeights;
      const galleryDeck = new THREE.Mesh(new THREE.CylinderGeometry(2.1, 1.5, 0.7, 20), mats.whiteMarble);
      galleryDeck.position.y = topY + 0.35;
      const lanternGlass = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 2.6, 16), mats.magnoliaLamp);
      lanternGlass.position.y = topY + 1.9;
      const redCap = new THREE.Mesh(new THREE.ConeGeometry(1.55, 2.5, 16), mats.lighthouseRed);
      redCap.position.y = topY + 4.3;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 3.2, 6), mats.goldTrim);
      rod.position.y = topY + 6.5;
      lighthouse.add(galleryDeck, lanternGlass, redCap, rod);
      yuzuiGroup.add(lighthouse);

      const boardwalkPts = [
        new THREE.Vector3(24, 2.3, -22),
        new THREE.Vector3(8, 2.4, -8),
        new THREE.Vector3(-6, 2.4, 4),
        new THREE.Vector3(-11, 2.3, 16),
        new THREE.Vector3(6, 2.2, 26)
      ];
      const bwCurve = new THREE.CatmullRomCurve3(boardwalkPts);
      const boardwalkMesh = new THREE.Mesh(
        new THREE.TubeGeometry(bwCurve, 36, 1.4, 6, false),
        mats.aotiCrimsonArch
      );
      boardwalkMesh.scale.set(1, 0.25, 1);
      boardwalkMesh.position.y = 1.7;
      yuzuiGroup.add(boardwalkMesh);

      for (let w = 0; w < 10; w++) {
        const tree = w % 2 === 0 ? createWeepingWillow(0.9, w) : createWutongTree(0.85, w);
        tree.position.set(4 + (w % 3) * 9, 1.2, -16 + w * 3.5);
        yuzuiGroup.add(tree);
      }

      group.add(yuzuiGroup);

      // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
