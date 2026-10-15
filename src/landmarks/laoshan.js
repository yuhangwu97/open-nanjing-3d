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
  id: 'laoshan',
  name: '南京老山国家森林公园',
  build(scene, ctx) {

    // buildLaoshanForestPark
      const group = new THREE.Group();
      // 响应用户要求：老山坐落江北最左侧 (X = -645, Z = -20)，体量大幅扩建为 148m 宽 × 490m 长的巍峨百里连绵山脉！
      const LX = -820, LZ = -60;
      group.position.set(LX, 0, LZ);

      // 0. 老山国家森林公园超大型生态林地台座 (176m x 518m)
      const laoshanBaseRim = new THREE.Mesh(new THREE.BoxGeometry(176, 0.7, 518), mats.platformInlay);
      laoshanBaseRim.position.set(0, 0.35, 0);
      laoshanBaseRim.receiveShadow = true;
      const laoshanBasePad = new THREE.Mesh(
        new THREE.BoxGeometry(168, 1.1, 510),
        new THREE.MeshStandardMaterial({ color: 0x1f5624, roughness: 0.85 })
      );
      laoshanBasePad.position.set(0, 0.55, 0);
      laoshanBasePad.receiveShadow = true;
      group.add(laoshanBaseRim, laoshanBasePad);

      // 1. 巍峨百里老山多峰山脉地形网格 (宽 148m、长 490m，主峰大刺山高达 78 单位！)
      const tGeo = new THREE.PlaneGeometry(148, 490, 52, 128);
      tGeo.rotateX(-Math.PI / 2);
      const pos = tGeo.attributes.position;
      const cols = new Float32Array(pos.count * 3);
      const cBase = new THREE.Color(0x1b3b1e);
      const cMid = new THREE.Color(0x15803d);
      const cRidge = new THREE.Color(0x4d7c0f);
      const cRock = new THREE.Color(0x64748b);
      const cAutumn = new THREE.Color(0xd97706);

      // 9座主次交错的雄伟山峰群（天花山、老鹰山、狮子岭、平山、大刺山最高峰、龙洞山、胡家山、天井山、横山）
      const stripPeaks = [
        { x: -10, z: -195, h: 52, rx: 32, rz: 42 },
        { x: 14,  z: -140, h: 60, rx: 35, rz: 44 },
        { x: -12, z: -85,  h: 66, rx: 36, rz: 46 },
        { x: -4,  z: -32,  h: 78, rx: 40, rz: 50 }, // 大刺山最高主峰（状元塔）
        { x: 18,  z: 8,    h: 58, rx: 32, rz: 40 }, // 东翼副峰
        { x: 6,   z: 35,   h: 68, rx: 38, rz: 46 }, // 鹰山峰
        { x: -8,  z: 92,   h: 62, rx: 36, rz: 44 }, // 狮子岭（兜率寺）
        { x: 10,  z: 148,  h: 56, rx: 34, rz: 42 },
        { x: -4,  z: 198,  h: 46, rx: 30, rz: 38 }
      ];

      function calcLaoshanStripH(vx, vz) {
        let h = 0;
        const spineX = Math.sin(vz * 0.018) * 11.0;
        const distFromSpine = Math.abs(vx - spineX);
        const endTaper = Math.sin(THREE.MathUtils.clamp((vz + 238) / 476, 0, 1) * Math.PI);
        h += 32 * endTaper * Math.exp(-(distFromSpine * distFromSpine) / (2 * 28 * 28));

        for (let k = 0; k < stripPeaks.length; k++) {
          const pk = stripPeaks[k];
          const d = Math.hypot((vx - pk.x) / pk.rx, (vz - pk.z) / pk.rz);
          h += pk.h * 0.68 * Math.exp(-(d * d) * 1.12);
        }

        if (h > 2.5) {
          h += (Math.sin(vx * 0.11 + vz * 0.06) * 3.6 + Math.cos(vz * 0.09 - vx * 0.08) * 2.8) * Math.min(1, h / 24);
        }
        return Math.max(0, h);
      }

      for (let i = 0; i < pos.count; i++) {
        const vx = pos.getX(i), vz = pos.getZ(i);
        const rawY = calcLaoshanStripH(vx, vz);
        const vy = rawY < 1.2 ? 1.18 : rawY + 1.15;
        pos.setY(i, vy);
        const c = new THREE.Color().copy(cBase).lerp(vy > 42 ? cRidge : cMid, Math.min(1, vy / 68));
        if (vy > 58) c.lerp(cRock, Math.min(0.65, (vy - 58) / 28));
        if (Math.sin(vx * 0.10 + vz * 0.08) > 0.38 && vy < 40) c.lerp(cAutumn, 0.45);
        cols[i * 3] = c.r;
        cols[i * 3 + 1] = c.g;
        cols[i * 3 + 2] = c.b;
      }
      tGeo.setAttribute('color', new THREE.BufferAttribute(cols, 3));
      tGeo.computeVertexNormals();
      const mountain = new THREE.Mesh(
        tGeo,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86 })
      );
      mountain.castShadow = true;
      mountain.receiveShadow = true;
      group.add(mountain);

      // 喀斯特山崖巨石簇
      [[-18, -45, 7.5], [22, -25, 6.8], [-16, 48, 7.0], [18, 85, 6.2], [-12, -135, 6.5]].forEach(([rx, rz, rs]) => {
        const ry = calcLaoshanStripH(rx, rz) + 1.15;
        const crag = new THREE.Mesh(new THREE.DodecahedronGeometry(rs, 1), mats.mingStoneBase);
        crag.scale.set(1.25, 0.8, 0.95);
        crag.position.set(rx, ry - 1.0, rz);
        group.add(crag);
      });

      // 2. 大刺山最高主峰之巅：五层八角飞檐【老山森林观景塔 / 状元塔】 (X = -4, Z = -32)
      const mainH = calcLaoshanStripH(-4, -32) + 1.15;
      const forestPagoda = new THREE.Group();
      forestPagoda.position.set(-4, mainH - 0.8, -32);
      const pPlinth = new THREE.Mesh(new THREE.CylinderGeometry(6.8, 8.0, 2.4, 8), mats.whiteMarble);
      pPlinth.position.y = 1.2;
      forestPagoda.add(pPlinth);
      for (let lv = 0; lv < 5; lv++) {
        const r = 4.6 - lv * 0.52;
        const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 2.8, 8), mats.vermilionRed);
        body.position.y = 2.4 + lv * 2.8 + 1.4;
        const roof = createChineseRoof(r * 2.45, r * 2.45, 1.45, mats.greenGlaze, lv === 4);
        roof.position.y = 2.4 + (lv + 1) * 2.8;
        forestPagoda.add(body, roof);
      }
      group.add(forestPagoda);

      // 3. 狮子岭千年古刹【兜率寺】（三进红墙金瓦禅院，Z = 92）
      const templeH = calcLaoshanStripH(-8, 92) + 1.15;
      const temple = new THREE.Group();
      temple.position.set(-8, templeH - 0.8, 92);
      const tWall = new THREE.Mesh(new THREE.BoxGeometry(15, 4.4, 11), mats.vermilionRed);
      tWall.position.y = 2.2;
      const tRoof = createChineseRoof(18.0, 13.5, 2.8, mats.imperialYellowGlaze, true);
      tRoof.position.y = 4.4;
      temple.add(tWall, tRoof);
      group.add(temple);

      // 4. 鹰山八角森林瞭望亭 (Z = 35) 与 东麓网红美丽乡村【不老村白墙黛瓦村落 & 老山石牌坊】(X = 52, Z = 15)
      const pavH = calcLaoshanStripH(6, 35) + 1.15;
      const eaglePav = new THREE.Group();
      eaglePav.position.set(6, pavH - 0.6, 35);
      const epCol = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.0, 3.8, 8), mats.vermilionRed);
      epCol.position.y = 1.9;
      const epRoof = createChineseRoof(7.2, 7.2, 2.3, mats.goldTrim, true);
      epRoof.position.y = 3.8;
      eaglePav.add(epCol, epRoof);
      group.add(eaglePav);

      // 东麓山脚【不老村】江南院落与【老山国家森林公园】迎宾石牌坊
      [-25, 0, 25].forEach((vz, idx) => {
        const cottage = new THREE.Group();
        cottage.position.set(54, 1.1, vz);
        const cBody = new THREE.Mesh(new THREE.BoxGeometry(8.5, 4.2, 6.5), mats.whiteMarble);
        cBody.position.y = 2.1;
        const cRoof = createChineseRoof(10.2, 8.0, 1.9, mats.darkGreyTile, false);
        cRoof.position.y = 4.2;
        cottage.add(cBody, cRoof);
        group.add(cottage);
      });

      // 5. 纵贯整条老山东坡的【七珍线彩虹森林盘山公路】（长 420 单位）
      const roadPts = [];
      for (let i = 0; i <= 32; i++) {
        const u = i / 32;
        const rz = -205 + u * 410;
        const rx = 22 + Math.sin(u * Math.PI * 6) * 10;
        roadPts.push(new THREE.Vector3(rx, calcLaoshanStripH(rx, rz) + 1.75, rz));
      }
      const forestRoad = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(roadPts), 90, 1.35, 6, false),
        mats.aotiCrimsonArch
      );
      forestRoad.scale.set(1, 0.22, 1);
      group.add(forestRoad);

      // 6. 漫山遍野的苍松、翠竹与深秋红枫林海 (180 棵)
      for (let t = 0; t < 180; t++) {
        const tz = -220 + ((t * 31) % 440);
        const tx = ((t * 19) % 88) - 44;
        const ty = calcLaoshanStripH(tx, tz) + 1.15;
        if (ty < 3.0 || ty > 64) continue;
        const tree = t % 3 === 0 ? createWutongTree(1.05, t) : createChinesePine(1.15, t);
        tree.position.set(tx, ty - 0.2, tz);
        group.add(tree);
      }

      scene.add(group);
    return group;
  }
};
