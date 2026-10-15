import * as THREE from 'three';
import { mats, yangtzeShimmerTex, lakeShimmerTex, cherryBlossomMat } from './materials.js';
import { sharedGeos, createWutongTree, createWeepingWillow } from './geo-builder.js';
import { YANGTZE_MAIN_CURVE, getYangtzeHalfWidth } from './constants.js';

export { YANGTZE_MAIN_CURVE, getYangtzeHalfWidth };

export function buildYangtzeRiver(scene, mats, ctx) {
  const group = new THREE.Group();
  let yangtzeSparkleGeo = null;
  const yangtzeSparkleData = [];
  const animatedShips = [];

      // 6.1 半圆弧形浩瀚长江（采用 YANGTZE_MAIN_CURVE 平滑曲线带状网格 + 动态滚动波光纹理 + 1600颗碎金波光闪烁粒子）
      const riverSegs = 220;
      const riverPositions = new Float32Array((riverSegs + 1) * 2 * 3);
      const riverUVs = new Float32Array((riverSegs + 1) * 2 * 2);
      const riverIndices = [];
      const leftBankPts = [];
      const rightBankPts = [];

      for (let i = 0; i <= riverSegs; i++) {
        const u = i / riverSegs;
        const pt = YANGTZE_MAIN_CURVE.getPointAt(u);
        const tan = YANGTZE_MAIN_CURVE.getTangentAt(u).normalize();
        const normal = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        const hw = getYangtzeHalfWidth(u);

        const pLeft = pt.clone().addScaledVector(normal, -hw);
        const pRight = pt.clone().addScaledVector(normal, hw);
        leftBankPts.push(new THREE.Vector3(pLeft.x, 0.65, pLeft.z));
        rightBankPts.push(new THREE.Vector3(pRight.x, 0.65, pRight.z));

        const vIdx = i * 6;
        riverPositions[vIdx]     = pLeft.x;
        riverPositions[vIdx + 1] = 0.22; // 高出陆地基底(-0.35)，确保江水饱满清晰可见
        riverPositions[vIdx + 2] = pLeft.z;
        riverPositions[vIdx + 3] = pRight.x;
        riverPositions[vIdx + 4] = 0.22;
        riverPositions[vIdx + 5] = pRight.z;

        const uvIdx = i * 4;
        riverUVs[uvIdx]     = u * 24;
        riverUVs[uvIdx + 1] = 0;
        riverUVs[uvIdx + 2] = u * 24;
        riverUVs[uvIdx + 3] = 3.5;

        if (i < riverSegs) {
          const a = i * 2, b = i * 2 + 1, c = (i + 1) * 2, d = (i + 1) * 2 + 1;
          // 严格采用逆时针绕序 (a, b, c) 与 (b, d, c)，确保法线朝上 (+Y) 绝不背面剔除！
          riverIndices.push(a, b, c, b, d, c);
        }
      }

      const riverRibbonGeo = new THREE.BufferGeometry();
      riverRibbonGeo.setAttribute('position', new THREE.BufferAttribute(riverPositions, 3));
      riverRibbonGeo.setAttribute('uv', new THREE.BufferAttribute(riverUVs, 2));
      riverRibbonGeo.setIndex(riverIndices);
      riverRibbonGeo.computeVertexNormals();

      const curvedRiverMesh = new THREE.Mesh(riverRibbonGeo, mats.yangtzeWater);
      curvedRiverMesh.receiveShadow = true;
      group.add(curvedRiverMesh);

      // 叠加第二层半透明流动波峰高光带，营造层层推进的江水波浪感
      const waveOverlayMat = new THREE.MeshBasicMaterial({
        map: yangtzeShimmerTex,
        color: 0xe0f2fe,
        transparent: true,
        opacity: 0.42,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const waveOverlayMesh = new THREE.Mesh(riverRibbonGeo, waveOverlayMat);
      waveOverlayMesh.position.y = 0.08;
      group.add(waveOverlayMesh);

      // 1,600 颗“波光粼粼”阳光碎金闪烁粒子（沿半圆弧形长江表面实时律动闪烁）
      const SPARKLE_COUNT = 1600;
      yangtzeSparkleGeo = new THREE.BufferGeometry();
      const spPosArr = new Float32Array(SPARKLE_COUNT * 3);
      const spColArr = new Float32Array(SPARKLE_COUNT * 3);
      const cGoldGlint = new THREE.Color(0xfef08a);
      const cWhiteGlint = new THREE.Color(0xffffff);
      const cCyanGlint = new THREE.Color(0xbae6fd);

      for (let s = 0; s < SPARKLE_COUNT; s++) {
        const u = (s / SPARKLE_COUNT + Math.random() * 0.01) % 1.0;
        const hw = getYangtzeHalfWidth(u) * 0.88;
        const lat = (Math.random() * 2 - 1) * hw;
        const pt = YANGTZE_MAIN_CURVE.getPointAt(u);
        const tan = YANGTZE_MAIN_CURVE.getTangentAt(u).normalize();
        const normal = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        const p = pt.clone().addScaledVector(normal, lat);
        spPosArr[s * 3]     = p.x;
        spPosArr[s * 3 + 1] = 0.42 + (s % 3) * 0.06;
        spPosArr[s * 3 + 2] = p.z;

        const col = s % 3 === 0 ? cGoldGlint : (s % 3 === 1 ? cWhiteGlint : cCyanGlint);
        spColArr[s * 3]     = col.r;
        spColArr[s * 3 + 1] = col.g;
        spColArr[s * 3 + 2] = col.b;

        yangtzeSparkleData.push({ u, latRatio: lat / Math.max(1, hw), speed: 0.008 + (s % 5) * 0.002 });
      }
      yangtzeSparkleGeo.setAttribute('position', new THREE.BufferAttribute(spPosArr, 3));
      yangtzeSparkleGeo.setAttribute('color', new THREE.BufferAttribute(spColArr, 3));
      const sparkleMat = new THREE.PointsMaterial({
        size: 2.35,
        vertexColors: true,
        transparent: true,
        opacity: 0.92,
        blending: THREE.AdditiveBlending
      });
      const sparklePoints = new THREE.Points(yangtzeSparkleGeo, sparkleMat);
      group.add(sparklePoints);

      // 沿半圆弧形长江两岸铺设生态石堤护岸（东/南岸在鱼嘴湿地公园 Z=320~415 段精准断开，确保鱼嘴公园 100% 无遮挡露出！）
      const northBankCurve = new THREE.CatmullRomCurve3(leftBankPts);
      const northBankWall = new THREE.Mesh(
        new THREE.TubeGeometry(northBankCurve, 160, 1.5, 6, false),
        mats.mingStoneBase
      );
      northBankWall.scale.set(1, 0.65, 1);
      group.add(northBankWall);

      const southBankPtsFiltered = rightBankPts.filter(p => p.z <= 320);
      const southBankCurve = new THREE.CatmullRomCurve3(southBankPtsFiltered);
      const southBankWall = new THREE.Mesh(
        new THREE.TubeGeometry(southBankCurve, 140, 1.4, 6, false),
        mats.whiteMarble
      );
      southBankWall.scale.set(1, 0.65, 1);
      group.add(southBankWall);

      // 【秦淮新河入江口水道】南移至 Z = 435（位于鱼嘴湿地公园南侧，彻底解除对鱼嘴公园的遮挡）
      const qinhuaiNewRiver = new THREE.Mesh(new THREE.BoxGeometry(155, 0.58, 18), mats.qinhuaiWater);
      qinhuaiNewRiver.position.set(-190, -0.04, 435);
      qinhuaiNewRiver.receiveShadow = true;
      group.add(qinhuaiNewRiver);

      // 【中新南京生态科技岛 · 江心洲】—— 大幅加长加宽（宽约 88 单位、长约 435 单位，纵贯 Z = -75 ~ +360！）
      const jiangxinzhou = new THREE.Group();
      const JXZ_X = -364, JXZ_Z = 142;
      jiangxinzhou.position.set(JXZ_X, 0, JXZ_Z);
      jiangxinzhou.scale.set(1.78, 1.0, 1.68);

      const jxzShape = new THREE.Shape();
      jxzShape.moveTo(0, -130);
      jxzShape.quadraticCurveTo(26, -65, 25, 12);
      jxzShape.quadraticCurveTo(24, 85, 0, 130);
      jxzShape.quadraticCurveTo(-24, 80, -25, 8);
      jxzShape.quadraticCurveTo(-26, -68, 0, -130);
      jxzShape.closePath();

      const jxzBankGeo = new THREE.ExtrudeGeometry(jxzShape, { depth: 1.5, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 1.2 });
      jxzBankGeo.rotateX(Math.PI / 2);
      const jxzBank = new THREE.Mesh(jxzBankGeo, mats.whiteMarble);
      jxzBank.position.y = 1.45;
      jxzBank.receiveShadow = true;
      jiangxinzhou.add(jxzBank);

      const jxzGrass = new THREE.Mesh(jxzBankGeo.clone(), mats.islandGrass);
      jxzGrass.scale.set(0.93, 1.0, 0.97);
      jxzGrass.position.y = 1.65;
      jxzGrass.receiveShadow = true;
      jiangxinzhou.add(jxzGrass);

      const trackPts = [];
      for (let i = 0; i < 36; i++) {
        const ang = (i / 36) * Math.PI * 2;
        const rx = Math.sin(ang) * 19.2 * (1 - 0.24 * Math.pow(Math.cos(ang), 2));
        const rz = Math.cos(ang) * 114;
        trackPts.push(new THREE.Vector3(rx, 1.72, rz));
      }
      const jxzTrack = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(trackPts, true), 72, 0.78, 6, true),
        mats.aotiCrimsonArch
      );
      jxzTrack.scale.set(1, 0.18, 1);
      jiangxinzhou.add(jxzTrack);

      for (let p = 0; p < 24; p++) {
        const pinkPatch = new THREE.Mesh(sharedGeos.wutongPuff, cherryBlossomMat);
        pinkPatch.position.set((p % 3 - 1) * 6.5, 2.1, 28 + p * 3.8);
        pinkPatch.scale.set(2.6, 0.55, 2.4);
        jiangxinzhou.add(pinkPatch);
      }
      for (let t = 0; t < 38; t++) {
        const tz = -108 + t * 5.2;
        const tx = ((t * 7) % 5 - 2) * 4.6;
        const tree = t % 3 === 0 ? createWutongTree(0.92, t) : createWeepingWillow(0.96, t);
        tree.position.set(tx, 1.6, tz);
        jiangxinzhou.add(tree);
      }

      const ecoCenter = new THREE.Mesh(new THREE.CylinderGeometry(4.5, 5.8, 12, 18), mats.zahaWhiteFacade);
      ecoCenter.scale.set(1.2, 1, 0.75);
      ecoCenter.position.set(-2, 7.6, -5);
      const ecoGlass = new THREE.Mesh(new THREE.CylinderGeometry(4.7, 5.2, 7.5, 18), mats.qingaoGlassMat);
      ecoGlass.scale.set(1.2, 1, 0.75);
      ecoGlass.position.set(-2, 7.8, -5);
      jiangxinzhou.add(ecoCenter, ecoGlass);

      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(2, 12.5, 22);
      const wheelRing = new THREE.Mesh(new THREE.TorusGeometry(8.5, 0.32, 8, 32), mats.whiteMarble);
      const wheelGlow = new THREE.Mesh(new THREE.TorusGeometry(8.2, 0.18, 6, 32), mats.zifengCrownGlow);
      wheelGroup.add(wheelRing, wheelGlow);
      for (let sp = 0; sp < 8; sp++) {
        const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 17, 4), mats.stayCableMat);
        spoke.rotation.z = (sp / 8) * Math.PI;
        wheelGroup.add(spoke);
      }
      [-2.2, 2.2].forEach(lz => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 12.5, 6), mats.whiteMarble);
        leg.position.set(0, -5.5, lz);
        leg.rotation.x = lz > 0 ? -0.22 : 0.22;
        wheelGroup.add(leg);
      });
      jiangxinzhou.add(wheelGroup);
      group.add(jiangxinzhou);

      // -------------------------------------------------------------------------

      // 6.5 长江半圆弧形航道 11 艘豪华游轮与万吨集装箱货轮船队（全部沿 YANGTZE_MAIN_CURVE 实时曲线巡航！）
      // -------------------------------------------------------------------------
      function createCargoShipMesh(hullColor, scale = 1.0) {
        const ship = new THREE.Group();
        const hullMat = new THREE.MeshStandardMaterial({ color: hullColor, roughness: 0.55 });
        const hullBody = new THREE.Mesh(new THREE.BoxGeometry(22, 2.6, 6.0), hullMat);
        hullBody.position.y = 1.2;
        hullBody.castShadow = true;
        const bowCone = new THREE.Mesh(new THREE.ConeGeometry(3.0, 5.5, 4), hullMat);
        bowCone.rotation.z = -Math.PI / 2;
        bowCone.rotation.x = Math.PI / 4;
        bowCone.position.set(13.2, 1.3, 0);
        const sternBlock = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.6, 5.6), hullMat);
        sternBlock.position.set(-12.2, 1.2, 0);
        ship.add(hullBody, bowCone, sternBlock);

        const bridge1 = new THREE.Mesh(new THREE.BoxGeometry(4.8, 3.2, 5.2), mats.whiteMarble);
        bridge1.position.set(-8.5, 4.0, 0);
        const bridge2 = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.4, 4.6), mats.whiteMarble);
        bridge2.position.set(-8.2, 6.6, 0);
        const bridgeWin = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.8, 4.8), mats.qingaoGlassMat);
        bridgeWin.position.set(-7.8, 7.0, 0);
        const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.85, 2.8, 10), mats.hsrRedMat);
        funnel.position.set(-9.6, 8.6, 0);
        ship.add(bridge1, bridge2, bridgeWin, funnel);

        const containerColors = [0xdc2626, 0x2563eb, 0xd97706, 0x059669, 0x7c3aed];
        [-2.5, 3.2, 8.5].forEach((cx, cIdx) => {
          [-1.35, 1.35].forEach((cz, zIdx) => {
            const cMat = new THREE.MeshStandardMaterial({ color: containerColors[(cIdx * 2 + zIdx) % containerColors.length], roughness: 0.5 });
            const box = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.6 + (cIdx % 2) * 1.1, 2.3), cMat);
            box.position.set(cx, 3.6, cz);
            box.castShadow = true;
            ship.add(box);
          });
        });

        const wake = new THREE.Mesh(
          new THREE.PlaneGeometry(12, 4.5),
          new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.45, side: THREE.DoubleSide })
        );
        wake.rotation.x = -Math.PI / 2;
        wake.position.set(-19, 0.32, 0);
        ship.add(wake);

        ship.scale.setScalar(scale);
        return ship;
      }

      function createCruiseShipMesh(scale = 1.0) {
        const cruise = new THREE.Group();
        const hull = new THREE.Mesh(new THREE.BoxGeometry(24, 2.6, 6.2), mats.whiteMarble);
        hull.position.y = 1.25;
        hull.castShadow = true;
        const bow = new THREE.Mesh(new THREE.ConeGeometry(3.1, 6.2, 4), mats.whiteMarble);
        bow.rotation.z = -Math.PI / 2;
        bow.rotation.x = Math.PI / 4;
        bow.position.set(14.8, 1.35, 0);
        const blueBelt = new THREE.Mesh(new THREE.BoxGeometry(24.4, 0.55, 6.35), mats.qingaoGlassMat);
        blueBelt.position.y = 1.8;
        cruise.add(hull, bow, blueBelt);

        for (let d = 0; d < 3; d++) {
          const len = 19.5 - d * 2.2;
          const deckWhite = new THREE.Mesh(new THREE.BoxGeometry(len, 1.55, 5.4 - d * 0.35), mats.whiteMarble);
          deckWhite.position.set(-0.5 - d * 0.4, 3.2 + d * 1.65, 0);
          deckWhite.castShadow = true;
          const deckGlass = new THREE.Mesh(new THREE.BoxGeometry(len - 0.8, 0.85, 5.55 - d * 0.35), mats.warmWindowGlow);
          deckGlass.position.set(-0.5 - d * 0.4, 3.25 + d * 1.65, 0);
          cruise.add(deckWhite, deckGlass);
        }

        const sunCanopy = new THREE.Mesh(new THREE.BoxGeometry(11, 0.35, 4.2), mats.goldTrim);
        sunCanopy.position.set(-1.5, 8.2, 0);
        const pool = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.2, 2.4), mats.lakeWater);
        pool.position.set(4.2, 7.5, 0);
        const funnel = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.85, 2.6, 12), mats.aotiCrimsonArch);
        funnel.rotation.z = 0.22;
        funnel.position.set(-5.5, 8.8, 0);
        const wake = new THREE.Mesh(
          new THREE.PlaneGeometry(14, 4.8),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5, side: THREE.DoubleSide })
        );
        wake.rotation.x = -Math.PI / 2;
        wake.position.set(-18.5, 0.32, 0);
        cruise.add(sunCanopy, pool, funnel, wake);

        cruise.scale.setScalar(scale);
        return cruise;
      }

      // 11 艘游轮与货轮全部沿半圆弧形航道 YANGTZE_MAIN_CURVE 实时巡航
      const curvedFleetConfigs = [
        { type: 'cruise', u: 0.05, dir: 1,  speed: 0.0052, lat: -82, scale: 1.05 },
        { type: 'cargo',  u: 0.14, dir: -1, speed: 0.0044, lat: -96, color: 0x991b1b, scale: 1.0 },
        { type: 'cruise', u: 0.23, dir: 1,  speed: 0.0055, lat: -80, scale: 1.02 },
        { type: 'cargo',  u: 0.32, dir: -1, speed: 0.0046, lat: -22, color: 0x1d4ed8, scale: 1.08 },
        { type: 'cruise', u: 0.41, dir: 1,  speed: 0.0054, lat: 14,  scale: 1.0 },
        { type: 'cargo',  u: 0.50, dir: -1, speed: 0.0043, lat: -16, color: 0x047857, scale: 0.96 },
        { type: 'cruise', u: 0.59, dir: 1,  speed: 0.0056, lat: 16,  scale: 1.06 },
        { type: 'cargo',  u: 0.68, dir: -1, speed: 0.0045, lat: -18, color: 0x7c2d12, scale: 1.04 },
        { type: 'cruise', u: 0.77, dir: 1,  speed: 0.0053, lat: 15,  scale: 1.05 },
        { type: 'cargo',  u: 0.86, dir: -1, speed: 0.0042, lat: -16, color: 0x1e3a8a, scale: 1.0 },
        { type: 'cargo',  u: 0.94, dir: 1,  speed: 0.0048, lat: 14,  color: 0x065f46, scale: 1.02 }
      ];

      curvedFleetConfigs.forEach(cfg => {
        const ship = cfg.type === 'cruise' ? createCruiseShipMesh(cfg.scale) : createCargoShipMesh(cfg.color, cfg.scale);
        group.add(ship);
        animatedShips.push({
          mesh: ship,
          u: cfg.u,
          dir: cfg.dir,
          speed: cfg.speed,
          lat: cfg.lat
        });
      });

      // -------------------------------------------------------------------------


  scene.add(group);

  if (ctx && ctx.addUpdater) {
    ctx.addUpdater((dt, elapsed) => {
      yangtzeShimmerTex.offset.x = (elapsed * 0.085) % 1.0;
      yangtzeShimmerTex.offset.y = Math.sin(elapsed * 0.6) * 0.04;
      if (lakeShimmerTex) {
        lakeShimmerTex.offset.x = (elapsed * 0.045) % 1.0;
        lakeShimmerTex.offset.y = Math.cos(elapsed * 0.5) * 0.03;
      }

      if (yangtzeSparkleGeo && yangtzeSparkleData.length > 0) {
        const spArr = yangtzeSparkleGeo.attributes.position.array;
        for (let i = 0; i < yangtzeSparkleData.length; i++) {
          const d = yangtzeSparkleData[i];
          d.u = (d.u + d.speed * dt) % 1.0;
          const pt = YANGTZE_MAIN_CURVE.getPointAt(d.u);
          const tan = YANGTZE_MAIN_CURVE.getTangentAt(d.u).normalize();
          const normal = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
          const hw = getYangtzeHalfWidth(d.u) * 0.86;
          const p = pt.clone().addScaledVector(normal, d.latRatio * hw);
          spArr[i * 3]     = p.x;
          spArr[i * 3 + 1] = 0.42 + Math.sin(elapsed * 4.5 + i) * 0.12;
          spArr[i * 3 + 2] = p.z;
        }
        yangtzeSparkleGeo.attributes.position.needsUpdate = true;
      }

      animatedShips.forEach(s => {
        s.u += s.dir * s.speed * dt;
        if (s.u > 0.98) s.u = 0.02;
        if (s.u < 0.02) s.u = 0.98;
        const pt = YANGTZE_MAIN_CURVE.getPointAt(s.u);
        const tan = YANGTZE_MAIN_CURVE.getTangentAt(s.u).normalize();
        const normal = new THREE.Vector3(-tan.z, 0, tan.x).normalize();
        const latOffset = s.u < 0.28 ? s.lat : (s.dir > 0 ? 15 : -15);
        s.mesh.position.copy(pt).addScaledVector(normal, latOffset);
        s.mesh.position.y = 0;
        const heading = tan.clone().multiplyScalar(s.dir);
        s.mesh.rotation.y = Math.atan2(-heading.z, heading.x);
      });
    });
  }

  return group;
}
