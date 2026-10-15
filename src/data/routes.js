export const ROUTES_DB = {
      all: {
        id: 'all',
        title: '🌟 二十二大地标古今全览线',
        subtitle: '主城文博 · 鸡鸣寺紫峰 · 栖霞红枫 · 河西江北 · 南站机场 · 名山圣境',
        stops: [
          'laoshan', 'bridge', 'xuanwu', 'jiming', 'zifeng', 'qixiashan', 'zhongshan', 'mingxiaoling', 'meiling', 'nanbo',
          'fuzimiao', 'citywall', 'fangshan', 'niushoushan', 'nanzhan', 'lukou_airport',
          'yuzui', 'fifthbridge', 'qingao', 'aoti', 'qingao_arena', 'memorial'
        ],
        color: 0xf59e0b,
        tip: '💡 <b>南京全域22景深度巡礼（全景模式默认隐藏3D连接线，保持视野通透）</b>：涵盖新增第22景东北临江【栖霞山·隋代舍利塔】、第21景【古鸡鸣寺·药师佛塔】、钟山风景区三绝、南京博物院、蓝宝石玻璃蓝紫峰大厦、玄武湖、夫子庙天下文枢大广场、中华门瓮城、实景1:1南京南站、禄口机场、牛首山、方山斜塔、老山森林公园、半圆弧形长江大桥/五桥及河西现代地标群！'
      },
      hub: {
        id: 'hub',
        title: '🚄 空铁门户与金陵名山圣境线',
        subtitle: '禄口国际机场 → 南京南站 → 方山斜塔 → 牛首山 → 中华门城墙 → 古鸡鸣寺 → 紫峰大厦 → 老山 → 栖霞山',
        stops: ['lukou_airport', 'nanzhan', 'fangshan', 'niushoushan', 'citywall', 'jiming', 'zifeng', 'laoshan', 'qixiashan'],
        color: 0xa855f7,
        tip: '💡 <b>空铁枢纽与名山古塔精华线</b>：从禄口国际机场T1/T2出发，经实景1:1南京南站平挑金顶枢纽，探访江宁方山7.59°定林寺斜塔、牛首山佛顶宫，再入中华门瓮城、古鸡鸣寺药师塔与450米玻璃蓝紫峰大厦，远眺江北老山与东北临江【栖霞山隋代舍利塔】！'
      },
      classic: {
        id: 'classic',
        title: '🔥 钟山帝陵·栖霞红枫与文脉线',
        subtitle: '栖霞山 → 中山陵 → 明孝陵 → 美龄宫 → 南京博物院 → 玄武湖 → 古鸡鸣寺 → 夫子庙大广场 → 中华门瓮城',
        stops: ['qixiashan', 'zhongshan', 'mingxiaoling', 'meiling', 'nanbo', 'xuanwu', 'jiming', 'fuzimiao', 'citywall'],
        color: 0x3b82f6,
        tip: '💡 <b>金陵王气与秋日红枫黄金线</b>：从东北江畔【栖霞山】赏漫山红枫与隋代舍利塔出发，游览右移舒展后的钟山三绝（中山陵、精雕明孝陵、美龄宫）与南京博物院老大殿，再打卡1.42x玄武湖、古鸡鸣寺、夫子庙66米天下文枢大广场与中华门瓮城。'
      },
      modern: {
        id: 'modern',
        title: '🏙️ 摩天双城与跨江天际线',
        subtitle: '紫峰大厦 → 奥体中心 → 青奥双塔&南京眼 → 长江五桥 → 鱼嘴灯塔 → 青奥体育馆 → 长江大桥',
        stops: ['zifeng', 'aoti', 'qingao', 'fifthbridge', 'yuzui', 'qingao_arena', 'bridge'],
        color: 0x06b6d4,
        tip: '💡 <b>感受现代化国际金陵</b>：从450米蓝宝石玻璃蓝紫峰大厦出发，纵览河西奥体双红斜拱、扎哈青奥双塔与南京眼、鱼嘴灯塔落日，再跨长江五桥打卡江北“江鸥展翅”青奥体育馆与下关长江大桥。'
      },
      culture: {
        id: 'culture',
        title: '🙏 铭记历史·四大古塔名刹祈福线',
        subtitle: '大屠杀纪念馆 → 古鸡鸣寺药师塔 → 玄武湖明城墙 → 栖霞古寺舍利塔 → 中华门瓮城 → 牛首山佛顶宫 → 方山斜塔 → 老山兜率寺',
        stops: ['memorial', 'jiming', 'xuanwu', 'qixiashan', 'citywall', 'niushoushan', 'fangshan', 'laoshan'],
        color: 0x10b981,
        tip: '💡 <b>厚重金陵人文与四大古塔祈福巡礼</b>：上午前往江东门纪念馆铭记历史，随后登临鸡笼山【古鸡鸣寺药师佛塔】、漫步台城明城墙，下午探访东北江畔【栖霞古寺与五级八角隋代舍利石塔】、中华门瓮城、牛首山佛顶圣塔、江宁方山定林寺斜塔与江北老山状元塔。'
      },
      night: {
        id: 'night',
        title: '🌙 夜泊秦淮与金陵璀璨夜景线',
        subtitle: '古鸡鸣寺药师塔 → 紫峰大厦 → 夫子庙大广场&画舫 → 中华门瓮城 → 南京南站 → 奥体双红拱 → 青奥南京眼',
        stops: ['jiming', 'zifeng', 'fuzimiao', 'citywall', 'nanzhan', 'aoti', 'qingao'],
        color: 0xec4899,
        tip: '💡 <b>已自动为您开启金陵璀璨夜景模式</b>：一次饱览古鸡鸣寺药师佛塔暖金佛光、450米紫峰大厦晶莹玻璃蓝夜景、夫子庙天下文枢大广场与秦淮画舫、中华门古城堡夜色、南京南站香槟金挑檐红字与河西璀璨霓虹！'
      }
    };
