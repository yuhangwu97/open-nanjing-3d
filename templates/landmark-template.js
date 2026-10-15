/**
 * 南京景点 3D 参数化建模模板 (Landmark Procedural Template)
 *
 * 使用说明：
 * 1. 复制本文件到 src/landmarks/ 目录下，重命名为你的景点英文标识（如 presidential-palace.js）
 * 2. 在 src/landmarks/index.js 中导入并加入 landmarks 数组
 * 3. 在 src/data/spots.js 中补充景点游览数据（门票、最佳观赏时段、游览贴士、摄影机位）
 */

import * as THREE from 'three';
import { mats } from '../core/materials.js';
import {
  sharedGeos,
  createChineseRoof,
  createBalustradeSegment,
  createWutongTree,
  createChinesePine,
  createRedMapleTree
} from '../core/geo-builder.js';

export default {
  // 必须与 src/data/spots.js 中的唯一 id 保持一致
  id: 'your_landmark_id',
  name: '景点中文名称',

  /**
   * 构建 3D 实体模型
   * @param {THREE.Scene} scene - Three.js 场景对象
   * @param {Object} ctx - 运行环境上下文
   * @param {Function} ctx.addUpdater - 注册 60FPS 每帧动态更新函数 (dt, elapsed) => {}
   */
  build(scene, ctx) {
    const group = new THREE.Group();

    // 1. 设置景点在南京沙盘中的参考中心坐标 (X, Z)
    // 提示：南京长江大桥约在 (-145, -315)，中山陵在 (525, -118)，紫峰大厦在 (265, 85)，新街口在 (15, 65)
    const centerX = 0;
    const centerZ = 0;
    group.position.set(centerX, 0, centerZ);

    // 2. 构建建筑地基台阶 / 广场
    const podiumGeo = new THREE.BoxGeometry(40, 1.2, 30);
    const podium = new THREE.Mesh(podiumGeo, mats.whiteMarble);
    podium.position.y = 0.6;
    podium.castShadow = true;
    podium.receiveShadow = true;
    group.add(podium);

    // 3. 构建主体建筑群（支持传统古建飞檐、现代玻璃幕墙等）
    const mainBody = new THREE.Mesh(
      new THREE.BoxGeometry(28, 12, 18),
      mats.concreteBeige
    );
    mainBody.position.y = 7.2;
    mainBody.castShadow = true;
    group.add(mainBody);

    // 4. 添加中式古建屋顶 (使用内置生成器)
    const roof = createChineseRoof(
      32,                     // 宽度
      22,                     // 进深
      5.5,                    // 屋脊高度
      2.8,                    // 飞檐悬挑宽度
      mats.glazedYellowRoof,  // 屋顶琉璃瓦材质 (如 mats.glazedYellowRoof / glazedBlueTile)
      true                    // 是否为重檐歇山顶 (true: 歇山顶 / false: 庑殿顶)
    );
    roof.position.y = 13.2;
    group.add(roof);

    // 5. 搭配周边绿化园林 (梧桐、松柏、红枫等)
    for (let i = 0; i < 6; i++) {
      const tree = createChinesePine(1.2, i);
      tree.position.set(-18 + i * 7, 1.2, 16);
      group.add(tree);
    }

    // 6. 如果包含动态物体（如喷泉、转动风车、巡航水禽等），可注册动态更新器：
    /*
    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
        // 每帧执行的动画逻辑
      });
    }
    */

    scene.add(group);
    return group;
  }
};
