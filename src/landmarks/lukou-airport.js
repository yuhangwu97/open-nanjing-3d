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
  id: 'lukou_airport',
  name: '南京禄口国际机场',
  build(scene, ctx) {
    const group = new THREE.Group();
  const animatedAirplanes = [];

    function buildLukouInternationalAirport() {
      const group = new THREE.Group();
      const AX = -315, AZ = 620;
      group.scale.setScalar(1.08);
      group.position.set(AX, 0, AZ);

      // 1. 巨型停机坪混凝土地坪 (Apron 185m x 95m)
      const apron = new THREE.Mesh(new THREE.BoxGeometry(195, 0.5, 96), mats.platformInlay);
      apron.position.set(0, 0.25, 0);
      apron.receiveShadow = true;
      group.add(apron);

      // 2. T1（北）与 T2（南）双航站楼展翼双曲金属屋盖 + Y形指廊 + 登机廊桥
      [-14, 16].forEach((tz, tIdx) => {
        const term = new THREE.Group();
        term.position.set(0, 0.5, tz);

        // 主楼通透蓝玻幕墙与外倾Y形树状钢支撑柱
        const glassBody = new THREE.Mesh(new THREE.BoxGeometry(46, 6.8, 14), mats.qingaoGlassMat);
        glassBody.position.y = 3.4;
        term.add(glassBody);

        for (let cx = -21; cx <= 21; cx += 6) {
          [-7.5, 7.5].forEach(cz => {
            const yCol = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 7.2, 8), mats.whiteMarble);
            yCol.position.set(cx, 3.6, cz);
            yCol.rotation.x = cz > 0 ? 0.16 : -0.16;
            term.add(yCol);
          });
        }

        // 双曲海鸥翼波浪形银白悬挑大屋盖 (Gull-Wing Curved Roof)
        const tRoofGeo = new THREE.BoxGeometry(54, 1.1, 20, 24, 2, 10);
        const rPos = tRoofGeo.attributes.position;
        for (let i = 0; i < rPos.count; i++) {
          const vx = rPos.getX(i), vy = rPos.getY(i), vz = rPos.getZ(i);
          const wave = Math.cos((vx / 27) * Math.PI) * 1.8 + Math.pow(Math.abs(vx) / 27, 2) * 3.2;
          rPos.setY(i, vy + wave);
        }
        tRoofGeo.computeVertexNormals();
        const tRoof = new THREE.Mesh(tRoofGeo, mats.silverDome);
        tRoof.position.y = 7.4;
        tRoof.castShadow = true;
        term.add(tRoof);

        // 东西两侧延伸指廊与登机廊桥 (Concourses & Boarding Jetbridges)
        [-34, 34].forEach(wx => {
          const concourse = new THREE.Mesh(new THREE.BoxGeometry(26, 4.5, 6.5), mats.zahaWhiteFacade);
          concourse.position.set(wx, 2.25, 0);
          concourse.castShadow = true;
          term.add(concourse);

          // 伸向机坪的透明登机廊桥与停靠客机
          [-6, 6].forEach((bx, bIdx) => {
            const dirZ = tIdx === 0 ? -1 : 1;
            const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 7.5), mats.warmWindowGlow);
            bridge.position.set(wx + bx, 2.8, dirZ * 6.5);
            term.add(bridge);

            if (bIdx === 0) {
              const parkedJet = createAirlinerMesh(tIdx === 0 ? 0xdc2626 : 0x0284c7, 0.72);
              parkedJet.rotation.y = dirZ > 0 ? -Math.PI / 2 : Math.PI / 2;
              parkedJet.position.set(wx + bx + 1.5, 0, dirZ * 13.5);
              term.add(parkedJet);
            }
          });
        });

        group.add(term);
      });

      // 3. 中央综合交通中心 (GTC圆穹顶) 与高耸入云的【禄口机场空管塔台】
      const gtcDome = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 10.5, 5.2, 24), mats.qingaoGlassMat);
      gtcDome.position.set(0, 2.8, 1);
      group.add(gtcDome);

      const atcTower = new THREE.Group();
      atcTower.position.set(16, 0.5, 1);
      const towerShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.8, 36, 12), mats.whiteMarble);
      towerShaft.position.y = 18;
      towerShaft.castShadow = true;
      const controlCab = new THREE.Mesh(new THREE.CylinderGeometry(3.4, 2.2, 3.8, 16), mats.qingaoGlassMat);
      controlCab.position.y = 37.5;
      const cabRoof = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 0.8, 16), mats.whiteMarble);
      cabRoof.position.y = 39.8;
      radarDishMesh = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.45), mats.goldTrim);
      radarDishMesh.position.y = 41.2;
      atcTower.add(towerShaft, controlCab, cabRoof, radarDishMesh);
      group.add(atcTower);

      // 4. 南北两条 4F 级平行主跑道 (Runway 06L/24R & 06R/24L)
      [-38, 38].forEach((rz, rIdx) => {
        const runway = new THREE.Mesh(new THREE.BoxGeometry(190, 0.25, 11.5), mats.runwayAsphalt);
        runway.position.set(0, 0.52, rz);
        runway.receiveShadow = true;
        group.add(runway);

        // 跑道白色虚线中线与两端钢琴键着陆标线
        for (let dx = -80; dx <= 80; dx += 10) {
          const dash = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.08, 0.45), mats.whiteMarble);
          dash.position.set(dx, 0.66, rz);
          group.add(dash);
        }
        [-88, 88].forEach(endX => {
          for (let pz = -4.2; pz <= 4.2; pz += 1.4) {
            const stripe = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.08, 0.65), mats.whiteMarble);
            stripe.position.set(endX, 0.66, rz + pz);
            group.add(stripe);
          }
        });

        // 跑道两侧发光绿/红助航边灯
        for (let lx = -90; lx <= 90; lx += 12) {
          [-5.6, 5.6].forEach(sideZ => {
            const lightDot = new THREE.Mesh(
              new THREE.SphereGeometry(0.26, 6, 6),
              Math.abs(lx) > 75 ? mats.runwayRedLight : mats.runwayGreenLight
            );
            lightDot.position.set(lx, 0.78, rz + sideZ);
            group.add(lightDot);
          });
        }

        // 动态起飞拉升与进近降落的民航大客机
        const activeJet = createAirlinerMesh(rIdx === 0 ? 0xe11d48 : 0x0284c7, 0.92);
        if (rIdx === 1) activeJet.rotation.y = Math.PI;
        group.add(activeJet);
        animatedAirplanes.push({
          mesh: activeJet,
          rz,
          mode: rIdx === 0 ? 'takeoff' : 'landing',
          phase: rIdx * 0.5
        });
      });

      scene.add(group);
    }



    scene.add(group);

    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      animatedAirplanes.forEach(ap => {
        const u = ((elapsed * 0.11) + ap.phase) % 1.0;
        if (ap.mode === 'takeoff') {
          const x = -92 + u * 210;
          const lift = u < 0.48 ? 0 : Math.pow((u - 0.48) / 0.52, 1.8) * 38;
          const pitch = u < 0.45 ? 0 : Math.min(0.32, (u - 0.45) * 0.85);
          ap.mesh.position.set(x, 0.65 + lift, ap.rz);
          ap.mesh.rotation.z = pitch;
        } else {
          const x = 92 - u * 210;
          const alt = u < 0.52 ? Math.pow((0.52 - u) / 0.52, 1.6) * 34 : 0;
          const pitch = u < 0.50 ? -0.14 : 0;
          ap.mesh.position.set(x, 0.65 + alt, ap.rz);
          ap.mesh.rotation.z = pitch;
        }
      });
      });
    }

    return group;
  }
};
