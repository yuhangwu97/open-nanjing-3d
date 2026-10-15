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
  id: 'meiling',
  name: '美龄宫 · 梧桐宝石项链',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 8.3 【美龄宫 & 法国梧桐宝石项链】 (大幅右移至 X = 545, Z = 82)
      const meiling = new THREE.Group();
      meiling.position.set(545, 0, MEILING_CENTER_Z);

      for (let i = 0; i < 5; i++) {
        const r = 12 + (4 - i) * 2.2;
        const layer = new THREE.Mesh(new THREE.CylinderGeometry(r, r + 2.0, 1.1, 32), mats.grassLand);
        layer.position.y = i * 1.1 + 0.55;
        layer.scale.set(1, 1, 1.15);
        layer.receiveShadow = true;
        meiling.add(layer);
      }

      const treePts = 44;
      for (let i = 0; i < treePts; i++) {
        const theta = (i / treePts) * Math.PI * 2;
        const sinT = Math.sin(theta), cosT = Math.cos(theta);
        const pinch = 0.56 + 0.44 * ((sinT + 1) / 2);
        const rx = 24 * pinch, rz = 28;
        const px = rx * cosT, pz = rz * sinT;

        [0.86, 1.10].forEach((sc, rIdx) => {
          const tree = createWutongTree(0.78 + (i % 3) * 0.05, i + rIdx * 5);
          tree.position.set(px * sc, sc < 1 ? 0.8 : 0, pz * sc);
          meiling.add(tree);
        });
      }

      for (let i = 0; i < 10; i++) {
        const dz = -30 - i * 2.4;
        const spread = 2.6 + i * 1.15;
        [-1, 1].forEach((side, sIdx) => {
          const wt = createWutongTree(0.8, i + sIdx);
          wt.position.set(side * spread, 0, dz);
          meiling.add(wt);
        });
      }

      const palace = new THREE.Group();
      const pTerr = new THREE.Mesh(new THREE.BoxGeometry(20, 1.6, 16), mats.whiteMarble);
      pTerr.position.y = 0.8;
      for (let bx = -9.5; bx <= 9.5; bx += 2.375) {
        [-7.6, 7.6].forEach(bz => {
          const post = new THREE.Mesh(new THREE.BoxGeometry(0.42, 2.2, 0.42), mats.whiteMarble);
          post.position.set(bx, 1.6, bz);
          palace.add(post);
        });
      }
      const pBody = new THREE.Mesh(new THREE.BoxGeometry(14, 5.8, 10), mats.palaceCream);
      pBody.position.y = 4.4;
      pBody.castShadow = true;
      for (let cx = -6; cx <= 6; cx += 3) {
        const rCol = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 5.8, 8), mats.vermilionRed);
        rCol.position.set(cx, 4.4, 5.1);
        palace.add(rCol);
      }
      const mRoof1 = createChineseRoof(18, 13.5, 2.3, mats.greenGlaze, false);
      mRoof1.position.y = 7.3;
      const mRoof2 = createChineseRoof(14, 10.2, 3.1, mats.greenGlaze, true);
      mRoof2.position.y = 9.5;

      const buick = new THREE.Group();
      const carBody = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 1.5), mats.cypressNeedles);
      carBody.position.y = 0.55;
      const carCab = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.7, 1.3), mats.greenGlaze);
      carCab.position.y = 1.15;
      buick.add(carBody, carCab);
      buick.position.set(0, 1.6, 6.2);

      palace.add(pTerr, pBody, mRoof1, mRoof2, buick);
      palace.position.y = 5.5;
      meiling.add(palace);

      group.add(meiling);

      // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
