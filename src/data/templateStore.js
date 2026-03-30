const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'templates.json');

// 原有的在线模版数据
const ONLINE_TEMPLATES = [
  // 社交媒体
  {
    id: 'tpl-online-001',
    name: '小红书美食分享封面',
    thumbnail: 'https://picsum.photos/seed/food1/1080/1440',
    category: '社交媒体',
    width: 1080,
    height: 1440,
    description: '适合美食博主分享美食内容',
    tags: ['美食', '小红书', '分享'],
    favoriteCount: 1280,
  },
  {
    id: 'tpl-online-002',
    name: '朋友圈早安日签',
    thumbnail: 'https://picsum.photos/seed/morning/1080/1080',
    category: '社交媒体',
    width: 1080,
    height: 1080,
    description: '每日早安正能量分享',
    tags: ['早安', '日签', '正能量'],
    favoriteCount: 856,
  },
  {
    id: 'tpl-online-003',
    name: '直播预告图文首图',
    thumbnail: 'https://picsum.photos/seed/live/1080/608',
    category: '社交媒体',
    width: 1080,
    height: 608,
    description: '直播活动预告宣传图',
    tags: ['直播', '预告', '宣传'],
    favoriteCount: 642,
  },
  {
    id: 'tpl-online-004',
    name: '穿搭种草封面',
    thumbnail: 'https://picsum.photos/seed/fashion/1080/1440',
    category: '社交媒体',
    width: 1080,
    height: 1440,
    description: '时尚穿搭博主推荐封面',
    tags: ['穿搭', '时尚', '种草'],
    favoriteCount: 1520,
  },
  // 海报
  {
    id: 'tpl-online-005',
    name: '春季沙龙活动海报',
    thumbnail: 'https://picsum.photos/seed/spring/1080/1528',
    category: '海报',
    width: 1080,
    height: 1528,
    description: '适合春季主题活动宣传',
    tags: ['春季', '沙龙', '活动'],
    favoriteCount: 723,
  },
  {
    id: 'tpl-online-006',
    name: '展会邀请函长图',
    thumbnail: 'https://picsum.photos/seed/invite/1080/1920',
    category: '海报',
    width: 1080,
    height: 1920,
    description: '展会活动邀请函',
    tags: ['展会', '邀请函', '长图'],
    favoriteCount: 534,
  },
  {
    id: 'tpl-online-007',
    name: '开业庆典宣传海报',
    thumbnail: 'https://picsum.photos/seed/ce/1080/1528',
    category: '海报',
    width: 1080,
    height: 1528,
    description: '店铺开业庆典宣传',
    tags: ['开业', '庆典', '宣传'],
    favoriteCount: 892,
  },
  {
    id: 'tpl-online-008',
    name: '音乐派对报名海报',
    thumbnail: 'https://picsum.photos/seed/music/1080/1528',
    category: '海报',
    width: 1080,
    height: 1528,
    description: '音乐活动派对宣传',
    tags: ['音乐', '派对', '活动'],
    favoriteCount: 467,
  },
  // 电商
  {
    id: 'tpl-online-009',
    name: '直播间爆款预告',
    thumbnail: 'https://picsum.photos/seed/hot/1080/1440',
    category: '电商',
    width: 1080,
    height: 1440,
    description: '直播带货爆款预告',
    tags: ['直播', '爆款', '带货'],
    favoriteCount: 2341,
  },
  {
    id: 'tpl-online-010',
    name: '新品上新促销海报',
    thumbnail: 'https://picsum.photos/seed/new/1080/1528',
    category: '电商',
    width: 1080,
    height: 1528,
    description: '新品上市促销宣传',
    tags: ['新品', '促销', '电商'],
    favoriteCount: 1876,
  },
  // 简历
  {
    id: 'tpl-online-011',
    name: '简约风格求职简历',
    thumbnail: 'https://picsum.photos/seed/resume1/800/1131',
    category: '简历',
    width: 800,
    height: 1131,
    description: '简约专业求职简历模板',
    tags: ['简历', '求职', '简约'],
    favoriteCount: 4521,
  },
  {
    id: 'tpl-online-012',
    name: '创意设计师简历',
    thumbnail: 'https://picsum.photos/seed/resume2/800/1131',
    category: '简历',
    width: 800,
    height: 1131,
    description: '创意设计师专属简历',
    tags: ['简历', '设计师', '创意'],
    favoriteCount: 2134,
  },
  // PPT
  {
    id: 'tpl-online-013',
    name: '商务汇报PPT模板',
    thumbnail: 'https://picsum.photos/seed/ppt1/1920/1080',
    category: 'PPT',
    width: 1920,
    height: 1080,
    description: '专业商务汇报演示模板',
    tags: ['PPT', '商务', '汇报'],
    favoriteCount: 5678,
  },
  {
    id: 'tpl-online-014',
    name: '年终总结PPT模板',
    thumbnail: 'https://picsum.photos/seed/ppt2/1920/1080',
    category: 'PPT',
    width: 1920,
    height: 1080,
    description: '年度工作总结汇报',
    tags: ['PPT', '年终', '总结'],
    favoriteCount: 6789,
  },
  // Logo
  {
    id: 'tpl-online-015',
    name: '科技品牌Logo',
    thumbnail: 'https://picsum.photos/seed/logo1/500/500',
    category: 'Logo',
    width: 500,
    height: 500,
    description: '科技公司品牌标志',
    tags: ['Logo', '科技', '品牌'],
    favoriteCount: 1234,
  },
  // 短视频
  {
    id: 'tpl-online-016',
    name: '抖音视频封面',
    thumbnail: 'https://picsum.photos/seed/video1/1080/1920',
    category: '短视频',
    width: 1080,
    height: 1920,
    description: '抖音短视频封面模板',
    tags: ['短视频', '抖音', '封面'],
    favoriteCount: 5678,
  },
  {
    id: 'tpl-online-017',
    name: '视频号封面',
    thumbnail: 'https://picsum.photos/seed/video2/1080/1260',
    category: '短视频',
    width: 1080,
    height: 1260,
    description: '微信视频号封面模板',
    tags: ['短视频', '视频号', '封面'],
    favoriteCount: 3456,
  },
  {
    id: 'tpl-online-018',
    name: '公众号封面首图',
    thumbnail: 'https://picsum.photos/seed/article/900/383',
    category: '社交媒体',
    width: 900,
    height: 383,
    description: '微信公众号文章封面',
    tags: ['公众号', '封面', '文章'],
    favoriteCount: 4567,
  },
];

// 分类配置
const CATEGORY_CONFIG = [
  { name: '社交媒体', tags: ['社交媒体', '朋友圈', '小红书'], description: '适用于公众号封面、朋友圈海报和短视频配图' },
  { name: '海报', tags: ['海报', '宣传', '活动'], description: '适用于活动宣传、招生招新和节日营销' },
  { name: '电商', tags: ['电商', '促销', '商品'], description: '适用于商品主图、详情页和促销横幅' },
  { name: '简历', tags: ['简历', '求职', '面试'], description: '适用于求职简历、自我介绍和个人作品集' },
  { name: 'PPT', tags: ['PPT', '演示', '汇报'], description: '适用于商务汇报、培训课件和年终总结' },
  { name: '名片', tags: ['名片', '商务', '个人'], description: '适用于个人名片、企业名片和电子名片' },
  { name: '邀请函', tags: ['邀请函', '婚礼', '活动'], description: '适用于婚礼、开业、年会和活动邀请' },
  { name: 'Logo', tags: ['Logo', '品牌', '标志'], description: '适用于品牌标志、店铺 Logo 和社交头像' },
  { name: '传单', tags: ['传单', '宣传', '促销'], description: '适用于促销传单、活动宣传页和产品介绍' },
  { name: '短视频', tags: ['短视频', '抖音', '封面'], description: '适用于抖音封面、视频号封面和短视频配图' },
];

// 图片尺寸配置
const SIZE_CONFIG = [
  { width: 1080, height: 1440 },
  { width: 1080, height: 1920 },
  { width: 1080, height: 1528 },
  { width: 1080, height: 1080 },
  { width: 800, height: 1131 },
  { width: 1920, height: 1080 },
  { width: 500, height: 500 },
  { width: 900, height: 383 },
];

// 精选模版名称 - 按分类分组
const TEMPLATE_NAMES_BY_CATEGORY = {
  '社交媒体': [
    '小红书爆款封面', '朋友圈精致日签', '公众号首图精选', '抖音吸睛封面',
    '微博热搜配图', '小红书种草笔记', '朋友圈早安问候', '短视频封面大师',
    '社媒运营神器', '爆款内容封面', '粉丝互动海报', '品牌传播利器',
    '内容创作者必备', '社媒涨粉秘籍', '流量密码封面', '话题营销神器',
    '热点追踪海报', '粉丝福利公告', '互动抽奖活动', '品牌故事讲述',
  ],
  '海报': [
    '企业周年庆典', '新品发布盛典', '品牌形象展示', '活动宣传推广',
    '节日主题海报', '促销活动海报', '品牌故事海报', '产品介绍海报',
    '企业文化展示', '团队风采展示', '客户案例展示', '合作伙伴招募',
    '行业峰会海报', '产品发布会', '品牌升级海报', '年度总结海报',
    '季度汇报海报', '项目成果展示', '团队建设活动', '企业社会责任',
  ],
  '电商': [
    '双十一狂欢节', '618年中大促', '年货节特惠', '新品首发专区',
    '限时秒杀专区', '满减优惠专区', '会员专享福利', '店铺周年庆',
    '品牌日特卖', '品类狂欢节', '爆款推荐专区', '好物清单精选',
    '优惠劵专区', '直播预告海报', '带货爆款封面', '商品详情页',
    '店铺首页设计', '促销横幅广告', '产品主图设计', '电商运营神器',
  ],
  '简历': [
    '简约专业简历', '创意设计简历', '商务精英简历', '技术大牛简历',
    '产品经理简历', '市场营销简历', '运营专员简历', '行政人事简历',
    '财务会计简历', '应届生简历', '实习生简历', '转行求职简历',
    '外企求职简历', '互联网简历', '金融行业简历', '教育行业简历',
    '医疗行业简历', '设计行业简历', '建筑行业简历', '法律行业简历',
  ],
  'PPT': [
    '商务汇报演示', '项目提案演示', '年度工作总结', '季度业绩汇报',
    '产品发布会PPT', '培训课件设计', '学术演讲PPT', '创业路演PPT',
    '投资融资演示', '战略规划PPT', '团队介绍PPT', '企业文化PPT',
    '市场分析报告', '竞品分析PPT', '用户调研报告', '数据可视化PPT',
    '流程图解设计', '组织架构图', '时间轴设计', '里程碑展示',
  ],
  '名片': [
    '简约商务名片', '创意个人名片', '企业高管名片', '设计师名片',
    '律师名片设计', '医生名片设计', '教师名片设计', '销售精英名片',
    '科技风格名片', '艺术风格名片', '极简风格名片', '奢华风格名片',
    '双面名片设计', '竖版名片设计', '异形名片设计', '透明名片设计',
    '金属质感名片', '纸纹质感名片', '凹凸工艺名片', '烫金工艺名片',
  ],
  '邀请函': [
    '婚礼邀请函', '生日派对邀请', '企业年会邀请', '新品发布会邀请',
    '展览开幕邀请', '音乐节邀请函', '艺术展邀请函', '时尚秀邀请函',
    '品牌活动邀请', '客户答谢邀请', '合作伙伴邀请', '媒体发布会邀请',
    '沙龙活动邀请', '论坛峰会邀请', '慈善晚宴邀请', '毕业典礼邀请',
    '校友聚会邀请', '家庭聚会邀请', '宝宝宴邀请函', '乔迁之喜邀请',
  ],
  'Logo': [
    '科技品牌Logo', '互联网Logo', '金融品牌Logo', '教育机构Logo',
    '医疗健康Logo', '餐饮美食Logo', '零售品牌Logo', '时尚品牌Logo',
    '房地产Logo', '汽车品牌Logo', '旅游品牌Logo', '娱乐传媒Logo',
    '体育品牌Logo', '公益组织Logo', '政府机构Logo', '学校院校Logo',
    '个人工作室Logo', '创业公司Logo', '传统行业Logo', '新兴行业Logo',
  ],
  '传单': [
    '促销活动传单', '新品推广传单', '店铺开业传单', '节日促销传单',
    '产品介绍传单', '服务宣传传单', '招商加盟传单', '招聘宣传传单',
    '培训课程传单', '健身俱乐部传单', '美容美发传单', '餐饮美食传单',
    '房产中介传单', '教育培训传单', '旅游度假传单', '家居装修传单',
    '汽车服务传单', '婚纱摄影传单', '儿童乐园传单', '社区服务传单',
  ],
  '短视频': [
    '抖音热门封面', '视频号封面', '快手爆款封面', 'B站视频封面',
    '小红书视频封面', '知识分享封面', '搞笑段子封面', '美食探店封面',
    '旅行Vlog封面', '美妆教程封面', '健身打卡封面', '宠物萌宠封面',
    '情感语录封面', '职场干货封面', '生活技巧封面', '游戏解说封面',
    '音乐MV封面', '舞蹈教学封面', '穿搭分享封面', '好物推荐封面',
  ],
};

// 生成本地模版数据
function generateLocalTemplates() {
  const templates = [];
  const imagesDir = path.join(__dirname, '../../public/templates');
  
  let imageFiles = [];
  try {
    imageFiles = fs.readdirSync(imagesDir).filter(f => 
      /\.(webp|png|jpg|jpeg)$/i.test(f)
    );
  } catch (e) {
    console.warn('未找到本地模版图片目录');
  }

  imageFiles.forEach((filename, index) => {
    const id = `tpl-local-${String(index + 1).padStart(3, '0')}`;
    const categoryIndex = index % CATEGORY_CONFIG.length;
    const category = CATEGORY_CONFIG[categoryIndex];
    const sizeIndex = index % SIZE_CONFIG.length;
    const size = SIZE_CONFIG[sizeIndex];
    
    // 根据分类获取模版名称
    const categoryNames = TEMPLATE_NAMES_BY_CATEGORY[category.name] || [];
    const nameIndex = Math.floor(index / CATEGORY_CONFIG.length) % categoryNames.length;
    const templateName = categoryNames[nameIndex] || `${category.name}精选设计`;
    
    templates.push({
      id,
      name: templateName,
      thumbnail: `/templates/${filename}`,
      category: category.name,
      width: size.width,
      height: size.height,
      description: `专业${category.name}设计，精选优质模版助力您的创作`,
      tags: [...category.tags, '精选', '热门'],
      favoriteCount: Math.floor(Math.random() * 5000) + 500,
    });
  });

  return templates;
}

// 合并所有模版数据
function getAllDefaultTemplates() {
  const localTemplates = generateLocalTemplates();
  return [...ONLINE_TEMPLATES, ...localTemplates];
}

// 从文件加载模版数据
function loadTemplates() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      const saved = JSON.parse(data);
      // 检查是否有新的本地图片需要添加
      const localTemplates = generateLocalTemplates();
      const savedLocalCount = saved.filter(t => t.id.startsWith('tpl-local-')).length;
      
      if (localTemplates.length > savedLocalCount) {
        // 有新图片，重新生成所有数据
        const allTemplates = getAllDefaultTemplates();
        saveTemplates(allTemplates);
        return allTemplates;
      }
      return saved;
    }
  } catch (error) {
    console.error('加载模版数据失败:', error.message);
  }
  
  // 文件不存在，生成所有默认数据
  const allTemplates = getAllDefaultTemplates();
  saveTemplates(allTemplates);
  return allTemplates;
}

// 保存模版数据到文件
function saveTemplates(templates) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(templates, null, 2), 'utf-8');
  } catch (error) {
    console.error('保存模版数据失败:', error.message);
  }
}

// 初始化模版数据
let templates = loadTemplates();

// 获取所有模版
function getTemplates() {
  return templates;
}

// 根据条件筛选模版
function getTemplatesByFilter(category, search, page = 1, limit = 20) {
  let result = [...templates];
  
  // 按分类筛选
  if (category) {
    result = result.filter(t => t.category === category);
  }
  
  // 按关键词搜索
  if (search) {
    const keyword = search.toLowerCase();
    result = result.filter(t => 
      t.name.toLowerCase().includes(keyword) ||
      t.description.toLowerCase().includes(keyword) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(keyword)))
    );
  }
  
  // 分页
  const total = result.length;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  return {
    list: result.slice(start, end),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

// 根据ID获取模版
function getTemplateById(id) {
  return templates.find(t => t.id === id) || null;
}

// 搜索模版
function searchTemplates(keyword) {
  if (!keyword) return templates;
  
  const kw = keyword.toLowerCase();
  return templates.filter(t => 
    t.name.toLowerCase().includes(kw) ||
    t.description.toLowerCase().includes(kw) ||
    (t.tags && t.tags.some(tag => tag.toLowerCase().includes(kw))) ||
    t.category.toLowerCase().includes(kw)
  );
}

// 添加模版
function addTemplate(template) {
  const newTemplate = {
    ...template,
    id: template.id || `tpl-${Date.now()}`,
    favoriteCount: template.favoriteCount || 0,
  };
  templates.push(newTemplate);
  saveTemplates(templates);
  return newTemplate;
}

// 更新模版
function updateTemplate(id, updates) {
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) {
    return null;
  }
  
  templates[index] = { ...templates[index], ...updates };
  saveTemplates(templates);
  return templates[index];
}

// 删除模版
function deleteTemplate(id) {
  const index = templates.findIndex(t => t.id === id);
  if (index === -1) {
    return false;
  }
  
  templates.splice(index, 1);
  saveTemplates(templates);
  return true;
}

// 重置为默认数据
function resetTemplates() {
  templates = getAllDefaultTemplates();
  saveTemplates(templates);
  return templates;
}

module.exports = {
  getTemplates,
  getTemplatesByFilter,
  getTemplateById,
  searchTemplates,
  addTemplate,
  updateTemplate,
  deleteTemplate,
  resetTemplates,
};
