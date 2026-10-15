# 🤝 Open Nanjing 3D 贡献者指南 (Contributing Guide)

欢迎加入 **Open Nanjing 3D (南京全域景点 3D 沙盘)** 开源项目！无论你是前端工程师、3D 开发者（Three.js / WebGL）、数字建模师（Blender / 3ds Max / C4D）、文旅地理学者还是南京本地文化爱好者，我们都非常期待你的加入！

---

## 🏗️ 架构概览

本项目采用解耦、插拔式的插件化设计，每个景点都是一个独立的模块：

```text
src/
├── core/                  # 3D 底座引擎 (地形、水系、材质库、公用几何构件、光照系统)
│   ├── constants.js       # 坐标系统常数与山脉高程方程
│   ├── materials.js       # 材质库、昼夜自发光材质、树冠季节颜色
│   ├── geo-builder.js     # 共享古建构件：斗拱、飞檐、重檐、琉璃瓦、各类名木
│   ├── terrain.js         # 2600x2050 巨幅沙盘底座
│   ├── yangtze.js         # 半圆弧浩瀚长江、巡航船队、粼粼波光与碎金粒子
│   ├── traffic.js         # 全城干道机动车、公交车、行人漫步与复兴号高铁
│   └── environment.js     # 动态天空流云、深秋银杏红枫飘落粒子、昼夜光影系统
├── data/
│   ├── spots.js           # 22+ 大景点导览元数据库 (经纬度、门票、避坑贴士、机位)
│   ├── routes.js          # 5 条主题路线规划 (空铁名山线、钟山文博线、河西滨江线等)
│   └── wishlist.js        # 南京 11 区待建景点认领心愿单
├── landmarks/             # 🌟 景点独立模块目录！每个景点一个文件
│   ├── index.js           # 景点自动注册中心
│   ├── bridge.js          # 地标 1: 南京长江大桥
│   ├── zhongshan.js       # 地标 10: 中山陵 & 紫金山
│   ├── fuzimiao.js        # 地标 13: 夫子庙 · 十里秦淮 & 天下文枢
│   └── ...
├── ui/                    # UI 与交互面板 (3D 浮动气泡、攻略抽屉、路线流光、登陵漫游)
└── main.js                # 引擎入口与 60FPS 主循环调度
```

---

## 🚀 5 分钟上手开发

### 1. 克隆仓库与安装依赖
```bash
git clone https://github.com/yuhangwu97/open-nanjing-3d.git
cd open-nanjing-3d

npm install
```

### 2. 启动本地热重载开发服务器
```bash
npm run dev
```
打开浏览器访问 `http://localhost:3000`，即可看到实时渲染的高拟真 3D 沙盘。任何对 `src/` 代码的修改都会触发毫秒级热更新！

### 3. 构建生产包与本地预览
```bash
npm run build
npm run preview
```

---

## 🏛️ 如何贡献一个新景点？

我们提供 **三种贡献途径**，满足不同技术背景的贡献者：

### 途径一：原生 Three.js 参数化代码建模 (推荐)

项目内置了极为丰富的古建构件与自然树种生成工具，无需繁琐的三维软件导出，几行代码即可搭建出高拟真的古典飞檐与现代摩天大厦！

#### 1. 一键生成景点骨架代码
```bash
# 用法: npm run new:landmark <景点名称> <英文ID>
npm run new:landmark "阅江楼" yuejiang_tower
```
该命令会自动在 `src/landmarks/yuejiang_tower.js` 创建标准模版。

#### 2. 编写 3D 模型代码
在 `src/landmarks/your_landmark.js` 中实现 `build(scene, ctx)`：
```javascript
import * as THREE from 'three';
import { mats } from '../core/materials.js';
import { sharedGeos, createChineseRoof, createChinesePine } from '../core/geo-builder.js';

export default {
  id: 'yuejiang_tower',
  name: '阅江楼 · 狮子山风景区',
  build(scene, ctx) {
    const group = new THREE.Group();
    group.position.set(-140, 15, -280); // 设置沙盘坐标

    // 1. 基座台地
    const base = new THREE.Mesh(new THREE.BoxGeometry(32, 4, 32), mats.whiteMarble);
    group.add(base);

    // 2. 使用内置屋顶生成器创建明代重檐歇山顶
    const roof = createChineseRoof(36, 36, 6.5, 3.2, mats.glazedGreenRoof, true);
    roof.position.y = 18;
    group.add(roof);

    // 3. 注册动画 (若有动态运动部件)
    if (ctx && ctx.addUpdater) {
      ctx.addUpdater((dt, elapsed) => {
        // 每帧更新逻辑
      });
    }

    scene.add(group);
    return group;
  }
};
```

#### 3. 在注册中心引入
在 `src/landmarks/index.js` 中：
```javascript
import yuejiang_tower from './yuejiang_tower.js';

export const landmarks = [
  ...
  yuejiang_tower
];
```

#### 4. 在 `src/data/spots.js` 中配置景点数据
```javascript
yuejiang_tower: {
  id: 'yuejiang_tower',
  icon: '🏯',
  name: '阅江楼 · 狮子山风景区',
  badge: '万里长江第一楼 · 远眺大桥绝佳机位',
  pinPos: new THREE.Vector3(-140, 36, -280),
  routeNodePos: new THREE.Vector3(-140, 18, -280),
  tags: ['明代楼阁', '狮子山', '4A级景区'],
  duration: '1.5 - 2 小时',
  ticket: '¥40 / 人',
  bestTime: '16:30-18:30 (江上落日)',
  defaultCam: { cam: [-90, 52, -220], look: [-140, 20, -280] },
  subViews: [
    { label: '🌅 狮子山巅俯瞰万里长江', cam: [-110, 48, -240], look: [-140, 22, -280] }
  ],
  highlights: [
    '<b>一江奔涌狮子山</b>：建于狮子山之巅，朱元璋亲撰《阅江楼记》。'
  ],
  tips: '建议傍晚登顶，既可观浩瀚长江夕阳，又能俯瞰南京长江大桥全景亮灯。'
}
```

---

### 途径二：外部 3D 模型导入 (.glb / .gltf)

如果你习惯使用 Blender、Cinema 4D 或 Sketchfab 建模：
1. 将优化压缩后的 `.glb` 文件（体积建议在 3MB 内）放入 `public/models/`。
2. 参考 `templates/gltf-landmark-template.js`：
```javascript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default {
  id: 'your_landmark',
  name: '景点名称',
  async build(scene, ctx) {
    const group = new THREE.Group();
    const loader = new GLTFLoader();
    const gltf = await new Promise((res, rej) => loader.load('./models/your_model.glb', res, undefined, rej));
    gltf.scene.position.set(X, Y, Z);
    group.add(gltf.scene);
    scene.add(group);
    return group;
  }
};
```

---

### 途径三：文旅攻略与特色路线贡献

如果你是南京本地文旅达人或摄影爱好者，无需写 3D 代码即可贡献：
- 完善 `src/data/spots.js` 中的游览贴士、美食推荐、日落机位与避坑建议
- 在 `src/data/routes.js` 中策划新的特色游玩路线（如“六朝古都寻古线”、“金陵亲子研学线”、“最美梧桐骑行线”）

---

## 📐 沙盘坐标系基准规范

| 坐标轴 | 方向定义 | 说明 |
| :--- | :--- | :--- |
| **+X 轴** | 正东 (East) | 望向紫金山、仙林方向 |
| **-X 轴** | 正西 (West) | 望向江北新区、老山方向 |
| **+Z 轴** | 正南 (South) | 望向江宁、方山、禄口机场方向 |
| **-Z 轴** | 正北 (North) | 望向长江北段、栖霞山方向 |
| **+Y 轴** | 垂直高度 (Up) | Y = 0 为长江基准水面，Y = 1.0 为城市地表平层 |

### 核心地标参考坐标锚点：
- **下关 · 南京长江大桥**：`(-145, 0, -315)`
- **主城 · 新街口 / 鼓楼 / 紫峰大厦**：`(15 ~ 265, 0, -28 ~ 85)`
- **东郊 · 中山陵紫金山**：`(525, 0, -118)`
- **南郊 · 夫子庙秦淮河**：`(145, 0, 195)`
- **南部 · 南京南站**：`(0, 0, 365)`
- **西南 · 鱼嘴湿地公园**：`(-255, 0, 365)`
- **江北 · 老山国家森林公园**：`(-820, 0, -60)`
- **东北 · 栖霞山**：`(790, 0, -395)`

---

## ⚡ 性能与材质规范

1. **共享几何体与材质复用**：尽量复用 `mats`（如 `mats.whiteMarble`, `mats.glazedYellowRoof`, `mats.ancientBrickMat`）与 `sharedGeos`，避免重复创建材质造成 Draw Call 飙升。
2. **多边形面数控制**：单个景点的几何面数尽量控制在 50,000 三角面以内，确保移动端与轻薄本 60FPS 满帧流畅运行。
3. **夜景自发光规范**：若包含夜间发光部件（如灯笼、窗户、霓虹灯），请给材质设置 `emissive` 与 `emissiveIntensity`，夜景模式下系统会自动联动增强。

---

## 📝 提交 Pull Request (PR) 流程

1. Fork 本仓库并切换至功能分支：
   ```bash
   git checkout -b feature/add-yuejiang-tower
   ```
2. 本地执行打包验证：
   ```bash
   npm run build
   ```
   确保无任何构建或解析报错。
3. 提交代码并推送至你的 Fork 仓库：
   ```bash
   git add .
   git commit -m "feat(landmark): 新增阅江楼 3D 模型与游览攻略"
   git push origin feature/add-yuejiang-tower
   ```
4. 在 GitHub 发起 Pull Request，Maintainer 会在 24 小时内 Review 并合并！
5. 合并后 GitHub Actions 会自动触发部署至线上预览站，你的贡献将被记录在项目 Contributor 榜单中！
