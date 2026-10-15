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
  id: 'qingao_arena',
  name: '南京青奥体育馆',
  build(scene, ctx) {
    const group = new THREE.Group();

    function buildQingaoSportsParkArena() {
      const group = new THREE.Group();
      const GX = -635, GZ = 95;
      group.scale.setScalar(1.15);
      group.position.set(GX, 0, GZ);

      // 1. 滨江青奥体育公园景观大底座与S形二层流线云端连廊
      const parkBase = new THREE.Mesh(new THREE.CylinderGeometry(42, 45, 1.0, 40), mats.platformInlay);
      parkBase.scale.set(1.25, 1, 0.85);
      parkBase.position.y = 0.5;
      parkBase.receiveShadow = true;
      group.add(parkBase);

      // S形流线高架云端平台 (Connecting Skywalk)
      const sCurvePts = [
        new THREE.Vector3(-28, 3.8, 10),
        new THREE.Vector3(-8, 4.2, 12),
        new THREE.Vector3(8, 4.2, -6),
        new THREE.Vector3(26, 3.8, -8)
      ];
      const sBridge = new THREE.Mesh(
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(sCurvePts), 36, 3.5, 8, false),
        mats.zahaWhiteFacade
      );
      sBridge.scale.set(1, 0.22, 1);
      group.add(sBridge);

      // 2. 东馆：2.1万座【南京青奥体育馆（“江鸥展翅”流线双曲巨构）】(X = 16, Z = 2)
      const arenaGroup = new THREE.Group();
      arenaGroup.position.set(16, 1.0, 2);

      // 内部深蓝发光玻璃幕墙核心与横向银白流线百叶环带
      const glassCore = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 12.5, 9.5, 36), mats.qingaoGlassMat);
      glassCore.scale.set(1.28, 1, 0.92);
      glassCore.position.y = 4.8;
      arenaGroup.add(glassCore);

      for (let b = 1; b <= 4; b++) {
        const louverRing = new THREE.Mesh(
          new THREE.CylinderGeometry(14.8 + b * 0.2, 14.4 + b * 0.2, 0.55, 36, 1, true),
          b % 2 === 0 ? mats.zahaWhiteFacade : mats.magnoliaLamp
        );
        louverRing.scale.set(1.3, 1, 0.94);
        louverRing.position.y = b * 1.9;
        arenaGroup.add(louverRing);
      }

      // 灵魂结构：“江鸥展翅”双曲波浪银白金属屋盖（两侧如海鸥双翼高高扬起，前端向南悬挑出尖锐鸥喙）
      const wingRoofGeo = new THREE.SphereGeometry(17.5, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.52);
      const wPos = wingRoofGeo.attributes.position;
      for (let i = 0; i < wPos.count; i++) {
        let vx = wPos.getX(i) * 1.38;
        let vy = wPos.getY(i) * 0.52;
        let vz = wPos.getZ(i) * 1.05;
        // 东西双翼向上掀起 (Gull-wing lift)，南北方向呈S流线起伏并在南端悬挑成鸥喙
        const wingLift = Math.pow(Math.abs(vx) / 22, 1.6) * 5.8 - Math.cos((vz / 18) * Math.PI) * 1.6;
        if (vz > 8) {
          vx *= (1 - (vz - 8) * 0.035); // 南端收拢成海鸥喙尖
          vy += (vz - 8) * 0.25;
        }
        wPos.setXYZ(i, vx, vy + 7.2 + wingLift * 0.55, vz);
      }
      wingRoofGeo.computeVertexNormals();
      const gullRoof = new THREE.Mesh(wingRoofGeo, mats.silverDome);
      gullRoof.castShadow = true;
      const gullWire = new THREE.Mesh(wingRoofGeo.clone(), mats.zahaDiagridWire);
      gullWire.scale.set(1.01, 1.01, 1.01);
      arenaGroup.add(gullRoof, gullWire);

      group.add(arenaGroup);

      // 3. 西场：1.8万座【青奥体育场（半敞口月牙形海浪看台与绿茵跑道）】(X = -20, Z = -4)
      const stadiumGroup = new THREE.Group();
      stadiumGroup.position.set(-20, 1.0, -4);

      const turf = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 9.5, 0.3, 32), mats.aotiTurfMat);
      turf.scale.set(1.2, 1, 0.85);
      turf.position.y = 0.25;
      const blueTrack = new THREE.Mesh(new THREE.RingGeometry(9.0, 13.2, 36), mats.qingaoGlassMat);
      blueTrack.rotation.x = -Math.PI / 2;
      blueTrack.scale.set(1.2, 0.85, 1);
      blueTrack.position.y = 0.28;
      stadiumGroup.add(turf, blueTrack);

      // C字形海浪悬挑白玉屋盖
      const crescentGeo = new THREE.TorusGeometry(14.5, 3.8, 12, 36, Math.PI * 1.35);
      crescentGeo.rotateX(Math.PI / 2);
      crescentGeo.rotateZ(0.4);
      const crescentRoof = new THREE.Mesh(crescentGeo, mats.zahaWhiteFacade);
      crescentRoof.scale.set(1.18, 0.88, 0.85);
      crescentRoof.position.y = 5.5;
      crescentRoof.castShadow = true;
      stadiumGroup.add(crescentRoof);

      group.add(stadiumGroup);
      scene.add(group);
    }

    // -------------------------------------------------------------------------
    // 地标十七：【南京明城墙 · 中华门瓮城 (“天下第一瓮城”四重城门与27藏兵洞)】 (X = 5, Z = 144)
    // 1:1 真实细节：
    // - 世界现存规模最大的堡垒式城门瓮城：由南向北依次贯穿【四道拱券城门洞】与【三道矩形内瓮城院落】
    // - 城台内壁清晰雕琢上下两层密集排列的【27个藏兵洞拱券门】（可藏兵三千）
    // - 东西两侧设有宽阔坡道式【登城马道】（武将可策马直登城头），顶部环绕600年青砖【凹凸雉堞垛口】与重檐歇山朱红【中华门敌楼】
    // - 南侧外秦淮河护城河与三孔石拱【长干桥】
    // -------------------------------------------------------------------------


    scene.add(group);

    return group;
  }
};
