import * as THREE from 'three';

export function createSkyscraperCurtainWallTexture(glassTop = '#0f2942', glassBot = '#1e3a8a', mullionColor = '#cbd5e1', lightColor = 'rgba(254, 240, 138, 0.78)') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      const bg = ctx.createLinearGradient(0, 0, 512, 1024);
      bg.addColorStop(0, glassTop);
      bg.addColorStop(0.5, glassBot);
      bg.addColorStop(1, '#091526');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 1024);

      const cols = 16, rows = 32;
      const cw = 512 / cols, ch = 1024 / rows;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const seed = Math.sin(r * 19.7 + c * 31.3) * 43758.5453;
          const frac = seed - Math.floor(seed);
          if (frac > 0.58) {
            ctx.fillStyle = frac > 0.82 ? lightColor : 'rgba(186, 230, 253, 0.45)';
            ctx.fillRect(c * cw + 3, r * ch + 4, cw - 6, ch - 8);
          } else {
            ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
            ctx.fillRect(c * cw + 2, r * ch + 3, cw - 4, ch - 6);
          }
        }
        // 层间金属腰线 (Floor Spandrel Band)
        ctx.fillStyle = r % 6 === 0 ? '#e2e8f0' : 'rgba(148, 163, 184, 0.55)';
        ctx.fillRect(0, r * ch, 512, r % 6 === 0 ? 4 : 2);
      }

      // 竖向金属窗框龙骨 (Vertical Mullions)
      ctx.strokeStyle = mullionColor;
      ctx.lineWidth = 2;
      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * cw, 0);
        ctx.lineTo(c * cw, 1024);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createAncientLatticeWindowTexture(wallBgHex = '#991b1b', latticeHex = '#7f1d1d', glowHex = '#fef08a') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = wallBgHex;
      ctx.fillRect(0, 0, 512, 256);

      // 上下青石须弥座边线与额枋彩画带
      ctx.fillStyle = '#b45309';
      ctx.fillRect(0, 0, 512, 22);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(0, 20, 512, 5);

      // 4组对开朱红雕花格扇门窗
      const bays = 4;
      const bw = 512 / bays;
      for (let b = 0; b < bays; b++) {
        const x0 = b * bw + 14;
        const w = bw - 28;
        // 内部暖黄宣纸灯火内透
        ctx.fillStyle = glowHex;
        ctx.fillRect(x0, 38, w, 148);

        // 朱红雕花步步锦/菱花窗棂网格
        ctx.strokeStyle = latticeHex;
        ctx.lineWidth = 4;
        ctx.strokeRect(x0, 38, w, 188);
        for (let gx = x0 + 12; gx < x0 + w; gx += 14) {
          ctx.beginPath(); ctx.moveTo(gx, 38); ctx.lineTo(gx, 186); ctx.stroke();
        }
        for (let gy = 54; gy < 186; gy += 16) {
          ctx.beginPath(); ctx.moveTo(x0, gy); ctx.lineTo(x0 + w, gy); ctx.stroke();
        }

        // 下部裙板与鎏金雕花绦环板
        ctx.fillStyle = '#7f1d1d';
        ctx.fillRect(x0, 182, w, 44);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x0 + 8, 188, w - 16, 30);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createShimmeringWaterTexture(baseTop = '#0369a1', baseBot = '#0284c7', glintColor = 'rgba(254, 249, 195, 0.88)', rippleColor = 'rgba(125, 211, 252, 0.65)') {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      const bg = ctx.createLinearGradient(0, 0, 512, 512);
      bg.addColorStop(0, baseTop);
      bg.addColorStop(0.5, baseBot);
      bg.addColorStop(1, baseTop);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 512, 512);

      // 绘制交织的波浪涟漪条带
      for (let i = 0; i < 140; i++) {
        const x = (Math.sin(i * 17.3) * 0.5 + 0.5) * 512;
        const y = (Math.cos(i * 31.7) * 0.5 + 0.5) * 512;
        const w = 18 + (i % 5) * 10;
        const h = 2.5 + (i % 3) * 1.5;
        ctx.fillStyle = rippleColor;
        ctx.beginPath();
        ctx.ellipse(x, y, w, h, (i % 3 - 1) * 0.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // 绘制阳光折射下的“波光粼粼”碎金高光点
      for (let j = 0; j < 95; j++) {
        const gx = (Math.sin(j * 43.1 + 1.7) * 0.5 + 0.5) * 512;
        const gy = (Math.cos(j * 29.3 + 0.9) * 0.5 + 0.5) * 512;
        const gw = 6 + (j % 4) * 5;
        ctx.fillStyle = glintColor;
        ctx.beginPath();
        ctx.ellipse(gx, gy, gw, 1.8, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(16, 4);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createMingBrickWallTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#475569';
      ctx.fillRect(0, 0, 512, 512);

      const rows = 16, cols = 8;
      const rh = 512 / rows, cw = 512 / cols;
      for (let r = 0; r < rows; r++) {
        const offset = (r % 2) * (cw * 0.5);
        for (let c = -1; c <= cols; c++) {
          const x = c * cw + offset;
          const y = r * rh;
          const shade = 64 + ((r * 7 + c * 13) % 26);
          ctx.fillStyle = `rgb(${shade}, ${shade + 8}, ${shade + 18})`;
          ctx.fillRect(x + 2, y + 2, cw - 4, rh - 4);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.strokeRect(x + 1, y + 1, cw - 2, rh - 2);
        }
      }
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(8, 2);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createMasterplanGroundTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 2048;
      const ctx = canvas.getContext('2d');

      // 世界坐标映射至 2600 x 2050 巨幅沙盘: X in [-1320, 1280] (w=2600), Z in [-980, 1070] (d=2050)
      const toU = (x) => ((x - (-1320)) / 2600) * 2048;
      const toV = (z) => ((z - (-980)) / 2050) * 2048;
      const toW = (w) => (w / 2600) * 2048;

      // 1. 细腻自然生态基底渐变
      const bgGrad = ctx.createRadialGradient(toU(20), toV(40), 120, toU(0), toV(45), 1750);
      bgGrad.addColorStop(0, '#34493e');
      bgGrad.addColorStop(0.55, '#28422b');
      bgGrad.addColorStop(1, '#1c3120');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 2048, 2048);

      // 2. 各大地理片区柔和过渡底色
      function drawSoftZone(cx, cz, rx, rz, colorInner, colorOuter) {
        ctx.save();
        ctx.translate(toU(cx), toV(cz));
        ctx.scale(1, (rz / rx) * (2600 / 2050));
        const r = toW(rx);
        const g = ctx.createRadialGradient(0, 0, r * 0.15, 0, 0, r);
        g.addColorStop(0, colorInner);
        g.addColorStop(0.72, colorOuter);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 江北老山森林氧吧深翠底色 (X = -820, Z = -60)
      drawSoftZone(-820, -60, 260, 380, 'rgba(20, 86, 38, 0.94)', 'rgba(26, 72, 38, 0.48)');
      // 江北新城与青奥体育馆文体带底色 (X = -635, Z = 95)
      drawSoftZone(-615, 115, 165, 220, 'rgba(42, 84, 72, 0.88)', 'rgba(36, 68, 58, 0.38)');
      // 河西新城现代CBD蓝灰城市底色 (纪念馆 -> 奥体 -> 青奥双塔)
      drawSoftZone(-210, 65, 125, 360, 'rgba(56, 74, 98, 0.92)', 'rgba(45, 60, 80, 0.45)');
      // 河西滨江风光带翡翠生态岸线
      drawSoftZone(-255, 120, 48, 360, 'rgba(36, 110, 62, 0.90)', 'rgba(36, 92, 52, 0.42)');
      // 金陵古都主城核心区暖石底色 (紫峰—鸡鸣寺—玄武湖—中华门—夫子庙)
      drawSoftZone(45, 25, 225, 290, 'rgba(68, 77, 92, 0.92)', 'rgba(54, 63, 76, 0.45)');
      // 钟山风景区皇家园林苍翠底色 (右移至 X = 395 ~ 560)
      drawSoftZone(495, -15, 255, 280, 'rgba(28, 78, 36, 0.92)', 'rgba(32, 68, 36, 0.45)');
      // 东北临江【栖霞山】红枫森林底色 (X = 790, Z = -415)
      drawSoftZone(790, -395, 195, 165, 'rgba(124, 45, 18, 0.55)', 'rgba(34, 68, 38, 0.42)');
      // 【C位核心】南京南站高铁枢纽礼仪广场底色
      drawSoftZone(0, 365, 185, 145, 'rgba(71, 85, 105, 0.94)', 'rgba(51, 65, 85, 0.48)');
      // 牛首山与江宁方山生态底色
      drawSoftZone(330, 480, 275, 210, 'rgba(40, 80, 44, 0.88)', 'rgba(34, 66, 38, 0.38)');
      // 禄口国际机场空铁枢纽底色
      drawSoftZone(-315, 620, 225, 145, 'rgba(52, 68, 88, 0.90)', 'rgba(42, 56, 72, 0.42)');

      // 3. 沙盘精密测绘经纬暗网格线
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.032)';
      ctx.lineWidth = 1;
      for (let gx = -1280; gx <= 1240; gx += 40) {
        const u = toU(gx);
        ctx.beginPath(); ctx.moveTo(u, 0); ctx.lineTo(u, 2048); ctx.stroke();
      }
      for (let gz = -940; gz <= 1030; gz += 40) {
        const v = toV(gz);
        ctx.beginPath(); ctx.moveTo(0, v); ctx.lineTo(2048, v); ctx.stroke();
      }

      // 4. 在沙盘底图上同步绘制半圆弧形长江深蓝河床与浅水滩涂光晕，增强江水纵深层次感
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.38)';
      ctx.lineWidth = toW(165);
      ctx.beginPath();
      for (let i = 0; i <= 120; i++) {
        const pt = YANGTZE_MAIN_CURVE.getPointAt(i / 120);
        if (i === 0) ctx.moveTo(toU(pt.x), toV(pt.z));
        else ctx.lineTo(toU(pt.x), toV(pt.z));
      }
      ctx.stroke();

      ctx.strokeStyle = '#0369a1';
      ctx.lineWidth = toW(122);
      ctx.stroke();
      ctx.restore();

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createMingXiaolingPlaqueTexture(titleText, bgHex = '#1e3a8a', textHex = '#fde047') {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, 256, 128);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 8;
      ctx.strokeRect(6, 6, 244, 116);
      ctx.fillStyle = textHex;
      ctx.font = 'bold 52px "STKaiti", "KaiTi", "PingFang SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(titleText, 128, 66);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

export function createJimingPlaqueTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 160;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#1e3a8a';
      ctx.fillRect(0, 0, 512, 160);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 10;
      ctx.strokeRect(8, 8, 496, 144);
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 82px "STKaiti", "KaiTi", "PingFang SC", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('古 鸡 鸣 寺', 256, 82);
      const tex = new THREE.CanvasTexture(canvas);
      tex.needsUpdate = true;
      return tex;
    }

export function createManiDomeDiamondTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      // 暖珍珠香槟金/象牙金渐变底色（还原照片左前方圆穹顶温润的香槟金光泽）
      const bg = ctx.createLinearGradient(0, 0, 0, 512);
      bg.addColorStop(0, '#fffbeb');
      bg.addColorStop(0.35, '#f5ebd6');
      bg.addColorStop(0.75, '#e6d5b8');
      bg.addColorStop(1, '#cbb28c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 512);

      // 绘制高密度立体菱形莲花瓣/佛顶发髻网格（每个菱形格带立体受光面、背光面与中心深色镂空螺髻圆孔）
      const cols = 36, rows = 18;
      const cw = 1024 / cols, ch = 512 / rows;

      for (let r = -1; r <= rows; r++) {
        for (let c = -1; c <= cols; c++) {
          const cx = (c + (r % 2) * 0.5) * cw;
          const cy = r * ch;
          const hw = cw * 0.48;
          const hh = ch * 0.92;

          // 菱形外框深古铜凹槽
          ctx.beginPath();
          ctx.moveTo(cx, cy - hh);
          ctx.lineTo(cx + hw, cy);
          ctx.lineTo(cx, cy + hh);
          ctx.lineTo(cx - hw, cy);
          ctx.closePath();
          ctx.fillStyle = '#eaddc5';
          ctx.fill();
          ctx.lineWidth = 2.6;
          ctx.strokeStyle = '#785c38';
          ctx.stroke();

          // 上半受光亮面（珍珠白金高光）
          ctx.beginPath();
          ctx.moveTo(cx, cy - hh * 0.85);
          ctx.lineTo(cx + hw * 0.82, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - hw * 0.82, cy);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255, 252, 240, 0.82)';
          ctx.fill();

          // 下半立体阴影面（暖古铜金）
          ctx.beginPath();
          ctx.moveTo(cx, cy + hh * 0.85);
          ctx.lineTo(cx + hw * 0.82, cy);
          ctx.lineTo(cx, cy);
          ctx.lineTo(cx - hw * 0.82, cy);
          ctx.closePath();
          ctx.fillStyle = 'rgba(161, 124, 78, 0.45)';
          ctx.fill();

          // 菱形格中心深色镂空花瓣孔洞（赋予实景图标志性的菠萝格/莲花瓣立体颗粒感！）
          ctx.beginPath();
          ctx.ellipse(cx, cy + hh * 0.08, hw * 0.34, hh * 0.32, 0, 0, Math.PI * 2);
          ctx.fillStyle = '#5c4328';
          ctx.fill();

          // 螺髻顶部金色珠点
          ctx.beginPath();
          ctx.arc(cx, cy - hh * 0.18, hw * 0.18, 0, Math.PI * 2);
          ctx.fillStyle = '#fef08a';
          ctx.fill();
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createKasayaCopperCanopyTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');

      // 1. 暖香槟玫瑰金 / 浅铜金色金属基底（严格还原实景图右侧大穹顶优雅的浅玫瑰铜金色调 #e6b89c ~ #c98a6b）
      const bg = ctx.createRadialGradient(380, 320, 60, 512, 512, 760);
      bg.addColorStop(0, '#f5d6c3');
      bg.addColorStop(0.42, '#e2b195');
      bg.addColorStop(0.78, '#c98e70');
      bg.addColorStop(1, '#a66c4e');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 1024, 1024);

      // 2. 全穹顶细密蜂窝/菱形镂空小网眼肌理
      const step = 22;
      for (let y = 0; y < 1024; y += step) {
        const offset = (Math.floor(y / step) % 2) * (step * 0.5);
        for (let x = -step; x < 1024 + step; x += step) {
          const px = x + offset;
          // 细密深棕镂空网孔
          ctx.fillStyle = 'rgba(72, 38, 24, 0.62)';
          ctx.beginPath();
          ctx.moveTo(px, y - 6.5);
          ctx.lineTo(px + 6.5, y);
          ctx.lineTo(px, y + 6.5);
          ctx.lineTo(px - 6.5, y);
          ctx.closePath();
          ctx.fill();
        }
      }

      // 3. 实景图右侧大穹顶最核心视觉标志：从左下舌尖向右上扇形分叉舒展的【放射状菩提叶脉 / 佛手树枝状大镂空花纹】！
      const originX = 360, originY = 780;
      const branchAngles = [-2.15, -1.85, -1.58, -1.32, -1.06, -0.82, -0.58];

      branchAngles.forEach((ang, bIdx) => {
        const len = 360 + (bIdx % 3) * 65;
        // 绘制主叶脉旁成排的大尺寸水滴/菱形镂空窗洞（还原照片中树枝状深色大镂空肌理）
        const numCells = 14;
        for (let k = 2; k <= numCells; k++) {
          const t = k / numCells;
          const r = t * len;
          const curveBend = Math.sin(t * Math.PI) * (bIdx - 3) * 18;
          const bx = originX + Math.cos(ang) * r + Math.cos(ang + Math.PI / 2) * curveBend;
          const by = originY + Math.sin(ang) * r + Math.sin(ang + Math.PI / 2) * curveBend;

          const cellW = (1 - Math.abs(t - 0.55) * 1.1) * 20;
          const cellH = (1 - Math.abs(t - 0.55) * 1.1) * 10;
          if (cellW > 4) {
            ctx.save();
            ctx.translate(bx, by);
            ctx.rotate(ang);
            // 叶脉两侧对称的大镂空孔洞
            [-14, 14].forEach(lat => {
              ctx.fillStyle = '#3b1d11';
              ctx.beginPath();
              ctx.ellipse(0, lat, cellW, cellH, 0.25 * Math.sign(lat), 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#f5d6c3';
              ctx.lineWidth = 2.2;
              ctx.stroke();
            });
            // 叶脉主干浅玫瑰金实心肋带
            ctx.fillStyle = '#f2cab2';
            ctx.fillRect(-cellW * 0.9, -4.5, cellW * 1.8, 9);
            ctx.restore();
          }
        }
      });

      // 4. 叠加流线型金属网壳主肋条高光
      ctx.strokeStyle = 'rgba(255, 237, 224, 0.55)';
      ctx.lineWidth = 2.0;
      for (let i = -1024; i <= 2048; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 1024);
        ctx.quadraticCurveTo(i + 180, 512, i + 460, 0);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(i, 1024);
        ctx.quadraticCurveTo(i - 160, 512, i - 420, 0);
        ctx.stroke();
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.anisotropy = 8;
      tex.needsUpdate = true;
      return tex;
    }

export function createNanzhanSingleCharTexture(ch) {
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

export function createNanzhanCenterGlassTexture() {
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

export function createNanzhanGoldLouverTexture() {
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

export function createNanzhanRoofTexture() {
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

