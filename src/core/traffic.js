import * as THREE from 'three';
import { mats } from './materials.js';

    export function buildCityTrafficAndPedestrians(scene, mats) {
      const animatedCityCars = [];
      const animatedPedestrians = [];
      const trafficGroup = new THREE.Group();

      const roadAsphaltMat = new THREE.MeshStandardMaterial({ color: 0x293548, roughness: 0.85 });
      const sidewalkSlateMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.65 });
      const doubleYellowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const laneDashMat = new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.65 });

      // 1. 构建统一的 3D 实体城市路网网格（含中央双黄线柏油机动车道与两侧浅灰人行道）
      CITY_ROAD_SEGMENTS.forEach((seg) => {
        const vec = new THREE.Vector3().subVectors(seg.p2, seg.p1);
        const len = vec.length();
        const mid = new THREE.Vector3().addVectors(seg.p1, seg.p2).multiplyScalar(0.5);
        const rotY = Math.atan2(vec.x, vec.z);

        const roadUnit = new THREE.Group();
        roadUnit.position.set(mid.x, 0, mid.z);
        roadUnit.rotation.y = rotY;

        // 柏油机动车道 (宽 9.4m)
        const asphalt = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.16, len + 2.0), roadAsphaltMat);
        asphalt.position.y = 0.08;
        asphalt.receiveShadow = true;
        roadUnit.add(asphalt);

        // 中央双黄线 (两条平行实线)
        [-0.22, 0.22].forEach(yx => {
          const yLine = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, len), doubleYellowMat);
          yLine.position.set(yx, 0.09, 0);
          roadUnit.add(yLine);
        });

        // 机动车道两侧白色虚线分道线
        for (let z = -len * 0.46; z <= len * 0.46; z += 10) {
          [-2.35, 2.35].forEach(lx => {
            const dash = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.18, 4.2), laneDashMat);
            dash.position.set(lx, 0.09, z);
            roadUnit.add(dash);
          });
        }

        // 两侧抬高式浅灰花岗岩人行道 (宽 2.2m, 位于 X = ±5.8m)
        [-5.8, 5.8].forEach(sx => {
          const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.28, len + 2.4), sidewalkSlateMat);
          sidewalk.position.set(sx, 0.14, 0);
          sidewalk.receiveShadow = true;
          roadUnit.add(sidewalk);
        });

        trafficGroup.add(roadUnit);
      });

      // 2. 构建精致 3D 城市汽车与公交车模型，100% 严格行驶在 CITY_ROAD_SEGMENTS 机动车道内！
      const carPalette = [0xef4444, 0x3b82f6, 0xf59e0b, 0x10b981, 0xf8fafc, 0x8b5cf6, 0x06b6d4];
      const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
      const taillightMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const cabinGlassMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.2, metalness: 0.8 });

      function createRoadVehicle(isBus, colorHex) {
        const veh = new THREE.Group();
        const bodyMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.3, metalness: 0.4 });
        if (isBus) {
          const busBody = new THREE.Mesh(new THREE.BoxGeometry(1.7, 1.35, 4.6), bodyMat);
          busBody.position.y = 0.85;
          busBody.castShadow = true;
          const busWin = new THREE.Mesh(new THREE.BoxGeometry(1.76, 0.55, 4.1), mats.warmWindowGlow);
          busWin.position.y = 1.05;
          const roofAc = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.22, 2.4), mats.whiteMarble);
          roofAc.position.y = 1.62;
          veh.add(busBody, busWin, roofAc);
        } else {
          const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.58, 3.0), bodyMat);
          chassis.position.y = 0.48;
          chassis.castShadow = true;
          const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.48, 1.65), cabinGlassMat);
          cabin.position.set(0, 0.92, -0.15);
          veh.add(chassis, cabin);
        }
        const halfL = isBus ? 2.32 : 1.52;
        [-0.48, 0.48].forEach(lx => {
          const hl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.1), headlightMat);
          hl.position.set(lx, 0.52, halfL);
          const tl = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.18, 0.1), taillightMat);
          tl.position.set(lx, 0.52, -halfL);
          veh.add(hl, tl);
        });
        return veh;
      }

      // 将 CITY_ROAD_SEGMENTS 与南京南站二层高架落客车道统一纳入机动车道发车系统
      const allMotorCorridors = [
        ...CITY_ROAD_SEGMENTS.map(s => ({ p1: s.p1.clone().setY(0.16), p2: s.p2.clone().setY(0.16), count: s.carCount, speed: s.speed, laneOffset: 2.35 })),
        { p1: new THREE.Vector3(-68, 9.75, 328.6), p2: new THREE.Vector3(68, 9.75, 328.6), count: 6, speed: 18, laneOffset: 1.8 }
      ];

      allMotorCorridors.forEach((cor, cIdx) => {
        const dirVec = cor.p2.clone().sub(cor.p1).normalize();
        const rightVec = new THREE.Vector3(-dirVec.z, 0, dirVec.x);
        const rotFwd = Math.atan2(dirVec.x, dirVec.z);
        const rotBwd = rotFwd + Math.PI;
        const segDist = cor.p1.distanceTo(cor.p2);

        for (let i = 0; i < cor.count; i++) {
          const forward = i % 2 === 0;
          const isBus = i % 5 === 0;
          const veh = createRoadVehicle(isBus, carPalette[(cIdx + i) % carPalette.length]);
          const laneShift = rightVec.clone().multiplyScalar(forward ? cor.laneOffset : -cor.laneOffset);
          const startPos = cor.p1.clone().add(laneShift);
          const endPos = cor.p2.clone().add(laneShift);
          veh.rotation.y = forward ? rotFwd : rotBwd;
          trafficGroup.add(veh);

          animatedCityCars.push({
            mesh: veh,
            start: forward ? startPos : endPos,
            end: forward ? endPos : startPos,
            u: (i / cor.count + cIdx * 0.13) % 1.0,
            speed: (cor.speed + (i % 3) * 2.5) / segDist
          });
        }
      });

      // 3. 构建全城 3D 行人系统，100% 严格行走在：
      // (A) CITY_ROAD_SEGMENTS 两侧浅灰人行道 (lateral = ±5.8m)
      // (B) 夫子庙 66m 天下文枢大广场 (X = 145, Z = 177.5)
      // (C) 古鸡鸣寺樱花大道人行道 (X = -5.2 / +4.2, Z = -73 ~ -33)
      // (D) 中山陵墓道 (X = 522 / 528, Z = 16 ~ -24)
      // (E) 南京眼步行桥面及青奥步廊 (Z = 140)
      const headGeo = new THREE.SphereGeometry(0.28, 8, 8);
      const torsoGeo = new THREE.CylinderGeometry(0.24, 0.34, 1.05, 8);
      const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.6 });
      const clothColors = [0xef4444, 0x3b82f6, 0x10b981, 0xf59e0b, 0xec4899, 0x8b5cf6, 0xf8fafc, 0x06b6d4];
      const clothMats = clothColors.map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6 }));

      function createPedestrian(cIdx) {
        const p = new THREE.Group();
        const torso = new THREE.Mesh(torsoGeo, clothMats[cIdx % clothMats.length]);
        torso.position.y = 0.55;
        torso.castShadow = true;
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.y = 1.28;
        p.add(torso, head);
        p.scale.setScalar(1.15);
        return p;
      }

      const pedestrianWalkways = [];

      // (A) 将每一条城市道路两侧的人行道 (offset = ±5.8m, Y = 0.28) 注册为严格的行人步道
      CITY_ROAD_SEGMENTS.forEach((seg) => {
        const dirVec = seg.p2.clone().sub(seg.p1).normalize();
        const rightVec = new THREE.Vector3(-dirVec.z, 0, dirVec.x);
        [-5.8, 5.8].forEach(sideOffset => {
          const shift = rightVec.clone().multiplyScalar(sideOffset);
          pedestrianWalkways.push({
            p1: seg.p1.clone().add(shift).setY(0.28),
            p2: seg.p2.clone().add(shift).setY(0.28),
            count: Math.max(3, Math.floor(seg.pedCount * 0.5))
          });
        });
      });

      // (B) 夫子庙 66m 宽天下文枢礼仪大广场 & 泮池步道 (X = 145, Z = 195)
      pedestrianWalkways.push(
        { p1: new THREE.Vector3(118, 0.95, 177.5), p2: new THREE.Vector3(172, 0.95, 177.5), count: 14 },
        { p1: new THREE.Vector3(138, 0.96, 187.5), p2: new THREE.Vector3(138, 0.96, 168.0), count: 8 },
        { p1: new THREE.Vector3(152, 0.96, 187.5), p2: new THREE.Vector3(152, 0.96, 168.0), count: 8 },
        { p1: new THREE.Vector3(115, 0.85, 189.2), p2: new THREE.Vector3(175, 0.85, 189.2), count: 10 }
      );

      // (C) 古鸡鸣寺樱花大道两侧人行道（位于玄武湖左后方 JX = 105, JZ = -245, cherrySidewalkL/R at X = 114.8 & 124.2）
      pedestrianWalkways.push(
        { p1: new THREE.Vector3(114.8, 0.35, -263), p2: new THREE.Vector3(114.8, 0.35, -223), count: 8 },
        { p1: new THREE.Vector3(124.2, 0.35, -263), p2: new THREE.Vector3(124.2, 0.35, -223), count: 8 }
      );

      // (D) 中山陵博爱坊广场与墓道 (ZX_OFFSET_X = 525)
      pedestrianWalkways.push(
        { p1: new THREE.Vector3(522.2, 0.25, 15), p2: new THREE.Vector3(522.2, 2.0, -24), count: 10 },
        { p1: new THREE.Vector3(527.8, 0.25, 15), p2: new THREE.Vector3(527.8, 2.0, -24), count: 10 }
      );

      // (E) 南京眼步行桥面与青奥中轴步廊 (Z = 140)
      pedestrianWalkways.push(
        { p1: new THREE.Vector3(-318, 9.3, 140),  p2: new THREE.Vector3(-266, 9.3, 140),  count: 10 },
        { p1: new THREE.Vector3(-242, 0.45, 140), p2: new THREE.Vector3(-198, 0.45, 140), count: 10 }
      );

      pedestrianWalkways.forEach((wk, wIdx) => {
        const dist = wk.p1.distanceTo(wk.p2);
        const dirVec = wk.p2.clone().sub(wk.p1).normalize();
        const rightVec = new THREE.Vector3(-dirVec.z, 0, dirVec.x);
        for (let i = 0; i < wk.count; i++) {
          const ped = createPedestrian(wIdx * 3 + i);
          trafficGroup.add(ped);
          const latShift = rightVec.clone().multiplyScalar(((i % 3) - 1) * 0.42);
          animatedPedestrians.push({
            mesh: ped,
            p1: wk.p1.clone().add(latShift),
            p2: wk.p2.clone().add(latShift),
            u: (i / wk.count + wIdx * 0.17) % 1.0,
            dir: i % 2 === 0 ? 1 : -1,
            speed: (2.8 + (i % 3) * 0.7) / dist,
            phase: i * 1.1
          });
        }
      });

      scene.add(trafficGroup);
      return { animatedCityCars, animatedPedestrians };
    }

export function setupTraffic(scene, mats, ctx) {
  const data = buildCityTrafficAndPedestrians(scene, mats);
  if (ctx && ctx.addUpdater && data) {
    ctx.addUpdater((dt, elapsed) => {
      if (data.animatedCityCars) {
        data.animatedCityCars.forEach(car => {
          car.u = (car.u + car.speed * dt) % 1.0;
          car.mesh.position.lerpVectors(car.start, car.end, car.u);
        });
      }
      if (data.animatedPedestrians) {
        data.animatedPedestrians.forEach(ped => {
          ped.u += ped.dir * ped.speed * dt;
          if (ped.u > 1.0) { ped.u = 1.0; ped.dir = -1; }
          if (ped.u < 0.0) { ped.u = 0.0; ped.dir = 1; }
          ped.mesh.position.lerpVectors(ped.p1, ped.p2, ped.u);
          ped.mesh.position.y += Math.abs(Math.sin(elapsed * 7.5 + ped.phase)) * 0.18;
        });
      }
    });
  }
}
