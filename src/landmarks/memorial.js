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
  id: 'memorial',
  name: '侵华日军南京大屠杀遇难同胞纪念馆',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 7.4 地标六：【侵华日军南京大屠杀遇难同胞纪念馆】（河西北部江东门 X = -142, Z = -68）
      // 真实特征（齐康院士 & 何镜堂院士团队设计）：
      // - 庄严肃穆的灰白大理石与清水混凝土色调
      // - 东端斜切翘起的三角形“折断的军刀”纪念主馆体量（象征侵略者军刀折断与正义胜利）
      // - 入口镜面水池与高达12米的《家破人亡》母亲抱子震撼青铜雕塑
      // - 集会广场高耸的“1937.12.13 - 1938.1”十字架形标志碑、和平大钟架、万枚鹅卵石与枯树遗骨陈列墓地广场
      // - 西端高30米的白色【和平公园 · 和平女神托鸽雕塑】与胜利之墙
      // -------------------------------------------------------------------------
      const memorial = new THREE.Group();
      const MX = -65, MZ = -115; // 位于南京奥体中心(-145,-5)的右上边内陆区域，远离长江江面！
      memorial.position.set(MX, 0, MZ);

      // 1. 庄重深灰石板与鹅卵石纪念基座广场 (76m x 36m)
      const memPlinth = new THREE.Mesh(new THREE.BoxGeometry(78, 0.8, 36), mats.memorialDarkSlate);
      memPlinth.position.y = 0.4;
      memPlinth.receiveShadow = true;
      memorial.add(memPlinth);

      // 2. 东侧标志性【“折断的军刀”斜切纪念主馆】（三角形楔形体量，东端尖锐斜切悬挑凌空）
      const bladeShape = new THREE.Shape();
      bladeShape.moveTo(0, 0);
      bladeShape.lineTo(34, 0);
      bladeShape.lineTo(42, 11.5); // 军刀折断斜切锋刃
      bladeShape.lineTo(-4, 4.2);
      bladeShape.closePath();

      const bladeGeo = new THREE.ExtrudeGeometry(bladeShape, { depth: 16, bevelEnabled: false });
      const bladeHall = new THREE.Mesh(bladeGeo, mats.memorialGreyConcrete);
      bladeHall.position.set(-4, 0.8, -14);
      bladeHall.castShadow = true;
      bladeHall.receiveShadow = true;
      memorial.add(bladeHall);

      // 折断军刀前端下方的黑色镜面反思水池与【《家破人亡》母子青铜雕塑】
      const reflectPool = new THREE.Mesh(new THREE.BoxGeometry(22, 0.3, 12), mats.darkDoor);
      reflectPool.position.set(24, 0.85, 8);
      const motherSculpture = new THREE.Group();
      const sculpBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.5, 2.0), mats.memorialDarkSlate);
      sculpBase.position.y = 0.75;
      const motherBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 9.2, 1.4), mats.bronze);
      motherBody.position.y = 5.6;
      motherBody.rotation.z = -0.08;
      const childArms = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 1.2), mats.bronze);
      childArms.position.set(0.6, 7.2, 0.3);
      motherSculpture.add(sculpBase, motherBody, childArms);
      motherSculpture.position.set(28, 0.9, 8);
      memorial.add(reflectPool, motherSculpture);

      // 3. 中部【鹅卵石墓地广场】（模拟苍白鹅卵石层、7棵枯树与齐康设计的灰白石砌灾难之墙）
      const gravelBed = new THREE.Mesh(new THREE.BoxGeometry(28, 0.25, 16), mats.pebbleGravel);
      gravelBed.position.set(-8, 0.85, 6);
      memorial.add(gravelBed);

      for (let dt = 0; dt < 5; dt++) {
        const deadTree = new THREE.Group();
        const dTrunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
        dTrunk.position.y = 1.2;
        const dBranch = new THREE.Mesh(sharedGeos.branchCyl, mats.treeTrunk);
        dBranch.position.set(0.3, 2.2, 0);
        dBranch.rotation.z = -0.6;
        deadTree.add(dTrunk, dBranch);
        deadTree.position.set(-18 + dt * 5, 0.9, 4 + (dt % 2) * 4);
        memorial.add(deadTree);
      }

      // 4. 集会广场【十字架标志碑】与【和平大钟架】
      const crossMonument = new THREE.Group();
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(1.3, 12.5, 1.3), mats.whiteMarble);
      crossV.position.y = 6.25;
      const crossH = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.5, 1.4), mats.whiteMarble);
      crossH.position.y = 9.2;
      crossMonument.add(crossV, crossH);
      crossMonument.position.set(6, 0.8, 11);
      memorial.add(crossMonument);

      // 黑色三柱和平大钟架与古铜钟
      const bellFrame = new THREE.Group();
      [[-1.8, -1.2], [1.8, -1.2], [0, 1.8]].forEach(([bx, bz]) => {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 6.5, 8), mats.darkDoor);
        post.position.set(bx, 3.25, bz);
        bellFrame.add(post);
      });
      const peaceBell = new THREE.Mesh(new THREE.ConeGeometry(1.1, 2.2, 12), mats.bronze);
      peaceBell.position.y = 4.2;
      bellFrame.add(peaceBell);
      bellFrame.position.set(-2, 0.8, 12);
      memorial.add(bellFrame);

      // 5. 西端【和平公园 · 30米高汉白玉和平女神雕塑】与清水混凝土柱廊
      const peacePark = new THREE.Group();
      peacePark.position.set(-30, 0.8, 0);
      const goddessPed = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 2.6, 9.5, 12), mats.whiteMarble);
      goddessPed.position.y = 4.75;
      const goddessStatue = new THREE.Mesh(new THREE.ConeGeometry(1.5, 7.5, 12), mats.whiteMarble);
      goddessStatue.position.y = 13.0;
      const peaceDove = new THREE.Mesh(new THREE.OctahedronGeometry(0.9, 0), mats.goldTrim);
      peaceDove.position.set(0.8, 17.2, 0.5);
      peacePark.add(goddessPed, goddessStatue, peaceDove);

      // 三期椭圆形胜利广场清水混凝土柱廊
      for (let c = 0; c < 10; c++) {
        const ang = (c / 9) * Math.PI - Math.PI / 2;
        const pCol = new THREE.Mesh(new THREE.BoxGeometry(0.65, 5.5, 0.65), mats.memorialGreyConcrete);
        pCol.position.set(-Math.cos(ang) * 7.5, 2.75, Math.sin(ang) * 11);
        peacePark.add(pCol);
      }
      memorial.add(peacePark);

      group.add(memorial);

    scene.add(group);
    return group;
  }
};
