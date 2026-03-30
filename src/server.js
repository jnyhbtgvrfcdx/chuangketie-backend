const app = require('./app');

// 仅当直接运行该文件时（本地开发），才启动服务
// Vercel 部署时，会自动忽略这段，用 Serverless 模式运行
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // 核心修改：监听 0.0.0.0，允许所有局域网设备访问
  app.listen(PORT, '0.0.0.0', () => {
    // 自动获取本机IP，给小组成员直接复制的地址
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIp = '127.0.0.1';
    // 遍历网卡，找到WLAN/以太网的局域网IP
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          localIp = net.address;
          break;
        }
      }
      if (localIp !== '127.0.0.1') break;
    }
    console.log(`✅ 创可贴后端服务已启动`);
    console.log(`🔗 本机访问：http://localhost:${PORT}`);
    console.log(`🌐 局域网访问：http://${localIp}:${PORT}`);
  });
}

// 必须导出 app，供 Vercel 调用
module.exports = app;