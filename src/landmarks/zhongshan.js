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
  id: 'zhongshan',
  name: '中山陵 & 紫金山风景区',
  build(scene, ctx) {
    const group = new THREE.Group();

      // 8.1 紫金山（钟山龙蟠）高拟真自然多峰山脉地形（大幅右移至 X = 525, Z = -155，与北段长江 Z=-495~-545 拉开逾 340 单位距离）
      const w = 290, d = 300, sx = 112, sz = 112;
      const terrainGeo = new THREE.PlaneGeometry(w, d, sx, sz);
      terrainGeo.rotateX(-Math.PI / 2);

      const posAttr = terrainGeo.attributes.position;
      const colors = new Float32Array(posAttr.count * 3);
      const cFoot = new THREE.Color(0x284b26);
      const cPine = new THREE.Color(0x1b3b22);
      const cMaple = new THREE.Color(0xb45309);
      const cGold = new THREE.Color(0xd97706);
      const cRock = new THREE.Color(0x64748b);
      const cPeak = new THREE.Color(0x94a3b8);

      for (let i = 0; i < posAttr.count; i++) {
        const vx = posAttr.getX(i) + 525;
        const vz = posAttr.getZ(i) - 130;
        const rawY = getPurpleMountainHeight(vx, vz);
        const vy = rawY < 0.8 ? -0.85 : rawY;
        posAttr.setXYZ(i, vx, vy, vz);

        const c = new THREE.Color();
        const patch = Math.sin(vx * 0.065 + vz * 0.04) * Math.cos(vx * 0.045 - vz * 0.07);
        if (vy < 18) {
          c.copy(cFoot).lerp(patch > 0.15 ? cGold : cMaple, Math.max(0, patch * 0.55));
        } else if (vy < 52) {
          c.copy(cFoot).lerp(cPine, (vy - 18) / 34);
          if (patch > 0.25) c.lerp(cMaple, 0.35);
        } else if (vy < 78) {
          c.copy(cPine).lerp(cRock, ((vy - 52) / 26) * 0.82);
        } else {
          c.copy(cRock).lerp(cPeak, Math.min(1, (vy - 78) / 28) * 0.72);
        }

        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
      }
      terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      terrainGeo.computeVertexNormals();

      const mountainMesh = new THREE.Mesh(
        terrainGeo,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.88 })
      );
      mountainMesh.receiveShadow = true;
      mountainMesh.castShadow = true;
      group.add(mountainMesh);

      // 头陀岭与山脊天然花岗岩奇石崖壁簇
      [
        [512, -185, 6.5], [542, -188, 7.2], [524, -204, 8.0],
        [452, -154, 5.2], [598, -166, 6.0], [572, -172, 5.5]
      ].forEach(([rx, rz, rScale]) => {
        const ry = getPurpleMountainHeight(rx, rz);
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rScale, 1), mats.mingStoneBase);
        rock.scale.set(1.3, 0.75, 0.95);
        rock.position.set(rx, ry - 1.2, rz);
        rock.rotation.set(0.2, rx * 0.1, 0.15);
        rock.castShadow = true;
        group.add(rock);
      });

      // 头陀岭主峰观景平台与紫金山电视发射塔 (X = 528, Z = -192)
      const mainPeakY = getPurpleMountainHeight(528, -192);
      const peakTower = new THREE.Group();
      const pTerrace = new THREE.Mesh(new THREE.CylinderGeometry(7.2, 9.5, 3.2, 12), mats.mingStoneBase);
      pTerrace.position.y = 1.4;
      const towerLattice = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 2.2, 14, 8), mats.silverDome);
      towerLattice.position.y = 8.5;
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.8, 12, 8), mats.whiteMarble);
      spire.position.y = 20.5;
      const redBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), mats.redLantern);
      redBeacon.position.y = 26.8;
      peakTower.add(pTerrace, towerLattice, spire, redBeacon);
      peakTower.position.set(528, mainPeakY - 1.0, -192);
      group.add(peakTower);

      // 紫金山观光索道缆车线
      const cableStart = new THREE.Vector3(452, getPurpleMountainHeight(452, -142) + 4.5, -142);
      const cableEnd = new THREE.Vector3(522, mainPeakY + 3.5, -188);
      const cableLine = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.LineCurve3(cableStart, cableEnd), 16, 0.12, 4, false),
        mats.stayCableMat
      );
      group.add(cableLine);
      for (let c = 1; c <= 4; c++) {
        const pt = cableStart.clone().lerp(cableEnd, c / 5);
        const gondola = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 1.1), mats.aotiCrimsonArch);
        gondola.position.copy(pt).add(new THREE.Vector3(0, -1.0, 0));
        group.add(gondola);
      }

      // 二茅峰 · 紫金山天文台 (X = 442, Z = -148)
      const obsY = getPurpleMountainHeight(442, -148);
      const obsGroup = new THREE.Group();
      const obsBase = new THREE.Mesh(new THREE.BoxGeometry(22, 3.8, 13), mats.mingStoneBase);
      obsBase.position.y = 1.4;
      obsGroup.add(obsBase);
      [[-6.2, 0, 2.6], [0, -1.2, 3.6], [6.5, 0.8, 2.5]].forEach(([dx, dz, r]) => {
        const drum = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.06, 3.2, 18), mats.whiteMarble);
        drum.position.set(dx, 4.4, dz);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(r, 18, 14, 0, Math.PI * 2, 0, Math.PI / 2), mats.silverDome);
        dome.position.set(dx, 6.0, dz);
        obsGroup.add(drum, dome);
      });
      const armillary = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.16, 8, 20), mats.bronze);
      armillary.position.set(-8.5, 4.6, 3.5);
      obsGroup.add(armillary);
      obsGroup.position.set(442, obsY - 1.2, -148);
      group.add(obsGroup);

      // 紫金山漫山苍松与五彩秋林
      for (let i = 0; i < 185; i++) {
        const tx = 402 + ((i * 53) % 245);
        const tz = -25 - ((i * 37) % 215);
        if (Math.abs(tx - AX) < 30 && tz > -148) continue;
        const ty = getPurpleMountainHeight(tx, tz);
        if (ty < 2.2 || ty > 74) continue;
        const tree = (i % 3 !== 0 || ty > 32) ? createChinesePine(1.0 + (i % 3) * 0.2, i) : createWutongTree(0.95, i);
        tree.position.set(tx, ty - 0.3, tz);
        group.add(tree);
      }

      // 8.2 【中山陵中轴建筑群】 (沿 X = 525)
      const mausoleum = new THREE.Group();
      mausoleum.position.x = AX;

      const entryPlaza = new THREE.Mesh(new THREE.CylinderGeometry(19, 19, 0.25, 32), mats.whiteMarble);
      entryPlaza.position.set(0, 0.12, 15);
      entryPlaza.receiveShadow = true;
      const xiaojingPed = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 3.2, 1.2, 8), mats.whiteMarble);
      xiaojingPed.position.set(0, 0.6, 16);
      const xiaojingDing = new THREE.Mesh(new THREE.SphereGeometry(1.4, 12, 10), mats.bronze);
      xiaojingDing.position.set(0, 2.1, 16);
      mausoleum.add(entryPlaza, xiaojingPed, xiaojingDing);

      // 博爱坊 (Z = 8, Y = 0)
      const pailou = new THREE.Group();
      [-8.0, -3.1, 3.1, 8.0].forEach((px, idx) => {
        const h = (idx === 1 || idx === 2) ? 11.0 : 9.4;
        const col = new THREE.Mesh(new THREE.BoxGeometry(1.05, h, 1.05), mats.whiteMarble);
        col.position.set(px, h / 2, 0);
        col.castShadow = true;
        pailou.add(col);
      });
      const mainBeam = new THREE.Mesh(new THREE.BoxGeometry(6.4, 1.3, 1.0), mats.whiteMarble);
      mainBeam.position.set(0, 7.8, 0);
      const boaiPlaque = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.0, 1.15), mats.blueGlaze);
      boaiPlaque.position.set(0, 7.8, 0);
      const cRoof = createChineseRoof(7.0, 2.8, 1.6, mats.blueGlaze);
      cRoof.position.set(0, 8.6, 0);
      pailou.add(mainBeam, boaiPlaque, cRoof);

      [-5.5, 5.5].forEach(bx => {
        const sBeam = new THREE.Mesh(new THREE.BoxGeometry(4.9, 1.1, 0.9), mats.whiteMarble);
        sBeam.position.set(bx, 6.8, 0);
        const sRoof = createChineseRoof(5.2, 2.4, 1.4, mats.blueGlaze);
        sRoof.position.set(bx, 7.5, 0);
        pailou.add(sBeam, sRoof);
      });
      pailou.position.set(0, 0, 8);
      mausoleum.add(pailou);

      // 墓道与两侧龙柏、古松
      const aveSlope = Math.atan2(2.0, 30);
      const avePath = new THREE.Mesh(new THREE.BoxGeometry(9, 0.28, 30.5), mats.platformInlay);
      avePath.position.set(0, 1.0, -7);
      avePath.rotation.x = aveSlope;
      avePath.receiveShadow = true;
      mausoleum.add(avePath);

      for (let z = 4; z >= -20; z -= 4.8) {
        const yPos = getAxisElevation(z);
        [-5.2, 5.2].forEach(tx => {
          const cyp = createCeremonialCypress(0.82);
          cyp.position.set(tx, yPos, z);
          mausoleum.add(cyp);
        });
        [-11.2, 11.2].forEach((tx, idx) => {
          const pine = createChinesePine(0.88, Math.abs(z) + idx);
          pine.position.set(tx, yPos, z);
          mausoleum.add(pine);
        });
      }

      // 陵门 (Z = -27, Y = 2.0)
      const gateTerrace = new THREE.Mesh(new THREE.BoxGeometry(30, 2.0, 10), mats.whiteMarble);
      gateTerrace.position.set(0, 1.0, -27);
      mausoleum.add(gateTerrace);

      const gate = new THREE.Group();
      [-7.6, -2.5, 2.5, 7.6].forEach((px, i) => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(i === 0 || i === 3 ? 3.0 : 2.0, 5.8, 6.0), mats.whiteMarble);
        pier.position.set(px, 2.9, 0);
        pier.castShadow = true;
        gate.add(pier);
      });
      const gWall = new THREE.Mesh(new THREE.BoxGeometry(18.2, 2.4, 6.0), mats.whiteMarble);
      gWall.position.set(0, 7.0, 0);
      const gRoof = createChineseRoof(21.5, 9.5, 3.8, mats.blueGlaze);
      gRoof.position.set(0, 8.2, 0);
      gate.add(gWall, gRoof);
      gate.position.set(0, 2.0, -27);
      mausoleum.add(gate);

      // 碑亭 (Z = -41.5, Y = 4.5)
      const pavTerrace = new THREE.Mesh(new THREE.BoxGeometry(28, 4.5, 11.5), mats.whiteMarble);
      pavTerrace.position.set(0, 2.25, -41.5);
      mausoleum.add(pavTerrace);

      const pavilion = new THREE.Group();
      [[-3.8, -3.8], [3.8, -3.8], [-3.8, 3.8], [3.8, 3.8]].forEach(([cx, cz]) => {
        const col = new THREE.Mesh(new THREE.BoxGeometry(2.2, 7.5, 2.2), mats.whiteMarble);
        col.position.set(cx, 3.75, cz);
        col.castShadow = true;
        pavilion.add(col);
      });
      const pBeam = new THREE.Mesh(new THREE.BoxGeometry(10.0, 1.8, 10.0), mats.whiteMarble);
      pBeam.position.set(0, 8.4, 0);
      const pRoof1 = createChineseRoof(14.2, 14.2, 2.3, mats.blueGlaze, false);
      pRoof1.position.set(0, 9.0, 0);
      const pRoof2 = createChineseRoof(11.0, 11.0, 3.0, mats.blueGlaze, true);
      pRoof2.position.set(0, 11.2, 0);

      const bixi = new THREE.Mesh(new THREE.BoxGeometry(3.2, 1.1, 2.4), mats.mingStoneBase);
      bixi.position.set(0, 0.55, 0);
      const stele = new THREE.Mesh(new THREE.BoxGeometry(2.1, 5.8, 0.7), mats.whiteMarble);
      stele.position.set(0, 3.6, 0);
      const steleGold = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2.4, 0.78), mats.goldTrim);
      steleGold.position.set(0, 3.9, 0);

      pavilion.add(pBeam, pRoof1, pRoof2, bixi, stele, steleGold);
      pavilion.position.set(0, 4.5, -41.5);
      mausoleum.add(pavilion);

      // 392级高对比度石阶与10层白玉大平台
      const stepDepth = STAIR_RUN / STEPS_PER_SEG;
      const stepRise = SEG_DY / STEPS_PER_SEG;

      for (let s = 0; s < SEGMENTS; s++) {
        const segStartZ = STAIR_START_Z - s * SEG_DZ;
        const segBaseY = STAIR_START_Y + s * SEG_DY;
        const halfW0 = getStairHalfWidth(segStartZ);
        const halfW1 = getStairHalfWidth(segStartZ - SEG_DZ);
        const fullWidth = halfW0 + halfW1;

        for (let k = 0; k < STEPS_PER_SEG; k++) {
          const zFront = segStartZ - k * stepDepth;
          const zCenter = zFront - stepDepth / 2;
          const yBottom = segBaseY + k * stepRise;
          const yTop = yBottom + stepRise;

          const riserBlock = new THREE.Mesh(new THREE.BoxGeometry(fullWidth, yTop, stepDepth), mats.stepRiser);
          riserBlock.position.set(0, yTop / 2, zCenter);
          riserBlock.castShadow = true;
          riserBlock.receiveShadow = true;
          mausoleum.add(riserBlock);

          const treadPlate = new THREE.Mesh(new THREE.BoxGeometry(fullWidth, 0.05, stepDepth + 0.02), mats.stepTread);
          treadPlate.position.set(0, yTop + 0.025, zCenter);
          mausoleum.add(treadPlate);

          const nosingBar = new THREE.Mesh(new THREE.BoxGeometry(fullWidth + 0.04, 0.04, 0.05), mats.stepNosing);
          nosingBar.position.set(0, yTop + 0.03, zFront);
          mausoleum.add(nosingBar);
        }

        const platZFront = segStartZ - STAIR_RUN;
        const platZCenter = platZFront - PLAT_LEN / 2;
        const platY = segBaseY + SEG_DY;

        const platBody = new THREE.Mesh(new THREE.BoxGeometry(fullWidth + 0.3, platY, PLAT_LEN), mats.whiteMarble);
        platBody.position.set(0, platY / 2, platZCenter);
        platBody.receiveShadow = true;
        mausoleum.add(platBody);

        if (s === 5) {
          [-8.5, 8.5].forEach(dx => {
            const dingPed = new THREE.Mesh(new THREE.BoxGeometry(2.0, 1.2, 2.0), mats.whiteMarble);
            dingPed.position.set(dx, platY + 0.6, platZCenter);
            const dingPot = new THREE.Mesh(new THREE.SphereGeometry(1.1, 12, 10), mats.bronze);
            dingPot.position.set(dx, platY + 1.8, platZCenter);
            mausoleum.add(dingPed, dingPot);
          });
        }

        const zEnd = segStartZ - SEG_DZ;
        [-1, 1].forEach((side, sIdx) => {
          mausoleum.add(createBalustradeSegment(side * halfW0, segBaseY, segStartZ, side * halfW1, platY, zEnd, 2));
          if (s % 2 === 0) {
            const cyp = createCeremonialCypress(0.85);
            cyp.position.set(side * (halfW1 + 2.8), segBaseY, platZCenter);
            mausoleum.add(cyp);
          }
          const pine = createChinesePine(0.95, s * 2 + sIdx);
          pine.position.set(side * (halfW1 + 7.2), Math.max(0, segBaseY - 1.0), segStartZ - 1.5);
          mausoleum.add(pine);
        });
      }

      const topPlaza = new THREE.Mesh(new THREE.BoxGeometry(48, STAIR_END_Y, 32), mats.whiteMarble);
      topPlaza.position.set(0, STAIR_END_Y / 2, -128);
      topPlaza.receiveShadow = true;
      mausoleum.add(topPlaza);

      [-13.5, 13.5].forEach(hx => {
        const huabiao = new THREE.Group();
        const hbBase = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.8, 1.8, 8), mats.whiteMarble);
        hbBase.position.y = 0.9;
        const hbShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.78, 11.5, 12), mats.whiteMarble);
        hbShaft.position.y = 6.6;
        const hbCloud = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.6, 0.9), mats.whiteMarble);
        hbCloud.position.y = 11.2;
        const hbCap = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 0.9, 1.2, 12), mats.goldTrim);
        hbCap.position.y = 12.6;
        huabiao.add(hbBase, hbShaft, hbCloud, hbCap);
        huabiao.position.set(hx, STAIR_END_Y, -114.5);
        mausoleum.add(huabiao);
      });

      const hall = new THREE.Group();
      const hallWalls = new THREE.Mesh(new THREE.BoxGeometry(28, 12.5, 16), mats.whiteMarble);
      hallWalls.position.y = 6.25;
      hallWalls.castShadow = true;
      hall.add(hallWalls);

      [-6.8, 0, 6.8].forEach(dx => {
        const door = new THREE.Mesh(new THREE.BoxGeometry(3.4, 7.2, 0.8), mats.darkDoor);
        door.position.set(dx, 3.6, 8.0);
        hall.add(door);
      });

      const hRoof1 = createChineseRoof(34, 21, 3.2, mats.blueGlaze, false);
      hRoof1.position.y = 12.2;
      const hRoof2 = createChineseRoof(28, 16, 4.6, mats.blueGlaze, true);
      hRoof2.position.y = 15.4;
      hall.add(hRoof1, hRoof2);
      hall.position.set(0, STAIR_END_Y, -125);
      mausoleum.add(hall);

      const tombDome = new THREE.Mesh(new THREE.SphereGeometry(8.0, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), mats.whiteMarble);
      tombDome.position.set(0, STAIR_END_Y, -138);
      mausoleum.add(tombDome);

      group.add(mausoleum);



    scene.add(group);

    return group;
  }
};
