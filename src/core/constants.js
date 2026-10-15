import * as THREE from 'three';

// ============================================================================
// 全域沙盘坐标常量与地形高程计算工具
// ============================================================================

export const ZX_OFFSET_X = 525; // 中山陵与紫金山坐标中心 X = 525, Z = -118
export const STAIR_START_Z = -48;
export const STAIR_END_Z = -112;
export const STAIR_START_Y = 4.5;
export const STAIR_END_Y = 28.0;
export const SEGMENTS = 10;
export const SEG_DZ = (STAIR_START_Z - STAIR_END_Z) / SEGMENTS;
export const SEG_DY = (STAIR_END_Y - STAIR_START_Y) / SEGMENTS;
export const STAIR_RUN = 4.4;
export const PLAT_LEN = 2.0;
export const STEPS_PER_SEG = 8;
export const MEILING_CENTER_Z = 82; // 美龄宫右移至 X = 545, Z = 82

export const autumnGolds = [0xd97706, 0xf59e0b, 0xea580c, 0xb45309];

export function getAxisElevation(z) {
  if (z >= 8) return 0;
  if (z >= -22) return ((8 - z) / 30) * 2.0;
  if (z >= -32) return 2.0;
  if (z >= -36) return 2.0 + ((-32 - z) / 4) * 2.5;
  if (z >= STAIR_START_Z) return STAIR_START_Y;
  if (z >= STAIR_END_Z) {
    const dist = STAIR_START_Z - z;
    const segIdx = Math.min(SEGMENTS - 1, Math.floor(dist / SEG_DZ));
    const localZ = dist - segIdx * SEG_DZ;
    const baseSegY = STAIR_START_Y + segIdx * SEG_DY;
    if (localZ <= STAIR_RUN) {
      const stepIdx = Math.min(STEPS_PER_SEG, Math.ceil((localZ / STAIR_RUN) * STEPS_PER_SEG));
      return baseSegY + (stepIdx / STEPS_PER_SEG) * SEG_DY;
    }
    return baseSegY + SEG_DY;
  }
  return STAIR_END_Y;
}

export function getStairHalfWidth(z) {
  const t = THREE.MathUtils.clamp((STAIR_START_Z - z) / (STAIR_START_Z - STAIR_END_Z), 0, 1);
  return 10.5 + Math.pow(t, 1.15) * 9.5;
}

// 多频自然山脉分形噪声辅助函数，赋予紫金山真实险峻的山脊线、岩壁冲沟与峰峦起伏
export function ridgeNoise(x, z) {
  const n1 = Math.sin(x * 0.035 + z * 0.028) * Math.cos(x * 0.024 - z * 0.038);
  const n2 = (1.0 - Math.abs(Math.sin(x * 0.065 - z * 0.052))) * 0.65;
  const n3 = Math.sin(x * 0.13 + z * 0.11) * 0.25;
  return n1 * 0.55 + n2 + n3;
}

export function getPurpleMountainHeight(x, z) {
  let h = 0;

  // 1. 北高峰 / 头陀岭主峰 (X = 528, Z = -192, 峰值 106)
  const dx1 = (x - 528) / 1.25, dz1 = (z - (-192)) / 0.85;
  const r1 = Math.hypot(dx1, dz1);
  h += 102 * Math.exp(-Math.pow(r1 / 56, 1.85));

  // 2. 西峰：第二峰二茅峰 · 紫金山天文台山脊 (X = 442, Z = -148, 峰值 68)
  const dx2 = (x - 442) / 1.15, dz2 = (z - (-148)) / 0.88;
  const r2 = Math.hypot(dx2, dz2);
  h += 66 * Math.exp(-Math.pow(r2 / 46, 1.8));

  // 3. 东峰：第三峰三茅峰与小茅山连绵山脊 (X = 608, Z = -162, 峰值 74)
  const dx3 = (x - 608) / 1.22, dz3 = (z - (-162)) / 0.88;
  const r3 = Math.hypot(dx3, dz3);
  h += 72 * Math.exp(-Math.pow(r3 / 48, 1.8));

  // 4. 东西向连绵龙脊鞍部
  if (x > 405 && x < 645 && z < -85 && z > -245) {
    const spineZ = -165 - Math.sin(((x - 430) / 180) * Math.PI) * 26;
    const distSpine = Math.abs(z - spineZ);
    const alongX = Math.sin(THREE.MathUtils.clamp((x - 405) / 240, 0, 1) * Math.PI);
    h += 32 * alongX * Math.exp(-(distSpine * distSpine) / (2 * 32 * 32));
  }

  if (h > 2.0) {
    const rn = ridgeNoise(x, z);
    const gully = Math.sin((x - 525) * 0.09 + z * 0.04) * Math.cos(z * 0.08);
    h += (rn * 8.5 + gully * 3.8) * Math.min(1.0, h / 28.0);
  }

  // 中山陵南麓缓坡自然衔接
  const relX = Math.abs(x - ZX_OFFSET_X);
  if (z > -148 && z < 20 && relX < 54) {
    const stairY = Math.max(0, getAxisElevation(z) - 0.8);
    const innerW = z < -112 ? 25 : getStairHalfWidth(z) + 2.5;
    if (relX <= innerW) {
      h = Math.min(h, stairY);
    } else {
      const blend = THREE.MathUtils.smoothstep(relX, innerW, 54);
      h = THREE.MathUtils.lerp(Math.min(h, stairY + 2.0), h, blend);
    }
  }

  // 明孝陵独龙阜与石象路山麓平缓谷地 (右移至 X = 395)
  if (x > 350 && x < 448 && z > -55 && z < 65) {
    const distMX = Math.hypot(x - 395, z - (-5));
    if (distMX < 44) {
      const tBlend = THREE.MathUtils.smoothstep(distMX, 22, 44);
      h = THREE.MathUtils.lerp(Math.min(h, 1.0), h, tBlend);
    }
  }

  return Math.max(0, h);
}
