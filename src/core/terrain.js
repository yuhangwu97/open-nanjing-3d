import * as THREE from 'three';
import { mats } from './materials.js';
import { YANGTZE_MAIN_CURVE } from './yangtze.js';
import { createMasterplanGroundTexture } from './textures.js';

export function buildSandboxTableBase(scene, mats) {
      const baseGroup = new THREE.Group();

      // 1. 沙盘底层深色金属托盘底座（扩展至 2636 x 2086，中心 X = -20, Z = 45，顶面位于 Y = -4.6）
      const tableBase = new THREE.Mesh(new THREE.BoxGeometry(2636, 10, 2086), mats.sandboxBase);
      tableBase.position.set(-20, -9.6, 45);
      baseGroup.add(tableBase);

      // 2. 全域沙盘主陆地层 (扩展至 2600 x 2050，顶面精确位于 Y = -0.35)
      const masterGroundTex = createMasterplanGroundTexture();
      const landMat = new THREE.MeshStandardMaterial({
        map: masterGroundTex,
        roughness: 0.88,
        metalness: 0.04
      });
      const landPlane = new THREE.Mesh(new THREE.BoxGeometry(2600, 4.2, 2050), landMat);
      landPlane.position.set(-20, -2.45, 45);
      landPlane.receiveShadow = true;
      baseGroup.add(landPlane);

      // 3. 沙盘四周外框金属收口边条 (2600 x 2050)
      [
        { x: -20,   z: -984, w: 2616, d: 8 },
        { x: -20,   z: 1074, w: 2616, d: 8 },
        { x: -1324, z: 45,   w: 8,    d: 2050 },
        { x: 1284,  z: 45,   w: 8,    d: 2050 }
      ].forEach(b => {
        const bar = new THREE.Mesh(new THREE.BoxGeometry(b.w, 4.5, b.d), mats.sandboxRim);
        bar.position.set(b.x, -2.35, b.z);
        baseGroup.add(bar);
      });

      // 4. 全城高清玻璃幕墙 CBD 写字楼群（带退台塔冠、层间发光腰线与万家灯火内透，严格避开所有道路与景区）
      const cityBlockCapMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.6 });
      const urbanClusters = [
        [-58, -8, 9, 20, 9], [-58, 48, 10, 26, 10], [42, 48, 10, 24, 10], [68, -5, 9, 18, 9],
        [-58, 92, 9, 17, 9], [52, 95, 9, 21, 9], [-58, -55, 8, 16, 8], [15, -125, 9, 18, 9],
        [-135, -115, 9, 20, 9], [15, -65, 10, 24, 10], [-115, 78, 10, 26, 10], [-125, 105, 9, 22, 9],
        [-125, 175, 9, 21, 9], [-135, 248, 8, 18, 8],
        [-78, 295, 10, 18, 9], [75, 295, 10, 19, 9], [-88, 435, 9, 16, 9], [88, 435, 9, 17, 9],
        [-525, -95, 9, 20, 9], [-535, 15, 10, 23, 9], [-525, 135, 9, 18, 9]
      ];
      urbanClusters.forEach(([ux, uz, uw, uh, ud], idx) => {
        const towerGroup = new THREE.Group();
        towerGroup.position.set(ux, -0.2, uz);

        const bMesh = new THREE.Mesh(new THREE.BoxGeometry(uw, uh, ud), mats.cbdGlassMat);
        bMesh.position.y = uh * 0.5;
        bMesh.castShadow = true;
        bMesh.receiveShadow = true;
        towerGroup.add(bMesh);

        const waist = new THREE.Mesh(new THREE.BoxGeometry(uw + 0.35, 0.45, ud + 0.35), mats.warmWindowGlow);
        waist.position.y = uh * 0.62;
        towerGroup.add(waist);

        const crownW = uw * 0.76, crownD = ud * 0.76, crownH = 2.6 + (idx % 3) * 0.8;
        const crown = new THREE.Mesh(new THREE.BoxGeometry(crownW, crownH, crownD), mats.cbdGlassMat);
        crown.position.y = uh + crownH * 0.5;
        const cap = new THREE.Mesh(new THREE.BoxGeometry(uw + 0.5, 0.5, ud + 0.5), cityBlockCapMat);
        cap.position.y = uh;
        const topCap = new THREE.Mesh(new THREE.BoxGeometry(crownW + 0.4, 0.4, crownD + 0.4), mats.goldTrim);
        topCap.position.y = uh + crownH;
        towerGroup.add(crown, cap, topCap);

        baseGroup.add(towerGroup);
      });

      scene.add(baseGroup);
    }
