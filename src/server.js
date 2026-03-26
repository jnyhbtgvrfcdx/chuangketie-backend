const app = require('./app');

// 仅当直接运行该文件时（本地开发），才启动服务
// Vercel 部署时，会自动忽略这段，用 Serverless 模式运行
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`创可贴后端运行在 http://localhost:${PORT}`);
  });
}

// 必须导出 app，供 Vercel 调用
module.exports = app;