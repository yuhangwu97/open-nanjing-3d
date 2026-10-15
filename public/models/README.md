# 3D 资产存放目录 (3D Models Directory)

此目录用于存放社区贡献的外部 3D 模型资产（例如通过 Blender、3ds Max、Sketchfab、C4D 等导出的模型）。

## 📦 模型格式与规范要求
1. **格式推荐**：`.glb`（优先推荐二进制格式，自包含贴图与材质）或 `.gltf`。
2. **体积控制**：单个景点模型体积建议压缩至 **3MB 以内**（推荐使用 `gltf-pipeline` 或 `draco` 压缩）。
3. **坐标系基准**：
   - 模型中心原点 `(0, 0, 0)` 对应建筑的地基中心底面。
   - 1 单位 = 真实世界约 1 米。
   - 朝向建议以主大门朝向正南（+Z）或依据实景方位放置。
4. **贴图材质**：贴图尺寸推荐 `1024x1024` 或 `512x512`，材质尽量使用 PBR 漫反射与金属粗糙度工作流。

## 🚀 如何在代码中加载你的模型
参考 `templates/gltf-landmark-template.js`，只需将你的 `.glb` 文件放到此目录，并在景点文件中调用：
```javascript
const model = await ctx.loadGLTF('./models/your-landmark.glb');
model.scene.position.set(X, Y, Z);
scene.add(model.scene);
```
