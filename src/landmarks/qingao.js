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
  id: 'qingao',
  name: '青奥双塔 & 南京眼步行桥',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 7.2 地标五：【南京青奥中心双子塔（扎哈·哈迪德代表作） & 保利大剧院裙楼】1:1 真实肌理重塑 (X = -155, Z = 165)
      // 为什么这次一眼就像真青奥双塔：
      // 1. 与西侧夹江上的【南京眼步行桥 (X=-258)】拉开整整 103 单位的滨江绿轴广场间距，再也不会挤在一起！
      // 2. 真实青奥双塔核心视觉是【通体高密度纯白GRC几何窗框外网壳 + 渐变露出的深蓝钻石切面玻璃】！
      //    塔身为硬朗挺拔的不对称折面六棱锥台晶体（1号塔315m高84，2号塔250m高68），底部纯白网格极密并与裙楼流线融为一体，向上网格渐疏露出深海蓝幕墙，顶部为凌厉的单向斜切几何冠顶。
      // 3. 裙楼【南京保利大剧院 & 国际青年会议中心】：塑造扎哈标志性的【S形流线纯白层叠折面巨构】，表面镶嵌三处巨大的不规则多边形斜切深蓝玻璃峡谷窗洞与金色剧院内厅。
      // -------------------------------------------------------------------------
      const qingao = new THREE.Group();
      const QX = -195, QZ = 140;
      qingao.position.set(QX, 0, QZ);

      // 0. 青奥中心广场与通往西侧南京眼桥头的 90 米滨江中轴景观大道
      const qingaoPlaza = new THREE.Mesh(new THREE.BoxGeometry(72, 0.8, 64), mats.platformInlay);
      qingaoPlaza.position.set(0, 0.4, 0);
      qingaoPlaza.receiveShadow = true;
      const axisPromenade = new THREE.Mesh(new THREE.BoxGeometry(68, 0.6, 14), mats.whiteMarble);
      axisPromenade.position.set(-48, 0.35, 0);
      const axisLawn = new THREE.Mesh(new THREE.BoxGeometry(62, 0.7, 6), mats.aotiTurfMat);
      axisLawn.position.set(-48, 0.4, 0);
      qingao.add(qingaoPlaza, axisPromenade, axisLawn);

      // 1. 扎哈·哈迪德【南京保利大剧院 / 国际青年会议中心】一体式纯白S形流线雕塑裙楼
      const podiumGroup = new THREE.Group();
      podiumGroup.position.set(-2, 0.8, 6);

      // 构建主裙楼流线多面体纯白外壳（长 46m, 宽 30m, 高 17.5m，带扎哈式斜切流线腰线与悬挑挑檐）
      const podGeo = new THREE.BoxGeometry(44, 16.5, 28, 28, 12, 18);
      const pPos = podGeo.attributes.position;
      for (let i = 0; i < pPos.count; i++) {
        let vx = pPos.getX(i);
        let vy = pPos.getY(i) + 8.25;
        let vz = pPos.getZ(i);
        const nx = vx / 22, nz = vz / 14, ny = vy / 16.5;
        // S形流线平面扭转与层叠悬挑折面感
        const sCurveShift = Math.sin(nx * Math.PI * 0.8) * 3.6;
        const taper = 1.0 - Math.pow(ny, 1.5) * 0.22;
        const roundCorner = Math.max(0.62, 1.0 - 0.32 * Math.pow(nx * nz, 2));
        vx = vx * taper * roundCorner + Math.sin(ny * Math.PI) * 1.8;
        vz = (vz * taper * roundCorner) + sCurveShift * (1 - ny * 0.4);
        // 屋顶双峰流线波谷起伏（东高西低，呼应两座主塔）
        if (vy > 8.0) {
          vy += (Math.cos(nx * 2.4) * 2.6 + Math.sin(nz * 1.8) * 1.4) * ((vy - 8.0) / 8.5);
        }
        pPos.setXYZ(i, vx, vy, vz);
      }
      podGeo.computeVertexNormals();
      const podMesh = new THREE.Mesh(podGeo, mats.zahaWhiteFacade);
      podMesh.castShadow = true;
      podMesh.receiveShadow = true;
      podiumGroup.add(podMesh);

      // 裙楼外立面标志性的【横向流线纯白百叶凹槽带】与【不规则多边形斜切深蓝玻璃大开窗】
      for (let ly = 3.2; ly <= 14.5; ly += 2.8) {
        const ribbon = new THREE.Mesh(new THREE.BoxGeometry(43 - ly * 0.5, 0.45, 27 - ly * 0.4), mats.qingaoGlassMat);
        ribbon.position.set(0, ly, 0);
        ribbon.rotation.y = 0.05 * Math.sin(ly);
        podiumGroup.add(ribbon);
      }

      // 保利大剧院正立面与西立面标志性的“钻石斜切大玻璃窗洞”与金色歌剧院内厅
      [
        { x: -5, y: 7.8, z: 13.6, sx: 14, sy: 7.5, sz: 2.2, rz: -0.18 },
        { x: 10, y: 6.5, z: 12.8, sx: 9.5, sy: 5.8, sz: 2.2, rz: 0.22 },
        { x: -18, y: 7.2, z: 0, sx: 2.4, sy: 7.2, sz: 13.5, rz: 0.12 }
      ].forEach(cut => {
        const glassCut = new THREE.Mesh(new THREE.BoxGeometry(cut.sx, cut.sy, cut.sz), mats.qingaoGlassMat);
        glassCut.position.set(cut.x, cut.y, cut.z);
        glassCut.rotation.z = cut.rz;
        const whiteFrame = new THREE.Mesh(new THREE.BoxGeometry(cut.sx + 1.2, cut.sy + 1.0, cut.sz * 0.85), mats.zahaWhiteFacade);
        whiteFrame.position.set(cut.x, cut.y, cut.z - 0.15);
        whiteFrame.rotation.z = cut.rz;
        const goldInner = new THREE.Mesh(new THREE.BoxGeometry(cut.sx * 0.65, cut.sy * 0.55, cut.sz * 0.9), mats.goldTrim);
        goldInner.position.set(cut.x, cut.y - 0.5, cut.z - 0.1);
        goldInner.rotation.z = cut.rz;
        podiumGroup.add(whiteFrame, glassCut, goldInner);
      });

      qingao.add(podiumGroup);

      // 2. 扎哈·哈迪德【青奥中心双子塔】（1号塔 314.5m -> 高 84；2号塔 249.5m -> 高 68）
      // 真实精髓：六边形/不对称折面帆形晶体截面 + 高密度纯白GRC几何窗框网格（底部纯白密集、中上部渐疏露出深蓝玻璃）+ 凌厉斜切平顶
      [
        { x: -15.5, z: -14.5, h: 84, bW: 14.5, tW: 8.2, bD: 11.2, tD: 6.4, rotY: 0.28, cutSlope: 0.52 },
        { x: 16.5, z: -12.5, h: 68, bW: 13.0, tW: 7.5, bD: 10.2, tD: 5.8, rotY: -0.32, cutSlope: -0.48 }
      ].forEach((tCfg) => {
        const tower = new THREE.Group();
        tower.position.set(tCfg.x, 0.8, tCfg.z);
        tower.rotation.y = tCfg.rotY;

        // 折面六棱晶体截面函数 (6-Faceted Asymmetric Sail Crystal Cross-Section)
        function sampleFacetedSection(ang, u) {
          // 将圆周量化为6个折面棱角并插值，呈现真实青奥双塔硬朗的多面体折面感
          const sectors = 6;
          const step = (Math.PI * 2) / sectors;
          const idx = Math.floor(((ang + Math.PI * 2) % (Math.PI * 2)) / step);
          const frac = (((ang + Math.PI * 2) % (Math.PI * 2)) - idx * step) / step;
          const a0 = idx * step, a1 = (idx + 1) * step;
          const taper = Math.pow(u, 0.88);
          const rx = THREE.MathUtils.lerp(tCfg.bW * 0.5, tCfg.tW * 0.5, taper);
          const rz = THREE.MathUtils.lerp(tCfg.bD * 0.5, tCfg.tD * 0.5, taper);
          const x = THREE.MathUtils.lerp(Math.cos(a0), Math.cos(a1), frac) * rx;
          const z = THREE.MathUtils.lerp(Math.sin(a0), Math.sin(a1), frac) * rz;
          return { x, z };
        }

        // (A) 内部深海蓝高反光玻璃幕墙核心体 (6棱折面锥台 + 顶部单向凌厉斜切面)
        const glassGeo = new THREE.CylinderGeometry(1, 1, tCfg.h, 6, 32);
        const gPos = glassGeo.attributes.position;
        for (let i = 0; i < gPos.count; i++) {
          const vx = gPos.getX(i), vz = gPos.getZ(i);
          let vy = gPos.getY(i) + tCfg.h * 0.5;
          const u = THREE.MathUtils.clamp(vy / tCfg.h, 0, 1);
          const ang = Math.atan2(vz, vx);
          const { x, z } = sampleFacetedSection(ang, u);
          if (u > 0.82) {
            vy += ((u - 0.82) / 0.18) * (tCfg.cutSlope * x);
          }
          gPos.setXYZ(i, x, vy, z);
        }
        glassGeo.computeVertexNormals();
        const glassCore = new THREE.Mesh(glassGeo, mats.qingaoGlassMat);
        glassCore.castShadow = true;
        tower.add(glassCore);

        // (B) 6道高耸挺拔的【纯白折面转角巨柱棱线 (6 Crisp White Facet Corner Columns)】
        for (let c = 0; c < 6; c++) {
          const ang = (c / 6) * Math.PI * 2;
          const colPts = [];
          for (let k = 0; k <= 16; k++) {
            const u = k / 16;
            const { x, z } = sampleFacetedSection(ang, u);
            let vy = u * tCfg.h;
            if (u > 0.82) vy += ((u - 0.82) / 0.18) * (tCfg.cutSlope * x);
            colPts.push(new THREE.Vector3(x * 1.022, vy, z * 1.022));
          }
          // 下粗上细的纯白转角柱
          const colMesh = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(colPts), 20, 0.36, 6, false),
            mats.zahaWhiteFacade
          );
          tower.add(colMesh);
        }

        // (C) 密集的【纯白水平/微倾参数化层间窗框带 (22 Tiers of White GRC Horizontal Faceted Mullions)】
        // 底部窗框极宽（形成扎哈标志性的下部纯白厚重裙塔过渡），向上渐细露出更多深蓝玻璃
        const numTiers = 22;
        for (let lv = 1; lv <= numTiers; lv++) {
          const u = lv / (numTiers + 1);
          const ringPts = [];
          for (let c = 0; c <= 6; c++) {
            const ang = (c / 6) * Math.PI * 2;
            const { x, z } = sampleFacetedSection(ang, u);
            let vy = u * tCfg.h;
            if (u > 0.82) vy += ((u - 0.82) / 0.18) * (tCfg.cutSlope * x);
            ringPts.push(new THREE.Vector3(x * 1.025, vy, z * 1.025));
          }
          const bandThickness = THREE.MathUtils.lerp(0.34, 0.14, u);
          const bandMesh = new THREE.Mesh(
            new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ringPts, true), 24, bandThickness, 4, true),
            lv % 5 === 0 ? mats.magnoliaLamp : mats.zahaWhiteFacade
          );
          tower.add(bandMesh);
        }

        // (D) 正反双向交织的【8道纯白斜交菱形结构肋带 (8 Intersecting White Diagrid Struts)】
        [-1, 1].forEach(dir => {
          for (let d = 0; d < 6; d++) {
            const aStart = (d / 6) * Math.PI * 2;
            const diagPts = [];
            for (let k = 0; k <= 24; k++) {
              const u = k / 24;
              const ang = aStart + dir * u * Math.PI * 1.35;
              const { x, z } = sampleFacetedSection(ang, u);
              let vy = u * tCfg.h;
              if (u > 0.82) vy += ((u - 0.82) / 0.18) * (tCfg.cutSlope * x);
              diagPts.push(new THREE.Vector3(x * 1.028, vy, z * 1.028));
            }
            const diagMesh = new THREE.Mesh(
              new THREE.TubeGeometry(new THREE.CatmullRomCurve3(diagPts), 28, 0.22, 4, false),
              mats.zahaWhiteFacade
            );
            tower.add(diagMesh);
          }
        });

        // (E) 塔顶凌厉斜切面的纯白折面封边冠顶与竖向白百叶女儿墙 (Slanted White Parapet Crown)
        const topRimPts = [];
        for (let c = 0; c <= 6; c++) {
          const ang = (c / 6) * Math.PI * 2;
          const { x, z } = sampleFacetedSection(ang, 1.0);
          const vy = tCfg.h + tCfg.cutSlope * x;
          topRimPts.push(new THREE.Vector3(x * 1.035, vy, z * 1.035));
        }
        const topRim = new THREE.Mesh(
          new THREE.TubeGeometry(new THREE.CatmullRomCurve3(topRimPts, true), 24, 0.48, 6, true),
          mats.zahaWhiteFacade
        );
        tower.add(topRim);

        qingao.add(tower);
      });

      group.add(qingao);

      // -------------------------------------------------------------------------
      // 7.3 【南京眼步行桥】1:1 真实穿环斜拉结构重塑 (横跨夹江连接青奥轴线与江心洲 X = -222, Z = 118)
      // 真实特征：
      // - 两座巨大的白色倾斜钢箱椭圆环主塔立于江中墩座，左塔向左倾斜、右塔向右倾斜（呈V字展开双翼）
      // - 【步行桥面从两个椭圆环的正中央穿心而过！】
      // - 羽翼般的斜拉钢索从椭圆钢环的上半弧内壁向下呈扇形辐射，拉住桥面的南北两侧边缘，行人宛如走在竖琴琴弦中央
      // -------------------------------------------------------------------------
      const nanjingEye = new THREE.Group();
      nanjingEye.position.set(-292, 0, 140);

      // 跨越夹江的流线型步行桥面（局部 X: -29 -> +29，在 Y = 8.8m 高度直接穿过两座椭圆环中心）
      const eyeDeck = new THREE.Mesh(new THREE.BoxGeometry(58, 0.85, 5.4), mats.whiteMarble);
      eyeDeck.position.y = 8.8;
      eyeDeck.castShadow = true;
      const eyeRedWalkway = new THREE.Mesh(new THREE.BoxGeometry(58, 0.15, 3.6), mats.aotiCrimsonArch);
      eyeRedWalkway.position.y = 9.28;
      nanjingEye.add(eyeDeck, eyeRedWalkway);

      // 两座标志性向外倾斜的【巨型白色钢椭圆塔环】（分别位于 X = -12 与 X = +12）
      [-12, 12].forEach((rx, idx) => {
        const sign = idx === 0 ? -1 : 1; // 西塔向西倾(-1)，东塔向东倾(+1)
        const towerUnit = new THREE.Group();
        towerUnit.position.set(rx, 8.8, 0); // 以桥面高程 Y=8.8 为旋转中心
        towerUnit.rotation.z = -sign * 0.28; // 向外侧优雅倾斜约 16 度

        // 水中混凝土承台墩座（向下延伸入水）
        const waterPier = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 4.2, 9.2, 20), mats.mingStoneBase);
        waterPier.scale.set(0.75, 1, 1.65);
        waterPier.position.y = -4.5;
        towerUnit.add(waterPier);

        // 椭圆钢箱主环：面朝东西桥轴方向（绕 Y 轴旋转 90 度），令桥面沿 X 轴从圆环正中心穿过！
        // 横向半径 (Z轴) = 9.8m（宽于桥面5.4m），竖向半径 (Y轴) = 13.8m（高高耸立于桥面之上）
        const ringRadius = 11.5;
        const scaleZ = 0.88; // Z半轴 ≈ 10.1m
        const scaleY = 1.24; // Y半轴 ≈ 14.2m
        const eyeRing = new THREE.Mesh(
          new THREE.TorusGeometry(ringRadius, 0.92, 14, 48),
          mats.zahaWhiteFacade
        );
        eyeRing.rotation.y = Math.PI / 2;
        eyeRing.scale.set(scaleZ, scaleY, 1.0);
        eyeRing.position.y = 4.2; // 环中心略高于桥面，底弧托于水中墩座，桥面从环内中下部穿心而过
        eyeRing.castShadow = true;
        towerUnit.add(eyeRing);

        // 椭圆环外侧发光霓虹灯带
        const neonRing = new THREE.Mesh(
          new THREE.TorusGeometry(ringRadius + 0.2, 0.22, 8, 48),
          mats.qingaoGlassMat
        );
        neonRing.rotation.y = Math.PI / 2;
        neonRing.scale.set(scaleZ, scaleY, 1.0);
        neonRing.position.y = 4.2;
        towerUnit.add(neonRing);

        nanjingEye.add(towerUnit);

        // 羽翼状竖琴斜拉钢索：从倾斜椭圆环的上半弧连接至桥面南北两侧边缘 (Z = ±2.5)
        for (let c = 1; c <= 7; c++) {
          [-1, 1].forEach(sideZ => {
            const theta = sideZ * (0.18 + c * 0.085); // 椭圆环上半圈角度分布
            const localY = 4.2 + Math.cos(theta) * (ringRadius * scaleY);
            const localZ = Math.sin(theta) * (ringRadius * scaleZ);
            // 考虑塔环绕 Z 轴外倾角 (-sign * 0.28) 后的世界锚固坐标
            const tiltAng = -sign * 0.28;
            const ringAnchor = new THREE.Vector3(
              rx - localY * Math.sin(tiltAng),
              8.8 + localY * Math.cos(tiltAng),
              localZ
            );
            const deckAnchor = new THREE.Vector3(
              rx + sign * (c * 1.95),
              9.0,
              sideZ * 2.5
            );
            const cLen = ringAnchor.distanceTo(deckAnchor);
            const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, cLen, 4), mats.stayCableMat);
            cable.position.copy(ringAnchor).lerp(deckAnchor, 0.5);
            cable.quaternion.setFromUnitVectors(
              new THREE.Vector3(0, 1, 0),
              deckAnchor.clone().sub(ringAnchor).normalize()
            );
            nanjingEye.add(cable);
          });
        }
      });

      // 【精确引桥对齐】：使用 createExactBridgeApproachRamp(pBridge, pGround) 修复南京眼步行桥两端上下桥坡向！
      // 西端引桥：从 8.8m 桥面精准降落至江心洲环岛绿道（Y = 1.7）
      nanjingEye.add(
        createExactBridgeApproachRamp(
          new THREE.Vector3(-29, 8.8, 0),
          new THREE.Vector3(-50, 1.7, 0),
          {
            width: 5.4,
            thickness: 0.75,
            deckMat: mats.whiteMarble,
            railMat: mats.zahaWhiteFacade,
            railHeight: 0.9,
            railWidth: 0.35,
            walkwayMat: mats.aotiCrimsonArch,
            walkwayWidth: 3.6,
            pierCount: 2,
            pierRadiusTop: 0.6,
            pierRadiusBot: 0.8
          }
        )
      );
      // 东端引桥：从 8.8m 桥面精准降落至河西青奥步廊广场（Y = 0.45）
      nanjingEye.add(
        createExactBridgeApproachRamp(
          new THREE.Vector3(29, 8.8, 0),
          new THREE.Vector3(50, 0.45, 0),
          {
            width: 5.4,
            thickness: 0.75,
            deckMat: mats.whiteMarble,
            railMat: mats.zahaWhiteFacade,
            railHeight: 0.9,
            railWidth: 0.35,
            walkwayMat: mats.aotiCrimsonArch,
            walkwayWidth: 3.6,
            pierCount: 2,
            pierRadiusTop: 0.6,
            pierRadiusBot: 0.8
          }
        )
      );

      group.add(nanjingEye);

      // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
