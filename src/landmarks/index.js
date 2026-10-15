// 南京全域地标 3D 模块注册中心 (Landmark Registry)
// 社区贡献新地标规范：
// 1. 在 src/landmarks/ 目录下新建 your-landmark.js
// 2. 导出包含 id, name, build(scene, ctx) 的默认对象
// 3. 在本文件中 import 并加入 landmarks 列表

import bridge from './bridge.js';
import fifthbridge from './fifth-bridge.js';
import yuzui from './yuzui.js';
import qixiashan from './qixiashan.js';
import aoti from './aoti.js';
import qingao from './qingao.js';
import memorial from './memorial.js';
import zhongshan from './zhongshan.js';
import meiling from './meiling.js';
import mingxiaoling from './mingxiaoling.js';
import nanbo from './nanbo.js';
import fuzimiao from './fuzimiao.js';
import xuanwu from './xuanwu.js';
import jiming from './jiming.js';
import niushoushan from './niushoushan.js';
import zifeng from './zifeng.js';
import nanzhan from './nanzhan.js';
import qingao_arena from './qingao-arena.js';
import citywall from './citywall.js';
import laoshan from './laoshan.js';
import fangshan from './fangshan.js';
import lukou_airport from './lukou-airport.js';

export const landmarks = [
  bridge,
  fifthbridge,
  yuzui,
  qixiashan,
  aoti,
  qingao,
  memorial,
  zhongshan,
  meiling,
  mingxiaoling,
  nanbo,
  fuzimiao,
  xuanwu,
  jiming,
  niushoushan,
  zifeng,
  nanzhan,
  qingao_arena,
  citywall,
  laoshan,
  fangshan,
  lukou_airport,
];

export function loadAllLandmarks(scene, ctx) {
  const loaded = {};
  landmarks.forEach(lm => {
    try {
      loaded[lm.id] = lm.build(scene, ctx);
    } catch (err) {
      console.error(`[OpenNanjing3D] 景点构建失败: ${lm.name} (${lm.id})`, err);
    }
  });
  return loaded;
}
