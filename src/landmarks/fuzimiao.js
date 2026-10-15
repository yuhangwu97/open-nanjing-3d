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
  id: 'fuzimiao',
  name: '夫子庙 · 十里秦淮 & 天下文枢',
  build(scene, ctx) {
    const group = new THREE.Group();
  const animatedQinhuaiBoats = [];

    function buildConfuciusTempleQinhuai() {
      const group = new THREE.Group();
      const FX = 145, FZ = 195;

      // 10.1 蜿蜒流淌的【外秦淮河与十里内秦淮水系】（串联东侧夫子庙泮池与西侧中华门外秦淮护城河长干桥）
      const qinhuaiCurvePts = [
        new THREE.Vector3(265, 0.1, 228),
        new THREE.Vector3(205, 0.1, 206),
        new THREE.Vector3(FX,  0.1, FZ + 6),
        new THREE.Vector3(82,  0.1, 212),
        new THREE.Vector3(32,  0.1, 232),
        new THREE.Vector3(-10, 0.1, 238),
        new THREE.Vector3(-75, 0.1, 218),
        new THREE.Vector3(-145, 0.1, 145)
      ];
      const qinhuaiCurve = new THREE.CatmullRomCurve3(qinhuaiCurvePts);
      const streamTube = new THREE.Mesh(
        new THREE.TubeGeometry(qinhuaiCurve, 96, 6.5, 8, false),
        mats.qinhuaiWater
      );
      streamTube.scale.set(1, 0.05, 1);
      streamTube.position.y = 0.05;
      group.add(streamTube);

      // 夫子庙泮池与核心河段加宽水面
      const riverWater = new THREE.Mesh(new THREE.BoxGeometry(126, 0.5, 22), mats.qinhuaiWater);
      riverWater.position.set(FX, -0.04, FZ + 6);
      riverWater.receiveShadow = true;
      group.add(riverWater);

      // 夫子庙核心标志：【半月形泮池石栏】与游船画舫码头
      const panchiArc = new THREE.Mesh(
        new THREE.TorusGeometry(16, 0.65, 8, 28, Math.PI),
        mats.whiteMarble
      );
      panchiArc.rotation.x = Math.PI / 2;
      panchiArc.scale.set(1.3, 0.55, 1);
      panchiArc.position.set(FX, 1.2, FZ - 4.8);
      group.add(panchiArc);

      // 南北两岸青石驳岸与白玉雕花护栏
      [-5.5, 17.5].forEach(zOffset => {
        const bank = new THREE.Mesh(new THREE.BoxGeometry(126, 1.4, 2.2), mats.mingStoneBase);
        bank.position.set(FX, 0.5, FZ + zOffset);
        group.add(bank);
        group.add(createBalustradeSegment(FX - 56, 1.0, FZ + zOffset, FX + 56, 1.0, FZ + zOffset, 20));
      });

      // 10.2 南岸标志性【110米夫子庙双龙戏珠大照壁】与西侧【乌衣巷】门坊
      const screenWall = new THREE.Group();
      const wallBody = new THREE.Mesh(new THREE.BoxGeometry(48, 7.8, 1.6), mats.vermilionRed);
      wallBody.position.y = 3.9;
      wallBody.castShadow = true;
      const wallRoof = createChineseRoof(51, 3.8, 1.9, mats.darkGreyTile, true);
      wallRoof.position.y = 7.8;
      const firePearl = new THREE.Mesh(new THREE.SphereGeometry(1.25, 12, 12), mats.goldTrim);
      firePearl.position.set(0, 4.1, -0.95);
      screenWall.add(wallBody, wallRoof, firePearl);

      [-10.5, 10.5].forEach((dx, dIdx) => {
        const dragonRelief = new THREE.Mesh(new THREE.TorusGeometry(2.6, 0.45, 8, 24, Math.PI * 1.5), mats.goldTrim);
        dragonRelief.position.set(dx, 4.1, -0.92);
        const dragonHead = new THREE.Mesh(new THREE.ConeGeometry(0.9, 2.0, 6), mats.goldTrim);
        dragonHead.position.set(dx + (dIdx === 0 ? 2.6 : -2.6), 4.6, -0.95);
        dragonHead.rotation.z = dIdx === 0 ? -Math.PI / 3 : Math.PI / 3;
        screenWall.add(dragonRelief, dragonHead);
      });
      screenWall.position.set(FX, 0.8, FZ + 18.8);
      group.add(screenWall);

      const wuyiAlley = new THREE.Group();
      wuyiAlley.position.set(FX - 34, 0.8, FZ + 21);
      const wyGate = new THREE.Mesh(new THREE.BoxGeometry(7.5, 5.2, 2.2), mats.whiteMarble);
      wyGate.position.y = 2.6;
      const wyArch = new THREE.Mesh(new THREE.BoxGeometry(2.8, 3.4, 2.5), mats.darkDoor);
      wyArch.position.y = 1.7;
      const wyRoof = createChineseRoof(9.2, 3.8, 1.8, mats.darkGreyTile, false);
      wyRoof.position.y = 5.2;
      wuyiAlley.add(wyGate, wyArch, wyRoof);
      group.add(wuyiAlley);

      // 10.3 南岸东侧【魁光阁 / 聚星亭】八角飞檐三重阁楼
      const kuiguang = new THREE.Group();
      for (let lv = 0; lv < 3; lv++) {
        const r = 4.2 - lv * 0.8;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 3.2, 8), mats.vermilionRed);
        body.position.y = 1.6 + lv * 3.2;
        const roof = createChineseRoof(r * 2.5, r * 2.5, 1.5, mats.goldTrim, lv === 2);
        roof.position.y = 3.2 + lv * 3.2;
        kuiguang.add(body, roof);
      }
      kuiguang.position.set(FX + 32, 0.8, FZ + 20);
      group.add(kuiguang);

      // 10.4 【文德桥】与东侧【桃叶渡古桥】
      [-22, 42].forEach((bridgeX, bIdx) => {
        const qBridge = new THREE.Group();
        const bWidth = bIdx === 0 ? 5.8 : 4.6;
        const archDeck = new THREE.Mesh(
          new THREE.CylinderGeometry(14.5, 13.6, bWidth, 28, 1, false, -Math.PI * 0.28, Math.PI * 0.56),
          mats.whiteMarble
        );
        archDeck.rotation.z = Math.PI / 2;
        archDeck.position.set(0, -9.2, 0);
        qBridge.add(archDeck);

        [-(bWidth * 0.46), (bWidth * 0.46)].forEach(bx => {
          const archRail = new THREE.Mesh(
            new THREE.CylinderGeometry(15.3, 14.5, 0.42, 28, 1, false, -Math.PI * 0.27, Math.PI * 0.54),
            mats.goldTrim
          );
          archRail.rotation.z = Math.PI / 2;
          archRail.position.set(bx, -9.2, 0);
          qBridge.add(archRail);
        });

        [-11.2, 11.2].forEach(az => {
          const abut = new THREE.Mesh(new THREE.BoxGeometry(bWidth + 1.2, 2.2, 4.2), mats.mingStoneBase);
          abut.position.set(0, 0.9, az);
          const stepRamp = new THREE.Mesh(new THREE.BoxGeometry(bWidth, 1.4, 3.8), mats.whiteMarble);
          stepRamp.position.set(0, 1.4, az + (az > 0 ? 1.8 : -1.8));
          stepRamp.rotation.x = az > 0 ? 0.32 : -0.32;
          qBridge.add(abut, stepRamp);
        });

        qBridge.position.set(FX + bridgeX, 0, FZ + 6);
        group.add(qBridge);
      });

      // -------------------------------------------------------------------------
      // 10.5 新增恢弘的 66 米宽【夫子庙天下文枢礼仪大广场】（位于天下文枢牌坊 Z=FZ-6.5 与六柱棂星门 Z=FZ-28.5 之间）
      // 包含：双色花岗岩与白玉御道铺装、正中高大汉白玉基座孔子行教青铜巨像、三足青铜大香炉、守门双石狮、左右对称“道冠古今”与“德配天地”牌坊及宫灯银杏阵列
      // -------------------------------------------------------------------------
      const wenshuPlaza = new THREE.Group();
      wenshuPlaza.position.set(FX, 0, FZ - 17.5);

      // 1) 66米宽双色花岗岩礼仪广场主铺装 + 边缘白玉石栏 + 中央汉白玉御道
      const outerGranite = new THREE.Mesh(new THREE.BoxGeometry(66, 0.85, 22), mats.memorialGreyConcrete);
      outerGranite.position.y = 0.425;
      outerGranite.receiveShadow = true;
      const innerLightGranite = new THREE.Mesh(new THREE.BoxGeometry(58, 0.90, 18.5), mats.platformInlay);
      innerLightGranite.position.y = 0.45;
      innerLightGranite.receiveShadow = true;
      const imperialJadeWay = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.96, 21.5), mats.whiteMarble);
      imperialJadeWay.position.y = 0.48;
      imperialJadeWay.receiveShadow = true;
      const goldInlayBorder = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.94, 21.6), mats.goldTrim);
      goldInlayBorder.position.y = 0.47;
      wenshuPlaza.add(outerGranite, innerLightGranite, goldInlayBorder, imperialJadeWay);

      // 2) 广场正中央：高大三层汉白玉须弥座 + 4.8米高【孔子行教青铜巨像】
      const confuciusMon = new THREE.Group();
      confuciusMon.position.set(0, 0.95, 0);
      const ped1 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.8, 6.8), mats.whiteMarble);
      ped1.position.y = 0.4;
      const ped2 = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.2, 5.0), mats.whiteMarble);
      ped2.position.y = 1.4;
      const ped3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.8, 3.6), mats.whiteMarble);
      ped3.position.y = 2.9;
      const statueRobe = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.35, 4.2, 12), mats.bronze);
      statueRobe.position.y = 5.8;
      statueRobe.castShadow = true;
      const statueSleeves = new THREE.Mesh(new THREE.BoxGeometry(2.3, 1.3, 1.1), mats.bronze);
      statueSleeves.position.set(0, 6.2, 0.35);
      const statueHead = new THREE.Mesh(new THREE.SphereGeometry(0.68, 12, 12), mats.bronze);
      statueHead.position.y = 8.35;
      const statueCrown = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.45, 0.85), mats.bronze);
      statueCrown.position.y = 8.95;
      confuciusMon.add(ped1, ped2, ped3, statueRobe, statueSleeves, statueHead, statueCrown);
      wenshuPlaza.add(confuciusMon);

      // 3) 三足青铜大香炉（位于孔子巨像南侧御道中央）与守门双石狮
      const tripodBurner = new THREE.Group();
      tripodBurner.position.set(0, 0.95, 6.2);
      const burnerBelly = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.15, 1.75, 14), mats.bronze);
      burnerBelly.position.y = 1.45;
      const burnerRim = new THREE.Mesh(new THREE.TorusGeometry(1.45, 0.18, 8, 20), mats.goldTrim);
      burnerRim.rotation.x = Math.PI / 2;
      burnerRim.position.y = 2.35;
      [-0.9, 0, 0.9].forEach((angOff, lIdx) => {
        const ang = (lIdx / 3) * Math.PI * 2;
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 1.1, 8), mats.bronze);
        leg.position.set(Math.cos(ang) * 0.95, 0.55, Math.sin(ang) * 0.95);
        tripodBurner.add(leg);
      });
      tripodBurner.add(burnerBelly, burnerRim);
      wenshuPlaza.add(tripodBurner);

      // 御道南北两端守门汉白玉双石狮
      [[-4.8, 9.2], [4.8, 9.2], [-4.8, -9.2], [4.8, -9.2]].forEach(([lx, lz]) => {
        const lionGroup = new THREE.Group();
        lionGroup.position.set(lx, 0.95, lz);
        const lPed = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.9, 1.8), mats.whiteMarble);
        lPed.position.y = 0.45;
        const lBody = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.5, 1.3), mats.whiteMarble);
        lBody.position.y = 1.65;
        const lHead = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), mats.whiteMarble);
        lHead.position.set(0, 2.55, 0.2);
        lionGroup.add(lPed, lBody, lHead);
        wenshuPlaza.add(lionGroup);
      });

      // 4) 左右对称“道冠古今”（东）与“德配天地”（西）四柱三间牌坊
      [
        { x: -31.5, title: '德配天地' },
        { x: 31.5,  title: '道冠古今' }
      ].forEach(pfCfg => {
        const sidePailou = new THREE.Group();
        sidePailou.position.set(pfCfg.x, 0.9, 0);
        sidePailou.rotation.y = Math.PI / 2;
        [-5.2, -1.8, 1.8, 5.2].forEach(px => {
          const col = new THREE.Mesh(new THREE.BoxGeometry(0.68, 7.2, 0.68), mats.vermilionRed);
          col.position.set(px, 3.6, 0);
          const ped = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.9, 1.1), mats.whiteMarble);
          ped.position.set(px, 0.45, 0);
          sidePailou.add(col, ped);
        });
        const topRoof = createChineseRoof(12.6, 2.6, 1.75, mats.goldTrim, true);
        topRoof.position.y = 6.6;
        const plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(3.2, 1.15),
          new THREE.MeshBasicMaterial({ map: createMingXiaolingPlaqueTexture(pfCfg.title) })
        );
        plaque.position.set(0, 5.6, 0.55);
        sidePailou.add(topRoof, plaque);
        wenshuPlaza.add(sidePailou);
      });

      // 5) 礼仪广场两侧古典宫灯阵列与百年金黄银杏树阵
      [-23, -15, 15, 23].forEach((gx, gIdx) => {
        [-6.5, 6.5].forEach((gz, zIdx) => {
          // 黄金银杏树
          const ginkgo = createWutongTree(0.92, gIdx * 3 + zIdx);
          ginkgo.position.set(gx, 0.9, gz);
          wenshuPlaza.add(ginkgo);

          // 古典朱红描金华表宫灯
          const lampPost = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 4.6, 8), mats.vermilionRed);
          lampPost.position.set(gx * 0.72, 3.2, gz * 0.85);
          const lampCrown = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.85), mats.redLantern);
          lampCrown.position.set(gx * 0.72, 5.6, gz * 0.85);
          wenshuPlaza.add(lampPost, lampCrown);
        });
      });

      group.add(wenshuPlaza);

      // 10.6 北岸中轴线：【天下文枢牌坊 (Z=FZ-6.5)】 → 【66米天下文枢大广场】 → 六柱三门石坊【棂星门 (Z=FZ-28.5)】 → 【大成殿 (Z=FZ-42)】
      const archPailou = new THREE.Group();
      [-5.8, -2.1, 2.1, 5.8].forEach(px => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.78, 7.8, 0.78), mats.vermilionRed);
        p.position.set(px, 3.9, 0);
        archPailou.add(p);
      });
      const pTop = createChineseRoof(14.2, 2.8, 1.9, mats.goldTrim, true);
      pTop.position.y = 7.1;
      const wenshuPlaque = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 1.2),
        new THREE.MeshBasicMaterial({ map: createMingXiaolingPlaqueTexture('天下文枢') })
      );
      wenshuPlaque.position.set(0, 6.1, 0.62);
      archPailou.add(pTop, wenshuPlaque);
      archPailou.position.set(FX, 0.8, FZ - 6.5);
      group.add(archPailou);

      // 棂星门六柱冲天石坊 (Z = FZ - 28.5)
      const lingxingGate = new THREE.Group();
      [-8.0, -4.8, -1.6, 1.6, 4.8, 8.0].forEach(lx => {
        const stoneCol = new THREE.Mesh(new THREE.BoxGeometry(0.68, 6.6, 0.68), mats.whiteMarble);
        stoneCol.position.set(lx, 3.3, 0);
        lingxingGate.add(stoneCol);
      });
      const lxBeam = new THREE.Mesh(new THREE.BoxGeometry(17.2, 1.25, 0.85), mats.vermilionRed);
      lxBeam.position.y = 4.4;
      lingxingGate.add(lxBeam);
      lingxingGate.position.set(FX, 0.8, FZ - 28.5);
      group.add(lingxingGate);

      // 孔庙核心：【大成殿】与东西庑廊 (Z = FZ - 42)
      const dacheng = new THREE.Group();
      const dcTerrace = new THREE.Mesh(new THREE.BoxGeometry(30, 2.2, 20), mats.whiteMarble);
      dcTerrace.position.y = 1.1;
      const dcBody = new THREE.Mesh(new THREE.BoxGeometry(23, 8.2, 14.5), mats.ancientLatticeMat);
      dcBody.position.y = 6.1;
      dcBody.castShadow = true;
      const dcWin = new THREE.Mesh(new THREE.BoxGeometry(19.5, 4.2, 14.8), mats.ancientLatticeMat);
      dcWin.position.y = 5.6;
      const dcRoof1 = createChineseRoof(28, 19.0, 2.8, mats.darkGreyTile, false);
      dcRoof1.position.y = 10.0;
      const dcRoof2 = createChineseRoof(23, 15.0, 3.8, mats.goldTrim, true);
      dcRoof2.position.y = 12.8;
      dacheng.add(dcTerrace, dcBody, dcWin, dcRoof1, dcRoof2);
      dacheng.position.set(FX, 0, FZ - 42);
      group.add(dacheng);

      // 10.7 东侧【江南贡院 · 明远楼】与科举博物馆号舍群
      const mingyuan = new THREE.Group();
      const myBase = new THREE.Mesh(new THREE.BoxGeometry(11, 4.8, 11), mats.mingBrick);
      myBase.position.y = 2.4;
      const myArch = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, 11.4), mats.darkDoor);
      myArch.position.y = 1.7;
      const myFloor1 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 4.2, 8.5), mats.ancientLatticeMat);
      myFloor1.position.y = 6.8;
      const myRoof1 = createChineseRoof(11.8, 11.8, 2.0, mats.darkGreyTile, false);
      myRoof1.position.y = 8.8;
      const myFloor2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 3.8, 6.5), mats.ancientLatticeMat);
      myFloor2.position.y = 11.4;
      const myRoof2 = createChineseRoof(9.8, 9.8, 2.8, mats.goldTrim, true);
      myRoof2.position.y = 13.4;
      mingyuan.add(myBase, myArch, myFloor1, myRoof1, myFloor2, myRoof2);
      mingyuan.position.set(FX + 42, 0, FZ - 22);
      group.add(mingyuan);

      // 10.8 沿河两侧鳞次栉比的【粉墙黛瓦马头墙秦淮河房（得月台、秦淮人家）】
      [-48, -38, 38, 50].forEach((dx, idx) => {
        const house = new THREE.Group();
        const hHeight = 5.2 + (idx % 2) * 1.4;
        const hBody = new THREE.Mesh(new THREE.BoxGeometry(10.5, hHeight, 8.5), mats.whiteMarble);
        hBody.position.y = hHeight / 2;
        const hWin = new THREE.Mesh(new THREE.BoxGeometry(9.2, 2.5, 8.8), mats.ancientLatticeMat);
        hWin.position.y = hHeight - 1.8;
        const hRoof = createChineseRoof(12.2, 10.2, 2.2, mats.darkGreyTile, false);
        hRoof.position.y = hHeight;
        [-5.3, 5.3].forEach(gx => {
          const gable = new THREE.Mesh(new THREE.BoxGeometry(0.45, hHeight + 2.2, 8.8), mats.whiteMarble);
          gable.position.set(gx, (hHeight + 2.2) / 2, 0);
          const cap = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 9.2), mats.darkGreyTile);
          cap.position.set(gx, hHeight + 2.3, 0);
          house.add(gable, cap);
        });
        house.add(hBody, hWin, hRoof);
        house.position.set(FX + dx, 0.8, FZ - 11.5);
        group.add(house);
      });

      for (let lx = FX - 50; lx <= FX + 50; lx += 5.0) {
        const lantern1 = new THREE.Mesh(sharedGeos.lanternSphere, mats.redLantern);
        lantern1.position.set(lx, 3.6, FZ - 5.2);
        const lantern2 = new THREE.Mesh(sharedGeos.lanternSphere, mats.redLantern);
        lantern2.position.set(lx, 3.6, FZ + 17.2);
        group.add(lantern1, lantern2);
      }

      // 动态巡游的发光【秦淮画舫】
      [-32, 0, 32].forEach((startX, idx) => {
        const boat = new THREE.Group();
        const hull = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.8, 3.0), mats.vermilionRed);
        hull.position.y = 0.4;
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(5.6, 1.8, 2.4), mats.warmWindowGlow);
        cabin.position.y = 1.5;
        const roof = createChineseRoof(7.2, 3.4, 1.2, mats.goldTrim, true);
        roof.rotation.y = Math.PI / 2;
        roof.position.y = 2.4;
        [-3.8, 3.8].forEach(bx => {
          const l = new THREE.Mesh(sharedGeos.lanternSphere, mats.redLantern);
          l.position.set(bx, 1.8, 0);
          boat.add(l);
        });
        boat.add(hull, cabin, roof);
        boat.position.set(FX + startX, 0.2, FZ + 6 + (idx % 2 === 0 ? -3.2 : 3.2));
        group.add(boat);
        animatedQinhuaiBoats.push({
          mesh: boat,
          baseX: FX,
          offsetX: startX,
          dir: idx % 2 === 0 ? 1 : -1,
          speed: 4.8 + idx * 0.8
        });
      });

      scene.add(group);
    }

    // ============================================================================
    // 11. 地标十二：【玄武湖景区 & 明城墙】与 地标十三：【牛首山 · 佛顶宫 & 佛顶塔】
    // ============================================================================
    const animatedLakeBoats = [];

    // 生成“古鸡鸣寺”蓝底金字山门匾额纹理
    function createJimingPlaqueTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 512, 160);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 496, 144);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 82px "STKaiti", "KaiTi", "PingFang SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('古 鸡 鸣 寺', 256, 82);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }



    scene.add(group);

    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      animatedQinhuaiBoats.forEach(qb => {
        qb.offsetX += qb.dir * qb.speed * dt;
        if (qb.dir > 0 && qb.offsetX > 48) qb.offsetX = -48;
        if (qb.dir < 0 && qb.offsetX < -48) qb.offsetX = 48;
        qb.mesh.position.x = qb.baseX + qb.offsetX;
      });
      });
    }

    return group;
  }
};
