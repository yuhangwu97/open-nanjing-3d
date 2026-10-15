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
  id: 'fangshan',
  name: '江宁方山 · 定林寺斜塔',
  build(scene, ctx) {
  let radarDishMesh = null;

    // buildFangshanVolcanoAndLeaningPagoda
      // -------------------------------------------------------------------------
      // 地标十九：【江宁方山（实景航拍图一 1:1 复刻：平顶翠绿茶园火山台地 + 白色球形气象雷达站 + 依山层叠定林寺明黄琉璃瓦建筑群 & 斜塔）】
      // 严格对照实景航拍图一 (image_9d60e7.jpg) 重构：
      // 1. 山体与山顶：郁郁葱葱的深翠森林平顶火山山脉，山顶左上方平缓台地铺设整齐的翠绿茶园垄带，并矗立着醒目的【白色球形气象雷达站圆顶】！
      // 2. 左上高台寺院建筑群：依山势筑起高大青石护坡挡墙与叠水瀑布墙，高台之上耸立【三层重檐明黄琉璃瓦万佛阁/藏经楼】（带黄色双拱基座），下方衔接白墙灰瓦现代禅修院落。
      // 3. 中下层核心定林寺建筑群：依山谷台地层叠展开——中央为【重檐歇山顶明黄琉璃瓦大雄宝殿】，两侧对称排布多座【黄墙明黄琉璃瓦配殿、钟鼓楼與回廊】，前排为【白墙黑瓦江南山门殿与鲜红立柱玻璃连廊】及石板广场。
      // 4. 定林寺斜塔与盘山路：东侧山腰林间矗立倾斜 7.59° 的南宋七级八角【定林寺斜塔】，两侧山坡蜿蜒盘山公路，漫山遍野覆盖 200+ 棵苍翠森林！
      // -------------------------------------------------------------------------
      const group = new THREE.Group();
      const FX = 455, FZ = 405;
      group.scale.setScalar(1.12);
      group.position.set(FX, 0, FZ);

      // 1. 方山平顶翠绿森林火山地形网格（北高南缓，形成供定林寺依山层叠筑台的天然山谷坡面！）
      const fsGeo = new THREE.PlaneGeometry(165, 165, 56, 56);
      fsGeo.rotateX(-Math.PI / 2);
      const fsPos = fsGeo.attributes.position;
      const fsCols = new Float32Array(fsPos.count * 3);
      const cDeepForest = new THREE.Color(0x14532d);
      const cLushGreen = new THREE.Color(0x15803d);
      const cTeaTerrace = new THREE.Color(0x4d7c0f);

      function getFangshanSlopeH(lx, lz) {
        // 北侧与左上侧为高耸平顶死火山台地 (lz < -8, H ≈ 38)，向南顺坡层叠而下至山麓寺院群 (lz: -5 -> +55)
        const radial = Math.hypot(lx * 0.88, (lz + 10) * 0.85);
        let h = 40 * Math.exp(-Math.pow(Math.max(0, radial - 28) / 42, 1.75));
        // 山顶西北部平顶茶园平台 (lx < 5, lz < -8)
        if (lx < 12 && lz < -6 && radial < 34) {
          h = Math.max(h, 36.5 - Math.max(0, radial - 22) * 0.4);
        }
        // 中南坡寺院三级台地切削（让建筑稳稳坐落在层叠山腰平台上）
        if (Math.abs(lx) < 36 && lz > -4 && lz < 52) {
          const slopeT = THREE.MathUtils.clamp((lz - (-4)) / 56, 0, 1);
          const steppedH = THREE.MathUtils.lerp(24.0, 2.5, slopeT);
          const blend = THREE.MathUtils.smoothstep(Math.abs(lx), 22, 38);
          h = THREE.MathUtils.lerp(steppedH, h, blend);
        }
        if (h > 2.0) {
          h += Math.sin(lx * 0.12 + lz * 0.10) * 1.1;
        }
        return Math.max(0.5, h);
      }

      for (let i = 0; i < fsPos.count; i++) {
        const vx = fsPos.getX(i), vz = fsPos.getZ(i);
        const vy = getFangshanSlopeH(vx, vz);
        fsPos.setY(i, vy);

        const c = new THREE.Color();
        if (vy > 34 && vx < 10 && vz < -6) {
          // 山顶翠绿茶园梯田条纹
          const stripe = Math.sin(vz * 1.6) > 0 ? 0.25 : 0.0;
          c.copy(cLushGreen).lerp(cTeaTerrace, 0.55 + stripe);
        } else {
          const n = Math.sin(vx * 0.09 + vz * 0.08) * 0.5 + 0.5;
          c.copy(cDeepForest).lerp(cLushGreen, n * 0.75);
        }
        fsCols[i * 3] = c.r;
        fsCols[i * 3 + 1] = c.g;
        fsCols[i * 3 + 2] = c.b;
      }
      fsGeo.setAttribute('color', new THREE.BufferAttribute(fsCols, 3));
      fsGeo.computeVertexNormals();
      const fsMountain = new THREE.Mesh(
        fsGeo,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86 })
      );
      fsMountain.castShadow = true;
      fsMountain.receiveShadow = true;
      group.add(fsMountain);

      // 2. 图一左上角山顶平顶茶园与标志性的【白色球形气象雷达站圆顶】(White Spherical Radar Dome on Summit Plateau)
      const summitY = getFangshanSlopeH(-18, -24);
      const radarStation = new THREE.Group();
      radarStation.position.set(-18, summitY, -24);
      const radarTowerBase = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 3.2, 16), mats.whiteMarble);
      radarTowerBase.position.y = 1.6;
      const radarSphereDome = new THREE.Mesh(new THREE.SphereGeometry(2.35, 24, 20), mats.zahaWhiteFacade);
      radarSphereDome.position.y = 4.6;
      radarSphereDome.castShadow = true;
      radarStation.add(radarTowerBase, radarSphereDome);
      group.add(radarStation);

      // 山顶翠绿茶园垄带立体模型 (Neat Green Tea Plantation Rows on Summit)
      for (let tz = -34; tz <= -12; tz += 2.6) {
        const teaRow = new THREE.Mesh(new THREE.BoxGeometry(24, 0.55, 1.35), mats.aotiTurfMat);
        teaRow.position.set(-12, getFangshanSlopeH(-12, tz) + 0.25, tz);
        group.add(teaRow);
      }

      // 3. 图一左侧高台建筑群：【三层重檐明黄琉璃瓦万佛阁/藏经楼 + 黄色双拱基座 + 叠水瀑布高挡墙 + 白墙灰瓦现代禅院】
      const upperWestPav = new THREE.Group();
      const uwY = getFangshanSlopeH(-24, 6);
      upperWestPav.position.set(-24, uwY, 6);

      // 黄色双拱门基座台与前侧灰石叠水瀑布挡墙
      const yellowArchBase = new THREE.Mesh(new THREE.BoxGeometry(16.5, 4.2, 11.5), mats.palaceCream);
      yellowArchBase.position.y = 2.1;
      [-3.2, 3.2].forEach(ax => {
        const archHole = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.6, 0.5), mats.darkDoor);
        archHole.position.set(ax, 1.5, 5.6);
        upperWestPav.add(archHole);
      });
      const waterfallWall = new THREE.Mesh(new THREE.BoxGeometry(18.0, 5.2, 2.2), mats.mingStoneBase);
      waterfallWall.position.set(2, -1.8, 7.5);
      upperWestPav.add(yellowArchBase, waterfallWall);

      // 三层重檐明黄琉璃瓦高阁（还原图一左侧醒目的三层黄琉璃瓦大楼阁！）
      for (let lv = 0; lv < 3; lv++) {
        const w = 13.8 - lv * 1.4;
        const d = 9.6 - lv * 1.0;
        const h = 3.1;
        const y0 = 4.2 + lv * 3.1;
        const hallBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats.ancientLatticeMat);
        hallBody.position.y = y0 + h * 0.5;
        hallBody.castShadow = true;
        const eaveRoof = createChineseRoof(w + 3.4, d + 3.0, lv === 2 ? 2.8 : 1.5, mats.imperialYellowGlaze, lv === 2);
        eaveRoof.position.y = y0 + h;
        upperWestPav.add(hallBody, eaveRoof);
      }

      // 高阁下方衔接的白墙灰瓦现代禅修院落（还原图一左下侧白墙平顶与灰瓦斜顶院落）
      const whiteCourtyard = new THREE.Mesh(new THREE.BoxGeometry(16, 3.6, 12), mats.whiteMarble);
      whiteCourtyard.position.set(1.5, -3.2, 16);
      const greyPitchedHall = new THREE.Mesh(new THREE.BoxGeometry(15, 3.4, 6.5), mats.whiteMarble);
      greyPitchedHall.position.set(3.5, -4.5, 24);
      const greyPitchedRoof = createChineseRoof(16.5, 8.0, 2.0, mats.darkGreyTile, false);
      greyPitchedRoof.position.set(3.5, -2.8, 24);
      upperWestPav.add(whiteCourtyard, greyPitchedHall, greyPitchedRoof);
      group.add(upperWestPav);

      // 4. 图一中上层台地：【第二座三层黄琉璃瓦楼阁 + 对称黄瓦殿宇院落】 (X = -4, Z = -2)
      const upperMidCompound = new THREE.Group();
      const umY = getFangshanSlopeH(-4, -2);
      upperMidCompound.position.set(-4, umY, -2);

      const umTerrace = new THREE.Mesh(new THREE.BoxGeometry(28, 3.5, 22), mats.mingStoneBase);
      umTerrace.position.y = 1.75;
      upperMidCompound.add(umTerrace);

      // 后方高层三层明黄琉璃瓦宝阁
      const rearTowerBody = new THREE.Mesh(new THREE.BoxGeometry(11.5, 7.2, 8.2), mats.ancientLatticeMat);
      rearTowerBody.position.set(-4, 3.5 + 3.6, -6);
      const rearTowerRoof1 = createChineseRoof(14.2, 10.6, 1.8, mats.imperialYellowGlaze, false);
      rearTowerRoof1.position.set(-4, 3.5 + 5.2, -6);
      const rearTowerRoof2 = createChineseRoof(13.0, 9.6, 2.5, mats.imperialYellowGlaze, true);
      rearTowerRoof2.position.set(-4, 3.5 + 7.2, -6);
      upperMidCompound.add(rearTowerBody, rearTowerRoof1, rearTowerRoof2);

      // 中庭黄墙黄瓦殿宇与左右配殿
      const midHallBody = new THREE.Mesh(new THREE.BoxGeometry(9.5, 4.2, 6.8), mats.jimingWallMat);
      midHallBody.position.set(2, 3.5 + 2.1, 2);
      const midHallRoof = createChineseRoof(11.8, 8.8, 2.2, mats.imperialYellowGlaze, true);
      midHallRoof.position.set(2, 3.5 + 4.2, 2);
      upperMidCompound.add(midHallBody, midHallRoof);

      [-7, 10].forEach(sx => {
        const sWing = new THREE.Mesh(new THREE.BoxGeometry(5.2, 3.4, 8.5), mats.jimingWallMat);
        sWing.position.set(sx, 3.5 + 1.7, 5);
        const sRoof = createChineseRoof(6.8, 10.2, 1.7, mats.imperialYellowGlaze, false);
        sRoof.position.set(sx, 3.5 + 3.4, 5);
        upperMidCompound.add(sWing, sRoof);
      });
      group.add(upperMidCompound);

      // 5. 图一前景核心：【定林寺主院落（重檐黄瓦大雄宝殿 + 左右黄墙金瓦配殿群 + 前排白墙黛瓦山门殿与红柱玻璃连廊）】 (X = 4, Z = 28)
      const lowerMainTemple = new THREE.Group();
      const lmY = getFangshanSlopeH(4, 28);
      lowerMainTemple.position.set(4, lmY, 28);

      const mainCourtSlab = new THREE.Mesh(new THREE.BoxGeometry(42, 3.2, 32), mats.platformInlay);
      mainCourtSlab.position.y = 1.6;
      mainCourtSlab.receiveShadow = true;
      lowerMainTemple.add(mainCourtSlab);

      // 核心【重檐歇山顶明黄琉璃瓦大雄宝殿】
      const daxiongBody = new THREE.Mesh(new THREE.BoxGeometry(14.5, 5.8, 10.2), mats.ancientLatticeMat);
      daxiongBody.position.set(-2, 3.2 + 2.9, -6);
      daxiongBody.castShadow = true;
      const dxRoof1 = createChineseRoof(18.2, 13.4, 2.1, mats.imperialYellowGlaze, false);
      dxRoof1.position.set(-2, 3.2 + 5.6, -6);
      const dxRoof2 = createChineseRoof(14.8, 10.5, 2.8, mats.imperialYellowGlaze, true);
      dxRoof2.position.set(-2, 3.2 + 7.5, -6);
      lowerMainTemple.add(daxiongBody, dxRoof1, dxRoof2);

      // 殿前黄墙明黄瓦前殿与左右对称黄瓦配殿群（还原图一前景密布的黄色琉璃瓦屋顶群！）
      [
        { x: 2,  z: 3,  w: 10.5, d: 6.8, h: 4.2 },
        { x: 11, z: -5, w: 9.2,  d: 7.2, h: 4.5 },
        { x: 16, z: 4,  w: 7.5,  d: 11.0, h: 4.0 },
        { x: -13, z: 2, w: 7.2,  d: 9.5, h: 4.0 }
      ].forEach(hCfg => {
        const hBox = new THREE.Mesh(new THREE.BoxGeometry(hCfg.w, hCfg.h, hCfg.d), mats.jimingWallMat);
        hBox.position.set(hCfg.x, 3.2 + hCfg.h * 0.5, hCfg.z);
        hBox.castShadow = true;
        const hRoof = createChineseRoof(hCfg.w + 2.4, hCfg.d + 2.2, 2.1, mats.imperialYellowGlaze, true);
        hRoof.position.set(hCfg.x, 3.2 + hCfg.h, hCfg.z);
        lowerMainTemple.add(hBox, hRoof);
      });

      // 图一最下方前排：【白墙黑瓦江南式山门殿、侧厢房与鲜红立柱连廊】+ 庭院中央青铜佛像雕塑
      const frontGreyHall = new THREE.Mesh(new THREE.BoxGeometry(15.5, 3.8, 6.2), mats.whiteMarble);
      frontGreyHall.position.set(-1, 3.2 + 1.9, 11.5);
      const frontGreyRoof = createChineseRoof(17.2, 7.8, 2.1, mats.darkGreyTile, false);
      frontGreyRoof.position.set(-1, 3.2 + 3.8, 11.5);
      // 鲜红立柱遮阳连廊（图一前景醒目的红色廊檐！）
      const redCorridor = new THREE.Mesh(new THREE.BoxGeometry(15.8, 0.45, 2.2), mats.aotiCrimsonArch);
      redCorridor.position.set(-1, 3.2 + 2.8, 15.2);
      const courtyardBronze = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.9, 2.8, 10), mats.bronze);
      courtyardBronze.position.set(-4, 3.2 + 1.4, 18.5);
      lowerMainTemple.add(frontGreyHall, frontGreyRoof, redCorridor, courtyardBronze);

      group.add(lowerMainTemple);

      // 6. 东侧山腰传奇：【南宋定林寺斜塔（倾斜 7.59° 的七级八角楼阁式砖塔）】 (X = 22, Z = 2)
      const leaningPagoda = new THREE.Group();
      const lpY = getFangshanSlopeH(22, 2);
      leaningPagoda.position.set(22, lpY, 2);
      leaningPagoda.rotation.z = -0.145;
      leaningPagoda.rotation.x = -0.05;

      const stonePed = new THREE.Mesh(new THREE.CylinderGeometry(2.8, 3.2, 1.8, 8), mats.mingStoneBase);
      stonePed.position.y = 0.9;
      leaningPagoda.add(stonePed);

      for (let lv = 0; lv < 7; lv++) {
        const r = 2.4 - lv * 0.20;
        const h = 2.05;
        const yPos = 1.8 + lv * 2.0;
        const pBody = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r, h, 8), mats.palaceCream);
        pBody.position.y = yPos + h / 2;
        pBody.castShadow = true;
        const pEave = createChineseRoof(r * 2.4, r * 2.4, 1.0, mats.darkGreyTile, false);
        pEave.position.y = yPos + h;
        leaningPagoda.add(pBody, pEave);
      }
      const ironSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.48, 3.6, 8), mats.bronze);
      ironSpire.position.y = 1.8 + 7 * 2.0 + 1.8;
      leaningPagoda.add(ironSpire);
      group.add(leaningPagoda);

      // 7. 还原图一穿行于浓密绿林间的【左右两条蜿蜒灰白盘山公路】
      [
        [[-18, -14], [-22, -4], [-20, 8], [-15, 22]],
        [[18, -12], [24, 4], [26, 18], [22, 34]]
      ].forEach(ptsArr => {
        const rPts = ptsArr.map(([rx, rz]) => new THREE.Vector3(rx, getFangshanSlopeH(rx, rz) + 0.55, rz));
        const rMesh = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rPts), 32, 1.25, 6, false),
          mats.platformInlay
        );
        rMesh.scale.set(1, 0.2, 1);
        group.add(rMesh);
      });

      // 8. 漫山遍野的 210 棵浓密苍翠森林（采用深翠松树与常绿阔叶树冠，还原图一满目苍翠的森林包裹感！）
      const lushGreenCanopyMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.72 });
      function createLushGreenTree(scale = 1.0, seed = 0) {
        const t = new THREE.Group();
        const tr = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
        tr.position.y = 0.9;
        t.add(tr);
        [[0, 2.8, 0, 1.35, 0.95, 1.35], [-0.7, 2.4, 0.4, 1.0, 0.8, 1.0], [0.7, 2.4, -0.4, 1.0, 0.8, 1.0]].forEach(([ox, oy, oz, sx, sy, sz]) => {
          const p = new THREE.Mesh(sharedGeos.wutongPuff, lushGreenCanopyMat);
          p.position.set(ox, oy, oz);
          p.scale.set(sx, sy, sz);
          p.castShadow = true;
          t.add(p);
        });
        t.scale.setScalar(scale);
        return t;
      }

      for (let i = 0; i < 210; i++) {
        const rRatio = Math.sqrt((i + 0.5) / 210);
        const theta = i * 2.3999632;
        const tx = Math.cos(theta) * rRatio * 74;
        const tz = Math.sin(theta) * rRatio * 72;
        // 避开山顶茶园、雷达站以及山腰寺院平台核心区
        if (tx < 8 && tz < -10 && Math.hypot(tx + 12, tz + 22) < 18) continue;
        if (Math.hypot(tx + 24, tz - 6) < 12) continue;
        if (Math.hypot(tx + 4, tz + 2) < 15) continue;
        if (Math.hypot(tx - 4, tz - 28) < 20) continue;

        const ty = getFangshanSlopeH(tx, tz);
        const tree = i % 3 === 0 ? createChinesePine(1.05 + (i % 3) * 0.15, i) : createLushGreenTree(1.0 + (i % 3) * 0.18, i);
        tree.position.set(tx, ty - 0.2, tz);
        group.add(tree);
      }

      scene.add(group);
    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      if (radarDishMesh) {
        radarDishMesh.rotation.y = elapsed * 2.2;
      }
      });
    }
    return group;
  }
};
