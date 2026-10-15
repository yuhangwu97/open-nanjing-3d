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
  id: 'mingxiaoling',
  name: '明孝陵 · 石象路 & 方城明楼',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 8.4 地标九：【明孝陵 · 全中轴皇家帝陵精细重塑】（右移至 X = 395, Z = -14）
      // 完整呈现世界文化遗产明清皇家第一陵序列：
      // 四方城神功圣德碑楼 -> 600米“ㄈ”形石象路&翁仲路神道 -> 六柱冲天棂星门 -> 五孔汉白玉金水桥 ->
      // 文武方门与红墙夹道 -> 三层白玉月台享殿（孝陵殿） -> 内红门与升仙桥 -> 收分条石方城（圆拱登城隧道、“此山明太祖之墓”刻石、左右折返石阶） -> 四面拱券朱红重檐明楼 -> 宝城垛口与独龙阜宝顶
      // -------------------------------------------------------------------------
      const mingXiaoling = new THREE.Group();
      const MX_X = 395;

      // 1. 后寝圆形封土大土丘【独龙阜宝顶（朱元璋与马皇后合葬处）】与【宝城城垣垛口】 (X = 395, Z = -37)
      const baochengGroup = new THREE.Group();
      baochengGroup.position.set(MX_X, 0, -37);
      // 宝城底部明代条石基座与上部收分青砖圆形城墙
      const bcStoneFoot = new THREE.Mesh(new THREE.CylinderGeometry(23.2, 24.0, 2.2, 40), mats.mingStoneBase);
      bcStoneFoot.position.y = 1.1;
      const bcBrickWall = new THREE.Mesh(new THREE.CylinderGeometry(22.2, 23.2, 4.8, 40), mats.ancientBrickMat);
      bcBrickWall.position.y = 4.6;
      bcBrickWall.castShadow = true;
      baochengGroup.add(bcStoneFoot, bcBrickWall);

      // 宝城城墙顶部 36 个青砖雉堞垛口
      for (let m = 0; m < 36; m++) {
        const ang = (m / 36) * Math.PI * 2;
        const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.1, 0.8), mats.mingBrick);
        merlon.position.set(Math.cos(ang) * 22.3, 7.45, Math.sin(ang) * 22.3);
        merlon.rotation.y = -ang + Math.PI / 2;
        baochengGroup.add(merlon);
      }

      // 宝顶自然浑圆三叠苍翠封土山丘
      const mound1 = new THREE.Mesh(new THREE.CylinderGeometry(17.5, 21.8, 6.5, 36), mats.islandGrass);
      mound1.position.y = 9.5;
      const mound2 = new THREE.Mesh(new THREE.SphereGeometry(18.0, 32, 18, 0, Math.PI * 2, 0, Math.PI * 0.48), mats.grassLand);
      mound2.scale.set(1, 0.68, 1);
      mound2.position.y = 10.2;
      mound2.castShadow = true;
      baochengGroup.add(mound1, mound2);

      // 宝顶之巅苍松、翠柏与深秋色叶林
      for (let p = 0; p < 22; p++) {
        const ang = (p / 22) * Math.PI * 2;
        const r = 4 + (p % 4) * 4.2;
        const hOff = Math.cos((r / 20) * Math.PI * 0.5) * 8.5;
        const tree = p % 3 === 0 ? createWutongTree(0.95, p) : createChinesePine(1.05, p);
        tree.position.set(Math.cos(ang) * r, 12.2 + hOff, Math.sin(ang) * r);
        baochengGroup.add(tree);
      }
      mingXiaoling.add(baochengGroup);

      // 2. 恢弘收分的条石【方城】与四面拱门重檐黄琉璃瓦【明楼】 (X = 395, Z = -14)
      const fangcheng = new THREE.Group();
      fangcheng.position.set(MX_X, 0, -14);

      // 方城下部汉白玉须弥座与向上微收分的明代巨石城台 (宽 26.5m, 深 15m, 高 10.2m)
      const fcPlinth = new THREE.Mesh(new THREE.BoxGeometry(27.6, 1.4, 16.0), mats.whiteMarble);
      fcPlinth.position.y = 0.7;
      // 采用左、右、上三块组合构建带真实圆拱券门洞口的收分方城城台
      const fcLeftBlock = new THREE.Mesh(new THREE.BoxGeometry(10.6, 9.0, 15.0), mats.mingBrick);
      fcLeftBlock.position.set(-7.9, 5.9, 0);
      fcLeftBlock.castShadow = true;
      fcLeftBlock.receiveShadow = true;
      const fcRightBlock = new THREE.Mesh(new THREE.BoxGeometry(10.6, 9.0, 15.0), mats.mingBrick);
      fcRightBlock.position.set(7.9, 5.9, 0);
      fcRightBlock.castShadow = true;
      fcRightBlock.receiveShadow = true;
      const fcUpperBlock = new THREE.Mesh(new THREE.BoxGeometry(5.6, 3.6, 15.0), mats.mingBrick);
      fcUpperBlock.position.set(0, 8.6, 0);
      fcUpperBlock.castShadow = true;
      fangcheng.add(fcPlinth, fcLeftBlock, fcRightBlock, fcUpperBlock);

      // 方城正中央深邃的圆拱形登城隧道（54级台阶暗道）、汉白玉券脸石框与朱红券门
      const tunnelVoid = new THREE.Mesh(new THREE.BoxGeometry(4.8, 5.2, 15.2), mats.darkDoor);
      tunnelVoid.position.set(0, 3.8, 0);
      const tunnelArchTop = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.4, 15.3, 18), mats.darkDoor);
      tunnelArchTop.rotation.x = Math.PI / 2;
      tunnelArchTop.position.set(0, 6.2, 0);
      [-7.55, 7.55].forEach(tz => {
        const marbleArchRing = new THREE.Mesh(new THREE.TorusGeometry(2.55, 0.35, 8, 20, Math.PI), mats.whiteMarble);
        marbleArchRing.position.set(0, 6.1, tz);
        fangcheng.add(marbleArchRing);
      });
      // 宝城/方城题刻“此山明太祖之墓”古石匾
      const tombInscrPlaque = new THREE.Mesh(
        new THREE.PlaneGeometry(5.6, 1.35),
        new THREE.MeshBasicMaterial({ map: createMingXiaolingPlaqueTexture('此山明太祖之墓', '#334155', '#f8fafc') })
      );
      tombInscrPlaque.position.set(0, 9.3, 7.58);
      fangcheng.add(tunnelVoid, tunnelArchTop, tombInscrPlaque);

      // 方城东西两侧登城折返石阶踏道与汉白玉护栏
      [-15.2, 15.2].forEach(sx => {
        const sideRamp = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9.8, 12.6), mats.mingStoneBase);
        sideRamp.position.set(sx, 4.9, -0.5);
        const sideRail = new THREE.Mesh(new THREE.BoxGeometry(3.5, 1.1, 13.0), mats.whiteMarble);
        sideRail.position.set(sx, 10.1, -0.5);
        fangcheng.add(sideRamp, sideRail);
      });

      // 方城顶面汉白玉雕花栏杆与青砖雉堞女墙
      const fcTopDeck = new THREE.Mesh(new THREE.BoxGeometry(27.0, 0.7, 15.4), mats.whiteMarble);
      fcTopDeck.position.y = 10.55;
      fangcheng.add(fcTopDeck);
      for (let bx = -13; bx <= 13; bx += 2.6) {
        [-7.6, 7.6].forEach(bz => {
          const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.7), mats.ancientBrickMat);
          merlon.position.set(bx, 11.4, bz);
          fangcheng.add(merlon);
        });
      }

      // 方城之上的【明楼】（汉白玉须弥座 + 厚重朱红宫墙 + 四面圆拱券门 + 治隆唐宋御碑 + 重檐歇山明黄琉璃瓦屋顶）
      const mlPedestal = new THREE.Mesh(new THREE.BoxGeometry(17.6, 1.3, 11.4), mats.whiteMarble);
      mlPedestal.position.y = 11.45;
      const mlCrimsonWalls = new THREE.Mesh(new THREE.BoxGeometry(16.2, 6.4, 10.2), mats.vermilionRed);
      mlCrimsonWalls.position.y = 15.3;
      mlCrimsonWalls.castShadow = true;
      fangcheng.add(mlPedestal, mlCrimsonWalls);

      // 明楼南北立面三道圆拱券洞门 + 东西立面圆拱券洞门 + 汉白玉券框
      [-4.4, 0, 4.4].forEach(ax => {
        [-5.12, 5.12].forEach(az => {
          const archVoid = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.6, 0.35), mats.darkDoor);
          archVoid.position.set(ax, 14.1, az);
          const archCrown = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.15, 0.38, 14), mats.darkDoor);
          archCrown.rotation.x = Math.PI / 2;
          archCrown.position.set(ax, 15.9, az);
          const archTrim = new THREE.Mesh(new THREE.TorusGeometry(1.22, 0.16, 6, 16, Math.PI), mats.whiteMarble);
          archTrim.position.set(ax, 15.9, az + (az > 0 ? 0.12 : -0.12));
          fangcheng.add(archVoid, archCrown, archTrim);
        });
      });
      [-8.12, 8.12].forEach(ex => {
        const sideArch = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 2.5), mats.darkDoor);
        sideArch.position.set(ex, 14.2, 0);
        fangcheng.add(sideArch);
      });

      // 明楼内康熙御题“治隆唐宋”鎏金巨碑与南檐“明楼”金字匾额
      const zhilongStele = new THREE.Mesh(new THREE.BoxGeometry(2.2, 4.8, 0.65), mats.goldTrim);
      zhilongStele.position.set(0, 14.8, 0);
      const minglouPlaque = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 1.25),
        new THREE.MeshBasicMaterial({ map: createMingXiaolingPlaqueTexture('明 楼') })
      );
      minglouPlaque.position.set(0, 17.6, 5.22);
      const mlRoof1 = createChineseRoof(20.6, 14.2, 2.4, mats.imperialYellowGlaze, false);
      mlRoof1.position.y = 18.4;
      const mlRoof2 = createChineseRoof(16.8, 10.8, 3.3, mats.imperialYellowGlaze, true);
      mlRoof2.position.y = 20.6;
      fangcheng.add(zhilongStele, minglouPlaque, mlRoof1, mlRoof2);
      mingXiaoling.add(fangcheng);

      // 3. 【内红门】与【升仙桥】 (X = 395, Z = -4.5)
      const neihongGate = new THREE.Group();
      neihongGate.position.set(MX_X, 0, -4.5);
      const nhWall = new THREE.Mesh(new THREE.BoxGeometry(14, 3.8, 2.8), mats.vermilionRed);
      nhWall.position.y = 1.9;
      [-3.6, 0, 3.6].forEach(dx => {
        const nhArch = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.6, 3.1), mats.darkDoor);
        nhArch.position.set(dx, 1.3, 0);
        neihongGate.add(nhArch);
      });
      const nhRoof = createChineseRoof(16.0, 4.8, 1.8, mats.imperialYellowGlaze, true);
      nhRoof.position.y = 3.8;
      neihongGate.add(nhWall, nhRoof);
      mingXiaoling.add(neihongGate);

      // 4. 前朝核心：【享殿（孝陵殿）】与三层汉白玉雕花须弥座大月台 (X = 395, Z = 4.5)
      const xiangdian = new THREE.Group();
      xiangdian.position.set(MX_X, 0, 4.5);
      // 三层递进式汉白玉须弥座大月台 + 栏板望柱
      [
        { w: 25.0, d: 15.6, h: 1.0, y: 0.5 },
        { w: 22.4, d: 13.6, h: 1.0, y: 1.5 },
        { w: 19.8, d: 11.6, h: 1.0, y: 2.5 }
      ].forEach(tier => {
        const tMesh = new THREE.Mesh(new THREE.BoxGeometry(tier.w, tier.h, tier.d), mats.whiteMarble);
        tMesh.position.y = tier.y;
        tMesh.receiveShadow = true;
        const rail = new THREE.Mesh(new THREE.BoxGeometry(tier.w + 0.3, 0.45, tier.d + 0.3), mats.platformInlay);
        rail.position.y = tier.y + tier.h * 0.5 + 0.2;
        xiangdian.add(tMesh, rail);
      });
      // 正中云龙丹陛御路踏道石阶
      const danbiRamp = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.2, 4.8), mats.whiteMarble);
      danbiRamp.position.set(0, 1.5, 8.2);
      danbiRamp.rotation.x = 0.52;
      const xdBody = new THREE.Mesh(new THREE.BoxGeometry(15.6, 5.4, 8.8), mats.ancientLatticeMat);
      xdBody.position.y = 5.7;
      xdBody.castShadow = true;
      const xdRoof1 = createChineseRoof(19.2, 12.2, 2.1, mats.imperialYellowGlaze, false);
      xdRoof1.position.y = 8.4;
      const xdRoof2 = createChineseRoof(16.0, 9.8, 2.7, mats.imperialYellowGlaze, true);
      xdRoof2.position.y = 10.3;
      const xdBurner = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 1.8, 12), mats.bronze);
      xdBurner.position.set(0, 3.8, 5.2);
      xiangdian.add(danbiRamp, xdBody, xdRoof1, xdRoof2, xdBurner);

      // 享殿院落两侧皇家红墙回廊与古银杏
      [-15.5, 15.5].forEach(wx => {
        const courtyardWall = new THREE.Mesh(new THREE.BoxGeometry(1.4, 3.6, 22), mats.vermilionRed);
        courtyardWall.position.set(wx, 1.8, 1.0);
        const cRoof = createChineseRoof(2.4, 22.8, 0.9, mats.imperialYellowGlaze, false);
        cRoof.position.set(wx, 3.6, 1.0);
        xiangdian.add(courtyardWall, cRoof);
      });
      mingXiaoling.add(xiangdian);

      // 5. 正门【文武方门】（朱红宫墙、五门三券洞、“明孝陵”金匾）、五孔汉白玉【金水桥】与六柱冲天【棂星门】
      const wenwuGate = new THREE.Group();
      wenwuGate.position.set(MX_X, 0, 16.5);
      const wwWall = new THREE.Mesh(new THREE.BoxGeometry(18.5, 5.2, 4.6), mats.vermilionRed);
      wwWall.position.y = 2.6;
      wwWall.castShadow = true;
      [-4.6, 0, 4.6].forEach(dx => {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(2.3, 3.5, 4.9), mats.darkDoor);
        arch.position.set(dx, 1.75, 0);
        wenwuGate.add(arch);
      });
      const wwPlaque = new THREE.Mesh(
        new THREE.PlaneGeometry(3.4, 1.3),
        new THREE.MeshBasicMaterial({ map: createMingXiaolingPlaqueTexture('明 孝 陵') })
      );
      wwPlaque.position.set(0, 4.3, 2.38);
      const wwRoof = createChineseRoof(21.2, 7.5, 2.4, mats.imperialYellowGlaze, true);
      wwRoof.position.y = 5.2;
      // 门前守门石狮
      [-3.2, 3.2].forEach(lx => {
        const lion = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.8, 1.3), mats.whiteMarble);
        lion.position.set(lx, 0.9, 3.4);
        wenwuGate.add(lion);
      });
      wenwuGate.add(wwWall, wwPlaque, wwRoof);
      mingXiaoling.add(wenwuGate);

      // 五孔汉白玉【金水桥】与金水御河 (Z = 22.5)
      const jinshuiRiver = new THREE.Mesh(new THREE.BoxGeometry(42, 0.4, 4.2), mats.qinhuaiWater);
      jinshuiRiver.position.set(MX_X, 0.05, 22.5);
      mingXiaoling.add(jinshuiRiver);
      [-4.5, 0, 4.5].forEach((bx, bIdx) => {
        const jsBridge = new THREE.Mesh(new THREE.BoxGeometry(bIdx === 1 ? 3.6 : 2.4, 0.85, 5.6), mats.whiteMarble);
        jsBridge.position.set(MX_X + bx, 0.55, 22.5);
        mingXiaoling.add(jsBridge);
      });

      // 六柱三门冲天石牌坊【棂星门】 (Z = 27.5)
      const mxLingxing = new THREE.Group();
      mxLingxing.position.set(MX_X, 0, 27.5);
      [-6.8, -4.0, -1.4, 1.4, 4.0, 6.8].forEach(lx => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.65, 6.4, 0.65), mats.whiteMarble);
        col.position.set(lx, 3.2, 0);
        const cloud = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.75), mats.whiteMarble);
        cloud.position.set(lx, 5.8, 0);
        mxLingxing.add(col, cloud);
      });
      const mxLxBeam = new THREE.Mesh(new THREE.BoxGeometry(14.5, 1.1, 0.8), mats.vermilionRed);
      mxLxBeam.position.y = 4.3;
      mxLingxing.add(mxLxBeam);
      mingXiaoling.add(mxLingxing);

      // 6. 蜿蜒曲折的【600米“最美石象路”与翁仲路神道】 & 【四方城（大明孝陵神功圣德碑楼）】
      const sacredCurvePts = [
        new THREE.Vector3(418, 0.2, 48),
        new THREE.Vector3(395, 0.2, 43),
        new THREE.Vector3(375, 0.2, 35),
        new THREE.Vector3(379, 0.2, 29),
        new THREE.Vector3(395, 0.2, 28)
      ];
      const sacredCurve = new THREE.CatmullRomCurve3(sacredCurvePts);
      const sacredRoad = new THREE.Mesh(
        new THREE.TubeGeometry(sacredCurve, 48, 2.6, 6, false),
        mats.sacredWayStone
      );
      sacredRoad.scale.set(1, 0.08, 1);
      sacredRoad.position.y = 0.12;
      mingXiaoling.add(sacredRoad);

      for (let i = 1; i <= 8; i++) {
        const u = i / 9.2;
        const pt = sacredCurve.getPointAt(u);
        const tangent = sacredCurve.getTangentAt(u).normalize();
        const normal = new THREE.Vector3(-tangent.z, 0, tangent.x);

        [-1, 1].forEach((side, sIdx) => {
          const animalPos = pt.clone().addScaledVector(normal, side * 3.6);
          const statueGroup = new THREE.Group();
          const sPed = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.65, 1.45), mats.mingStoneBase);
          sPed.position.y = 0.32;
          const isWengzhong = (i >= 7);
          const isElephant = (i === 3 || i === 4);
          const isCamel = (i === 5 || i === 6);

          if (isWengzhong) {
            // 翁仲路文臣武将石像与云龙望柱
            const body = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.58, 2.8, 10), mats.whiteMarble);
            body.position.y = 1.9;
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 10, 10), mats.whiteMarble);
            head.position.y = 3.55;
            statueGroup.add(sPed, body, head);
          } else {
            const sBody = new THREE.Mesh(
              new THREE.BoxGeometry(isElephant ? 2.3 : 1.8, isElephant ? 1.4 : 1.1, isElephant ? 1.4 : 1.0),
              mats.whiteMarble
            );
            sBody.position.y = isElephant ? 1.7 : 1.4;
            sBody.castShadow = true;
            statueGroup.add(sPed, sBody);
            [[-0.7, -0.42], [0.7, -0.42], [-0.7, 0.42], [0.7, 0.42]].forEach(([lx, lz]) => {
              const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 1.15, 8), mats.whiteMarble);
              leg.position.set(lx, 0.88, lz);
              statueGroup.add(leg);
            });
            const sHead = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.98, 0.94), mats.whiteMarble);
            sHead.position.set(1.08, isElephant ? 2.0 : 1.88, 0);
            statueGroup.add(sHead);
            if (isElephant) {
              const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 1.38, 8), mats.whiteMarble);
              trunk.position.set(1.45, 1.28, 0);
              trunk.rotation.z = 0.18;
              const ears = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.88, 1.52), mats.whiteMarble);
              ears.position.set(0.94, 2.0, 0);
              statueGroup.add(trunk, ears);
            } else if (isCamel) {
              [-0.42, 0.35].forEach(hx => {
                const hump = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.78, 8), mats.whiteMarble);
                hump.position.set(hx, 2.2, 0);
                statueGroup.add(hump);
              });
            }
          }
          statueGroup.position.copy(animalPos);
          statueGroup.lookAt(pt.x, animalPos.y, pt.z);
          mingXiaoling.add(statueGroup);

          const autumnTree = createWutongTree(0.92 + (i % 2) * 0.12, i * 3 + sIdx);
          const treePos = pt.clone().addScaledVector(normal, side * 6.4);
          autumnTree.position.copy(treePos);
          mingXiaoling.add(autumnTree);
        });
      }

      // 神道东端起点：【四方城（大明孝陵神功圣德碑楼）】(X = 418, Z = 48)
      const sifangcheng = new THREE.Group();
      sifangcheng.position.set(418, 0, 48);
      const sfPlinth = new THREE.Mesh(new THREE.BoxGeometry(12.2, 1.2, 12.2), mats.whiteMarble);
      sfPlinth.position.y = 0.6;
      const sfWalls = new THREE.Mesh(new THREE.BoxGeometry(10.6, 6.8, 10.6), mats.vermilionRed);
      sfWalls.position.y = 4.2;
      sfWalls.castShadow = true;
      // 四面圆拱券门洞
      const sfArchNS = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.4, 11.0), mats.darkDoor);
      sfArchNS.position.y = 3.0;
      const sfArchEW = new THREE.Mesh(new THREE.BoxGeometry(11.0, 4.4, 3.2), mats.darkDoor);
      sfArchEW.position.y = 3.0;
      const sfBixi = new THREE.Mesh(new THREE.BoxGeometry(3.4, 1.4, 2.6), mats.mingStoneBase);
      sfBixi.position.y = 1.6;
      const sfStele = new THREE.Mesh(new THREE.BoxGeometry(2.2, 8.6, 0.9), mats.whiteMarble);
      sfStele.position.y = 5.2;
      const sfRoof1 = createChineseRoof(13.4, 13.4, 2.0, mats.imperialYellowGlaze, false);
      sfRoof1.position.y = 7.6;
      const sfRoof2 = createChineseRoof(11.0, 11.0, 2.6, mats.imperialYellowGlaze, true);
      sfRoof2.position.y = 9.4;
      sifangcheng.add(sfPlinth, sfWalls, sfArchNS, sfArchEW, sfBixi, sfStele, sfRoof1, sfRoof2);
      mingXiaoling.add(sifangcheng);

      group.add(mingXiaoling);

      // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
