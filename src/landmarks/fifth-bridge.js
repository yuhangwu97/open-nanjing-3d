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
  id: 'fifthbridge',
  name: '南京长江五桥 & 江心洲',
  build(scene, ctx) {
    const group = new THREE.Group();
  const animatedFifthBridgeCars = [];

      // 6.3 地标二：【南京长江五桥（江心洲长江大桥）】1:1 真实工程造型与精确引桥连接
      // -------------------------------------------------------------------------
      const fifthBridge = new THREE.Group();
      const FB_X = -382.5, FB_Z = 215, FB_SPAN = 235;

      const fbDeck = new THREE.Mesh(new THREE.BoxGeometry(FB_SPAN, 1.1, 12.6), mats.asphaltRoad);
      fbDeck.position.set(FB_X, 17.5, FB_Z);
      fbDeck.castShadow = true;
      fbDeck.receiveShadow = true;
      fifthBridge.add(fbDeck);

      const steelGirder = new THREE.Mesh(new THREE.BoxGeometry(FB_SPAN, 0.9, 9.8), mats.bridgeSteel);
      steelGirder.position.set(FB_X, 16.6, FB_Z);
      const medianBarrier = new THREE.Mesh(new THREE.BoxGeometry(FB_SPAN, 0.65, 1.6), mats.whiteMarble);
      medianBarrier.position.set(FB_X, 18.2, FB_Z);
      fifthBridge.add(steelGirder, medianBarrier);

      [-6.3, 6.3].forEach(zSide => {
        const edgeRail = new THREE.Mesh(new THREE.BoxGeometry(FB_SPAN, 1.2, 0.45), mats.whiteMarble);
        edgeRail.position.set(FB_X, 18.2, FB_Z + zSide);
        fifthBridge.add(edgeRail);
      });

      [-445, -382.5, -320].forEach(px => {
        const pylon = new THREE.Group();
        pylon.position.set(px, 0, FB_Z);

        const pileCap = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5.4, 3.8, 24), mats.mingStoneBase);
        pileCap.scale.set(1.35, 1, 0.82);
        pileCap.position.y = 1.9;
        pylon.add(pileCap);

        const lowerPier = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 3.2, 14.0, 16), mats.whiteMarble);
        lowerPier.scale.set(1.45, 1, 0.65);
        lowerPier.position.y = 10.6;
        lowerPier.castShadow = true;
        const supportBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.0, 11.8), mats.whiteMarble);
        supportBeam.position.y = 16.2;
        pylon.add(lowerPier, supportBeam);

        const monopoleShaft = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 2.25, 43.0, 20), mats.whiteMarble);
        monopoleShaft.scale.set(1.55, 1, 0.52);
        monopoleShaft.position.y = 39.0;
        monopoleShaft.castShadow = true;
        pylon.add(monopoleShaft);

        const verticalGroove = new THREE.Mesh(new THREE.BoxGeometry(3.65, 24.5, 0.35), mats.darkDoor);
        verticalGroove.position.set(0, 46.5, 0);
        const lightStrip = new THREE.Mesh(new THREE.BoxGeometry(3.72, 22.0, 0.14), mats.magnoliaLamp);
        lightStrip.position.set(0, 46.5, 0);
        pylon.add(verticalGroove, lightStrip);

        const towerCap = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.15, 2.2, 16), mats.whiteMarble);
        towerCap.scale.set(1.5, 1, 0.52);
        towerCap.position.y = 61.2;
        const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.32, 8, 8), mats.redLantern);
        beacon.position.y = 62.6;
        pylon.add(towerCap, beacon);

        for (let c = 1; c <= 8; c++) {
          const anchorTopY = 34.5 + c * 3.15;
          const anchorDeckX = 3.2 + c * 2.45;
          [-1, 1].forEach(dirX => {
            [-0.52, 0.52].forEach(planeZ => {
              const pTop = new THREE.Vector3(dirX * 0.9, anchorTopY, planeZ);
              const pBot = new THREE.Vector3(dirX * anchorDeckX, 18.2, planeZ);
              const cableLen = pTop.distanceTo(pBot);
              const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, cableLen, 4), mats.stayCableMat);
              cable.position.copy(pTop).lerp(pBot, 0.5);
              cable.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                pBot.clone().sub(pTop).normalize()
              );
              pylon.add(cable);
            });
          });
        }

        fifthBridge.add(pylon);
      });

      for (let i = 0; i < 8; i++) {
        const eastbound = i % 2 === 0;
        const cMesh = new THREE.Mesh(
          new THREE.BoxGeometry(2.8, 0.8, 1.4),
          new THREE.MeshBasicMaterial({ color: eastbound ? 0x38bdf8 : 0xfbbf24 })
        );
        cMesh.position.set(FB_X - 95 + i * 24, 18.4, FB_Z + (eastbound ? 3.4 : -3.4));
        fifthBridge.add(cMesh);
        animatedFifthBridgeCars.push({ mesh: cMesh, dir: eastbound ? 1 : -1, speed: 24 + (i % 3) * 4 });
      }

      fifthBridge.add(
        createExactBridgeApproachRamp(
          new THREE.Vector3(-500, 17.5, FB_Z),
          new THREE.Vector3(-565, 0.0, FB_Z),
          { width: 12.6, thickness: 1.1, deckMat: mats.asphaltRoad, railMat: mats.whiteMarble, pierCount: 3 }
        )
      );
      fifthBridge.add(
        createExactBridgeApproachRamp(
          new THREE.Vector3(-265, 17.5, FB_Z),
          new THREE.Vector3(-200, 0.0, FB_Z),
          { width: 12.6, thickness: 1.1, deckMat: mats.asphaltRoad, railMat: mats.whiteMarble, pierCount: 3 }
        )
      );

      group.add(fifthBridge);

      // -------------------------------------------------------------------------


    scene.add(group);

    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      animatedFifthBridgeCars.forEach(fc => {
        fc.mesh.position.x += fc.dir * fc.speed * dt;
        if (fc.dir > 0 && fc.mesh.position.x > -265) fc.mesh.position.x = -500;
        if (fc.dir < 0 && fc.mesh.position.x < -500) fc.mesh.position.x = -265;
      });
      });
    }

    return group;
  }
};
