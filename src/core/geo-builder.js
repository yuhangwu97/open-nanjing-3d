import * as THREE from 'three';
import { mats, wutongCrownMats, cherryBlossomMat, whiteCherryBlossomMat, willowFoliageMat } from './materials.js';

export const sharedGeos = {
      trunkCyl: new THREE.CylinderGeometry(0.16, 0.32, 2.0, 7),
      branchCyl: new THREE.CylinderGeometry(0.07, 0.14, 1.3, 6),
      wutongPuff: new THREE.IcosahedronGeometry(1.08, 1),
      pinePad: new THREE.CylinderGeometry(0.35, 1.25, 0.6, 7),
      cypressTier: new THREE.ConeGeometry(0.88, 2.0, 8),
      willowStrand: new THREE.CylinderGeometry(0.04, 0.2, 2.3, 6),
      lanternSphere: new THREE.SphereGeometry(0.28, 8, 8)
    };

    export function createWutongTree(scale = 1.0, seed = 0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
      trunk.position.y = 1.0;
      trunk.castShadow = true;
      tree.add(trunk);

      for (let b = 0; b < 3; b++) {
        const ang = (b / 3) * Math.PI * 2 + seed * 0.7;
        const branch = new THREE.Mesh(sharedGeos.branchCyl, mats.treeTrunk);
        branch.position.set(Math.cos(ang) * 0.32, 2.15, Math.sin(ang) * 0.32);
        branch.rotation.z = -Math.cos(ang) * 0.42;
        branch.rotation.x = Math.sin(ang) * 0.42;
        tree.add(branch);
      }

      const puffOffsets = [
        [0, 3.35, 0, 1.2, 0.9, 1.2],
        [-0.78, 2.9, 0.5, 0.9, 0.78, 0.9],
        [0.78, 2.95, 0.4, 0.92, 0.78, 0.88],
        [0.12, 2.85, -0.82, 0.88, 0.75, 0.9],
        [-0.3, 3.55, -0.22, 0.8, 0.72, 0.8]
      ];
      puffOffsets.forEach(([ox, oy, oz, sx, sy, sz], idx) => {
        const subMat = wutongCrownMats[(seed + idx) % wutongCrownMats.length];
        const puff = new THREE.Mesh(sharedGeos.wutongPuff, subMat);
        puff.position.set(ox, oy, oz);
        puff.scale.set(sx, sy, sz);
        puff.rotation.y = seed + idx;
        puff.castShadow = true;
        tree.add(puff);
      });

      tree.scale.setScalar(scale);
      return tree;
    }

    export function createChinesePine(scale = 1.0, seed = 0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.pineBark);
      trunk.position.y = 1.05;
      trunk.castShadow = true;
      tree.add(trunk);

      const layers = [
        { x: 0.3, y: 2.15, z: 0.12, rx: 1.28, ry: 0.62, rz: 1.15 },
        { x: -0.38, y: 2.75, z: -0.18, rx: 1.18, ry: 0.58, rz: 1.08 },
        { x: 0.18, y: 3.3, z: -0.2, rx: 1.02, ry: 0.55, rz: 0.98 },
        { x: 0, y: 3.8, z: 0, rx: 0.8, ry: 0.52, rz: 0.8 }
      ];
      layers.forEach((l, i) => {
        const pad = new THREE.Mesh(sharedGeos.pinePad, mats.pineNeedles);
        pad.position.set(l.x, l.y, l.z);
        pad.scale.set(l.rx, l.ry, l.rz);
        pad.rotation.y = seed + i * 0.8;
        pad.castShadow = true;
        tree.add(pad);
      });
      tree.scale.setScalar(scale);
      return tree;
    }

    export function createCeremonialCypress(scale = 1.0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.pineBark);
      trunk.position.y = 0.85;
      trunk.scale.set(0.7, 0.8, 0.7);
      tree.add(trunk);

      [{ y: 1.95, r: 0.9, h: 1.05 }, { y: 2.95, r: 0.72, h: 1.0 }, { y: 3.85, r: 0.5, h: 0.9 }].forEach(t => {
        const cone = new THREE.Mesh(sharedGeos.cypressTier, mats.cypressNeedles);
        cone.position.y = t.y;
        cone.scale.set(t.r, t.h, t.r);
        cone.castShadow = true;
        tree.add(cone);
      });
      tree.scale.setScalar(scale);
      return tree;
    }

    export function createWeepingWillow(scale = 1.0, seed = 0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
      trunk.position.y = 1.0;
      const topPuff = new THREE.Mesh(sharedGeos.wutongPuff, willowFoliageMat);
      topPuff.position.y = 1.65;
      topPuff.scale.set(1.15, 0.7, 1.15);
      trunk.add(topPuff);
      tree.add(trunk);

      for (let i = 0; i < 5; i++) {
        const ang = (i / 5) * Math.PI * 2 + seed;
        const strand = new THREE.Mesh(sharedGeos.willowStrand, willowFoliageMat);
        strand.position.set(Math.cos(ang) * 0.88, 1.75, Math.sin(ang) * 0.88);
        tree.add(strand);
      }
      tree.scale.setScalar(scale);
      return tree;
    }

    export function createCherryTree(scale = 1.0, seed = 0) {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
      trunk.position.y = 0.8;
      trunk.scale.set(0.7, 0.75, 0.7);
      tree.add(trunk);

      [[0, 2.2, 0, 1.1, 0.7, 1.1], [-0.6, 1.95, 0.35, 0.8, 0.6, 0.8], [0.6, 2.0, -0.3, 0.8, 0.6, 0.8]].forEach(([ox, oy, oz, sx, sy, sz], idx) => {
        const blossomMat = ((seed + idx) % 3 === 0) ? whiteCherryBlossomMat : cherryBlossomMat;
        const puff = new THREE.Mesh(sharedGeos.wutongPuff, blossomMat);
        puff.position.set(ox, oy, oz);
        puff.scale.set(sx, sy, sz);
        puff.rotation.y = seed;
        tree.add(puff);
      });
      tree.scale.setScalar(scale);
      return tree;
    }

    // 基于三维向量与四元数矩阵对齐的精确引桥生成算法（彻底修正上下桥坡向反置问题，100% 严丝合缝连接桥面与地面）
    export function createExactBridgeApproachRamp(pBridge, pGround, opts = {}) {
      const {
        width = 12.6,
        thickness = 1.0,
        deckMat = mats.asphaltRoad,
        railMat = mats.whiteMarble,
        railHeight = 1.2,
        railWidth = 0.45,
        walkwayMat = null,
        walkwayWidth = 3.6,
        pierCount = 3,
        pierRadiusTop = 0.85,
        pierRadiusBot = 1.08
      } = opts;

      const rampGroup = new THREE.Group();
      const vec = new THREE.Vector3().subVectors(pGround, pBridge);
      const slopeLen = vec.length();
      const midPt = new THREE.Vector3().addVectors(pBridge, pGround).multiplyScalar(0.5);

      // 构造右手正交局部坐标系：xAxis 严格沿 pBridge -> pGround 斜向下，zAxis 水平横切桥面，yAxis 垂直坡面向上
      const xAxis = vec.clone().normalize();
      const worldUp = new THREE.Vector3(0, 1, 0);
      const zAxis = new THREE.Vector3().crossVectors(xAxis, worldUp).normalize();
      if (zAxis.lengthSq() < 0.001) zAxis.set(0, 0, 1);
      const yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();

      const basisMat = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
      const rampQuat = new THREE.Quaternion().setFromRotationMatrix(basisMat);

      // 斜坡引桥主面板（两端精确贴合 pBridge 与 pGround）
      const deckMesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen + 0.5, thickness, width), deckMat);
      deckMesh.position.copy(midPt).addScaledVector(yAxis, -thickness * 0.25);
      deckMesh.quaternion.copy(rampQuat);
      deckMesh.castShadow = true;
      deckMesh.receiveShadow = true;
      rampGroup.add(deckMesh);

      if (walkwayMat) {
        const walkMesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen + 0.5, 0.16, walkwayWidth), walkwayMat);
        walkMesh.position.copy(midPt).addScaledVector(yAxis, thickness * 0.28);
        walkMesh.quaternion.copy(rampQuat);
        rampGroup.add(walkMesh);
      }

      // 两侧贴合坡向的引桥护栏
      [-width * 0.5 + railWidth * 0.5, width * 0.5 - railWidth * 0.5].forEach(latZ => {
        const railMesh = new THREE.Mesh(new THREE.BoxGeometry(slopeLen + 0.4, railHeight, railWidth), railMat);
        railMesh.position.copy(midPt)
          .addScaledVector(zAxis, latZ)
          .addScaledVector(yAxis, railHeight * 0.48);
        railMesh.quaternion.copy(rampQuat);
        rampGroup.add(railMesh);
      });

      // 沿坡向渐低排列的垂直桥墩与桥台
      for (let k = 1; k <= pierCount; k++) {
        const u = k / (pierCount + 1);
        const ptOnSlope = new THREE.Vector3().lerpVectors(pBridge, pGround, u);
        const pierH = Math.max(0.6, ptOnSlope.y - pGround.y + 0.3);
        const latList = width > 8.5 ? [-width * 0.3, width * 0.3] : [0];
        latList.forEach(lat => {
          const pier = new THREE.Mesh(
            new THREE.CylinderGeometry(pierRadiusTop, pierRadiusBot, pierH, 12),
            mats.whiteMarble
          );
          pier.position.copy(ptOnSlope).addScaledVector(zAxis, lat);
          pier.position.y = pGround.y + pierH * 0.5 - 0.25;
          pier.castShadow = true;
          rampGroup.add(pier);
        });
      }

      const horizDir = new THREE.Vector3(vec.x, 0, vec.z).normalize();
      const abutQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(1, 0, 0), horizDir);
      const abut = new THREE.Mesh(new THREE.BoxGeometry(5.8, 1.8, width + 1.2), mats.mingStoneBase);
      abut.position.copy(pGround);
      abut.position.y = pGround.y - 0.15;
      abut.quaternion.copy(abutQuat);
      rampGroup.add(abut);

      return rampGroup;
    }

    export function createChineseRoof(width, depth, height, tileMat, withGoldRidge = true) {
      const group = new THREE.Group();
      // 额枋斗拱铺作垫层 (Dougong Eave Bracket Frieze)
      const dougongBelt = new THREE.Mesh(
        new THREE.BoxGeometry(width * 0.92, Math.max(0.22, height * 0.14), depth * 0.92),
        mats.vermilionRed
      );
      dougongBelt.position.y = height * 0.05;
      group.add(dougongBelt);

      // 飞檐裙边（四角带微微上翘反宇弧度）
      const skirtGeo = new THREE.BoxGeometry(width * 1.06, height * 0.16, depth * 1.06, 6, 1, 6);
      const sPos = skirtGeo.attributes.position;
      for (let i = 0; i < sPos.count; i++) {
        const vx = sPos.getX(i), vy = sPos.getY(i), vz = sPos.getZ(i);
        const edgeDist = Math.pow(vx / (width * 0.53), 2) * Math.pow(vz / (depth * 0.53), 2);
        sPos.setY(i, vy + edgeDist * height * 0.42);
      }
      skirtGeo.computeVertexNormals();
      const skirt = new THREE.Mesh(skirtGeo, tileMat);
      skirt.position.y = height * 0.12;
      skirt.castShadow = true;
      group.add(skirt);

      // 反宇曲面坡屋顶主体（中间微凹举折、四角翘起）
      const roofGeo = new THREE.CylinderGeometry(width * 0.44, width * 0.75, height * 0.86, 4, 4);
      roofGeo.rotateY(Math.PI / 4);
      const rPos = roofGeo.attributes.position;
      for (let i = 0; i < rPos.count; i++) {
        const vy = rPos.getY(i);
        const normY = (vy + height * 0.43) / (height * 0.86);
        const sag = 1.0 - Math.sin(normY * Math.PI) * 0.08;
        rPos.setX(i, rPos.getX(i) * sag);
        rPos.setZ(i, rPos.getZ(i) * sag);
      }
      roofGeo.computeVertexNormals();
      const roof = new THREE.Mesh(roofGeo, tileMat);
      roof.scale.set(1, 1, depth / width);
      roof.position.y = height * 0.53;
      roof.castShadow = true;
      group.add(roof);

      // 四条垂脊与翼角翘起仙人走兽 (Corner Ridges & Upturned Eave Tips)
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sz]) => {
        const horn = new THREE.Mesh(new THREE.ConeGeometry(Math.max(0.18, width * 0.022), height * 0.42, 4), withGoldRidge ? mats.goldTrim : tileMat);
        horn.position.set(sx * width * 0.52, height * 0.34, sz * depth * 0.52);
        horn.rotation.z = -sx * 0.55;
        horn.rotation.x = sz * 0.55;
        group.add(horn);
      });

      // 正脊与两端鸱吻脊兽 (Main Ridge & Chiwen Dragon Finials)
      const ridge = new THREE.Mesh(new THREE.BoxGeometry(width * 0.62, height * 0.22, Math.max(0.42, depth * 0.09)), tileMat);
      ridge.position.y = height * 0.96;
      group.add(ridge);

      if (withGoldRidge) {
        const goldStrip = new THREE.Mesh(new THREE.BoxGeometry(width * 0.60, height * 0.09, Math.max(0.46, depth * 0.1)), mats.goldTrim);
        goldStrip.position.y = height * 1.03;
        group.add(goldStrip);
        [-1, 1].forEach(side => {
          const chiwen = new THREE.Mesh(new THREE.ConeGeometry(0.36, height * 0.45, 5), mats.goldTrim);
          chiwen.position.set(side * width * 0.31, height * 1.12, 0);
          chiwen.rotation.z = -side * 0.22;
          group.add(chiwen);
        });
      }
      return group;
    }

    export function createBalustradeSegment(x1, y1, z1, x2, y2, z2, postCount = 3) {
      const group = new THREE.Group();
      const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1;
      const len = Math.hypot(dx, dz);
      const steps = Math.max(1, postCount);

      for (let i = 0; i < steps; i++) {
        const tMid = (i + 0.5) / steps;
        const panel = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.05, len / steps + 0.1), mats.whiteMarble);
        panel.position.set(x1 + dx * tMid, y1 + dy * tMid + 0.5, z1 + dz * tMid);
        panel.rotation.order = 'YXZ';
        panel.rotation.y = Math.atan2(dx, dz);
        panel.rotation.x = -Math.atan2(dy, len);
        group.add(panel);
      }
      for (let i = 0; i <= postCount; i++) {
        const t = i / postCount;
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.45, 0.8), mats.whiteMarble);
        post.position.set(x1 + dx * t, y1 + dy * t + 0.72, z1 + dz * t);
        group.add(post);
      }
      return group;
    }

export function createRedMapleTree(scale = 1.0, seed = 0) {
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

export function createNiushouLushTree(scale = 1.0, seed = 0) {
        const t = new THREE.Group();
        const tr = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
        tr.position.y = 0.9;
        t.add(tr);
        const mMat = nsFoliageMats[seed % nsFoliageMats.length];
        [[0, 2.7, 0, 1.45, 1.0, 1.45], [-0.7, 2.3, 0.45, 1.08, 0.85, 1.08], [0.7, 2.3, -0.45, 1.08, 0.85, 1.08]].forEach(([ox, oy, oz, sx, sy, sz]) => {
          const p = new THREE.Mesh(sharedGeos.wutongPuff, mMat);
          p.position.set(ox, oy, oz);
          p.scale.set(sx, sy, sz);
          p.castShadow = true;
          t.add(p);
        });
        t.scale.setScalar(scale);
        return t;
      }

export function createCurvedTriangularPrism(botR, topR, height, mat, rotOffset = 0) {
        const geo = new THREE.CylinderGeometry(topR, botR, height, 36, 12);
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i), vz = pos.getZ(i);
          const ang = Math.atan2(vz, vx) + rotOffset;
          // 饱满的弧边三角形截面 (Reuleaux / Curved Triangle Section)，绝非三叶梅花柱
          const triFactor = 0.82 + 0.22 * Math.cos(ang * 3) - 0.04 * Math.cos(ang * 6);
          pos.setX(i, vx * triFactor);
          pos.setZ(i, vz * triFactor);
        }
        geo.computeVertexNormals();
        const mesh = new THREE.Mesh(geo, mat);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return mesh;
      }

export function createLushGreenTree(scale = 1.0, seed = 0) {
        const t = new THREE.Group();
        const tr = new THREE.Mesh(sharedGeos.trunkCyl, mats.treeTrunk);
        tr.position.y = 0.9;
        t.add(tr);
        [[0, 2.8, 0, 1.35, 0.95, 1.35], [-0.7, 2.4, 0.4, 1.0, 0.8, 1.0], [0.7, 2.4, -0.4, 1.0, 0.8, 1.0]].forEach(([ox, oy, oz, sx, sy, sz]) => {
          const p = new THREE.Mesh(sharedGeos.wutongPuff, lushGreenCanopyMat);
          p.position.set(ox, oy, oz);
          p.scale.set(sx, sy, sz);
          p.castShadow = true;
          t.add(p);
        });
        t.scale.setScalar(scale);
        return t;
      }
