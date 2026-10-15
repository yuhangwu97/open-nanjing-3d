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
  id: 'jiming',
  name: '古鸡鸣寺 · 药师佛塔',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 11.2 新增第 21 景：【🏯 古鸡鸣寺 · 药师佛塔】（独立坐落于主城鸡笼山 X = -15, Z = -55）
      // 依山势层叠刻画：
      // - 明黄色“古鸡鸣寺”三门山门 + 百级登寺石阶
      // - 毗卢宝殿、大雄宝殿与东西配殿（黄墙、朱红雕花格扇门窗、黛瓦飞檐）
      // - 山巅 44.8 米高的七级八角重檐【药师佛塔】（黄墙、朱红雕花格扇窗、黛瓦飞檐、鎏金塔刹）
      // - 东侧粉白夹道的【鸡鸣寺路樱花大道】
      // -------------------------------------------------------------------------
      const jimingGroup = new THREE.Group();
      const JX = 105, JZ = -245;
      jimingGroup.position.set(JX, 0, JZ);

      // 1. 鸡笼山三层叠翠山形台基与青石挡墙
      const hillBase1 = new THREE.Mesh(new THREE.CylinderGeometry(24, 30, 3.6, 32), mats.islandGrass);
      hillBase1.scale.set(1.15, 1, 1.25);
      hillBase1.position.set(-2, 1.8, 2);
      hillBase1.receiveShadow = true;
      const hillBase2 = new THREE.Mesh(new THREE.CylinderGeometry(18, 23, 4.2, 28), mats.islandGrass);
      hillBase2.position.set(-3, 5.6, -2);
      hillBase2.receiveShadow = true;
      const hillBase3 = new THREE.Mesh(new THREE.CylinderGeometry(11.5, 16, 4.6, 24), mats.islandGrass);
      hillBase3.position.set(-3.5, 9.8, -6);
      hillBase3.receiveShadow = true;
      jimingGroup.add(hillBase1, hillBase2, hillBase3);

      // 依山势砌筑的明黄色寺院围墙
      const compoundWall = new THREE.Mesh(new THREE.BoxGeometry(30, 3.8, 34), mats.imperialYellowGlaze);
      compoundWall.position.set(-3, 4.2, 0);
      jimingGroup.add(compoundWall);

      // 2. 南麓坡脚：明黄色“古鸡鸣寺”三门山门 + 百级登寺石阶 (Z = +20 -> +4)
      const shanmen = new THREE.Group();
      shanmen.position.set(-3, 0, 21);
      const smWall = new THREE.Mesh(new THREE.BoxGeometry(14.5, 5.2, 3.2), mats.imperialYellowGlaze);
      smWall.position.y = 2.6;
      smWall.castShadow = true;
      [-4.2, 0, 4.2].forEach((ax, aIdx) => {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(aIdx === 1 ? 2.6 : 2.0, aIdx === 1 ? 3.5 : 3.0, 3.5), mats.vermilionRed);
        arch.position.set(ax, aIdx === 1 ? 1.75 : 1.5, 0);
        const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(aIdx === 1 ? 2.1 : 1.6, aIdx === 1 ? 3.2 : 2.7, 3.65), mats.ancientLatticeMat);
        doorLeaf.position.set(ax, aIdx === 1 ? 1.6 : 1.35, 0);
        shanmen.add(arch, doorLeaf);
      });
      const smRoof = createChineseRoof(17.2, 5.8, 2.4, mats.darkGreyTile, true);
      smRoof.position.y = 5.2;
      const jmPlaque = new THREE.Mesh(
        new THREE.PlaneGeometry(4.6, 1.45),
        new THREE.MeshBasicMaterial({ map: createJimingPlaqueTexture() })
      );
      jmPlaque.position.set(0, 4.35, 1.68);
      shanmen.add(smWall, smRoof, jmPlaque);
      jimingGroup.add(shanmen);

      // 百级青石登寺石阶与汉白玉护栏（从山门一路拾级而上直达中庭毗卢宝殿）
      for (let st = 0; st < 14; st++) {
        const stepY = 0.5 + st * 0.48;
        const stepZ = 18.5 - st * 1.05;
        const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.5, 1.15), mats.stepTread);
        stepMesh.position.set(-3, stepY, stepZ);
        stepMesh.castShadow = true;
        jimingGroup.add(stepMesh);
      }
      jimingGroup.add(
        createBalustradeSegment(-6.6, 0.5, 18.5, -6.6, 7.2, 4.0, 4),
        createBalustradeSegment(0.6,  0.5, 18.5, 0.6,  7.2, 4.0, 4)
      );

      // 3. 中层核心殿宇群：【毗卢宝殿】（主殿）与【东西配殿（观音殿、财神殿）】
      // 采用明黄墙体 + 古建朱红雕花格扇门窗纹理 + 黛瓦重檐歇山飞檐屋顶
      const piluHall = new THREE.Group();
      piluHall.position.set(-3, 7.6, 1.5);
      const plTerrace = new THREE.Mesh(new THREE.BoxGeometry(16.5, 1.4, 11.5), mats.whiteMarble);
      plTerrace.position.y = 0.7;
      const plYellowWall = new THREE.Mesh(new THREE.BoxGeometry(14.2, 5.2, 8.8), mats.jimingWallMat);
      plYellowWall.position.y = 3.8;
      plYellowWall.castShadow = true;
      const plLatticeFront = new THREE.Mesh(new THREE.BoxGeometry(11.8, 4.2, 9.05), mats.ancientLatticeMat);
      plLatticeFront.position.y = 3.6;
      const plRoof1 = createChineseRoof(17.5, 11.8, 2.2, mats.darkGreyTile, false);
      plRoof1.position.y = 6.3;
      const plRoof2 = createChineseRoof(14.2, 9.4, 2.8, mats.darkGreyTile, true);
      plRoof2.position.y = 8.2;
      // 庭院祈福青铜大香炉与长明宝鼎
      const incenseBurner = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 1.8, 12), mats.bronze);
      incenseBurner.position.set(0, 2.1, 6.2);
      piluHall.add(plTerrace, plYellowWall, plLatticeFront, plRoof1, plRoof2, incenseBurner);
      jimingGroup.add(piluHall);

      // 东西配殿（观音殿、财神殿）
      [-13.5, 7.5].forEach(wx => {
        const sideHall = new THREE.Group();
        sideHall.position.set(wx, 6.8, 2.5);
        const sBody = new THREE.Mesh(new THREE.BoxGeometry(5.6, 4.2, 10.5), mats.jimingWallMat);
        sBody.position.y = 2.1;
        sBody.castShadow = true;
        const sDoor = new THREE.Mesh(new THREE.BoxGeometry(5.85, 3.4, 7.2), mats.ancientLatticeMat);
        sDoor.position.y = 1.9;
        const sRoof = createChineseRoof(7.4, 12.2, 2.1, mats.darkGreyTile, true);
        sRoof.position.y = 4.2;
        sideHall.add(sBody, sDoor, sRoof);
        jimingGroup.add(sideHall);
      });

      // 4. 鸡笼山巅制高点：44.8米高的七级八角重檐【药师佛塔】（黄墙、朱红雕花格扇窗、黛瓦飞檐、鎏金塔刹）
      const yaoshiPagoda = new THREE.Group();
      yaoshiPagoda.position.set(-3.5, 11.8, -7.5);

      // 汉白玉八角雕花须弥座塔基
      const pagodaPed = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 7.0, 2.2, 8), mats.whiteMarble);
      pagodaPed.position.y = 1.1;
      yaoshiPagoda.add(pagodaPed);

      for (let lv = 0; lv < 7; lv++) {
        const r = 4.5 - lv * 0.38;
        const h = 2.85;
        const yBase = 2.2 + lv * 2.75;

        // 明黄色八角塔身 + 四面朱红雕花格扇门窗纹理 + 朱红转角倚柱
        const octYellow = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r, h, 8), mats.jimingWallMat);
        octYellow.position.y = yBase + h * 0.5;
        octYellow.castShadow = true;

        const octWindow = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, h * 0.68, 8), mats.ancientLatticeMat);
        octWindow.position.y = yBase + h * 0.48;

        // 每一层八角回廊朱红平座栏杆
        const balcony = new THREE.Mesh(new THREE.CylinderGeometry(r * 1.14, r * 1.12, 0.42, 8), mats.vermilionRed);
        balcony.position.y = yBase + 0.2;

        // 黛瓦八角翘角飞檐与金色角梁风铎
        const pRoof = createChineseRoof(r * 2.55, r * 2.55, 1.35, mats.darkGreyTile, lv === 6);
        pRoof.position.y = yBase + h;

        yaoshiPagoda.add(octYellow, octWindow, balcony, pRoof);
      }

      // 塔顶八角鎏金覆钵、相轮与宝葫芦塔刹 (Gilded Finial Spire)
      const topSpireY = 2.2 + 7 * 2.75 + 1.2;
      const spireBase = new THREE.Mesh(new THREE.SphereGeometry(1.15, 12, 10), mats.goldTrim);
      spireBase.position.y = topSpireY;
      const spireShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.72, 5.6, 10), mats.goldTrim);
      spireShaft.position.y = topSpireY + 2.8;
      const gourd = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 1), mats.goldTrim);
      gourd.position.y = topSpireY + 5.8;
      yaoshiPagoda.add(spireBase, spireShaft, gourd);
      jimingGroup.add(yaoshiPagoda);

      // 5. 东侧粉白夹道的【鸡鸣寺路樱花大道】（连接鸡鸣寺山门直通北侧解放门台城明城墙）
      const cherryRoad = new THREE.Mesh(new THREE.BoxGeometry(7.6, 0.25, 48), mats.asphaltRoad);
      cherryRoad.position.set(14.5, 0.12, 2);
      const cherrySidewalkL = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 48), mats.platformInlay);
      cherrySidewalkL.position.set(9.8, 0.18, 2);
      const cherrySidewalkR = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.35, 48), mats.platformInlay);
      cherrySidewalkR.position.set(19.2, 0.18, 2);
      jimingGroup.add(cherryRoad, cherrySidewalkL, cherrySidewalkR);

      for (let c = 0; c < 11; c++) {
        const cz = -20 + c * 4.2;
        [9.5, 19.5].forEach((cx, sIdx) => {
          const chTree = createCherryTree(1.08 + (c % 2) * 0.12, c * 3 + sIdx);
          chTree.position.set(cx, 0.2, cz);
          jimingGroup.add(chTree);
        });
      }

      // 鸡鸣寺与鸡笼山四周苍松翠柏点缀
      for (let p = 0; p < 12; p++) {
        const ang = (p / 12) * Math.PI * 1.4 + 0.9;
        const pine = createChinesePine(0.95, p);
        pine.position.set(-3 + Math.cos(ang) * 21, 1.5, Math.sin(ang) * 22);
        jimingGroup.add(pine);
      }

      group.add(jimingGroup);
    scene.add(group);
    return group;
  }
};
