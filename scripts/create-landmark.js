#!/usr/bin/env node

/**
 * 社区贡献新景点脚手架工具 (Scaffolding Tool for New Nanjing Landmark)
 * 用法: npm run new:landmark <景点名称> [英文标识]
 * 示例: npm run new:landmark "阅江楼" yuejiang_tower
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log(`
\x1b[33m🌟 Open Nanjing 3D 景点脚手架生成器\x1b[0m

\x1b[36m用法:\x1b[0m
  npm run new:landmark <景点名称> [英文ID]

\x1b[36m示例:\x1b[0m
  npm run new:landmark "阅江楼" yuejiang_tower
  npm run new:landmark "总统府" presidential_palace
  npm run new:landmark "大报恩寺琉璃塔" baoen_temple
`);
  process.exit(1);
}

const landmarkName = args[0];
let landmarkId = args[1];

if (!landmarkId) {
  // 简易拼音/随机前缀
  landmarkId = 'landmark_' + Date.now().toString(36);
}

const targetFile = path.resolve(__dirname, `../src/landmarks/${landmarkId}.js`);
if (fs.existsSync(targetFile)) {
  console.error(`\x1b[31m❌ 文件已存在: ${targetFile}\x1b[0m`);
  process.exit(1);
}

const templatePath = path.resolve(__dirname, '../templates/landmark-template.js');
let templateContent = fs.readFileSync(templatePath, 'utf-8');

templateContent = templateContent.replace('your_landmark_id', landmarkId);
templateContent = templateContent.replace('景点中文名称', landmarkName);

fs.writeFileSync(targetFile, templateContent, 'utf-8');

console.log(`
\x1b[32m✅ 成功创建新景点模板文件！\x1b[0m
📁 路径: \x1b[36m${targetFile}\x1b[0m
🏛️ 景点: \x1b[33m${landmarkName} (${landmarkId})\x1b[0m

\x1b[35m下一步开发指引:\x1b[0m
1. 打开 \x1b[36msrc/landmarks/${landmarkId}.js\x1b[0m 编写你的 3D 建筑群与景观
2. 在 \x1b[36msrc/landmarks/index.js\x1b[0m 中导入并注册此地标:
   import ${landmarkId} from './${landmarkId}.js';
3. 在 \x1b[36msrc/data/spots.js\x1b[0m 中添加该景点的攻略信息、门票、最佳拍摄机位
4. 运行 \x1b[32mnpm run dev\x1b[0m 在浏览器中实时预览效果！
`);
