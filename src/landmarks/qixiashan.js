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
  id: 'qixiashan',
  name: '栖霞山',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 6.6 新增第 22 景：【🍁 栖霞山（“金陵第一明秀山” · 420+棵漫山红枫层林尽染 · 栖霞古寺 · 隋代舍利塔 · 太虚亭）】
      // 稳坐于东北长江南岸陆地之上 (X = 790, Z = -380；北侧长江南岸石堤位于 Z = -505，山体北麓止于 Z = -450，彻底杜绝压盖江面！)
      // -------------------------------------------------------------------------
      const qixiaGroup = new THREE.Group();
      const QXX = 790, QXZ = -380;
      qixiaGroup.position.set(QXX, 0, QXZ);

      // 1. 栖霞山三峰（主峰凤翔峰海拔286米、东峰龙山、西峰虎山）丹枫红叶地貌网格（纵深 140，北界 Z=-450 与江岸 Z=-505 留有 55 单位滨江陆地缓冲！）
      const qxGeo = new THREE.PlaneGeometry(206, 138, 64, 52);
      qxGeo.rotateX(-Math.PI / 2);
      const qxPos = qxGeo.attributes.position;
      const qxCols = new Float32Array(qxPos.count * 3);
      const cRubyMaple = new THREE.Color(0x991b1b);
      const cCrimsonMaple = new THREE.Color(0xdc2626);
      const cScarletMaple = new THREE.Color(0xef4444);
      const cFlameMaple = new THREE.Color(0xea580c);
      const cGoldMaple = new THREE.Color(0xf59e0b);

      function getQixiaHeight(lx, lz) {
        let h = 0;
        // 中峰：凤翔峰主峰 (lx = 6, lz = -8, H = 62)
        const dMain = Math.hypot(lx - 6, (lz - (-8)) * 1.12);
        h += 62 * Math.exp(-Math.pow(dMain / 38, 1.82));
        // 东峰：龙山临江红枫岭 (lx = 52, lz = -16, H = 48)
        const dEast = Math.hypot(lx - 52, (lz - (-16)) * 1.08);
        h += 48 * Math.exp(-Math.pow(dEast / 33, 1.78));
        // 西峰：虎山桃花涧与红叶谷山脊 (lx = -48, lz = -4, H = 46)
        const dWest = Math.hypot(lx - (-48), (lz - (-4)) * 1.08);
        h += 46 * Math.exp(-Math.pow(dWest / 33, 1.78));
        // 南麓栖霞古寺与明镜湖平缓谷地 (lz > 14)
        if (lz > 14 && Math.abs(lx) < 38) {
          const flatBlend = THREE.MathUtils.smoothstep(lz, 14, 26);
          h = THREE.MathUtils.lerp(h, Math.min(h, 2.0), flatBlend);
        }
        if (h > 2.5) {
          h += (Math.sin(lx * 0.12 + lz * 0.09) * 2.8 + Math.cos(lx * 0.08 - lz * 0.11) * 2.2) * Math.min(1, h / 22);
        }
        return Math.max(0, h);
      }

      for (let i = 0; i < qxPos.count; i++) {
        const vx = qxPos.getX(i), vz = qxPos.getZ(i);
        const rawY = getQixiaHeight(vx, vz);
        const vy = rawY < 0.8 ? 0.45 : rawY + 0.6;
        qxPos.setY(i, vy);

        // 全山地表铺满落红枫叶毯与丹枫渐变色（漫山红遍、层林尽染）
        const c = new THREE.Color();
        const wave = Math.sin(vx * 0.10 + vz * 0.09) * Math.cos(vx * 0.08 - vz * 0.11);
        if (vy < 8) {
          c.copy(cFlameMaple).lerp(cGoldMaple, Math.max(0, wave * 0.65 + 0.25));
        } else if (vy < 36) {
          c.copy(cCrimsonMaple).lerp(wave > 0 ? cScarletMaple : cFlameMaple, Math.abs(wave) * 0.85);
        } else {
          c.copy(cRubyMaple).lerp(cCrimsonMaple, THREE.MathUtils.clamp((vy - 36) / 28, 0, 1));
        }
        qxCols[i * 3] = c.r;
        qxCols[i * 3 + 1] = c.g;
        qxCols[i * 3 + 2] = c.b;
      }
      qxGeo.setAttribute('color', new THREE.BufferAttribute(qxCols, 3));
      qxGeo.computeVertexNormals();
      const qixiaTerrain = new THREE.Mesh(
        qxGeo,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78 })
      );
      qixiaTerrain.castShadow = true;
      qixiaTerrain.receiveShadow = true;
      qixiaGroup.add(qixiaTerrain);

      // 红叶谷盘山赏枫红石步道（从山麓古寺蜿蜒盘旋直达凤翔峰顶太虚亭）
      const mapleTrailPts = [
        new THREE.Vector3(-12, getQixiaHeight(-12, 18) + 1.0, 18),
        new THREE.Vector3(-28, getQixiaHeight(-28, 4) + 1.1, 4),
        new THREE.Vector3(-16, getQixiaHeight(-16, -10) + 1.1, -10),
        new THREE.Vector3(6,   getQixiaHeight(6, -8) + 1.0, -8)
      ];
      const mapleTrail = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(mapleTrailPts), 36, 1.35, 6, false),
        mats.aotiCrimsonArch
      );
      mapleTrail.scale.set(1, 0.2, 1);
      qixiaGroup.add(mapleTrail);

      // 2. 凤翔峰山巅临江【太虚亭 / 始皇临江处】（双层八角重檐朱红飞檐金瓦观江亭，北望滚滚长江）
      const peakY = getQixiaHeight(6, -8) + 0.6;
      const taixuPavilion = new THREE.Group();
      taixuPavilion.position.set(6, peakY - 0.6, -8);
      const txPlinth = new THREE.Mesh(new THREE.CylinderGeometry(6.2, 7.4, 2.2, 8), mats.whiteMarble);
      txPlinth.position.y = 1.1;
      const txCols1 = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.4, 3.8, 8), mats.vermilionRed);
      txCols1.position.y = 4.0;
      const txRoof1 = createChineseRoof(11.2, 11.2, 2.0, mats.imperialYellowGlaze, false);
      txRoof1.position.y = 5.9;
      const txCols2 = new THREE.Mesh(new THREE.CylinderGeometry(3.0, 3.2, 2.8, 8), mats.vermilionRed);
      txCols2.position.y = 8.2;
      const txRoof2 = createChineseRoof(8.8, 8.8, 2.5, mats.goldTrim, true);
      txRoof2.position.y = 9.6;
      taixuPavilion.add(txPlinth, txCols1, txRoof1, txCols2, txRoof2);
      qixiaGroup.add(taixuPavilion);

      // 虎山红叶谷【霜红苑 / 话山亭】与龙山【枫岭亭】两座伴山赏枫古亭
      [[-46, -4], [50, -15]].forEach(([px, pz]) => {
        const subPeakY = getQixiaHeight(px, pz) + 0.6;
        const maplePav = new THREE.Group();
        maplePav.position.set(px, subPeakY - 0.5, pz);
        const mpCol = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.8, 3.4, 6), mats.vermilionRed);
        mpCol.position.y = 1.7;
        const mpRoof = createChineseRoof(6.8, 6.8, 2.0, mats.goldTrim, true);
        mpRoof.position.y = 3.4;
        maplePav.add(mpCol, mpRoof);
        qixiaGroup.add(maplePav);
      });

      // 3. 山麓千年古刹【栖霞古寺】（明黄院墙、三门山门、毗卢宝殿、藏经楼，中国四大名刹之一）
      const qixiaTemple = new THREE.Group();
      qixiaTemple.position.set(0, 1.0, 26);

      const templePlatform = new THREE.Mesh(new THREE.BoxGeometry(36, 1.4, 28), mats.whiteMarble);
      templePlatform.position.y = 0.7;
      const yellowWall = new THREE.Mesh(new THREE.BoxGeometry(34, 3.6, 26), mats.imperialYellowGlaze);
      yellowWall.position.y = 2.5;
      qixiaTemple.add(templePlatform, yellowWall);

      const qxShanmen = new THREE.Mesh(new THREE.BoxGeometry(14, 4.8, 3.6), mats.jimingWallMat);
      qxShanmen.position.set(0, 3.6, 12.5);
      const qxSmRoof = createChineseRoof(16.8, 6.0, 2.3, mats.darkGreyTile, true);
      qxSmRoof.position.set(0, 6.0, 12.5);
      qixiaTemple.add(qxShanmen, qxSmRoof);

      const piluBody = new THREE.Mesh(new THREE.BoxGeometry(17.5, 6.2, 10.5), mats.jimingWallMat);
      piluBody.position.set(0, 4.5, 1.5);
      piluBody.castShadow = true;
      const piluLattice = new THREE.Mesh(new THREE.BoxGeometry(14.8, 4.6, 10.8), mats.ancientLatticeMat);
      piluLattice.position.set(0, 4.3, 1.5);
      const piluRoof1 = createChineseRoof(21.0, 13.5, 2.3, mats.darkGreyTile, false);
      piluRoof1.position.set(0, 7.6, 1.5);
      const piluRoof2 = createChineseRoof(17.2, 10.8, 3.0, mats.darkGreyTile, true);
      piluRoof2.position.set(0, 9.6, 1.5);
      const burner = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 1.8, 12), mats.bronze);
      burner.position.set(0, 2.3, 8.2);
      qixiaTemple.add(piluBody, piluLattice, piluRoof1, piluRoof2, burner);

      const cangjingBody = new THREE.Mesh(new THREE.BoxGeometry(19.0, 5.8, 8.5), mats.ancientLatticeMat);
      cangjingBody.position.set(0, 5.2, -9.2);
      const cangjingRoof = createChineseRoof(22.2, 11.2, 2.6, mats.darkGreyTile, true);
      cangjingRoof.position.set(0, 8.1, -9.2);
      qixiaTemple.add(cangjingBody, cangjingRoof);
      qixiaGroup.add(qixiaTemple);

      // 4. 国宝【隋代五级八角舍利石塔】（位于古寺东南侧 X = 25, Z = 22）
      const suiRelicPagoda = new THREE.Group();
      suiRelicPagoda.position.set(25, 1.4, 22);

      const relicPed1 = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.4, 1.8, 8), mats.whiteMarble);
      relicPed1.position.y = 0.9;
      const relicPed2 = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.4, 1.4, 8), mats.platformInlay);
      relicPed2.position.y = 2.5;
      suiRelicPagoda.add(relicPed1, relicPed2);

      for (let lv = 0; lv < 5; lv++) {
        const r = 3.1 - lv * 0.32;
        const h = lv === 0 ? 3.2 : 2.15;
        const yBase = 3.2 + (lv === 0 ? 0 : 3.2 + (lv - 1) * 2.15);
        const octStone = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.94, r, h, 8), mats.whiteMarble);
        octStone.position.y = yBase + h * 0.5;
        octStone.castShadow = true;
        const nicheRing = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.97, r * 0.97, h * 0.45, 8), mats.goldTrim);
        nicheRing.position.y = yBase + h * 0.48;
        const stoneEave = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.85, r * 1.38, 0.78, 8), mats.platformInlay);
        stoneEave.position.y = yBase + h + 0.15;
        suiRelicPagoda.add(octStone, nicheRing, stoneEave);
      }
      const relicTopY = 3.2 + 3.2 + 4 * 2.15;
      const lotusCap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 1.45, 2.2, 8), mats.goldTrim);
      lotusCap.position.y = relicTopY + 1.1;
      const pearlSpire = new THREE.Mesh(new THREE.SphereGeometry(0.65, 10, 10), mats.goldTrim);
      pearlSpire.position.y = relicTopY + 2.6;
      suiRelicPagoda.add(lotusCap, pearlSpire);
      qixiaGroup.add(suiRelicPagoda);

      const grottoCliff = new THREE.Mesh(new THREE.BoxGeometry(14, 7.5, 8), mats.mingStoneBase);
      grottoCliff.position.set(34, 4.5, 14);
      const grottoEave = createChineseRoof(15.5, 5.2, 1.8, mats.vermilionRed, false);
      grottoEave.position.set(34, 8.2, 16.5);
      qixiaGroup.add(grottoCliff, grottoEave);

      // 5. 栖霞山麓【明镜湖】（彩虹曲桥、湖心八角红枫亭，位于古寺西南侧 X = -28, Z = 32）
      const mirrorLakeGroup = new THREE.Group();
      mirrorLakeGroup.position.set(-28, 0.5, 32);
      const mlRim = new THREE.Mesh(new THREE.CylinderGeometry(15.5, 16.5, 0.9, 32), mats.whiteMarble);
      mlRim.scale.set(1.25, 1, 0.9);
      mlRim.position.y = 0.2;
      const mlWater = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 14.5, 0.7, 32), mats.lakeWater);
      mlWater.scale.set(1.25, 1, 0.9);
      mlWater.position.y = 0.35;
      const lakePavBase = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, 1.2, 8), mats.whiteMarble);
      lakePavBase.position.y = 0.8;
      const lakePavBody = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 2.8, 8), mats.vermilionRed);
      lakePavBody.position.y = 2.6;
      const lakePavRoof = createChineseRoof(6.2, 6.2, 1.8, mats.goldTrim, true);
      lakePavRoof.position.y = 4.0;
      const rainbowBridge = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.65, 2.2), mats.whiteMarble);
      rainbowBridge.position.set(7.5, 0.85, 0);
      mirrorLakeGroup.add(mlRim, mlWater, lakePavBase, lakePavBody, lakePavRoof, rainbowBridge);
      qixiaGroup.add(mirrorLakeGroup);

      // 6. “秋栖霞 · 满山红枫”：420+ 棵高密度火红鸡爪槭、枫香、羽毛枫、红乌桕与古银杏铺满三峰每一寸山坡！
      const mapleCrownMats = [
        new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.55, emissive: new THREE.Color(0x7f1d1d), emissiveIntensity: 0.16 }), // 丹枫正红
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.52, emissive: new THREE.Color(0x991b1b), emissiveIntensity: 0.18 }), // 绯红鸡爪槭
        new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.58, emissive: new THREE.Color(0x450a0a), emissiveIntensity: 0.15 }), // 深红霜叶
        new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.54, emissive: new THREE.Color(0x9a3412), emissiveIntensity: 0.16 }), // 烈焰橙红枫
        new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.56, emissive: new THREE.Color(0x78350f), emissiveIntensity: 0.14 })  // 琥珀红金枫
      ];

      function createRedMapleTree(scale = 1.0, seed = 0) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
        trunk.position.y = 1.0;
        trunk.castShadow = true;
        tree.add(trunk);
        // 饱满伞状多层红枫树冠
        const offsets = [
          [0, 3.3, 0, 1.55, 1.05, 1.55],
          [-0.92, 2.8, 0.52, 1.15, 0.88, 1.15],
          [0.92, 2.85, -0.48, 1.15, 0.88, 1.15],
          [-0.45, 2.9, -0.82, 1.08, 0.85, 1.08],
          [0.48, 3.85, 0.32, 1.05, 0.82, 1.05]
        ];
        offsets.forEach(([ox, oy, oz, sx, sy, sz], idx) => {
          const mMat = mapleCrownMats[(seed + idx) % mapleCrownMats.length];
          const puff = new THREE.Mesh(sharedGeos.wutongPuff, mMat);
          puff.position.set(ox, oy, oz);
          puff.scale.set(sx, sy, sz);
          puff.rotation.y = seed + idx;
          puff.castShadow = true;
          tree.add(puff);
        });
        tree.scale.setScalar(scale);
        return tree;
      }

      // 采用黄金螺旋 + 网格交错算法，在栖霞山三峰密植 420 棵火红枫树，做到真正的“满山红枫”！
      for (let m = 0; m < 420; m++) {
        // 黄金角分布覆盖三峰核心区 + 全山坡面
        const rRatio = Math.sqrt((m + 0.5) / 420);
        const theta = m * 2.3999632;
        let mx = Math.cos(theta) * rRatio * 96;
        let mz = Math.sin(theta) * rRatio * 68 - 4;

        // 避开栖霞古寺大殿中轴心、明镜湖水面中心与山顶太虚亭正中心
        if (mz > 11 && mz < 40 && Math.abs(mx) < 18) {
          mx = mx < 0 ? mx - 20 : mx + 20;
        }
        if (Math.hypot(mx - (-28), mz - 32) < 14) {
          mx -= 16;
        }
        if (Math.hypot(mx - 6, mz - (-8)) < 7.5) {
          mx += 9;
        }

        const my = getQixiaHeight(mx, mz) + 0.45;
        const sc = 1.08 + (m % 4) * 0.22;
        const maple = createRedMapleTree(sc, m);
        maple.position.set(mx, my - 0.25, mz);
        qixiaGroup.add(maple);
      }

      group.add(qixiaGroup);

    scene.add(group);
    return group;
  }
};
