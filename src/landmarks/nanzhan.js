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
  createJimingPlaqueTexture,
  createNanzhanCenterGlassTexture,
  createNanzhanGoldLouverTexture,
  createNanzhanRoofTexture,
  createNanzhanSingleCharTexture
} from '../core/textures.js';

export default {
  id: 'nanzhan',
  name: '南京南站',
  build(scene, ctx) {
  const animatedHSRTrains = [];

    // buildNanjingSouthStation
      const group = new THREE.Group();
      // 【C位主核】：南京南站雄踞沙盘中南C位 (X = 0, Z = 365)，1:1 严格还原实景照片造型！
      const SX = 0, SZ = 365;
      group.position.set(SX, 0, SZ);
      group.scale.setScalar(1.12);

      const centerGlassMat = new THREE.MeshStandardMaterial({
        map: createNanzhanCenterGlassTexture(),
        roughness: 0.14,
        metalness: 0.78,
        emissive: new THREE.Color(0x0284c7),
        emissiveIntensity: 0.32
      });
      const goldLouverMat = new THREE.MeshStandardMaterial({
        map: createNanzhanGoldLouverTexture(),
        roughness: 0.28,
        metalness: 0.62,
        emissive: new THREE.Color(0xb45309),
        emissiveIntensity: 0.35
      });
      const champagneGoldMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.26,
        metalness: 0.68,
        emissive: new THREE.Color(0x92400e),
        emissiveIntensity: 0.24
      });
      const bronzeSoffitMat = new THREE.MeshStandardMaterial({
        color: 0xb45309,
        roughness: 0.32,
        metalness: 0.70,
        emissive: new THREE.Color(0x78350f),
        emissiveIntensity: 0.28
      });
      const roofTopMat = new THREE.MeshStandardMaterial({
        map: createNanzhanRoofTexture(),
        roughness: 0.25,
        metalness: 0.55
      });

      // 1. 南北双广场浅灰花岗岩方格地砖台基 (164m x 118m, 顶面 Y = 0.7)
      const stationPlaza = new THREE.Mesh(new THREE.BoxGeometry(164, 0.7, 118), mats.platformInlay);
      stationPlaza.position.y = 0.35;
      stationPlaza.receiveShadow = true;
      group.add(stationPlaza);

      // 还原实景照片前景：中轴下沉式地铁扶梯入口 + 浅蓝透明玻璃围栏 + 修剪整齐的翠绿灌木花坛 + 两座竖向长方体发光立柱灯塔
      [-43, 43].forEach(pz => {
        const sunkenGroup = new THREE.Group();
        sunkenGroup.position.set(0, 0.7, pz);
        // 浅蓝透明玻璃护栏围合框
        const glassFenceMat = new THREE.MeshStandardMaterial({
          color: 0x38bdf8,
          roughness: 0.1,
          metalness: 0.3,
          transparent: true,
          opacity: 0.68
        });
        const fenceFront = new THREE.Mesh(new THREE.BoxGeometry(44, 1.35, 0.25), glassFenceMat);
        fenceFront.position.set(0, 0.68, pz > 0 ? 5.5 : -5.5);
        const fenceBack = new THREE.Mesh(new THREE.BoxGeometry(44, 1.35, 0.25), glassFenceMat);
        fenceBack.position.set(0, 0.68, pz > 0 ? -5.5 : 5.5);
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(44.4, 0.16, 11.2), mats.whiteMarble);
        topRail.position.set(0, 1.38, 0);
        sunkenGroup.add(fenceFront, fenceBack, topRail);

        // 下沉电扶梯斜坡与两侧修剪整齐的翠绿灌木丛
        [-4.8, 4.8].forEach(ex => {
          const escalator = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.4, 7.5), mats.memorialDarkSlate);
          escalator.position.set(ex, 0.35, 0);
          escalator.rotation.x = pz > 0 ? 0.22 : -0.22;
          sunkenGroup.add(escalator);
        });
        [-14.5, 0, 14.5].forEach((hx, hIdx) => {
          const hedge = new THREE.Mesh(new THREE.BoxGeometry(hIdx === 1 ? 5.5 : 11.5, 1.6, 6.2), mats.aotiTurfMat);
          hedge.position.set(hx, 0.9, 0);
          sunkenGroup.add(hedge);
        });

        // 广场两侧标志性的竖向长方体发光立柱灯塔 (Vertical Rectangular Light Totems in Photo)
        [-18.5, 18.5].forEach(tx => {
          const totem = new THREE.Group();
          totem.position.set(tx, 0, pz > 0 ? -4.2 : 4.2);
          const tCore = new THREE.Mesh(new THREE.BoxGeometry(1.45, 8.8, 1.45), mats. bronze);
          tCore.position.y = 4.4;
          const tLightPanel = new THREE.Mesh(new THREE.BoxGeometry(1.15, 8.2, 1.55), mats.magnoliaLamp);
          tLightPanel.position.y = 4.5;
          totem.add(tCore, tLightPanel);
          sunkenGroup.add(totem);
        });

        group.add(sunkenGroup);
      });

      // 2. 实景照片灵魂焦点：站前正中央高耸入云的【五星红旗旗杆与迎风飘扬的五星红旗】
      [-37.5, 37.5].forEach(fz => {
        const flagGroup = new THREE.Group();
        flagGroup.position.set(0, 0.7, fz);
        const flagPed = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), mats.whiteMarble);
        flagPed.position.y = 0.6;
        const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.28, 32.5, 12), mats.whiteMarble);
        flagPole.position.y = 16.25;
        const redFlag = new THREE.Mesh(new THREE.BoxGeometry(4.6, 3.0, 0.18), mats.redFlagMat);
        redFlag.position.set(2.3, 30.8, 0);
        redFlag.castShadow = true;
        flagGroup.add(flagPed, flagPole, redFlag);
        group.add(flagGroup);
      });

      // 3. 一层深色进站门廊基座层 (宽 106m, 深 56m, Y: 0.7 -> 7.6) 与 260m 贯穿式高速铁路高架桥
      const basePodium = new THREE.Mesh(new THREE.BoxGeometry(106, 6.9, 56), mats.darkDoor);
      basePodium.position.y = 4.15;
      basePodium.castShadow = true;
      basePodium.receiveShadow = true;
      group.add(basePodium);

      // 一层进站口方柱与红色LED进站横幅（还原照片桥下深色门洞与红底门头）
      for (let gx = -45; gx <= 45; gx += 18) {
        [-28.2, 28.2].forEach(gz => {
          const groundPier = new THREE.Mesh(new THREE.BoxGeometry(2.8, 6.8, 2.2), mats.platformInlay);
          groundPier.position.set(gx, 4.1, gz);
          group.add(groundPier);
          if (Math.abs(gx) <= 27) {
            const redBanner = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.1, 0.4), mats.hsrRedMat);
            redBanner.position.set(gx, 4.6, gz);
            group.add(redBanner);
          }
        });
      }

      // 260米超长多股道高铁高架桥面板 + 东西两端 100% 严丝合缝合拢的接地斜坡引桥板！
      const hsrViaduct = new THREE.Mesh(new THREE.BoxGeometry(260, 1.3, 38), mats.memorialGreyConcrete);
      hsrViaduct.position.set(0, 7.1, 0);
      hsrViaduct.receiveShadow = true;
      group.add(hsrViaduct);

      // 采用 createExactBridgeApproachRamp 四元数精确坡向对齐算法 + 端头盖梁过渡墩，彻底解决两端面板没合拢的问题！
      [-1, 1].forEach(dirX => {
        // 端头衔接过渡盖梁墩（消除水平高架板与斜坡引桥板的折角缝隙）
        const jointCap = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.35, 38.2), mats.memorialGreyConcrete);
        jointCap.position.set(dirX * 129.8, 7.1, 0);
        const jointPier = new THREE.Mesh(new THREE.BoxGeometry(4.2, 6.8, 30), mats.memorialDarkSlate);
        jointPier.position.set(dirX * 129.8, 3.4, 0);
        group.add(jointCap, jointPier);

        group.add(
          createExactBridgeApproachRamp(
            new THREE.Vector3(dirX * 129.5, 7.42, 0),
            new THREE.Vector3(dirX * 188.0, 0.0, 0),
            {
              width: 38.0,
              thickness: 1.3,
              deckMat: mats.memorialGreyConcrete,
              railMat: mats.whiteMarble,
              railHeight: 0.95,
              pierCount: 3
            }
          )
        );
      });

      for (let vx = -114; vx <= 114; vx += 18) {
        if (Math.abs(vx) < 54) continue;
        const pier = new THREE.Mesh(new THREE.BoxGeometry(3.6, 6.6, 28), mats.memorialDarkSlate);
        pier.position.set(vx, 3.3, 0);
        pier.castShadow = true;
        group.add(pier);
      }

      // 4. 东西两翼：与主站房立面（X = ±46）100% 严丝合缝合拢的【平顶水平延展站台雨棚翼楼】(X: ±45 -> ±103)
      [-74, 74].forEach(wingX => {
        const wingGroup = new THREE.Group();
        wingGroup.position.set(wingX, 7.6, 0);
        // 深色玻璃与金属百叶窗体（加宽至 58m，内侧直接嵌入主站房百叶墙体内部，零缝隙合拢！）
        const wingBody = new THREE.Mesh(new THREE.BoxGeometry(58, 6.2, 44), mats.darkDoor);
        wingBody.position.y = 3.1;
        // 顶部浅香槟金/米白水平挑檐封边
        const wingFascia = new THREE.Mesh(new THREE.BoxGeometry(60, 1.35, 46), mats.palaceCream);
        wingFascia.position.y = 6.5;
        wingFascia.castShadow = true;
        const wingGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(60.2, 0.45, 46.2), champagneGoldMat);
        wingGoldTrim.position.y = 5.75;
        wingGroup.add(wingBody, wingFascia, wingGoldTrim);

        for (let px = -24; px <= 24; px += 8) {
          [-22.2, 22.2].forEach(pz => {
            const wCol = new THREE.Mesh(new THREE.BoxGeometry(1.1, 5.6, 1.1), mats.palaceCream);
            wCol.position.set(px, 2.8, pz);
            wingGroup.add(wCol);
          });
        }
        group.add(wingGroup);
      });

      // 5. 二层南北贯通式【水平高架送站落客车道平台】+ 两端严丝合缝合拢的上下桥斜坡引桥！
      [-32.5, 32.5].forEach(dz => {
        const dropDeck = new THREE.Mesh(new THREE.BoxGeometry(136, 1.5, 8.2), mats.palaceCream);
        dropDeck.position.set(0, 7.8, dz);
        dropDeck.castShadow = true;
        const asphalt = new THREE.Mesh(new THREE.BoxGeometry(136, 0.16, 6.8), mats.asphaltRoad);
        asphalt.position.set(0, 8.6, dz);
        group.add(dropDeck, asphalt);

        for (let px = -54; px <= 54; px += 18) {
          const col = new THREE.Mesh(new THREE.BoxGeometry(2.2, 7.2, 2.2), mats.platformInlay);
          col.position.set(px, 3.6, dz + (dz > 0 ? 1.8 : -1.8));
          group.add(col);
        }

        // 采用 createExactBridgeApproachRamp 将二层高架落客平台两端 (X = ±68, Y = 7.8) 严丝合缝合拢连接至地面广场！
        [-1, 1].forEach(sideX => {
          const endCap = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.52, 8.25), mats.palaceCream);
          endCap.position.set(sideX * 67.8, 7.8, dz);
          const endPier = new THREE.Mesh(new THREE.BoxGeometry(2.4, 7.2, 2.4), mats.platformInlay);
          endPier.position.set(sideX * 67.8, 3.6, dz);
          group.add(endCap, endPier);

          group.add(
            createExactBridgeApproachRamp(
              new THREE.Vector3(sideX * 67.5, 8.15, dz),
              new THREE.Vector3(sideX * 108.0, 0.35, dz),
              {
                width: 8.2,
                thickness: 1.5,
                deckMat: mats.palaceCream,
                railMat: mats.whiteMarble,
                railHeight: 0.9,
                walkwayMat: mats.asphaltRoad,
                walkwayWidth: 6.8,
                pierCount: 2
              }
            )
          );
        });
      });

      // 6. 候车大厅主站房核心体：严格还原实景照片的【中央通透深蓝玻璃幕墙 + 左右两侧香槟金横向百叶遮阳幕墙】！
      const hallH = 14.2, hallD = 50;
      // 中央通透玻璃核心段 (X: -11 ~ +11)
      const centerGlassHall = new THREE.Mesh(new THREE.BoxGeometry(22, hallH, hallD + 0.4), centerGlassMat);
      centerGlassHall.position.set(0, 7.6 + hallH / 2, 0);
      centerGlassHall.castShadow = true;
      group.add(centerGlassHall);

      // 左右两侧香槟金横向百叶遮阳格栅幕墙段 (X: -46 ~ -11 与 +11 ~ +46)
      [-28.5, 28.5].forEach(sideX => {
        const louverHall = new THREE.Mesh(new THREE.BoxGeometry(35, hallH, hallD), goldLouverMat);
        louverHall.position.set(sideX, 7.6 + hallH / 2, 0);
        louverHall.castShadow = true;
        group.add(louverHall);
      });

      // 7. 南北正立面各 6 根【巨型香槟金方形廊柱 + 四棱台层叠式古铜金斗拱柱头】（对应实景照片 6 根大斗拱柱！）
      [-45, -27, -9, 9, 27, 45].forEach(cx => {
        [-26.2, 26.2].forEach(cz => {
          const col = new THREE.Group();
          col.position.set(cx, 7.6, cz);

          // 汉白玉方形柱础
          const base = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.2, 2.6), mats.whiteMarble);
          base.position.y = 0.6;

          // 挺拔的香槟金竖向凹槽方柱身
          const shaft = new THREE.Mesh(new THREE.BoxGeometry(1.85, 11.8, 1.85), champagneGoldMat);
          shaft.position.y = 6.5;
          shaft.castShadow = true;
          col.add(base, shaft);

          // 柱顶标志性的【四层倒四棱台叠涩古铜金斗拱柱头】(Stepped Inverted-Pyramid Golden Dougong Capital)
          [
            { y: 12.2, w: 2.8, d: 2.8 },
            { y: 12.75, w: 4.2, d: 4.2 },
            { y: 13.3, w: 5.8, d: 5.6 },
            { y: 13.85, w: 7.4, d: 7.0 }
          ].forEach((tier, tIdx) => {
            const capBox = new THREE.Mesh(
              new THREE.BoxGeometry(tier.w, 0.52, tier.d),
              tIdx % 2 === 0 ? champagneGoldMat : bronzeSoffitMat
            );
            capBox.position.y = tier.y;
            capBox.castShadow = true;
            col.add(capBox);
          });

          group.add(col);
        });
      });

      // 8. 南京南站灵魂大屋顶：1:1 还原实景照片的【超宽平挑式香槟金倒梯形斜切大屋檐】(Flat Cantilevered Beveled Golden Megaroof)
      // 绝不翘角弯曲！采用平直超宽悬挑顶面 (宽 134m, 深 74m) + 倒四棱台斜切香槟金格栅挑檐底面
      const roofGroup = new THREE.Group();
      roofGroup.position.y = 21.8;

      const botW = 104, botD = 54;
      const topW = 136, topD = 74;
      const bevelH = 2.6;

      // 构造倒四棱台斜切挑檐几何体 (Inverted Frustum Beveled Eave Soffit)
      const eaveGeo = new THREE.BoxGeometry(1, bevelH, 1, 1, 1, 1);
      const ePos = eaveGeo.attributes.position;
      for (let i = 0; i < ePos.count; i++) {
        const sx = Math.sign(ePos.getX(i));
        const sy = ePos.getY(i);
        const sz = Math.sign(ePos.getZ(i));
        if (sy > 0) {
          ePos.setX(i, sx * topW * 0.5);
          ePos.setZ(i, sz * topD * 0.5);
        } else {
          ePos.setX(i, sx * botW * 0.5);
          ePos.setZ(i, sz * botD * 0.5);
        }
      }
      eaveGeo.computeVertexNormals();
      const beveledSoffit = new THREE.Mesh(eaveGeo, champagneGoldMat);
      beveledSoffit.position.y = bevelH * 0.5;
      beveledSoffit.castShadow = true;
      beveledSoffit.receiveShadow = true;
      roofGroup.add(beveledSoffit);

      // 屋檐顶部纤薄锐利的浅米白/香槟金平直封边压顶与采光天窗屋面
      const flatTopCap = new THREE.Mesh(new THREE.BoxGeometry(topW + 0.8, 0.55, topD + 0.8), roofTopMat);
      flatTopCap.position.y = bevelH + 0.28;
      flatTopCap.castShadow = true;
      roofGroup.add(flatTopCap);

      // 屋檐下方深古铜金格栅藻井横梁带
      [-26.5, 26.5].forEach(rz => {
        const soffitBeam = new THREE.Mesh(new THREE.BoxGeometry(102, 0.75, 3.2), bronzeSoffitMat);
        soffitBeam.position.set(0, 0.15, rz);
        roofGroup.add(soffitBeam);
      });

      group.add(roofGroup);

      // 9. 屋檐正上方独立矗立的 4 个大红立体发光书法大字【南 京 南 站】（1:1还原实景照片中立在平屋檐顶上的4个独立立体红字！）
      const chars = ['南', '京', '南', '站'];
      const charMats = chars.map(ch => new THREE.MeshBasicMaterial({ map: createNanzhanSingleCharTexture(ch) }));
      [-35.5, 35.5].forEach((pz, sideIdx) => {
        const signRow = new THREE.Group();
        signRow.position.set(0, 24.65, pz);
        if (sideIdx === 0) signRow.rotation.y = Math.PI;

        chars.forEach((ch, cIdx) => {
          const cx = (cIdx - 1.5) * 6.4;
          const charHolder = new THREE.Group();
          charHolder.position.set(cx, 2.3, 0);
          // 立体红字背面金属支撑骨架与3D字壳
          const charBox = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.6, 0.75), mats.hsrRedMat);
          const charFace = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 4.5), charMats[cIdx]);
          charFace.position.z = 0.40;
          const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 6), mats.bridgeSteel);
          strutL.position.set(-1.4, -1.2, -0.6);
          strutL.rotation.x = 0.25;
          const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 2.4, 6), mats.bridgeSteel);
          strutR.position.set(1.4, -1.2, -0.6);
          strutR.rotation.x = 0.25;
          charHolder.add(charBox, charFace, strutL, strutR);
          signRow.add(charHolder);
        });
        group.add(signRow);
      });

      // 10. 四列动态穿梭的高铁列车：【复兴号红神龙 CR400AF】、【复兴号金凤凰 CR400BF】与【和谐号 CRH380B】
      [
        { z: -12.5, dir: 1,  speed: 42, type: 'red' },
        { z: -4.2,  dir: -1, speed: 36, type: 'gold' },
        { z: 4.2,   dir: 1,  speed: 34, type: 'blue' },
        { z: 12.5,  dir: -1, speed: 40, type: 'red' }
      ].forEach((tCfg, tIdx) => {
        const hsr = new THREE.Group();
        const stripeMat = tCfg.type === 'red' ? mats.hsrRedMat : (tCfg.type === 'gold' ? mats.goldTrim : mats.blueGlaze);
        for (let c = -3; c <= 3; c++) {
          const isHead = Math.abs(c) === 3;
          const car = new THREE.Mesh(
            new THREE.BoxGeometry(isHead ? 8.0 : 7.4, 2.2, 2.5),
            mats.hsrSilverMat
          );
          car.position.set(c * 7.8, 1.25, 0);
          const stripe = new THREE.Mesh(new THREE.BoxGeometry(7.5, 0.52, 2.58), stripeMat);
          stripe.position.set(c * 7.8, 1.4, 0);
          const win = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.45, 2.62), mats.warmWindowGlow);
          win.position.set(c * 7.8, 1.65, 0);
          hsr.add(car, stripe, win);
        }
        [-1, 1].forEach(endSide => {
          const nose = new THREE.Mesh(new THREE.ConeGeometry(1.25, 4.6, 14), stripeMat);
          nose.rotation.z = -endSide * Math.PI / 2;
          nose.scale.set(0.85, 1, 1);
          nose.position.set(endSide * 29.2, 1.1, 0);
          hsr.add(nose);
        });
        hsr.position.set(tCfg.dir * (-85 + tIdx * 35), 7.8, tCfg.z);
        group.add(hsr);
        animatedHSRTrains.push({ mesh: hsr, dir: tCfg.dir, speed: tCfg.speed });
      });

      scene.add(group);
    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      animatedHSRTrains.forEach(tr => {
        tr.mesh.position.x += tr.dir * tr.speed * dt;
        if (tr.dir > 0 && tr.mesh.position.x > 112) tr.mesh.position.x = -112;
        if (tr.dir < 0 && tr.mesh.position.x < -112) tr.mesh.position.x = 112;
      });
      });
    }
    return group;
  }
};
