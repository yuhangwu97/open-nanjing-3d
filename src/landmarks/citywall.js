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
  id: 'citywall',
  name: '南京城墙 · 中华门瓮城',
  build(scene, ctx) {

    // buildMingCityWallZhonghuamen
      const group = new THREE.Group();
      const WX = -10, WZ = 215;
      group.position.set(WX, 0, WZ);

      // 1. 南侧外立面（Z = +14.5）面向城外外秦淮河护城河（Z = +23）与三孔古石桥【长干桥】
      const moatWater = new THREE.Mesh(new THREE.BoxGeometry(126, 0.45, 11), mats.qinhuaiWater);
      moatWater.position.set(0, -0.02, 23);
      group.add(moatWater);

      const changganBridge = new THREE.Group();
      const cgDeck = new THREE.Mesh(new THREE.BoxGeometry(8.5, 1.8, 13.5), mats.whiteMarble);
      cgDeck.position.set(0, 1.2, 23);
      [-2.2, 0, 2.2].forEach(ax => {
        const arch = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 9.0, 12), mats.darkDoor);
        arch.rotation.z = Math.PI / 2;
        arch.position.set(0, 0.4, 23 + ax * 1.6);
        changganBridge.add(arch);
      });
      changganBridge.add(cgDeck);
      group.add(changganBridge);

      // 2. 中华门瓮城朝向修正（“瓮城在城墙里面”）：
      // 南侧最外立面城墙 (Z = +14.5) 与东西两翼环城明城墙齐平并高立重檐朱红中华门敌楼；
      // 三道内瓮城院落、四重券门、27个藏兵洞与左右登城马道全部朝北（-Z，城内方向）延伸！
      const wallH = 11.5;
      [-17.5, 17.5].forEach(sideX => {
        const sideWall = new THREE.Mesh(new THREE.BoxGeometry(4.2, wallH, 32), mats.ancientBrickMat);
        sideWall.position.set(sideX, wallH / 2, 0);
        sideWall.castShadow = true;
        sideWall.receiveShadow = true;
        group.add(sideWall);
      });

      // 由南（城外侧主城门 Z=+14.5）向北（城内侧内瓮城门 Z=+5.0 -> -4.5 -> -14.0）依次贯穿四道城门横墙
      [14.5, 5.0, -4.5, -14.0].forEach((gz, gIdx) => {
        // gIdx === 0 (Z = +14.5) 为南侧面向护城河的主城门厚城台 (厚 5.6m)
        const thickness = gIdx === 0 ? 5.6 : 3.2;
        const gateWall = new THREE.Mesh(new THREE.BoxGeometry(35, wallH, thickness), mats.ancientBrickMat);
        gateWall.position.set(0, wallH / 2, gz);
        gateWall.castShadow = true;
        gateWall.receiveShadow = true;
        const gateArch = new THREE.Mesh(new THREE.BoxGeometry(4.6, 6.2, thickness + 0.4), mats.darkDoor);
        gateArch.position.set(0, 3.1, gz);
        group.add(gateWall, gateArch);

        // 瓮城内壁上下两层共 27 个【藏兵洞拱券门】（朝向北侧瓮城院落内部）
        [-11.5, -7.8, 7.8, 11.5].forEach(cx => {
          [2.2, 6.8].forEach(cy => {
            const cavern = new THREE.Mesh(new THREE.BoxGeometry(2.1, 2.8, thickness + 0.25), mats.darkDoor);
            cavern.position.set(cx, cy, gz);
            group.add(cavern);
          });
        });
      });

      // 3. 城墙顶部环绕一圈的【凹凸雉堞垛口 (Crenellated Battlements)】
      for (let bx = -18.5; bx <= 18.5; bx += 2.6) {
        [-16.2, 16.2].forEach(bz => {
          const merlon = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.35, 0.8), mats.mingBrick);
          merlon.position.set(bx, wallH + 0.65, bz);
          group.add(merlon);
        });
      }
      for (let bz = -14; bz <= 14; bz += 2.6) {
        [-19.2, 19.2].forEach(bx => {
          const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.35, 1.4), mats.mingBrick);
          merlon.position.set(bx, wallH + 0.65, bz);
          group.add(merlon);
        });
      }

      // 4. 东西两翼环城明城墙（与南侧外立面 Z = +14.5 齐平！）与城内北侧左右对称宽阔斜坡【登城马道】（Z = -11.5）
      [-1, 1].forEach(side => {
        const horseRamp = new THREE.Mesh(new THREE.BoxGeometry(24, 3.5, 6.5), mats.ancientBrickMat);
        horseRamp.position.set(side * 29, 5.6, -11.5);
        horseRamp.rotation.z = -side * 0.34;
        horseRamp.castShadow = true;
        group.add(horseRamp);

        // 与南侧外立面 (Z = +14.5) 齐平延伸的环城明城墙，凸显“瓮城在城墙里面（北侧城内）”的防御格局
        const wingWall = new THREE.Mesh(new THREE.BoxGeometry(42, 9.5, 4.8), mats.mingBrick);
        wingWall.position.set(side * 48, 4.75, 14.5);
        wingWall.castShadow = true;
        group.add(wingWall);
        for (let mx = 28; mx <= 66; mx += 3.2) {
          const wMerlon = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.2, 0.85), mats.ancientBrickMat);
          wMerlon.position.set(side * mx, 10.1, 16.5);
          group.add(wMerlon);
        }
      });

      // 5. 南侧外立面主城台（Z = +14.5）之上的重檐歇山朱红【中华门敌楼 / 谯楼】（面向南侧外秦淮河与长干桥）
      const watchtower = new THREE.Group();
      watchtower.position.set(0, wallH, 14.5);
      const wtBase = new THREE.Mesh(new THREE.BoxGeometry(18, 4.8, 8.2), mats.ancientLatticeMat);
      wtBase.position.y = 2.4;
      wtBase.castShadow = true;
      const wtWin = new THREE.Mesh(new THREE.BoxGeometry(14.5, 2.8, 8.5), mats.ancientLatticeMat);
      wtWin.position.y = 2.6;
      const wtRoof1 = createChineseRoof(21.5, 11.2, 2.2, mats.darkGreyTile, false);
      wtRoof1.position.y = 4.8;
      const wtRoof2 = createChineseRoof(17.5, 8.8, 2.8, mats.darkGreyTile, true);
      wtRoof2.position.y = 6.8;
      watchtower.add(wtBase, wtWin, wtRoof1, wtRoof2);
      group.add(watchtower);

      scene.add(group);
    return group;
  }
};
