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
  id: 'aoti',
  name: '南京奥体中心',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 7.1 地标四：【南京奥体中心】1:1 真实建筑形态重塑 (Hexi Central X = -155, Z = 30)
      // 真实特征：
      // - 内部为敞口阶梯看台碗，可以直接俯瞰中央碧绿足球场草坪与400米红跑道
      // - 屋盖为东西两瓣高耸隆起、南北两端低垂轻薄的银白色双曲面月牙马鞍形金属屋盖（中间留有巨大椭圆形露天开口）
      // - 灵魂标志：两条跨度360米的巨型鲜红箱形钢拱架，以45度外倾角从南北两端的巨大混凝土拱座起跳，高高飞越银白屋盖上方，并通过一排排倾斜钢拉杆将屋面吊起
      // -------------------------------------------------------------------------
      const aoti = new THREE.Group();
      const AX = -145, AZ = -5;
      aoti.position.set(AX, 0, AZ);
      aoti.scale.setScalar(1.10);

      // 1. 奥体中心双层景观大平台基座与环场彩虹健身跑道
      const aotiPlaza = new THREE.Mesh(new THREE.CylinderGeometry(52, 56, 1.2, 56), mats.platformInlay);
      aotiPlaza.position.y = 0.6;
      aotiPlaza.receiveShadow = true;
      const outerFitnessRing = new THREE.Mesh(new THREE.RingGeometry(43, 47.5, 56), mats.aotiTrackMat);
      outerFitnessRing.rotation.x = -Math.PI / 2;
      outerFitnessRing.position.y = 1.25;
      aoti.add(aotiPlaza, outerFitnessRing);

      // 四座扇形二层观众疏散大平台与落地宽大石阶（将二层看台环廊稳稳接至地面广场！）
      [0, Math.PI * 0.5, Math.PI, Math.PI * 1.5].forEach(ang => {
        const rampGroup = new THREE.Group();
        rampGroup.rotation.y = ang;
        const concoursePod = new THREE.Mesh(new THREE.BoxGeometry(14, 3.8, 8), mats.whiteMarble);
        concoursePod.position.set(0, 1.9, 34);
        const grandStair = new THREE.Mesh(new THREE.BoxGeometry(12, 1.4, 9.5), mats.stepTread);
        grandStair.position.set(0, 1.8, 40.5);
        grandStair.rotation.x = 0.38;
        rampGroup.add(concoursePod, grandStair);
        aoti.add(rampGroup);
      });

      // 2. 主体育场内场：FIFA标准翠绿足球场草坪（中线、中圈、南北禁区框、双球门）+ 8道400米红色跑道
      const pitchTurf = new THREE.Mesh(new THREE.CylinderGeometry(16.0, 16.0, 0.38, 40), mats.aotiTurfMat);
      pitchTurf.scale.set(1.26, 1, 0.88);
      pitchTurf.position.y = 1.32;
      const centerCircle = new THREE.Mesh(new THREE.RingGeometry(3.1, 3.45, 28), mats.whiteMarble);
      centerCircle.rotation.x = -Math.PI / 2;
      centerCircle.position.y = 1.54;
      const halfwayLine = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.05, 24), mats.whiteMarble);
      halfwayLine.position.y = 1.53;
      aoti.add(pitchTurf, centerCircle, halfwayLine);

      // 东西两端禁区白线框与足球门架
      [-14.5, 14.5].forEach(gx => {
        const penBox = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.05, 10.5), mats.whiteMarble);
        penBox.position.set(gx * 0.82, 1.52, 0);
        const innerBox = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.06, 9.8), mats.aotiTurfMat);
        innerBox.position.set(gx * 0.82, 1.53, 0);
        const goalFrame = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 3.2), mats.whiteMarble);
        goalFrame.position.set(gx, 2.1, 0);
        aoti.add(penBox, innerBox, goalFrame);
      });

      // 400米标准跑道与白色分道线
      const runningTrack = new THREE.Mesh(new THREE.RingGeometry(15.0, 22.2, 48), mats.aotiTrackMat);
      runningTrack.rotation.x = -Math.PI / 2;
      runningTrack.scale.set(1.22, 0.9, 1);
      runningTrack.position.y = 1.30;
      aoti.add(runningTrack);
      [16.8, 18.6, 20.4].forEach(tr => {
        const laneRing = new THREE.Mesh(new THREE.RingGeometry(tr, tr + 0.14, 48), mats.whiteMarble);
        laneRing.rotation.x = -Math.PI / 2;
        laneRing.scale.set(1.22, 0.9, 1);
        laneRing.position.y = 1.33;
        aoti.add(laneRing);
      });

      // 3. 内部三层阶梯看台碗（红、蓝、黄、白四色分区看台）与东西两端巨型LED记分牌大屏
      const bowlColors = [mats.aotiCrimsonArch, mats.qingaoGlassMat, mats.goldTrim, mats.whiteMarble];
      for (let t = 0; t < 4; t++) {
        const tierR = 22.0 + t * 2.2;
        const tierH = 2.6 + t * 2.1;
        const standRing = new THREE.Mesh(
          new THREE.CylinderGeometry(tierR + 1.9, tierR, 2.1, 48, 1, true),
          bowlColors[t % bowlColors.length]
        );
        standRing.scale.set(1.2, 1, 0.92);
        standRing.position.y = tierH;
        aoti.add(standRing);
      }
      [-31, 31].forEach(sx => {
        const screenBoard = new THREE.Mesh(new THREE.BoxGeometry(1.2, 4.2, 8.8), mats.darkDoor);
        screenBoard.position.set(sx, 11.8, 0);
        const screenGlow = new THREE.Mesh(new THREE.BoxGeometry(1.3, 3.4, 7.8), mats.qingaoGlassMat);
        screenGlow.position.set(sx, 11.8, 0);
        aoti.add(screenBoard, screenGlow);
      });

      // 4. 外围银白色流线型【双曲面马鞍形悬挑金属屋盖 + 28道放射状屋面结构钢肋条 + 内环透明阳光板】
      const roofGeo = new THREE.RingGeometry(18.2, 35.5, 64, 10);
      roofGeo.rotateX(-Math.PI / 2);
      const rPos = roofGeo.attributes.position;
      for (let i = 0; i < rPos.count; i++) {
        const vx = rPos.getX(i), vz = rPos.getZ(i);
        const rDist = Math.hypot(vx, vz);
        const ang = Math.atan2(vz, vx);
        const saddleWave = Math.cos(ang * 2) * 4.5;
        const radialSlope = ((rDist - 18.2) / 17.3) * 2.6;
        rPos.setY(i, 10.8 + saddleWave + radialSlope);
        rPos.setX(i, vx * 1.18);
        rPos.setZ(i, vz * 0.92);
      }
      roofGeo.computeVertexNormals();
      const saddleRoof = new THREE.Mesh(roofGeo, mats.silverDome);
      saddleRoof.castShadow = true;
      aoti.add(saddleRoof);

      // 屋面放射状银白钢结构肋骨与内圈蓝晶采光环
      for (let i = 0; i < 28; i++) {
        const ang = (i / 28) * Math.PI * 2;
        const saddleY = 11.8 + Math.cos(ang * 2) * 4.2;
        const rib = new THREE.Mesh(new THREE.BoxGeometry(16.5, 0.38, 0.45), mats.whiteMarble);
        rib.position.set(Math.cos(ang) * 27 * 1.18, saddleY, Math.sin(ang) * 27 * 0.92);
        rib.rotation.y = -ang;
        aoti.add(rib);
      }

      // 体育场外立面流线型玻璃幕墙与 24 根V形斜撑钢柱裙边
      const facadeWallGeo = new THREE.CylinderGeometry(33.5, 29.5, 9.8, 56, 4, true);
      const fPos = facadeWallGeo.attributes.position;
      for (let i = 0; i < fPos.count; i++) {
        const vx = fPos.getX(i), vy = fPos.getY(i), vz = fPos.getZ(i);
        const ang = Math.atan2(vz, vx);
        if (vy > 0) fPos.setY(i, vy + Math.cos(ang * 2) * 3.8);
        fPos.setX(i, vx * 1.18);
        fPos.setZ(i, vz * 0.92);
      }
      facadeWallGeo.computeVertexNormals();
      const facadeSkirt = new THREE.Mesh(facadeWallGeo, mats.qingaoGlassMat);
      facadeSkirt.position.y = 5.8;
      aoti.add(facadeSkirt);

      for (let i = 0; i < 24; i++) {
        const ang = (i / 24) * Math.PI * 2;
        const colH = 9.5 + Math.cos(ang * 2) * 2.5;
        const vCol = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.38, colH, 8), mats.whiteMarble);
        vCol.position.set(Math.cos(ang) * 32.5 * 1.18, colH * 0.5 + 1.0, Math.sin(ang) * 32.5 * 0.92);
        aoti.add(vCol);
      }

      // 5. 奥体灵魂标志：两条以 45° 外倾、横跨全场的【360米跨度双曲鲜红桁架巨拱】（双弦管+横撑桁架感+落地混凝土三角拱座）
      [-1, 1].forEach(sideZ => {
        const archPts = [];
        const innerPts = [];
        const numPts = 44;
        for (let i = 0; i <= numPts; i++) {
          const u = (i / numPts) * 2 - 1;
          const x = u * 49;
          const h = (1 - u * u) * 28.5;
          const z = sideZ * (8.5 + (1 - u * u) * 19.0);
          archPts.push(new THREE.Vector3(x, 0.8 + h, z));
          innerPts.push(new THREE.Vector3(x * 0.97, 0.8 + h * 0.93, z * 0.94));
        }
        const archCurve = new THREE.CatmullRomCurve3(archPts);
        const innerCurve = new THREE.CatmullRomCurve3(innerPts);
        const redArchMain = new THREE.Mesh(new THREE.TubeGeometry(archCurve, 52, 1.35, 10, false), mats.aotiCrimsonArch);
        const redArchSub = new THREE.Mesh(new THREE.TubeGeometry(innerCurve, 52, 0.75, 8, false), mats.aotiCrimsonArch);
        redArchMain.castShadow = true;
        aoti.add(redArchMain, redArchSub);

        // 拱架内部横向空间钢桁架腹杆与拉索
        for (let k = -7; k <= 7; k++) {
          const u = (k + 7.5) / 15;
          const pA = archCurve.getPointAt(u);
          const pB = innerCurve.getPointAt(u);
          const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, pA.distanceTo(pB), 6), mats.aotiCrimsonArch);
          strut.position.copy(pA).lerp(pB, 0.5);
          strut.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pB.clone().sub(pA).normalize());
          aoti.add(strut);

          const ux = (u * 2 - 1) * 49;
          const roofEdgeZ = sideZ * 24.0 * Math.sqrt(Math.max(0.15, 1 - Math.pow(u * 2 - 1, 2) * 0.75));
          const roofEdgeY = 11.8 + Math.cos((u * 2 - 1) * Math.PI) * 3.4;
          const pBot = new THREE.Vector3(ux * 0.82, roofEdgeY, roofEdgeZ);
          const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, pA.distanceTo(pBot), 4), mats.stayCableMat);
          hanger.position.copy(pA).lerp(pBot, 0.5);
          hanger.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pBot.clone().sub(pA).normalize());
          aoti.add(hanger);
        }

        // 两端硕大的灰白色混凝土三角落地拱座
        [-49, 49].forEach(endX => {
          const thrustBlock = new THREE.Mesh(new THREE.BoxGeometry(7.5, 4.8, 5.2), mats.whiteMarble);
          thrustBlock.position.set(endX, 1.8, sideZ * 8.5);
          thrustBlock.rotation.z = endX > 0 ? -0.35 : 0.35;
          aoti.add(thrustBlock);
        });
      });

      // 6. 奥体北侧附属场馆群：飞碟流线造型体育馆、海螺游泳馆、网球中心与十运会圣火塔
      [-29, 29].forEach((dx, idx) => {
        const subGroup = new THREE.Group();
        subGroup.position.set(dx, 1.2, -34);
        const subGlass = new THREE.Mesh(new THREE.CylinderGeometry(10.5, 9.2, 4.2, 28), mats.qingaoGlassMat);
        subGlass.scale.set(1.32, 1, 0.92);
        subGlass.position.y = 2.1;
        const subDome = new THREE.Mesh(
          new THREE.SphereGeometry(10.2, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
          mats.silverDome
        );
        subDome.scale.set(1.38, 0.58, 0.96);
        subDome.position.y = 3.2;
        subDome.castShadow = true;
        const subArc = new THREE.Mesh(new THREE.TorusGeometry(10.8, 0.42, 8, 28, Math.PI), mats.aotiCrimsonArch);
        subArc.rotation.x = Math.PI * 0.25 * (idx === 0 ? 1 : -1);
        subArc.position.y = 3.5;
        subGroup.add(subGlass, subDome, subArc);
        aoti.add(subGroup);
      });

      const torchTower = new THREE.Mesh(new THREE.ConeGeometry(1.8, 25, 10), mats.aotiCrimsonArch);
      torchTower.position.set(0, 12.5, -40);
      const torchFlame = new THREE.Mesh(new THREE.OctahedronGeometry(1.4, 1), mats.goldTrim);
      torchFlame.position.set(0, 25.8, -40);
      aoti.add(torchTower, torchFlame);

      group.add(aoti);

      // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
