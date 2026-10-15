/**
 * 外部 3D 模型导入贡献模板 (GLTF/GLB External 3D Model Template)
 *
 * 适用于：Blender、3ds Max、Cinema 4D 或 Sketchfab 导出的 3D 模型资产。
 * 
 * 步骤：
 * 1. 将压缩优化后的 .glb 模型（建议 3MB 以内）放入 public/models/ 目录中
 * 2. 复制此模版至 src/landmarks/ 并修改配置
 * 3. 在 src/landmarks/index.js 中注册
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  id: 'your_model_landmark_id',
  name: '景点中文名称',

  async build(scene, ctx) {
    const group = new THREE.Group();
    const loader = new GLTFLoader();

    // 模型相对 public 目录的路径
    const modelPath = './models/your-model.glb';

    try {
      const gltf = await new Promise((resolve, reject) => {
        loader.load(modelPath, resolve, undefined, reject);
      });

      const model = gltf.scene;

      // 调整模型缩放、位置与朝向
      model.scale.setScalar(1.0);
      model.position.set(0, 0, 0); // 沙盘坐标 (X, Y, Z)
      model.rotation.y = 0;

      // 遍历开启阴影投射与接收
      model.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      group.add(model);
    } catch (err) {
      console.warn(`[OpenNanjing3D] 模型加载失败: ${modelPath}`, err);
    }

    scene.add(group);
    return group;
  }
};
