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
  createJimingPlaqueTexture,
  createManiDomeDiamondTexture,
  createKasayaCopperCanopyTexture
} from '../core/textures.js';

export default {
  id: 'niushoushan',
  name: '牛首山 · 佛顶宫 & 佛顶塔',
  build(scene, ctx) {

    // buildNiushoushanUsnisaPalace
      // -------------------------------------------------------------------------
      // 地标十三：【牛首山文化旅游区 · 佛顶宫 & 佛顶塔】1:1 严格对照最新上传实景图 (image_a07cb5.jpg) 精准重构
      // 实景图 (image_a07cb5.jpg) 核心空间方位与建筑造型（从南向北俯视）：
      // 1. 【左前方主C位 — 摩尼宝珠圆穹顶】：
      //    - 位于画面左前方（lx = -11.5, lz = +2.5），为一座极其饱满浑圆的香槟金立体菱形发髻/莲花瓣球冠大穹顶（半径 16.2m）；
      //    - 穹顶底部坐落于环形米白石材柱廊圆鼓座之上，圆鼓座外圈整齐开设 32 个大尺寸深色矩形窗洞；
      //    - 圆鼓座左外侧与左前侧环绕着一圈宽阔的【深灰蓝弧形镜面水池挑台】，最左侧伸出两道横跨山林的石栈桥！
      // 2. 【摩尼宝珠正后方山巅 — 九级四面唐风佛顶塔】：
      //    - 位于摩尼宝珠圆穹顶的正后方偏左一点（lx = -9.5, lz = -23.5），恰好从摩尼宝珠圆顶与右侧大穹顶交汇处的正后方拔地而起！
      //    - 严格刻画 9 层暖金铜色飞檐翘角屋顶、深棕红唐风木构塔身与顶端直指苍穹的鎏金塔刹；佛顶塔左侧配有米白石材山顶小广场。
      // 3. 【右侧环抱拱起 — 巨型“佛手袈裟/菩提叶”暖香槟玫瑰金镂空大穹顶】：
      //    - 位于摩尼宝珠圆穹顶的右侧（lx: -8 -> +36, lz: -22 -> +21）；
      //    - 左上内缘从摩尼宝珠顶部后侧起拱，紧密贴合摩尼宝珠右侧球面弧线向下延伸，形成泾渭分明的双穹顶咬合缝；
      //    - 主体向右上方饱满隆起成恢弘的暖香槟玫瑰金穹隆，前缘在摩尼宝珠右下前方（lx = +8.5, lz = +19.5）优美下垂成圆润舌尖触地，随后右下边缘呈 S 形波浪弧线高高扬起并落于右侧柱列之上；
      //    - 表面精准还原实景图标志性的【中心放射状树枝叶脉/佛手分叉大镂空花纹 + 细密蜂窝网眼】！
      // 4. 【正前方山崖多层弧形架空柱廊退台 & 右后方山谷大湖泊】：
      //    - 摩尼宝珠正前方山崖（lz = +15 -> +34）层叠筑起三层弧形架空立柱退台长廊、U形内凹双层采光庭院、浅蓝玻璃采光雨棚与右下角白色景交车停车场；
      //    - 大穹顶右后方苍翠山谷间（lx = +32, lz = -46）镶嵌着宽阔平静的自然山间湖泊！
      // -------------------------------------------------------------------------
      const group = new THREE.Group();
      const NX = 205, NZ = 545;
      group.scale.setScalar(1.14);
      group.position.set(NX, 0, NZ);

      const maniDiamondTex = createManiDomeDiamondTexture();
      const maniDiamondMat = new THREE.MeshStandardMaterial({
        map: maniDiamondTex,
        bumpMap: maniDiamondTex,
        bumpScale: 0.45,
        roughness: 0.24,
        metalness: 0.58,
        emissive: new THREE.Color(0xb45309),
        emissiveIntensity: 0.14
      });

      const kasayaRoseGoldTex = createKasayaCopperCanopyTexture();
      const kasayaRoseGoldMat = new THREE.MeshStandardMaterial({
        map: kasayaRoseGoldTex,
        bumpMap: kasayaRoseGoldTex,
        bumpScale: 0.38,
        roughness: 0.26,
        metalness: 0.68,
        side: THREE.DoubleSide,
        emissive: new THREE.Color(0xc2410c),
        emissiveIntensity: 0.18
      });

      const kasayaFineWireMat = new THREE.MeshStandardMaterial({
        color: 0xf5d0ba,
        roughness: 0.22,
        metalness: 0.78,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
        emissive: new THREE.Color(0xd97706),
        emissiveIntensity: 0.20
      });

      const tangPagodaGoldRoofMat = new THREE.MeshStandardMaterial({
        color: 0xeab308,
        roughness: 0.24,
        metalness: 0.62,
        emissive: new THREE.Color(0xb45309),
        emissiveIntensity: 0.22
      });

      const warmBeigeStoneMat = new THREE.MeshStandardMaterial({
        color: 0xe7dec8,
        roughness: 0.55,
        metalness: 0.08
      });

      // 1. 牛首山连绵苍翠自然山脉地形网格 (220m x 185m)
      // 还原实景图背景：左后方高耸连绵的深翠山峰、右后方平缓开阔的湖谷、前景陡峭葱茏的翠绿山崖
      const nsGeo = new THREE.PlaneGeometry(220, 185, 68, 60);
      nsGeo.rotateX(-Math.PI / 2);
      const nsPos = nsGeo.attributes.position;
      const nsCols = new Float32Array(nsPos.count * 3);
      const cDeepPine = new THREE.Color(0x14532d);
      const cLushForest = new THREE.Color(0x166534);
      const cBrightFoliage = new THREE.Color(0x3f6212);

      function getNiushouHeight(lx, lz) {
        let h = 0;
        // 中央佛顶宫主山台 (lx = 0, lz = 0, H = 20.5)
        const dCenter = Math.hypot(lx / 1.35, (lz - 2) / 1.05);
        h += 21.5 * Math.exp(-Math.pow(dCenter / 46, 1.9));

        // 左后方（西北）佛顶塔高耸主峰与远山脉 (lx = -26, lz = -34, H = 32)
        const dNWPeak = Math.hypot((lx + 26) / 1.25, (lz + 34) / 1.05);
        h += 31.0 * Math.exp(-Math.pow(dNWPeak / 42, 1.8));

        // 左翼苍翠山脊 (lx = -54, lz = -6, H = 24)
        const dWest = Math.hypot((lx + 54) / 1.1, (lz + 6) / 1.1);
        h += 23.0 * Math.exp(-Math.pow(dWest / 34, 1.75));

        // 右翼护山翠岭 (lx = 46, lz = 8, H = 20)
        const dEast = Math.hypot((lx - 46) / 1.15, (lz - 8) / 1.05);
        h += 19.5 * Math.exp(-Math.pow(dEast / 34, 1.75));

        // 前景山麓护坡山林脊线 (lz > 26)
        const dFront = Math.hypot((lx + 4) / 1.4, (lz - 42) / 0.85);
        h += 11.5 * Math.exp(-Math.pow(dFront / 36, 1.7));

        // 右后方山谷隐龙湖凹陷盆地 (lx = 32, lz = -46 -> 压低至 H = 2.2)
        const dLake = Math.hypot((lx - 32) / 1.35, (lz + 46) / 0.95);
        if (dLake < 28) {
          const lakeBlend = THREE.MathUtils.smoothstep(dLake, 14, 28);
          h = THREE.MathUtils.lerp(2.0, h, lakeBlend);
        }

        // 中央核心台地平整化 (lx: -28 ~ +32, lz: -18 ~ +22 -> 平整在 H = 18.2)
        if (lx > -30 && lx < 34 && lz > -20 && lz < 24) {
          const coreDist = Math.max(Math.abs(lx - 2) / 31, Math.abs(lz - 2) / 21);
          if (coreDist < 1.0) {
            const b = THREE.MathUtils.smoothstep(coreDist, 0.68, 1.0);
            h = THREE.MathUtils.lerp(18.2, h, b);
          }
        }

        if (h > 2.2) {
          h += (Math.sin(lx * 0.11 + lz * 0.09) * 1.3 + Math.cos(lx * 0.08 - lz * 0.11) * 1.0) * Math.min(1, h / 16);
        }
        return Math.max(0.4, h);
      }

      for (let i = 0; i < nsPos.count; i++) {
        const vx = nsPos.getX(i), vz = nsPos.getZ(i);
        const vy = getNiushouHeight(vx, vz);
        nsPos.setY(i, vy);

        const c = new THREE.Color();
        const n = Math.sin(vx * 0.10 + vz * 0.08) * 0.5 + 0.5;
        c.copy(cDeepPine).lerp(n > 0.58 ? cBrightFoliage : cLushForest, n * 0.85);
        nsCols[i * 3] = c.r;
        nsCols[i * 3 + 1] = c.g;
        nsCols[i * 3 + 2] = c.b;
      }
      nsGeo.setAttribute('color', new THREE.BufferAttribute(nsCols, 3));
      nsGeo.computeVertexNormals();
      const nsMountain = new THREE.Mesh(
        nsGeo,
        new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.86 })
      );
      nsMountain.castShadow = true;
      nsMountain.receiveShadow = true;
      group.add(nsMountain);

      // 2. 右后方山谷宽阔的自然形态大湖泊（1:1还原 image_a07cb5.jpg 右上方山林间波光静谧的湖泊！）
      const lakeShape = new THREE.Shape();
      lakeShape.moveTo(14, -42);
      lakeShape.quadraticCurveTo(26, -54, 46, -50);
      lakeShape.quadraticCurveTo(56, -44, 48, -35);
      lakeShape.quadraticCurveTo(34, -32, 18, -36);
      lakeShape.closePath();
      const valleyLakeGeo = new THREE.ExtrudeGeometry(lakeShape, { depth: 0.45, bevelEnabled: false });
      valleyLakeGeo.rotateX(Math.PI / 2);
      const valleyLakeMesh = new THREE.Mesh(valleyLakeGeo, mats.lakeWater);
      valleyLakeMesh.position.y = 2.65;
      group.add(valleyLakeMesh);

      const baseY = 18.4; // 佛顶宫核心台地高程

      // 3. 左前方主C位：【摩尼宝珠圆穹顶 (Mani Jewel Dome) + 32窗环形石材柱廊圆鼓座 + 左外侧弧形镜面水池挑台】
      // 严格定位在左前方 (lx = -11.5, ly = baseY, lz = 2.5)
      const maniCenter = new THREE.Vector3(-11.5, baseY, 2.5);
      const maniGroup = new THREE.Group();
      maniGroup.position.copy(maniCenter);

      // (A) 左外侧与前侧环绕的【宽阔弧形深灰蓝镜面水池挑台 & 浅米白弧形外护栏】（1:1还原实景图左中侧环绕圆鼓座的弧形深色水池带！）
      const poolOuterR = 23.2;
      const poolInnerR = 16.5;
      const poolDeck = new THREE.Mesh(
        new THREE.CylinderGeometry(poolOuterR, poolOuterR + 0.8, 1.4, 56, 1, false, Math.PI * 0.45, Math.PI * 1.25),
        warmBeigeStoneMat
      );
      poolDeck.position.y = 0.7;
      poolDeck.receiveShadow = true;
      const crescentWater = new THREE.Mesh(
        new THREE.RingGeometry(poolInnerR + 0.6, poolOuterR - 0.7, 52, 1, Math.PI * 0.48, Math.PI * 1.18),
        mats.memorialDarkSlate
      );
      crescentWater.rotation.x = -Math.PI / 2;
      crescentWater.position.y = 1.43;
      const crescentWaterShimmer = new THREE.Mesh(
        new THREE.RingGeometry(poolInnerR + 0.8, poolOuterR - 0.9, 52, 1, Math.PI * 0.48, Math.PI * 1.18),
        mats.lakeWater
      );
      crescentWaterShimmer.rotation.x = -Math.PI / 2;
      crescentWaterShimmer.position.y = 1.45;
      maniGroup.add(poolDeck, crescentWater, crescentWaterShimmer);

      // 左侧伸向山林的两道平行景观石栈桥（还原实景图左侧边缘伸出的两座横向栈桥！）
      [1.0, 7.8].forEach(bz => {
        const leftBridge = new THREE.Mesh(new THREE.BoxGeometry(8.5, 0.75, 2.4), warmBeigeStoneMat);
        leftBridge.position.set(-24.2, 0.9, bz);
        maniGroup.add(leftBridge);
      });

      // (B) 摩尼宝珠底部：【环形米白石材柱廊圆鼓座（外圈整齐排列 32 个大尺寸深色矩形窗洞 + 双层挑檐环带）】
      const drumR = 16.6;
      const drumH = 4.5;
      const drumCore = new THREE.Mesh(new THREE.CylinderGeometry(drumR - 0.45, drumR - 0.25, drumH, 56), mats.darkDoor);
      drumCore.position.y = 1.2 + drumH * 0.5;
      // 上下米白石材挑檐环梁
      const drumBotBand = new THREE.Mesh(new THREE.CylinderGeometry(drumR + 0.3, drumR + 0.5, 0.9, 56), warmBeigeStoneMat);
      drumBotBand.position.y = 1.65;
      const drumMidBand = new THREE.Mesh(new THREE.CylinderGeometry(drumR + 0.25, drumR + 0.25, 0.65, 56), warmBeigeStoneMat);
      drumMidBand.position.y = 4.65;
      const drumTopCornice = new THREE.Mesh(new THREE.CylinderGeometry(drumR + 0.55, drumR + 0.35, 0.72, 56), mats.whiteMarble);
      drumTopCornice.position.y = 5.45;
      maniGroup.add(drumCore, drumBotBand, drumMidBand, drumTopCornice);

      // 圆鼓座外圈 32 根厚实的米白石材方柱（在柱间形成实景图中一圈极其醒目的深色大矩形窗洞！）
      const pillarCount = 32;
      for (let p = 0; p < pillarCount; p++) {
        const ang = (p / pillarCount) * Math.PI * 2;
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.55, 1.05), warmBeigeStoneMat);
        pillar.position.set(Math.cos(ang) * drumR, 3.15, Math.sin(ang) * drumR);
        pillar.rotation.y = -ang + Math.PI / 2;
        pillar.castShadow = true;
        maniGroup.add(pillar);

        // 上沿小方窗洞间的短石柱
        const upperPost = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.55, 0.95), warmBeigeStoneMat);
        upperPost.position.set(Math.cos(ang) * (drumR - 0.05), 5.0, Math.sin(ang) * (drumR - 0.05));
        upperPost.rotation.y = -ang + Math.PI / 2;
        maniGroup.add(upperPost);
      }

      // (C) 摩尼宝珠圆穹顶主体：饱满浑圆的香槟金立体菱形发髻/莲花瓣球冠穹顶 (半径 16.0m，顶点高至 baseY + 18.2 = 36.6)
      const domeR = 16.0;
      const maniDomeGeo = new THREE.SphereGeometry(domeR, 56, 36, 0, Math.PI * 2, 0, Math.PI * 0.49);
      const maniDomeMesh = new THREE.Mesh(maniDomeGeo, maniDiamondMat);
      maniDomeMesh.scale.set(1.0, 0.80, 1.0); // 饱满浑圆的椭球冠比例，与实景图完全一致
      maniDomeMesh.position.y = 5.4;
      maniDomeMesh.castShadow = true;
      maniDomeMesh.receiveShadow = true;
      maniGroup.add(maniDomeMesh);

      // 在摩尼圆穹顶表面叠加 7 圈立体凸起的金色螺髻/莲瓣浮雕节点环，增强近景 3D 颗粒立体感！
      const bossGeo = new THREE.OctahedronGeometry(0.38, 1);
      for (let ring = 1; ring <= 7; ring++) {
        const phi = (ring / 8.2) * (Math.PI * 0.46);
        const yRing = 5.4 + Math.cos(phi) * (domeR * 0.80);
        const rRing = Math.sin(phi) * (domeR + 0.08);
        const count = Math.max(10, Math.round(36 * Math.sin(phi)));
        for (let k = 0; k < count; k++) {
          const theta = (k / count) * Math.PI * 2 + (ring % 2) * (Math.PI / count);
          const boss = new THREE.Mesh(bossGeo, mats.goldTrim);
          boss.scale.set(1.1, 0.65, 1.1);
          boss.position.set(Math.cos(theta) * rRing, yRing, Math.sin(theta) * rRing);
          maniGroup.add(boss);
        }
      }

      group.add(maniGroup);

      // 4. 摩尼宝珠正后方山巅：【88米九级四面唐风佛顶塔】（1:1还原 image_a07cb5.jpg 中位于圆穹顶正后方偏左的高耸九级金铜飞檐古塔！）
      const pagodaBaseY = getNiushouHeight(-9.5, -23.5);
      const fodingPagoda = new THREE.Group();
      fodingPagoda.position.set(-9.5, pagodaBaseY, -23.5);

      // 佛顶塔左前侧的米白石材山顶礼仪小广场（还原实景图中摩尼穹顶左上方、佛顶塔左侧的米白石板平台与点缀树木！）
      const upperLeftPlaza = new THREE.Mesh(new THREE.CylinderGeometry(11.5, 12.8, 3.2, 24), warmBeigeStoneMat);
      upperLeftPlaza.scale.set(1.2, 1, 0.85);
      upperLeftPlaza.position.set(-12.5, -1.2, 6.5);
      fodingPagoda.add(upperLeftPlaza);

      // 佛顶塔汉白玉台基与底层副阶
      const pagodaPlinth = new THREE.Mesh(new THREE.BoxGeometry(13.6, 2.2, 13.6), warmBeigeStoneMat);
      pagodaPlinth.position.y = 1.1;
      fodingPagoda.add(pagodaPlinth);

      // 严格雕琢【九级四面】9 层暖金铜色深出檐飞檐翘角屋顶 + 深棕红木构塔身
      for (let lv = 0; lv < 9; lv++) {
        const w = 9.8 - lv * 0.64;
        const h = 2.28;
        const y0 = 2.2 + lv * 2.22;

        const coreBody = new THREE.Mesh(new THREE.BoxGeometry(w, h, w), mats.ancientLatticeMat);
        coreBody.position.y = y0 + h * 0.5;
        coreBody.castShadow = true;

        const railBelt = new THREE.Mesh(new THREE.BoxGeometry(w + 0.9, 0.36, w + 0.9), mats.bronze);
        railBelt.position.y = y0 + 0.2;

        const roof = createChineseRoof(w + 3.5, w + 3.5, 1.25, tangPagodaGoldRoofMat, lv === 8);
        roof.position.y = y0 + h;
        fodingPagoda.add(coreBody, railBelt, roof);
      }

      // 塔顶高耸入云的鎏金相轮塔刹（直冲天际线！）
      const spireY0 = 2.2 + 9 * 2.22 + 1.0;
      const spireBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.95, 1.6, 1.4, 12), mats.goldTrim);
      spireBowl.position.y = spireY0;
      const spireMast = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.78, 7.2, 12), mats.goldTrim);
      spireMast.position.y = spireY0 + 3.9;
      const spirePearl = new THREE.Mesh(new THREE.SphereGeometry(0.58, 10, 10), mats.goldTrim);
      spirePearl.position.y = spireY0 + 7.7;
      fodingPagoda.add(spireBowl, spireMast, spirePearl);
      group.add(fodingPagoda);

      // 5. 右侧环抱拱起：【巨型“佛手袈裟 / 菩提叶”暖香槟玫瑰金镂空大穹顶】
      // 1:1 严格还原 image_a07cb5.jpg 的参数化曲面形态：
      // - 左内缘 (u = 0) 紧密贴合左前方摩尼宝珠圆穹顶 (center: -11.5, +2.5) 的右侧弧线，从后上方 (-8.5, 35.0, -13.5) 顺滑包络至前下方 (+3.5, 22.0, +13.5)；
      // - 主体向右侧 (u -> 1, lx -> +36) 饱满隆起成巨大的玫瑰金袈裟/菩提叶穹顶 (峰值高 Y = 38.2)；
      // - 前缘在摩尼宝珠右下前方 (u ≈ 0.26, v = 1 -> lx ≈ +8.5, lz ≈ +19.5) 优美下垂成圆润舌尖触地 (Y = 19.2)，随后向右下边缘呈 S 形波浪弧线高高扬起！
      const uSegs = 64, vSegs = 52;
      const canopyGeo = new THREE.PlaneGeometry(1, 1, uSegs, vSegs);
      const cPos = canopyGeo.attributes.position;
      const cUV = canopyGeo.attributes.uv;

      for (let i = 0; i < cPos.count; i++) {
        // u in [0, 1]: 0 = 紧贴摩尼圆穹顶右侧弧缝 (Left Seam), 1 = 最右侧外缘 (Far Right Edge)
        // v in [0, 1]: 0 = 北侧后缘 (Rear/North near Pagoda), 1 = 南侧前缘 (Front/South Scalloped Lip)
        const u = cPos.getX(i) + 0.5;
        const v = 0.5 - cPos.getY(i);

        // (1) 左边界曲线 (u = 0)：严格贴合摩尼圆穹顶 (cx=-11.5, cz=2.5, R=16.2) 的右侧球面弧线！
        const seamAngle = THREE.MathUtils.lerp(-Math.PI * 0.44, Math.PI * 0.34, v);
        const seamRadius = 15.8 - Math.sin(v * Math.PI) * 1.6;
        const leftX = -11.5 + Math.cos(seamAngle) * seamRadius;
        const leftZ = 2.5 + Math.sin(seamAngle) * seamRadius;
        // 左弧缝高度：在后上方紧贴摩尼宝珠肩部 (Y = 34.6)，沿着圆穹顶右侧弧线平滑降至前下方 (Y = 21.8)
        const leftY = THREE.MathUtils.lerp(34.6, 21.4, Math.pow(v, 1.15)) + Math.sin(v * Math.PI) * 2.2;

        // (2) 右边界曲线 (u = 1)：向右大幅舒展包络右翼山坡 (lx 延伸至 +36.5)
        const rightX = 16.0 + Math.sin(v * Math.PI * 0.85) * 20.5;
        const rightZ = THREE.MathUtils.lerp(-18.5, 5.5, v);
        const rightY = 21.5 + Math.sin(v * Math.PI) * 3.8;

        // (3) 水平坐标 (cx, cz) 插值 + 前缘左下侧标志性的【圆润下垂舌尖凸出 (Front Dipping Tongue at u ≈ 0.24, v = 1)】
        const tongueBell = Math.exp(-Math.pow((u - 0.24) / 0.19, 2)) * Math.pow(v, 1.6);
        const rightArchScoop = Math.exp(-Math.pow((u - 0.72) / 0.24, 2)) * Math.pow(v, 1.4);

        let cx = THREE.MathUtils.lerp(leftX, rightX, Math.pow(u, 0.88));
        let cz = THREE.MathUtils.lerp(leftZ, rightZ, u)
                 + tongueBell * 9.5          // 前缘在左下侧向前伸出圆润舌尖 (lz -> +20.5)
                 - rightArchScoop * 3.2      // 右下侧前缘微向内收弧
                 - Math.sin(u * Math.PI) * (1 - v) * 6.5; // 后缘向北饱满外鼓

        // (4) 垂直高度场 cy：中央偏右上方饱满隆起 (峰值 Y = 38.5)，前缘左下舌尖下垂触地 (Y = 19.0)，右下缘呈波浪拱起 (Y = 25.5)
        const baseShellY = THREE.MathUtils.lerp(leftY, rightY, u);
        // 穹隆主拱高度
        const domeBulge = Math.sin(u * Math.PI * 0.88) * Math.sin(v * Math.PI * 0.82) * 14.2;
        // 后上方饱满肩部隆起（呼应照片中佛顶塔前右侧高高隆起的饱满金顶）
        const upperShoulder = Math.sin(u * Math.PI * 0.75) * Math.pow(1 - v, 0.85) * 7.8;
        // 前缘 S 形波浪曲边：在 u ≈ 0.24 处下垂触地 (dip = -6.8)，在 u ≈ 0.68 处向上拱起成优雅眉弓 (arch = +4.2)
        const frontLipDip = -tongueBell * 6.8 + rightArchScoop * 4.2;

        let cy = baseShellY + domeBulge + upperShoulder + frontLipDip;
        cPos.setXYZ(i, cx, Math.max(18.8, cy), cz);
        cUV.setXY(i, u, 1 - v);
      }
      canopyGeo.computeVertexNormals();

      const kasayaCanopyMesh = new THREE.Mesh(canopyGeo, kasayaRoseGoldMat);
      kasayaCanopyMesh.castShadow = true;
      kasayaCanopyMesh.receiveShadow = true;
      group.add(kasayaCanopyMesh);

      const kasayaWireMesh = new THREE.Mesh(canopyGeo.clone(), kasayaFineWireMat);
      kasayaWireMesh.position.y = 0.08;
      group.add(kasayaWireMesh);

      // 大穹顶右下侧边缘下方的细密竖向支承立柱与阴影幕墙（还原实景图右侧大穹顶边缘下的一排立柱！）
      for (let k = 0; k < 8; k++) {
        const t = k / 7;
        const colX = THREE.MathUtils.lerp(14, 34, t);
        const colZ = THREE.MathUtils.lerp(14, 3, t);
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 5.5, 8), warmBeigeStoneMat);
        col.position.set(colX, baseY + 2.4, colZ);
        group.add(col);
      }

      // 6. 正前方山崖：【三层弧形架空立柱退台长廊、U形半围合下沉庭院、浅蓝玻璃采光顶与右下角停车场】
      // 1:1 严格还原 image_a07cb5.jpg 下半部分极具辨识度的多层弧形建筑基座！
      const cliffTerraces = new THREE.Group();
      cliffTerraces.position.set(0, 0, 0);

      // (A) 上层连接广场与左前侧折线观景挑台 (Y = 18.4)
      const mainPlazaSlab = new THREE.Mesh(new THREE.CylinderGeometry(24, 26, 1.4, 48), warmBeigeStoneMat);
      mainPlazaSlab.scale.set(1.35, 1, 0.85);
      mainPlazaSlab.position.set(2, baseY - 0.5, 8);
      mainPlazaSlab.receiveShadow = true;
      cliffTerraces.add(mainPlazaSlab);

      // (B) 摩尼宝珠正前方的【U形半围合双层架空内庭院平台 & 绿顶入口门廊】（还原照片正中偏左下的U形弧形内院！）
      const uCourtGroup = new THREE.Group();
      uCourtGroup.position.set(-6.5, baseY - 2.2, 20.5);

      // U形外围折板挑台与护栏
      const uOuterDeck = new THREE.Mesh(new THREE.CylinderGeometry(11.5, 12.2, 1.2, 36, 1, false, -Math.PI * 0.15, Math.PI * 1.3), warmBeigeStoneMat);
      uOuterDeck.scale.set(1.25, 1, 0.72);
      uOuterDeck.position.y = 1.8;
      // U形内凹深色采光井与内部双层立柱
      const uInnerVoid = new THREE.Mesh(new THREE.CylinderGeometry(7.8, 7.8, 3.2, 28), mats.darkDoor);
      uInnerVoid.scale.set(1.2, 1, 0.65);
      uInnerVoid.position.set(0.5, 0.4, 0.5);
      uCourtGroup.add(uOuterDeck, uInnerVoid);

      for (let c = 0; c < 10; c++) {
        const ang = (c / 9) * Math.PI * 1.1 - Math.PI * 0.05;
        const pCol = new THREE.Mesh(new THREE.BoxGeometry(0.55, 3.4, 0.55), warmBeigeStoneMat);
        pCol.position.set(Math.cos(ang) * 9.5, 0.5, Math.sin(ang) * 6.2);
        uCourtGroup.add(pCol);
      }

      // U形庭院左侧醒目的绿色琉璃坡顶入口门头（还原实景图中U形庭院左前角的绿顶门廊！）
      const greenEntryBox = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.2, 3.6), warmBeigeStoneMat);
      greenEntryBox.position.set(-7.5, 1.6, 5.2);
      greenEntryBox.rotation.y = 0.35;
      const greenEntryRoof = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.45, 3.9), mats.greenGlaze);
      greenEntryRoof.position.set(-7.5, 2.8, 5.2);
      greenEntryRoof.rotation.y = 0.35;
      uCourtGroup.add(greenEntryBox, greenEntryRoof);
      cliffTerraces.add(uCourtGroup);

      // (C) 最下方山崖前缘：【双层弧形架空立柱护坡长廊 & 浅蓝灰玻璃采光雨棚】（1:1还原实景图最底部弧形双层柱廊！）
      const lowerGalleryGroup = new THREE.Group();
      lowerGalleryGroup.position.set(1.5, baseY - 6.2, 27.5);

      const galR = 22.0;
      // 底层与二层弧形混凝土挑板
      [0, 2.4, 4.6].forEach((ly, lIdx) => {
        const arcSlab = new THREE.Mesh(
          new THREE.CylinderGeometry(galR, galR + 0.6, 0.65, 48, 1, false, -Math.PI * 0.32, Math.PI * 0.64),
          warmBeigeStoneMat
        );
        arcSlab.scale.set(1.25, 1, 0.52);
        arcSlab.position.set(0, ly, -6);
        lowerGalleryGroup.add(arcSlab);
      });

      // 弧形长廊内部深色阴影背墙与 14 根双层方形立柱
      const galBackWall = new THREE.Mesh(
        new THREE.CylinderGeometry(galR - 1.2, galR - 1.0, 4.5, 40, 1, false, -Math.PI * 0.30, Math.PI * 0.60),
        mats.darkDoor
      );
      galBackWall.scale.set(1.25, 1, 0.50);
      galBackWall.position.set(0, 2.25, -6);
      lowerGalleryGroup.add(galBackWall);

      for (let g = 0; g <= 12; g++) {
        const ang = THREE.MathUtils.lerp(-Math.PI * 0.28, Math.PI * 0.28, g / 12);
        const gx = Math.sin(ang) * galR * 1.25;
        const gz = Math.cos(ang) * galR * 0.52 - 6;
        const gPillar = new THREE.Mesh(new THREE.BoxGeometry(0.72, 4.6, 0.72), warmBeigeStoneMat);
        gPillar.position.set(gx, 2.3, gz);
        lowerGalleryGroup.add(gPillar);
      }

      // 弧形长廊顶面的浅蓝灰玻璃采光雨棚带（还原实景图底部长廊上方的一长条浅蓝灰采光顶！）
      const skyCanopy = new THREE.Mesh(new THREE.BoxGeometry(19.5, 0.45, 4.2), mats.platformInlay);
      skyCanopy.position.set(-1.5, 4.95, 4.2);
      skyCanopy.rotation.y = -0.08;
      const skyGlass = new THREE.Mesh(new THREE.BoxGeometry(18.5, 0.52, 3.4), mats.qingaoGlassMat);
      skyGlass.position.set(-1.5, 4.98, 4.2);
      skyGlass.rotation.y = -0.08;
      lowerGalleryGroup.add(skyCanopy, skyGlass);

      cliffTerraces.add(lowerGalleryGroup);

      // (D) 右下角深灰柏油停车场平台、白色景交车与翠绿草坪带（1:1还原实景图右下角大穹顶下方的停车场与小白车！）
      const parkingApron = new THREE.Mesh(new THREE.CylinderGeometry(9.5, 10.2, 1.2, 24), mats.asphaltRoad);
      parkingApron.scale.set(1.35, 1, 0.75);
      parkingApron.position.set(22.5, baseY - 1.2, 20.5);
      cliffTerraces.add(parkingApron);

      // 停靠在右下角停车场的白色景交巴士/商务车
      [[25.5, 20.2, -0.25], [21.0, 22.0, 0.15]].forEach(([bx, bz, brot]) => {
        const tourVan = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.95, 1.1), mats.whiteMarble);
        tourVan.position.set(bx, baseY - 0.1, bz);
        tourVan.rotation.y = brot;
        cliffTerraces.add(tourVan);
      });

      // 大穹顶下垂舌尖前方的翠绿草坪花坛与步道点缀树
      const frontLawnPatch = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.35, 5.2), mats.aotiTurfMat);
      frontLawnPatch.position.set(13.5, baseY - 0.4, 21.5);
      frontLawnPatch.rotation.y = -0.22;
      cliffTerraces.add(frontLawnPatch);

      [[-1.5, 17.5], [2.5, 19.5], [6.5, 22.5], [10.5, 23.2], [-14.5, 14.5]].forEach(([tx, tz], idx) => {
        const shrubTree = createChinesePine(0.55 + (idx % 2) * 0.1, idx);
        shrubTree.position.set(tx, baseY - 0.4, tz);
        cliffTerraces.add(shrubTree);
      });

      group.add(cliffTerraces);

      // 7. 漫山遍野的 280 棵苍翠森林（紧密包裹前景山崖、左翼山谷与后方群峰，完美复刻 image_a07cb5.jpg 绿海环抱佛宫的意境！）
      const nsFoliageMats = [
        new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.76 }),
        new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.78 }),
        new THREE.MeshStandardMaterial({ color: 0x3f6212, roughness: 0.74 })
      ];
      function createNiushouLushTree(scale = 1.0, seed = 0) {
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

      for (let i = 0; i < 280; i++) {
        const rRatio = Math.sqrt((i + 0.5) / 280);
        const theta = i * 2.3999632;
        const tx = Math.cos(theta) * rRatio * 98;
        const tz = Math.sin(theta) * rRatio * 82;

        // 严格避开左前方摩尼圆穹顶、右侧大穹顶、正后方佛顶塔、前景多层挑台与右后方山谷湖泊
        if (Math.hypot(tx - (-11.5), tz - 2.5) < 23.5) continue;
        if (tx > -10 && tx < 36 && tz > -20 && tz < 23) continue;
        if (Math.hypot(tx - (-9.5), tz - (-23.5)) < 14) continue;
        if (tx > -18 && tx < 28 && tz >= 16 && tz < 33) continue;
        if (tx > 12 && tx < 56 && tz > -55 && tz < -31) continue;

        const ty = getNiushouHeight(tx, tz);
        const sc = 1.02 + (i % 4) * 0.18;
        const tree = i % 4 === 0 ? createChinesePine(sc, i) : createNiushouLushTree(sc, i);
        tree.position.set(tx, ty - 0.25, tz);
        group.add(tree);
      }

      scene.add(group);
    return group;
  }
};
