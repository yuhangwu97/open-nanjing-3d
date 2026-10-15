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
  id: 'bridge',
  name: '南京长江大桥',
  build(scene, ctx) {
    const group = new THREE.Group();
  let bridgeTrainGroup = null;
  const animatedBridgeCars = [];

      // 6.2 地标一：【南京长江大桥】 (Northwest X = -145, Z = -315)
      // -------------------------------------------------------------------------
      const bridgeCenterX = -145;
      const riverCenterZ = -315;

      for (let z = riverCenterZ - 36; z <= riverCenterZ + 36; z += 18) {
        const pier = new THREE.Group();
        const pierBody = new THREE.Mesh(new THREE.BoxGeometry(7.2, 16.5, 3.8), mats.mingStoneBase);
        pierBody.position.y = 8.25;
        pierBody.castShadow = true;
        pier.add(pierBody);
        [-3.6, 3.6].forEach(px => {
          const nose = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.9, 10, 4), mats.mingStoneBase);
          nose.position.set(px, 5, 0);
          pier.add(nose);
        });
        pier.position.set(bridgeCenterX, 0, z);
        group.add(pier);
      }

      const mainSpanLen = 112;
      const railDeck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.8, mainSpanLen), mats.bridgeSteel);
      railDeck.position.set(bridgeCenterX, 16.5, riverCenterZ);
      group.add(railDeck);

      const roadDeck = new THREE.Mesh(new THREE.BoxGeometry(11.5, 1.0, 204), mats.asphaltRoad);
      roadDeck.position.set(bridgeCenterX, 23.5, riverCenterZ);
      roadDeck.receiveShadow = true;
      roadDeck.castShadow = true;
      group.add(roadDeck);

      [-4.8, 4.8].forEach(sideX => {
        const topChord = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, mainSpanLen), mats.bridgeSteel);
        topChord.position.set(bridgeCenterX + sideX, 23.0, riverCenterZ);
        const botChord = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.65, mainSpanLen), mats.bridgeSteel);
        botChord.position.set(bridgeCenterX + sideX, 16.5, riverCenterZ);
        group.add(topChord, botChord);

        for (let z = riverCenterZ - 50; z <= riverCenterZ + 50; z += 6.5) {
          const vPost = new THREE.Mesh(new THREE.BoxGeometry(0.5, 6.8, 0.5), mats.bridgeSteel);
          vPost.position.set(bridgeCenterX + sideX, 19.8, z);
          group.add(vPost);
          if (z < riverCenterZ + 50) {
            const diag = new THREE.Mesh(new THREE.BoxGeometry(0.4, 9.0, 0.4), mats.bridgeSteel);
            diag.position.set(bridgeCenterX + sideX, 19.8, z + 3.25);
            diag.rotation.x = 0.72;
            group.add(diag);
          }
        }
      });

      [riverCenterZ - 83, riverCenterZ - 67, riverCenterZ + 67, riverCenterZ + 83].forEach(zApp => {
        const appPier = new THREE.Mesh(new THREE.BoxGeometry(10.8, 23.0, 3.2), mats.palaceCream);
        appPier.position.set(bridgeCenterX, 11.5, zApp);
        appPier.castShadow = true;
        const archRib = new THREE.Mesh(new THREE.TorusGeometry(6.5, 0.85, 8, 18, Math.PI), mats.palaceCream);
        archRib.rotation.y = Math.PI / 2;
        archRib.position.set(bridgeCenterX, 15.5, zApp + (zApp < riverCenterZ ? -8 : 8));
        group.add(appPier, archRib);
      });

      [riverCenterZ + 52, riverCenterZ - 52].forEach(zTower => {
        [-7.8, 7.8].forEach(xOff => {
          const tower = new THREE.Group();
          const lowerShaft = new THREE.Mesh(new THREE.BoxGeometry(5.8, 30, 7.5), mats.palaceCream);
          lowerShaft.position.y = 15;
          lowerShaft.castShadow = true;
          const upperHall = new THREE.Mesh(new THREE.BoxGeometry(6.4, 5.5, 8.2), mats.palaceCream);
          upperHall.position.y = 32.5;
          const windowBand = new THREE.Mesh(new THREE.BoxGeometry(6.6, 1.8, 7.0), mats.warmWindowGlow);
          windowBand.position.y = 32.8;
          const reliefFrame = new THREE.Mesh(new THREE.BoxGeometry(6.1, 10, 2.2), mats.goldTrim);
          reliefFrame.position.y = 16;
          tower.add(lowerShaft, upperHall, windowBand, reliefFrame);

          [-1.2, 0, 1.2].forEach((flagOffset, fIdx) => {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 8.5, 6), mats.goldTrim);
            pole.position.set(flagOffset, 38.5, fIdx * 0.6 - 0.6);
            const redFlag = new THREE.Mesh(
              new THREE.BoxGeometry(0.35, 4.8 + (fIdx === 1 ? 0.8 : 0), 3.6),
              mats.redFlagMat
            );
            redFlag.position.set(flagOffset, 38.2, fIdx * 0.6 + 1.1);
            redFlag.castShadow = true;
            tower.add(pole, redFlag);
          });

          tower.position.set(bridgeCenterX + xOff, 0, zTower);
          group.add(tower);
        });

        const statueZ = zTower > riverCenterZ ? zTower + 15 : zTower - 15;
        [-7.8, 7.8].forEach(xOff => {
          const ped = new THREE.Mesh(new THREE.BoxGeometry(4.2, 8.5, 4.2), mats.palaceCream);
          ped.position.set(bridgeCenterX + xOff, 23.5 + 4.25, statueZ);
          const heroStatue = new THREE.Mesh(new THREE.ConeGeometry(1.6, 5.2, 7), mats.whiteMarble);
          heroStatue.position.set(bridgeCenterX + xOff, 23.5 + 11.0, statueZ);
          group.add(ped, heroStatue);
        });
      });

      for (let z = riverCenterZ - 45; z <= riverCenterZ + 45; z += 10) {
        [-5.4, 5.4].forEach(xOff => {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 4.2, 6), mats.bridgeSteel);
          pole.position.set(bridgeCenterX + xOff, 26.0, z);
          const magnoliaBulb = new THREE.Mesh(new THREE.SphereGeometry(0.45, 8, 8), mats.magnoliaLamp);
          magnoliaBulb.position.set(bridgeCenterX + xOff, 28.3, z);
          group.add(pole, magnoliaBulb);
        });
      }

      bridgeTrainGroup = new THREE.Group();
      for (let c = 0; c < 5; c++) {
        const carriage = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.3, 7.5), c === 0 ? mats.vermilionRed : mats.greenGlaze);
        carriage.position.set(0, 1.3, c * 8.2);
        const winStrip = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 6.8), mats.warmWindowGlow);
        winStrip.position.set(0, 1.5, c * 8.2);
        bridgeTrainGroup.add(carriage, winStrip);
      }
      bridgeTrainGroup.position.set(bridgeCenterX, 16.9, riverCenterZ - 40);
      group.add(bridgeTrainGroup);

      for (let i = 0; i < 10; i++) {
        const isNorthbound = i % 2 === 0;
        const carMat = new THREE.MeshBasicMaterial({ color: isNorthbound ? 0xfef08a : 0xef4444 });
        const car = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.8, 3.0), carMat);
        const laneX = bridgeCenterX + (isNorthbound ? 2.2 : -2.2);
        const startZ = riverCenterZ - 50 + (i / 10) * 180;
        car.position.set(laneX, 24.4, startZ);
        group.add(car);
        animatedBridgeCars.push({ mesh: car, dir: isNorthbound ? -1 : 1, speed: 22 + (i % 3) * 5 });
      }

      group.add(
        createExactBridgeApproachRamp(
          new THREE.Vector3(bridgeCenterX, 23.5, riverCenterZ - 102),
          new THREE.Vector3(bridgeCenterX, 0.0, riverCenterZ - 170),
          { width: 11.5, thickness: 1.0, deckMat: mats.asphaltRoad, railMat: mats.palaceCream, pierCount: 4 }
        ),
        createExactBridgeApproachRamp(
          new THREE.Vector3(bridgeCenterX, 23.5, riverCenterZ + 102),
          new THREE.Vector3(bridgeCenterX, 0.0, riverCenterZ + 170),
          { width: 11.5, thickness: 1.0, deckMat: mats.asphaltRoad, railMat: mats.palaceCream, pierCount: 4 }
        )
      );

      // -------------------------------------------------------------------------


    scene.add(group);

    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      if (bridgeTrainGroup) {
        bridgeTrainGroup.position.z += 28 * dt;
        if (bridgeTrainGroup.position.z > -260) bridgeTrainGroup.position.z = -380;
      }
      animatedBridgeCars.forEach(c => {
        c.mesh.position.z += c.dir * c.speed * dt;
        if (c.dir > 0 && c.mesh.position.z > -225) c.mesh.position.z = -405;
        if (c.dir < 0 && c.mesh.position.z < -405) c.mesh.position.z = -225;
      });
      });
    }

    return group;
  }
};
