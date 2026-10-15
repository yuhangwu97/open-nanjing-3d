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
  id: 'nanbo',
  name: '南京博物院',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 8.5 地标十：【南京博物院（原国立中央博物院“老大殿”）】1:1 严格还原实景航拍图二 (X = 395, Z = 165)
      // 实景图二核心特征：
      // - 屋顶：暖橙红/金棕色琉璃瓦屋面 + 明黄色琉璃正脊与四条垂脊的巨型单檐四阿庑殿顶
      // - 立面：屋檐下白色额枋横带 + 正中8根朱红廊柱构成的9开间深出檐前廊 + 左右两端厚重米白石材包角墩台墙
      // - 左右对称翼楼：从大月台左右两侧向前伸出的L形平顶阙式厢房翼楼（米白墙面开窗 + 深灰平屋顶 + 四周环绕一圈明黄色琉璃瓦挑檐裙边）
      // - 双层白石大月台与前广场：上层白石大月台前缘设镂空方孔白石护栏墙，正中为宽阔的【三出陛御路大石阶】（四道白石栏板分隔三路石阶）通往下层青灰方砖大广场，两侧点缀修剪整齐的球形绿植灌木
      // - 后方与西侧：大殿正后方紧邻现代白灰多窗横长形馆舍楼，西侧耸立现代灰白阶梯几何体特展/艺术馆
      // -------------------------------------------------------------------------
      const nanjingMuseum = new THREE.Group();
      const NM_X = 395, NM_Z = 165;
      nanjingMuseum.position.set(NM_X, 0, NM_Z);

      // 南博专属材质：暖橙红/金棕琉璃瓦屋面 + 明黄屋脊 + 青灰方砖广场
      const nanboTerracottaRoofMat = new THREE.MeshStandardMaterial({
        color: 0xc2410c,
        roughness: 0.28,
        metalness: 0.25,
        emissive: new THREE.Color(0x9a3412),
        emissiveIntensity: 0.16
      });
      const nanboYellowRidgeMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.22,
        metalness: 0.45,
        emissive: new THREE.Color(0xca8a04),
        emissiveIntensity: 0.22
      });
      const nanboBlueGreyTileMat = new THREE.MeshStandardMaterial({
        color: 0x64748b,
        roughness: 0.72,
        metalness: 0.10
      });

      // 1. 下层青灰方砖前广场 (宽 66m, 深 24m, Z = +18) 与左右绿茵草坪、球形冬青灌木丛
      const forecourtPlaza = new THREE.Mesh(new THREE.BoxGeometry(52, 0.55, 22), nanboBlueGreyTileMat);
      forecourtPlaza.position.set(0, 0.28, 19);
      forecourtPlaza.receiveShadow = true;
      nanjingMuseum.add(forecourtPlaza);

      // 前广场中央引桥式三路白石御道与护栏（还原图二下方青灰广场中的三道白石栏杆通道）
      [-7.2, -2.4, 2.4, 7.2].forEach(rx => {
        const lowRail = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.1, 12), mats.whiteMarble);
        lowRail.position.set(rx, 0.85, 23.5);
        nanjingMuseum.add(lowRail);
      });

      // 2. 上层高大白石须弥座大月台 (宽 54m, 高 3.6m, 深 28m, Z = -2)
      const upperTerrace = new THREE.Mesh(new THREE.BoxGeometry(54, 3.6, 28), mats.whiteMarble);
      upperTerrace.position.set(0, 1.8, -2);
      upperTerrace.castShadow = true;
      upperTerrace.receiveShadow = true;
      nanjingMuseum.add(upperTerrace);

      // 月台前缘（Z = +11.8）标志性的【白石镂空方孔护栏墙】（分左右两段，夹在中央大石阶两侧，完全还原图二！）
      [-15.5, 15.5].forEach(bx => {
        const balWall = new THREE.Mesh(new THREE.BoxGeometry(15.0, 1.35, 0.65), mats.whiteMarble);
        balWall.position.set(bx, 3.6 + 0.68, 11.6);
        nanjingMuseum.add(balWall);
        // 护栏下方的一排深色方形泄水/装饰孔洞
        for (let hx = -5.6; hx <= 5.6; hx += 2.8) {
          const hole = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.55, 0.75), mats.darkDoor);
          hole.position.set(bx + hx, 2.85, 11.6);
          nanjingMuseum.add(hole);
        }
      });

      // 月台正中央：超宽【三出陛白石大石阶】（宽 15.6m，由4道白石斜坡栏板分隔为左、中、右三路石阶，直通下层青灰广场）
      for (let s = 0; s < 9; s++) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(15.6, 0.42, 1.05), mats.stepTread);
        st.position.set(0, (s + 0.5) * 0.4, 11.8 + (8 - s) * 0.92);
        st.receiveShadow = true;
        nanjingMuseum.add(st);
      }
      [-7.8, -2.6, 2.6, 7.8].forEach(rx => {
        const stairRail = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.15, 9.2), mats.whiteMarble);
        stairRail.position.set(rx, 2.3, 15.6);
        stairRail.rotation.x = 0.40;
        const postBot = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.6, 0.68), mats.whiteMarble);
        postBot.position.set(rx, 0.9, 19.8);
        const postTop = new THREE.Mesh(new THREE.BoxGeometry(0.68, 1.6, 0.68), mats.whiteMarble);
        postTop.position.set(rx, 4.2, 11.6);
        nanjingMuseum.add(stairRail, postBot, postTop);
      });

      // 3. 核心主馆【老大殿（历史馆）】（位于上层月台北侧 Z = -5.5，Y = 3.6）
      const mainHallGroup = new THREE.Group();
      mainHallGroup.position.set(0, 3.6, -5.5);

      // 内部深红木格扇门窗殿身 (宽 30m, 高 7.0m, 深 15m)
      const innerHall = new THREE.Mesh(new THREE.BoxGeometry(28, 6.8, 14.2), mats.ancientLatticeMat);
      innerHall.position.set(0, 3.4, -0.6);
      innerHall.castShadow = true;
      mainHallGroup.add(innerHall);

      // 左右两端厚重的【米白石材包角墩台墙】（还原图二中朱红柱列左右两侧宽厚的白石山墙包角！）
      [-15.8, 15.8].forEach(wx => {
        const cornerBastion = new THREE.Mesh(new THREE.BoxGeometry(4.8, 7.0, 15.4), mats.whiteMarble);
        cornerBastion.position.set(wx, 3.5, -0.2);
        cornerBastion.castShadow = true;
        mainHallGroup.add(cornerBastion);
      });

      // 正面 8 根鲜艳的【朱红廊柱】（构成 9 开间深前廊，两端柱微向内倾“侧脚”）
      for (let c = 0; c < 8; c++) {
        const cx = -11.55 + c * 3.3;
        const pCol = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.40, 6.6, 12), mats.vermilionRed);
        pCol.position.set(cx, 3.3, 6.8);
        pCol.castShadow = true;
        if (c === 0) pCol.rotation.z = -0.04;
        if (c === 7) pCol.rotation.z = 0.04;
        mainHallGroup.add(pCol);
      }

      // 柱头上方横贯全殿的【白色额枋横带】与正中蓝底牌匾（还原图二屋檐下醒目的白额枋！）
      const whiteArchitrave = new THREE.Mesh(new THREE.BoxGeometry(36.4, 1.05, 15.6), mats.whiteMarble);
      whiteArchitrave.position.set(0, 6.85, -0.2);
      const centerPlaque = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.85, 0.35), mats.blueGlaze);
      centerPlaque.position.set(0, 6.85, 7.7);
      mainHallGroup.add(whiteArchitrave, centerPlaque);

      // 巨型仿辽宋【单檐四阿庑殿顶】：暖橙红/金棕色琉璃瓦屋面 + 明黄色琉璃正脊与四条垂脊（1:1还原图二色彩！）
      const liaoRoof = createChineseRoof(42.5, 22.0, 6.2, nanboTerracottaRoofMat, false);
      liaoRoof.position.set(0, 7.2, -0.2);
      mainHallGroup.add(liaoRoof);

      // 明黄色琉璃瓦主正脊、两端鸱吻与四条斜垂脊 (Bright Yellow Glazed Ridges in Photo 2)
      const yellowMainRidge = new THREE.Mesh(new THREE.BoxGeometry(25.5, 0.95, 1.15), nanboYellowRidgeMat);
      yellowMainRidge.position.set(0, 13.35, -0.2);
      mainHallGroup.add(yellowMainRidge);
      [-12.6, 12.6].forEach(rx => {
        const chiwen = new THREE.Mesh(new THREE.ConeGeometry(0.55, 1.6, 5), nanboYellowRidgeMat);
        chiwen.position.set(rx, 14.1, -0.2);
        mainHallGroup.add(chiwen);
      });
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
        const hipStart = new THREE.Vector3(sx * 12.4, 13.2, -0.2);
        const hipEnd = new THREE.Vector3(sx * 21.2, 7.8, -0.2 + sz * 11.0);
        const hipLen = hipStart.distanceTo(hipEnd);
        const hipRidge = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.36, hipLen, 6), nanboYellowRidgeMat);
        hipRidge.position.copy(hipStart).lerp(hipEnd, 0.5);
        hipRidge.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), hipEnd.clone().sub(hipStart).normalize());
        mainHallGroup.add(hipRidge);
      });

      nanjingMuseum.add(mainHallGroup);

      // 4. 左右两侧对称向前伸出的【L形平顶带明黄琉璃瓦挑檐裙边翼楼】（1:1还原图二左右两侧伸出的平顶黄檐厢房！）
      [-23.5, 23.5].forEach(wx => {
        const wingGroup = new THREE.Group();
        wingGroup.position.set(wx, 0, 8.5);

        // 翼楼下部白石台基与米白开窗墙体
        const wingBase = new THREE.Mesh(new THREE.BoxGeometry(11.5, 3.6, 20.5), mats.whiteMarble);
        wingBase.position.y = 1.8;
        const wingWalls = new THREE.Mesh(new THREE.BoxGeometry(10.6, 3.6, 19.6), mats.palaceCream);
        wingWalls.position.y = 5.4;
        wingWalls.castShadow = true;
        wingGroup.add(wingBase, wingWalls);

        // 翼楼正面与内侧整齐排列的深色矩形窗洞
        for (let kx = -3.2; kx <= 3.2; kx += 2.1) {
          const winF = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.5, 0.3), mats.darkDoor);
          winF.position.set(kx, 5.3, 9.8);
          const winB = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.3), mats.darkDoor);
          winB.position.set(kx, 2.2, 10.25);
          wingGroup.add(winF, winB);
        }

        // 四周环绕一圈的【明黄色琉璃瓦挑檐裙边】 + 中央【深灰色平屋顶平台】（图二最鲜明的特征！）
        const yellowEaveSkirt = createChineseRoof(13.2, 22.2, 1.55, nanboYellowRidgeMat, false);
        yellowEaveSkirt.position.y = 6.8;
        const flatGreyRoofDeck = new THREE.Mesh(new THREE.BoxGeometry(9.8, 0.95, 18.6), mats.memorialDarkSlate);
        flatGreyRoofDeck.position.y = 7.95;
        const roofParapet = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.45, 19.0), nanboYellowRidgeMat);
        roofParapet.position.y = 7.65;
        wingGroup.add(yellowEaveSkirt, flatGreyRoofDeck, roofParapet);

        // 翼楼前角修剪圆润的巨型球形冬青绿植灌木（还原图二左右翼楼前方的两团深绿圆灌木！）
        const bigBush = new THREE.Mesh(sharedGeos.wutongPuff, mats.pineNeedles);
        bigBush.scale.set(3.2, 2.6, 3.2);
        bigBush.position.set(wx > 0 ? -1.5 : 1.5, 2.4, 12.2);
        bigBush.castShadow = true;
        wingGroup.add(bigBush);

        nanjingMuseum.add(wingGroup);
      });

      // 5. 大殿正后方紧邻的【现代白灰多窗横长形馆舍楼】与西侧【现代灰白阶梯几何场馆】（还原图二背景与左侧建筑！）
      const rearAdminBuilding = new THREE.Group();
      rearAdminBuilding.position.set(0, 0, -21);
      const rearBody = new THREE.Mesh(new THREE.BoxGeometry(26, 15.5, 9.5), mats.whiteMarble);
      rearBody.position.y = 7.75;
      rearBody.castShadow = true;
      const rearRoof = new THREE.Mesh(new THREE.BoxGeometry(26.6, 0.8, 10.0), mats.memorialDarkSlate);
      rearRoof.position.y = 15.8;
      rearAdminBuilding.add(rearBody, rearRoof);
      for (let ry = 9.5; ry <= 14.0; ry += 2.2) {
        for (let rx = -10.5; rx <= 10.5; rx += 2.6) {
          const rWin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.25), mats.darkDoor);
          rWin.position.set(rx, ry, 4.8);
          rearAdminBuilding.add(rWin);
        }
      }
      nanjingMuseum.add(rearAdminBuilding);

      // 西侧现代灰白石材阶梯几何体场馆（还原图二左侧现代馆体）
      const westModernHall = new THREE.Group();
      westModernHall.position.set(-38, 0, -6);
      const wmBase = new THREE.Mesh(new THREE.BoxGeometry(16, 11.5, 28), mats.platformInlay);
      wmBase.position.y = 5.75;
      wmBase.castShadow = true;
      const wmTop = new THREE.Mesh(new THREE.BoxGeometry(14, 3.8, 22), mats.memorialDarkSlate);
      wmTop.position.set(-0.5, 13.4, -2);
      westModernHall.add(wmBase, wmTop);
      nanjingMuseum.add(westModernHall);

      group.add(nanjingMuseum);

    scene.add(group);
    return group;
  }
};
