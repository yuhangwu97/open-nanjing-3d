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
  id: 'zifeng',
  name: '紫峰大厦 & 鼓楼',
  build(scene, ctx) {
    const group = new THREE.Group();

    function buildZifengTowerAndGulou() {
      const group = new THREE.Group();
      const ZX = 265, ZZ = 85;
      group.position.set(ZX, 0, ZZ);

      // 1. 鼓楼环岛广场与6层弧形石材+玻璃商业裙楼 (Curved Podium)
      const plaza = new THREE.Mesh(new THREE.CylinderGeometry(28, 30, 0.8, 40), mats.platformInlay);
      plaza.position.y = 0.4;
      plaza.receiveShadow = true;
      group.add(plaza);

      // 弧形裙楼群（环抱主塔东南西三侧）
      const podiumMain = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 16.0, 9.2, 6, 1, false, -0.4, Math.PI * 1.35), mats.zifengGlassMat);
      podiumMain.position.set(0, 4.6, 2.5);
      podiumMain.castShadow = true;
      const podiumCap = new THREE.Mesh(new THREE.CylinderGeometry(15.0, 15.0, 0.8, 6, 1, false, -0.4, Math.PI * 1.35), mats.zifengFinMat);
      podiumCap.position.set(0, 9.4, 2.5);
      group.add(podiumMain, podiumCap);

      // 2. 紫峰大厦灵魂造型：【高低错落咬合的双三角扇形弧面束筒 (Interlocking Bundled Curved-Triangular Prisms)】
      // Helper: 生成圆角弧边等腰三角棱柱 (Curved-Side Triangular Prism)
      function createCurvedTriangularPrism(botR, topR, height, mat, rotOffset = 0) {
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

      // (A) 东南外侧副束筒 (Outer South-East Wing Prism)：从 Y=0.8 升至 72层观光厅 (Y=66)，在此形成标志性的【72层水平大退台缺口】！
      const wingPrism = createCurvedTriangularPrism(10.2, 8.8, 65.2, mats.zifengGlassMat, 0.0);
      wingPrism.position.set(2.2, 0.8 + 32.6, 2.0);
      group.add(wingPrism);

      // 72层云端观光层退台纯白平台盖板与内凹全景发光玻璃环 (The Iconic 72F Setback Observatory Notch at Y=66~70)
      const setbackLedge = createCurvedTriangularPrism(9.1, 9.1, 1.2, mats.zifengFinMat, 0.0);
      setbackLedge.position.set(2.2, 66.2, 2.0);
      const obsGlassNotch = createCurvedTriangularPrism(8.2, 8.2, 3.2, mats.zifengCrownGlow, 0.0);
      obsGlassNotch.position.set(1.2, 68.4, 1.1);
      group.add(setbackLedge, obsGlassNotch);

      // (B) 中间过渡束筒 (Mid-Tier Interlocking Prism)：从 Y=0.8 升至 82层 (Y=82)，形成第二道阶梯退台！
      const midPrism = createCurvedTriangularPrism(9.4, 7.6, 81.2, mats.zifengGlassMat, Math.PI / 3);
      midPrism.position.set(0.4, 0.8 + 40.6, 0.4);
      const midLedge = createCurvedTriangularPrism(7.8, 7.8, 1.0, mats.zifengFinMat, Math.PI / 3);
      midLedge.position.set(0.4, 82.2, 0.4);
      group.add(midPrism, midLedge);

      // (C) 西北主核心高耸束筒 (Main Taller North-West Core Prism)：从底部一气呵成直冲 Y=95，高出副筒整整 29 单位！
      const mainCorePrism = createCurvedTriangularPrism(8.8, 6.6, 94.2, mats.zifengGlassMat, Math.PI);
      mainCorePrism.position.set(-1.6, 0.8 + 47.1, -1.4);
      const mainCoreLedge = createCurvedTriangularPrism(6.8, 6.8, 1.1, mats.zifengFinMat, Math.PI);
      mainCoreLedge.position.set(-1.6, 95.2, -1.4);
      group.add(mainCorePrism, mainCoreLedge);

      // (D) 竖向锯齿状银白色鱼鳞金属龙骨凹槽 (Signature Vertical Silver Sawtooth Spines along the Interlocking Seams)
      [
        { x: 4.8, z: -2.6, h: 82, rot: 0.5 },
        { x: -3.2, z: 4.6, h: 82, rot: -0.8 },
        { x: -5.8, z: -4.2, h: 95, rot: 2.2 },
        { x: 5.6, z: 4.8, h: 66, rot: -0.4 }
      ].forEach(sp => {
        const spineBar = new THREE.Mesh(new THREE.BoxGeometry(0.95, sp.h, 1.65), mats.zifengFinMat);
        spineBar.position.set(sp.x, 0.8 + sp.h / 2, sp.z);
        spineBar.rotation.y = sp.rot;
        group.add(spineBar);
        // 锯齿阶梯鱼鳞节点
        for (let sy = 6; sy < sp.h; sy += 4.5) {
          const tooth = new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.65, 2.0), mats.whiteMarble);
          tooth.position.set(sp.x, 0.8 + sy, sp.z);
          tooth.rotation.y = sp.rot;
          group.add(tooth);
        }
      });

      // (E) 密集的水平银白玻璃幕墙层间环带 (26 Horizontal Curtain-Wall Spandrel Rings)
      for (let ly = 4; ly <= 92; ly += 3.6) {
        const isHigh = ly > 66;
        const isVeryHigh = ly > 82;
        const rRing = isVeryHigh ? 5.6 : (isHigh ? 6.8 : 8.6);
        const ox = isVeryHigh ? -1.6 : (isHigh ? -0.6 : 0.6);
        const oz = isVeryHigh ? -1.4 : (isHigh ? -0.5 : 0.5);
        const hBand = createCurvedTriangularPrism(
          rRing, rRing, 0.24,
          (ly === 40 || ly === 65.6 || ly === 81.6) ? mats.zifengCrownGlow : mats.zifengFinMat,
          isVeryHigh ? Math.PI : 0
        );
        hBand.position.set(ox, ly, oz);
        group.add(hBand);
      }

      // 3. 顶部阶梯式发光玻璃灯笼塔冠与偏心耸立的【450米超高纯白通信天线尖塔】 (Y = 95.5 -> 132)
      const lanternCrown1 = createCurvedTriangularPrism(5.2, 4.2, 6.5, mats.zifengCrownGlow, Math.PI);
      lanternCrown1.position.set(-1.6, 98.8, -1.4);
      const lanternCrown2 = createCurvedTriangularPrism(3.4, 2.2, 5.2, mats.zifengFinMat, Math.PI);
      lanternCrown2.position.set(-1.8, 104.5, -1.6);
      group.add(lanternCrown1, lanternCrown2);

      // 偏心矗立在西北最高筒顶端的纯白通信桅杆尖塔 (Iconic Off-Center Tall White Mast Antenna)
      const mastBase = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.35, 8.5, 12), mats.whiteMarble);
      mastBase.position.set(-1.8, 111.2, -1.6);
      const mastSpire = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.52, 18.5, 10), mats.whiteMarble);
      mastSpire.position.set(-1.8, 124.5, -1.6);
      const topBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 10), mats.zifengCrownGlow);
      topBeacon.position.set(-1.8, 134.0, -1.6);
      group.add(mastBase, mastSpire, topBeacon);

      // 4. 西南侧明代【鼓楼红墙重檐歇山碑楼】（保持适当间距，构成经典“古今同框”）
      const gulou = new THREE.Group();
      gulou.position.set(-22, 0.4, 20);
      const glBase = new THREE.Mesh(new THREE.BoxGeometry(14.5, 5.5, 9.6), mats.vermilionRed);
      glBase.position.y = 2.75;
      glBase.castShadow = true;
      [-3.8, 0, 3.8].forEach(ax => {
        const arch = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3.4, 10.0), mats.darkDoor);
        arch.position.set(ax, 1.7, 0);
        gulou.add(arch);
      });
      const glHall = new THREE.Mesh(new THREE.BoxGeometry(10.2, 4.0, 6.5), mats.ancientLatticeMat);
      glHall.position.y = 7.5;
      const glRoof1 = createChineseRoof(13.0, 9.2, 1.9, mats.darkGreyTile, false);
      glRoof1.position.y = 9.4;
      const glRoof2 = createChineseRoof(10.5, 7.2, 2.5, mats.darkGreyTile, true);
      glRoof2.position.y = 11.2;
      gulou.add(glBase, glHall, glRoof1, glRoof2);
      group.add(gulou);

      scene.add(group);
    }

    // -------------------------------------------------------------------------
    // 地标十五：【南京南站 (亚洲最大高铁枢纽 · 双重檐京派飞檐斗拱宫殿巨构)】 (X = -10, Z = 315)
    // 1:1 真实建筑形态重塑：
    // - 恢弘体量：主站房宽 116m、纵深 68m、高 30m，连同东西两侧无柱波浪站台雨棚与高架立交总跨度达 260m！
    // - 标志性【双重檐庑殿意象飞檐大屋顶】：下层超深出挑金色藻井底面+银白飞翘屋檐，上层抬升式重檐高侧窗天窗冠顶（内嵌8道纵向蓝晶采光天窗）
    // - 南北立面各 10 根【巨型汉白玉基座 + 朱红分叉四层立体钢斗拱廊柱】，内衬古铜金中式回纹/冰裂纹通透玻璃幕墙与三座朱红宫门进站口
    // - 屋檐正中央高悬高清 CanvasTexture 渲染的鲜红发光书法【“南京南站”】巨型匾额
    // - 二层贯通式高架送客匝道平台 + 东西双环螺旋立交引桥 + 南北中轴镜面水景广场
    // - 下层 28 股道高架站场：4 列动态高速穿梭的【复兴号红神龙 CR400AF】、【复兴号金凤凰 CR400BF】与【和谐号 CRH380B】动车组
    // -------------------------------------------------------------------------
    // 生成南京南站屋顶独立镂空立体大红字【南】【京】【南】【站】单字贴图
    function createNanzhanSingleCharTexture(ch) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, 256, 256);
      ctx.strokeStyle = '#fca5a5';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 240, 240);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = 'rgba(254, 240, 138, 0.9)';
      ctx.shadowBlur = 12;
      ctx.font = 'bold 180px "STKaiti", "KaiTi", "PingFang SC", "Microsoft YaHei", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ch, 128, 132);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    // 生成南京南站正中央开间【通透蓝晶玻璃幕墙】纹理（如实景图中央通透大玻璃窗）
    function createNanzhanCenterGlassTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0f2942');
      grad.addColorStop(0.22, '#1e4e79');
      grad.addColorStop(0.75, '#38bdf8');
      grad.addColorStop(1, '#0c2d48');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      // 顶部深色钢桁架阴影带
      ctx.fillStyle = 'rgba(15, 23, 42, 0.72)';
      ctx.fillRect(0, 0, 512, 96);

      // 细密的银灰玻璃幕墙分格网
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.55)';
      ctx.lineWidth = 3;
      for (let x = 0; x <= 512; x += 64) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
      }
      for (let y = 0; y <= 512; y += 64) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(512, y); ctx.stroke();
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    // 生成南京南站左右两侧开间【香槟金/古铜色横向百叶遮阳格栅幕墙】纹理（1:1还原实景照片两侧金色百叶窗立面！）
    function createNanzhanGoldLouverTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // 顶部深蓝高侧窗带
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, 512, 82);

      // 下部暖香槟金/古铜金百叶基底
      const grad = ctx.createLinearGradient(0, 82, 512, 512);
      grad.addColorStop(0, '#d97706');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(1, '#b45309');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 82, 512, 430);

      // 密集的横向百叶遮阳条纹
      for (let y = 88; y < 512; y += 12) {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, y, 512, 4);
        ctx.fillStyle = '#fde68a';
        ctx.fillRect(0, y + 4, 512, 3);
      }

      // 竖向金色分隔龙骨立柱
      ctx.fillStyle = '#92400e';
      for (let x = 0; x <= 512; x += 128) {
        ctx.fillRect(x - 6, 0, 12, 512);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

    // 生成南京南站平顶屋面【纵向晶蓝采光天窗 + 银白直立锁边金属屋面】纹理
    function createNanzhanRoofTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(0, 0, 1024, 512);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      for (let x = 0; x <= 1024; x += 16) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 512); ctx.stroke();
      }
      for (let row = 0; row < 8; row++) {
        const y = 36 + row * 58;
        ctx.fillStyle = '#0369a1';
        ctx.fillRect(64, y, 896, 26);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 3;
        ctx.strokeRect(64, y, 896, 26);
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }



    scene.add(group);

    return group;
  }
};
