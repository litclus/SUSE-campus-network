# 川轻化校园网自动登录

四川轻化工大学（SUSE）校园网自动认证工具

## ✨ 功能特点

- 🔐 自动完成校园网认证登录
- 🚀 轻量级
- ⚡ 配置简单

## 📋 系统要求

- Node.js 16 及以上版本
- pnpm（推荐）或 npm 包管理器

## 🚀 安装使用

```bash
# 克隆仓库
git clone https://github.com/litclus/SUSE-campus-network.git

cd SUSE-campus-network
# 安装依赖
pnpm i
# 或者
npm i
```

## ⚙️ 配置说明

在项目根目录打开（如果没有请创建） `.env` 文件，填写你的账号信息：

```env
USERNAME=你的学号
PASSWORD=你的密码
SERVICE=你的运营商
```

### 支持的运营商

- `移动` - 宜宾移动
- `联通` - 宜宾联通
- `电信` - 宜宾电信
- 其它校区请根据实际情况填写

### 配置示例

```env
USERNAME=woshixuehao
PASSWORD=woshimima
SERVICE=宜宾移动
```

## 🎯 运行方式

```bash
# 直接运行
node main.js
```

## 🔄 运行流程

1. **网络检测**：通过访问 `baidu.com` 测试网络连通性
2. **门户识别**：提取校园网认证门户的跳转地址
3. **获取密钥**：从门户获取RSA公钥参数
4. **密码加密**：使用RSA算法加密密码
5. **提交认证**：将加密后的凭据提交至认证门户
6. **结果反馈**：显示登录成功或失败信息

## 📁 项目结构

```
suse-campus-network/
├── src/
│   ├── network.js        # 主要连接逻辑
│   ├── EncryptPassword.js # 密码加密处理
│   └── security.js       # RSA加密实现
├── main.js              # 程序入口
├── .env                 # 环境变量（账号信息配置）
└── package.json
```

## 🛠️ 技术细节

- **运行环境**：Node.js
- **依赖库**：axios、dotenv、litils
- **无需构建**：纯 JavaScript 代码

## 🤝 贡献

这是一个个人工具，欢迎 Fork 并根据自己的需求进行修改

## 📄 开源协议

MIT License - 自行承担使用风险

## ⚠️ 免责声明

本工具仅供学习交流使用，请遵守学校的网络使用规定
