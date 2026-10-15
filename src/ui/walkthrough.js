import * as THREE from 'three';
import {
  ZX_OFFSET_X,
  STAIR_START_Z,
  STAIR_END_Z,
  STAIR_END_Y,
  getAxisElevation
} from '../core/constants.js';

export function setupWalkthrough(camera, controls, ctx) {
  let isPlayingWalk = false;
  let walkT = 0;
  const WALK_DURATION = 26.0;

  const walkBtnToggle = document.getElementById('btn-walk-toggle');
  const walkIcon = document.getElementById('walk-icon');
  const walkBtnText = document.getElementById('walk-btn-text');
  const walkSlider = document.getElementById('walk-slider');
  const walkPercent = document.getElementById('walk-percent');
  const walkStageLabel = document.getElementById('walk-stage-label');
  const walkStepCounter = document.getElementById('walk-step-counter');

  function evaluateWalkPose(t) {
    const eyeHeight = 1.68;
    const AX = ZX_OFFSET_X;

    if (t <= 0.88) {
      const u = t / 0.88;
      const z = THREE.MathUtils.lerp(18, -114, u);
      const groundY = getAxisElevation(z);

      let xOffset = 0;
      if (z < -34 && z > -48) {
        xOffset = Math.sin(((z - (-34)) / (-14)) * Math.PI) * 2.3;
      }

      const isOnStairs = (z < STAIR_START_Z && z > STAIR_END_Z);
      const stepBob = Math.sin(u * 135) * (isOnStairs ? 0.13 : 0.04);
      const camPos = new THREE.Vector3(AX + xOffset, groundY + eyeHeight + stepBob, z);

      const lookZ = Math.max(-130, z - 22);
      const lookGroundY = getAxisElevation(lookZ);
      const lookTarget = new THREE.Vector3(AX, lookGroundY + (isOnStairs ? 3.0 : 2.4), lookZ);
      return { camPos, lookTarget, z };
    } else {
      const turnU = (t - 0.88) / 0.12;
      const easeTurn = 1 - Math.pow(1 - turnU, 2);
      const camPos = new THREE.Vector3(
        AX + Math.sin(easeTurn * Math.PI) * 3.0,
        STAIR_END_Y + eyeHeight + easeTurn * 0.5,
        THREE.MathUtils.lerp(-114, -111, easeTurn)
      );
      const angle = easeTurn * Math.PI;
      const lookDist = 42;
      const lookTarget = new THREE.Vector3(
        AX + Math.sin(angle) * lookDist * 0.3,
        THREE.MathUtils.lerp(33.0, 6.0, easeTurn),
        camPos.z - Math.cos(angle) * lookDist
      );
      return { camPos, lookTarget, z: camPos.z };
    }
  }

  function applyWalkProgress(t) {
    walkT = THREE.MathUtils.clamp(t, 0, 1);
    const { camPos, lookTarget, z } = evaluateWalkPose(walkT);
    camera.position.copy(camPos);
    controls.target.copy(lookTarget);

    if (walkSlider) walkSlider.value = Math.round(walkT * 1000);
    if (walkPercent) walkPercent.textContent = `${Math.round(walkT * 100)}%`;

    let stageText = '当前位置：孝经鼎与博爱坊广场';
    let stepNum = 0;
    if (z > 4) { stageText = '穿过【博爱坊】石牌坊'; stepNum = 6; }
    else if (z > -22) { stageText = '漫步【墓道】苍松翠柏'; stepNum = 8 + Math.round(((4 - z) / 26) * 32); }
    else if (z > -34) { stageText = '穿过【陵门】天下为公'; stepNum = 40; }
    else if (z > -48) { stageText = '绕行【碑亭】赑屃功德碑'; stepNum = 54; }
    else if (z > -112 && walkT <= 0.88) {
      const r = (-48 - z) / 64;
      const pIdx = Math.min(10, Math.floor(r * 10) + 1);
      stageText = `攀登 392 级石阶 (第 ${pIdx}/10 段 · 仰视只见石阶)`;
      stepNum = Math.min(392, 54 + Math.round(r * 338));
    } else {
      stageText = '抵达【祭堂】双华表 · 回首俯瞰十层白玉平台';
      stepNum = 392;
    }
    if (walkStageLabel) walkStageLabel.textContent = stageText;
    if (walkStepCounter) walkStepCounter.textContent = `${stepNum} / 392 级`;
  }

  function setWalkPlaying(play) {
    isPlayingWalk = play;
    if (play) {
      if (ctx && ctx.stopTween) ctx.stopTween();
      if (walkT >= 0.995) walkT = 0;
      if (walkIcon) walkIcon.textContent = '⏸';
      if (walkBtnText) walkBtnText.textContent = '暂停第一人称登陵漫游';
    } else {
      if (walkIcon) walkIcon.textContent = '▶';
      if (walkBtnText) walkBtnText.textContent = walkT > 0 && walkT < 0.99 ? '继续第一人称登陵漫游' : '开启第一人称登陵漫游 (392级石阶)';
    }
  }

  if (walkBtnToggle) walkBtnToggle.addEventListener('click', () => setWalkPlaying(!isPlayingWalk));
  if (walkSlider) {
    walkSlider.addEventListener('input', (e) => {
      if (isPlayingWalk) setWalkPlaying(false);
      if (ctx && ctx.stopTween) ctx.stopTween();
      applyWalkProgress(parseFloat(e.target.value) / 1000);
    });
  }

  if (ctx && ctx.addUpdater) {
    ctx.addUpdater((dt) => {
      if (isPlayingWalk) {
        const nextT = walkT + dt / WALK_DURATION;
        if (nextT >= 1.0) {
          applyWalkProgress(1.0);
          setWalkPlaying(false);
        } else {
          applyWalkProgress(nextT);
        }
      }
    });
  }

  return {
    isPlaying: () => isPlayingWalk,
    setPlaying: setWalkPlaying,
    applyProgress: applyWalkProgress
  };
}
