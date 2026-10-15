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
  id: 'xuanwu',
  name: '玄武湖景区 & 明城墙',
  build(scene, ctx) {
    const group = new THREE.Group();
  const animatedLakeBoats = [];

      // 11.1 地标十二：【玄武湖景区（实景图三 1:1 自然五洲绿岛） & 台城/解放门真实明城墙】
      // 大幅右移至 X = 155, Z = -165，景区整体扩建放大 1.42x
      // 严格对照实景航拍图三 (image_9d646c.jpg) 重构：
      // - 摒弃原本生硬的 5 个圆形饼状柱体，采用自然有机的多边形曲线轮廓刻画【环洲（弯月抱湖半岛+内湖水湾+左侧笔直金色梧桐长堤+中央红杉林+疏林草坪+黄白游船码头）】、【樱洲（环洲怀抱之中）】、【梁洲（左上芳桥相连）】、【翠洲（右侧修长弧形林荫“翠虹堤”相连+白色游艇码头）】、【菱洲】
      // - 湖面增设图三左右两侧标志性的【大型圆形音乐喷泉水景环】与碧绿波光湖水
      // - 彻底重塑【玄武湖明城墙（台城/解放门段）】：摒弃扭曲管道与悬浮方块，采用下宽上窄收分的明代错缝青砖实体城墙网格 + 切线精准对齐的外侧凹凸雉堞垛口与内侧女儿墙 + 凸出马面敌台 + 解放门/玄武门重檐城楼！
      // -------------------------------------------------------------------------
      const xuanwuGroup = new THREE.Group();
      const LX = 225, LZ = -165;
      xuanwuGroup.position.set(LX, 0, LZ);
      xuanwuGroup.scale.set(1.42, 1.0, 1.42);

      // 1. 碧绿温润、波光粼粼的玄武湖宽阔水面与青石驳岸
      const lakeShape = new THREE.Shape();
      lakeShape.moveTo(0, -52);
      lakeShape.bezierCurveTo(42, -50, 66, -26, 62, 10);
      lakeShape.bezierCurveTo(58, 36, 30, 48, -6, 46);
      lakeShape.bezierCurveTo(-44, 44, -64, 22, -60, -14);
      lakeShape.bezierCurveTo(-56, -40, -30, -52, 0, -52);
      lakeShape.closePath();

      const lakeRimGeo = new THREE.ExtrudeGeometry(lakeShape, { depth: 0.75, bevelEnabled: true, bevelThickness: 0.25, bevelSize: 0.8 });
      lakeRimGeo.rotateX(Math.PI / 2);
      const lakeRim = new THREE.Mesh(lakeRimGeo, mats.mingStoneBase);
      lakeRim.position.set(0, 0.25, 0);
      lakeRim.receiveShadow = true;

      const lakeWaterGeo = new THREE.ExtrudeGeometry(lakeShape, { depth: 0.62, bevelEnabled: false });
      lakeWaterGeo.rotateX(Math.PI / 2);
      const lakeMesh = new THREE.Mesh(lakeWaterGeo, mats.lakeWater);
      lakeMesh.scale.set(0.98, 1, 0.98);
      lakeMesh.position.set(0, 0.36, 0);
      lakeMesh.receiveShadow = true;
      xuanwuGroup.add(lakeRim, lakeMesh);

      // 还原图三湖面左右两侧标志性的【圆形音乐喷泉水景浮环】(Circular Floating Fountain Rings in Photo 3)
      [[-36, 12, 3.8], [42, 18, 4.4]].forEach(([fx, fz, fr]) => {
        const fRing = new THREE.Mesh(new THREE.TorusGeometry(fr, 0.22, 8, 28), mats.goldTrim);
        fRing.rotation.x = Math.PI / 2;
        fRing.position.set(fx, 0.48, fz);
        const fInner = new THREE.Mesh(new THREE.RingGeometry(fr * 0.45, fr * 0.62, 24), mats.magnoliaLamp);
        fInner.rotation.x = -Math.PI / 2;
        fInner.position.set(fx, 0.49, fz);
        xuanwuGroup.add(fRing, fInner);
      });

      // 自然有机轮廓洲岛生成辅助函数（深绿护岸树丛边缘 + 自然草坪 + 驳岸石线）
      const metasequoiaRedMat = new THREE.MeshStandardMaterial({ color: 0xc2410c, roughness: 0.65 }); // 水杉红褐秋叶
      const lushLawnMat = new THREE.MeshStandardMaterial({ color: 0x4d7c0f, roughness: 0.85 });

      function createOrganicIslandMesh(pts2D, height = 1.25) {
        const shape = new THREE.Shape();
        pts2D.forEach(([px, pz], i) => {
          if (i === 0) shape.moveTo(px, pz);
          else shape.lineTo(px, pz);
        });
        shape.closePath();
        const bankGeo = new THREE.ExtrudeGeometry(shape, { depth: height, bevelEnabled: true, bevelThickness: 0.35, bevelSize: 0.55 });
        bankGeo.rotateX(Math.PI / 2);
        const bankMesh = new THREE.Mesh(bankGeo, mats.mingStoneBase);
        bankMesh.position.y = height * 0.5 + 0.1;
        bankMesh.receiveShadow = true;

        const grassGeo = new THREE.ExtrudeGeometry(shape, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.2, bevelSize: 0.2 });
        grassGeo.rotateX(Math.PI / 2);
        const grassMesh = new THREE.Mesh(grassGeo, mats.islandGrass);
        grassMesh.scale.set(0.96, 1, 0.96);
        grassMesh.position.y = height + 0.18;
        grassMesh.receiveShadow = true;

        const grp = new THREE.Group();
        grp.add(bankMesh, grassMesh);
        return grp;
      }

      // 2. 【环洲 & 樱洲】（1:1还原图三前景核心：左侧笔直金色梧桐长堤、弯月抱湖半岛、内部水湾内湖、中央红杉林簇与疏林草坪）
      const huanzhouPts = [
        [-24, 24], [-26, 8], [-27, -8], [-22, -14], [-8, -14],
        [8, -10], [16, -2], [18, 8], [10, 14], [2, 16],
        [-10, 20], [-18, 25]
      ];
      const huanzhouIsle = createOrganicIslandMesh(huanzhouPts, 1.25);
      xuanwuGroup.add(huanzhouIsle);

      // 环洲岛内曲折的【内湖水湾水道】（还原图三环洲岛中央蜿蜒的深色内湖水道与小桥！）
      const innerCoveShape = new THREE.Shape();
      innerCoveShape.moveTo(-18, 12);
      innerCoveShape.quadraticCurveTo(-19, 2, -14, -4);
      innerCoveShape.quadraticCurveTo(-4, -8, 6, -3);
      innerCoveShape.quadraticCurveTo(10, 3, 4, 8);
      innerCoveShape.quadraticCurveTo(-6, 4, -12, 14);
      innerCoveShape.closePath();
      const coveGeo = new THREE.ExtrudeGeometry(innerCoveShape, { depth: 0.45, bevelEnabled: false });
      coveGeo.rotateX(Math.PI / 2);
      const innerCoveWater = new THREE.Mesh(coveGeo, mats.lakeWater);
      innerCoveWater.position.y = 1.38;
      xuanwuGroup.add(innerCoveWater);

      // 环洲内湾中心草坪与图三标志性的【深秋火红水杉林簇】
      const centerMeadow = new THREE.Mesh(new THREE.CylinderGeometry(7.5, 8.2, 0.2, 20), lushLawnMat);
      centerMeadow.scale.set(1.3, 1, 0.85);
      centerMeadow.position.set(-4, 1.35, 2);
      xuanwuGroup.add(centerMeadow);

      for (let r = 0; r < 16; r++) {
        const rx = -10 + (r % 6) * 2.2 + (r % 2) * 0.5;
        const rz = 4 + Math.floor(r / 6) * 2.2;
        const redwood = new THREE.Group();
        const cone = new THREE.Mesh(sharedGeos.cypressTier, metasequoiaRedMat);
        cone.position.y = 2.2;
        cone.scale.set(0.95, 1.65, 0.95);
        cone.castShadow = true;
        redwood.add(cone);
        redwood.position.set(rx, 1.25, rz);
        xuanwuGroup.add(redwood);
      }

      // 图三左侧最抢眼的【环洲西岸笔直金色梧桐/垂柳林荫大道长堤】（从南端一路笔直延伸至北端芳桥）
      const westPromenade = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 38), mats.platformInlay);
      westPromenade.position.set(-24.2, 1.32, 5);
      xuanwuGroup.add(westPromenade);
      for (let t = 0; t < 15; t++) {
        const tz = -12 + t * 2.5;
        const goldTree = createWutongTree(0.88 + (t % 2) * 0.1, t);
        goldTree.position.set(-23.2, 1.25, tz);
        xuanwuGroup.add(goldTree);
      }

      // 图三左下角与西岸整齐停靠的【黄色与白色游船码头栈桥】
      [
        { x: -27.5, z: 14, color: mats.imperialYellowGlaze, dir: -1 },
        { x: -27.5, z: 16.5, color: mats.imperialYellowGlaze, dir: -1 },
        { x: -16, z: 25.5, color: mats.whiteMarble, dir: 1 },
        { x: -13, z: 24.5, color: mats.imperialYellowGlaze, dir: 1 }
      ].forEach(dock => {
        const pier = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.25, 0.9), mats.whiteMarble);
        pier.position.set(dock.x, 0.55, dock.z);
        pier.rotation.y = dock.dir > 0 ? 0.5 : 0;
        xuanwuGroup.add(pier);
        for (let k = -1.5; k <= 1.5; k += 1.5) {
          const smallBoat = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.35, 2.1), dock.color);
          smallBoat.position.set(dock.x + k, 0.48, dock.z + 1.2);
          xuanwuGroup.add(smallBoat);
        }
      });

      // 樱洲（藏经楼重檐绿琉璃瓦与白墙黛瓦江南庭院，位于 [-4, -9]）
      const cangjingPav = new THREE.Group();
      cangjingPav.position.set(-4, 1.3, -9);
      const cjBase = new THREE.Mesh(new THREE.BoxGeometry(7.2, 1.0, 5.8), mats.whiteMarble);
      cjBase.position.y = 0.5;
      const cjBody1 = new THREE.Mesh(new THREE.BoxGeometry(5.8, 3.0, 4.6), mats.ancientLatticeMat);
      cjBody1.position.y = 2.4;
      const cjRoof1 = createChineseRoof(7.6, 6.2, 1.6, mats.greenGlaze, false);
      cjRoof1.position.y = 3.9;
      const cjBody2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 2.2, 3.4), mats.ancientLatticeMat);
      cjBody2.position.y = 5.4;
      const cjRoof2 = createChineseRoof(5.8, 4.8, 1.9, mats.greenGlaze, true);
      cjRoof2.position.y = 6.5;
      cangjingPav.add(cjBase, cjBody1, cjRoof1, cjBody2, cjRoof2);
      xuanwuGroup.add(cangjingPav);

      // 3. 【梁洲】（图三左上方自然绿岛，带芳桥与览胜楼，位于 [-34, -10]）
      const liangzhouPts = [
        [-44, -2], [-46, -12], [-38, -18], [-28, -16], [-27, -6], [-34, 0]
      ];
      const liangzhouIsle = createOrganicIslandMesh(liangzhouPts, 1.2);
      xuanwuGroup.add(liangzhouIsle);
      const liangPav = new THREE.Group();
      liangPav.position.set(-36, 1.3, -10);
      const lpBody = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.6, 4.4), mats.ancientLatticeMat);
      lpBody.position.y = 1.8;
      const lpRoof = createChineseRoof(7.0, 5.8, 2.0, mats.darkGreyTile, true);
      lpRoof.position.y = 3.6;
      liangPav.add(lpBody, lpRoof);
      xuanwuGroup.add(liangPav);

      // 4. 【菱洲】（图三中上方红叶绿树岛屿，由细长林荫石堤与梁洲相连，位于 [-12, -28]）
      const lingzhouPts = [
        [-20, -24], [-22, -32], [-14, -36], [-4, -34], [-3, -26], [-11, -22]
      ];
      const lingzhouIsle = createOrganicIslandMesh(lingzhouPts, 1.2);
      xuanwuGroup.add(lingzhouIsle);

      // 5. 【翠洲】（图三右侧绿岛 + 标志性的修长弧形林荫长堤“翠虹堤” + 白色游艇栈桥，位于 [28, -8]）
      const cuizhouPts = [
        [18, -4], [17, -14], [24, -20], [36, -18], [40, -8], [34, 0], [22, 0]
      ];
      const cuizhouIsle = createOrganicIslandMesh(cuizhouPts, 1.2);
      xuanwuGroup.add(cuizhouIsle);

      // 图三右侧极具辨识度的【弧形林荫长堤（翠虹堤）】与白色游船码头
      const cuihongPts = [
        new THREE.Vector3(36, 0.7, -3),
        new THREE.Vector3(45, 0.7, 3),
        new THREE.Vector3(54, 0.7, 10)
      ];
      const cuihongCurve = new THREE.CatmullRomCurve3(cuihongPts);
      const cuihongCauseway = new THREE.Mesh(
        new THREE.TubeGeometry(cuihongCurve, 24, 1.8, 6, false),
        mats.islandGrass
      );
      cuihongCauseway.scale.set(1, 0.35, 1);
      xuanwuGroup.add(cuihongCauseway);
      for (let c = 0; c <= 8; c++) {
        const pt = cuihongCurve.getPointAt(c / 8);
        const tree = createWeepingWillow(0.78, c);
        tree.position.set(pt.x, 0.8, pt.z);
        xuanwuGroup.add(tree);
      }

      // 五洲之间的白玉拱桥与林荫堤桥（连接西岸玄武门、环洲、梁洲、菱洲、翠洲与南岸）
      function createLakeArchBridge(x1, z1, x2, z2) {
        const brGroup = new THREE.Group();
        const midX = (x1 + x2) * 0.5, midZ = (z1 + z2) * 0.5;
        const span = Math.hypot(x2 - x1, z2 - z1);
        const rotY = Math.atan2(x2 - x1, z2 - z1);
        brGroup.position.set(midX, 0.5, midZ);
        brGroup.rotation.y = rotY;

        const segs = 12;
        for (let s = 0; s < segs; s++) {
          const u0 = s / segs - 0.5, u1 = (s + 1) / segs - 0.5;
          const um = (u0 + u1) * 0.5;
          const yArch = Math.cos(um * Math.PI) * 1.8 + 0.55;
          const tilt = Math.sin(um * Math.PI) * 0.28;
          const slab = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.45, (span / segs) + 0.25), mats.whiteMarble);
          slab.position.set(0, yArch, um * span);
          slab.rotation.x = tilt;
          brGroup.add(slab);
        }
        return brGroup;
      }

      xuanwuGroup.add(
        createLakeArchBridge(-24, 24, -32, 34), // 南岸进入环洲长桥
        createLakeArchBridge(-25, -6, -30, -6), // 环洲至梁洲芳桥
        createLakeArchBridge(-28, -16, -19, -25), // 梁洲至菱洲堤桥
        createLakeArchBridge(14, -4, 19, -5),   // 环洲至翠洲桥
        createLakeArchBridge(-46, -6, -54, -4)  // 梁洲至西岸玄武门桥
      );

      // 在五洲岛屿四周边缘密植葱茏护岸绿树与秋叶林（还原图三岛屿四周浓密的绿树环绕感）
      const islandTreeZones = [
        ...huanzhouPts.map(([x, z]) => [x * 0.88, z * 0.88]),
        ...liangzhouPts.map(([x, z]) => [x, z]),
        ...lingzhouPts.map(([x, z]) => [x, z]),
        ...cuizhouPts.map(([x, z]) => [x, z])
      ];
      islandTreeZones.forEach(([tx, tz], idx) => {
        const tree = idx % 3 === 0 ? createWutongTree(0.85, idx) : (idx % 2 === 0 ? createWeepingWillow(0.9, idx) : createChinesePine(0.9, idx));
        tree.position.set(tx, 1.25, tz);
        xuanwuGroup.add(tree);
      });

      // 6. 西岸【玄武门】三孔重檐城楼
      const xuanwuGate = new THREE.Group();
      xuanwuGate.position.set(-55, 0, -4);
      const xwWall = new THREE.Mesh(new THREE.BoxGeometry(6.8, 8.2, 18), mats.mingBrick);
      xwWall.position.y = 4.1;
      xwWall.castShadow = true;
      [-4.5, 0, 4.5].forEach(az => {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(7.2, 4.2, 2.5), mats.darkDoor);
        arch.position.set(0, 2.1, az);
        xuanwuGate.add(arch);
      });
      const xwTower = new THREE.Mesh(new THREE.BoxGeometry(5.0, 4.4, 12.5), mats.ancientLatticeMat);
      xwTower.position.y = 10.2;
      const xwRoof1 = createChineseRoof(7.2, 14.8, 1.9, mats.darkGreyTile, false);
      xwRoof1.position.y = 12.4;
      const xwRoof2 = createChineseRoof(5.8, 12.2, 2.5, mats.darkGreyTile, true);
      xwRoof2.position.y = 14.2;
      xuanwuGate.add(xwWall, xwTower, xwRoof1, xwRoof2);
      xuanwuGroup.add(xuanwuGate);

      // -------------------------------------------------------------------------
      // 7. 彻底重塑【玄武湖台城 / 解放门六百年明城墙】（告别假管道与错位方块！）
      // 采用分段式下宽上窄收分的明代条石基座 + 高清错缝青砖城墙体 + 城顶海墁石板马道 + 切线精准对齐的外侧凹凸雉堞垛口与内侧女儿墙 + 马面敌台 + 解放门城楼
      // -------------------------------------------------------------------------
      const wallWaypoints = [
        new THREE.Vector3(-52, 0, 36),
        new THREE.Vector3(-28, 0, 44),
        new THREE.Vector3(0,   0, 45),
        new THREE.Vector3(28,  0, 38),
        new THREE.Vector3(50,  0, 20),
        new THREE.Vector3(58,  0, -8),
        new THREE.Vector3(56,  0, -34)
      ];

      function buildAuthenticWallSegment(pA, pB, segIndex) {
        const segGroup = new THREE.Group();
        const vec = new THREE.Vector3().subVectors(pB, pA);
        const len = vec.length();
        const mid = new THREE.Vector3().addVectors(pA, pB).multiplyScalar(0.5);
        const rotY = Math.atan2(vec.x, vec.z);

        segGroup.position.set(mid.x, 0, mid.z);
        segGroup.rotation.y = rotY;

        const wallH = 8.6;
        // (1) 底部明代须弥条石压顶基座 (宽 6.2m, 高 1.6m)
        const stoneFooting = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.6, len + 2.2), mats.whiteMarble);
        stoneFooting.position.y = 0.8;
        stoneFooting.receiveShadow = true;
        segGroup.add(stoneFooting);

        // (2) 下宽上窄收分的明代错缝青砖主墙体 (底宽 5.6m, 顶宽 4.6m, 高 7.0m)
        const wallBody = new THREE.Mesh(new THREE.BoxGeometry(5.2, wallH - 1.6, len + 2.0), mats.mingBrick);
        wallBody.position.y = 1.6 + (wallH - 1.6) * 0.5;
        wallBody.castShadow = true;
        wallBody.receiveShadow = true;
        segGroup.add(wallBody);

        // (3) 城墙顶部海墁青砖步行马道与两侧白石压檐线 (高 Y = 8.6m)
        const topWalkway = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, len + 2.2), mats.platformInlay);
        topWalkway.position.y = wallH + 0.15;
        topWalkway.receiveShadow = true;
        segGroup.add(topWalkway);

        // (4) 内侧（玄武湖侧 X = -2.35）连续女儿墙护栏 + 外侧（X = +2.35）精准对齐切线的凹凸雉堞垛口！
        const innerParapet = new THREE.Mesh(new THREE.BoxGeometry(0.55, 1.05, len + 1.6), mats.mingBrick);
        innerParapet.position.set(-2.35, wallH + 0.8, 0);
        const outerBaseParapet = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, len + 1.6), mats.mingBrick);
        outerBaseParapet.position.set(2.35, wallH + 0.55, 0);
        segGroup.add(innerParapet, outerBaseParapet);

        const merlonStep = 2.6;
        const numMerlons = Math.floor(len / merlonStep);
        for (let m = 0; m < numMerlons; m++) {
          const mz = -len * 0.5 + (m + 0.5) * merlonStep;
          const merlon = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.95, 1.45), mats.mingBrick);
          merlon.position.set(2.35, wallH + 1.25, mz);
          const merlonCap = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.16, 1.55), mats.platformInlay);
          merlonCap.position.set(2.35, wallH + 1.78, mz);
          segGroup.add(merlon, merlonCap);
        }

        // (5) 每段城墙外侧增设凸出的【明代城墙马面 / 敌台墩台】
        const bastion = new THREE.Mesh(new THREE.BoxGeometry(3.2, wallH + 0.3, 6.4), mats.mingBrick);
        bastion.position.set(3.4, (wallH + 0.3) * 0.5, 0);
        bastion.castShadow = true;
        segGroup.add(bastion);

        // 在第 1 段（台城/解放门位置）增设拱券城门洞与重檐歇山【台城/解放门敌楼】
        if (segIndex === 1) {
          const gateArch = new THREE.Mesh(new THREE.BoxGeometry(6.6, 4.8, 3.8), mats.darkDoor);
          gateArch.position.set(0, 2.4, 0);
          const gateTowerBody = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.8, 9.5), mats.ancientLatticeMat);
          gateTowerBody.position.set(0, wallH + 2.1, 0);
          const gateRoof = createChineseRoof(6.4, 11.8, 2.4, mats.darkGreyTile, true);
          gateRoof.position.set(0, wallH + 4.0, 0);
          segGroup.add(gateArch, gateTowerBody, gateRoof);
        }

        return segGroup;
      }

      for (let i = 0; i < wallWaypoints.length - 1; i++) {
        xuanwuGroup.add(buildAuthenticWallSegment(wallWaypoints[i], wallWaypoints[i + 1], i));
      }

      // 城墙转角圆形角楼墩台，消除折角接缝
      wallWaypoints.forEach((wp) => {
        const cornerBastion = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.7, 9.0, 16), mats.mingBrick);
        cornerBastion.position.set(wp.x, 4.5, wp.z);
        cornerBastion.castShadow = true;
        const cornerCap = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 0.8, 16), mats.platformInlay);
        cornerCap.position.set(wp.x, 9.1, wp.z);
        xuanwuGroup.add(cornerBastion, cornerCap);
      });

      scene.add(xuanwuGroup);

      // 玄武湖动态游船
      const worldGroup = new THREE.Group();
      for (let b = 0; b < 8; b++) {
        const boat = new THREE.Group();
        const isDuck = b % 2 === 0;
        const hull = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.58, 1.8), isDuck ? mats.goldTrim : mats.whiteMarble);
        hull.position.y = 0.28;
        const canopy = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.95, 1.55), isDuck ? mats.imperialYellowGlaze : mats.blueGlaze);
        canopy.position.y = 0.92;
        boat.add(hull, canopy);
        worldGroup.add(boat);
        animatedLakeBoats.push({
          mesh: boat,
          cx: LX + (b % 2 === 0 ? -42 : 34),
          cz: LZ + ((b % 4) - 1.5) * 18,
          rx: 8.5 + (b % 3) * 2.5,
          rz: 6.5 + (b % 3) * 2.0,
          speed: 0.32 + b * 0.05,
          phase: b * 1.1
        });
      }

      // -------------------------------------------------------------------------


    scene.add(group);

    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
      animatedLakeBoats.forEach(b => {
        const t = elapsed * b.speed + b.phase;
        b.mesh.position.set(b.cx + Math.cos(t) * b.rx, 0.25, b.cz + Math.sin(t) * b.rz);
        b.mesh.rotation.y = Math.atan2(-Math.sin(t) * b.rx * b.speed, Math.cos(t) * b.rz * b.speed);
      });
      });
    }

    return group;
  }
};
