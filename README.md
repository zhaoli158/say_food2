# 食物营养查询

一个简单的食物营养查询工具，支持文字搜索和图片识别。

## 功能特点

- 文字搜索食物营养信息
- 支持模糊搜索和别名搜索
- 显示详细的营养成分
- 血糖指数参考
- 适合人群建议

## 访问地址

https://zhaoli158.github.io/say_food

## 使用说明

1. 打开网站
2. 选择搜索方式：
   - 文字搜索：直接输入食物名称
   - 图片识别：上传食物图片
3. 查看详细的营养信息

## 技术栈
- HTML5
- CSS3
- JavaScript
- Clarifai API (用于图像识别)
- TensorFlow.js (用于本地模型处理)
- IndexedDB (用于本地数据存储)

## 项目结构
```
├── index.html          # 主页面
├── style.css          # 样式文件
├── foodSearch.js      # 食物搜索功能
├── script.js          # 图片识别功能
├── localModel.js      # 本地模型处理
└── database.js        # 数据库操作
```

### API 配置
1. 注册 Clarifai 账号：
   - 访问 https://clarifai.com/signup
   - 完成注册并登录

2. 获取 API 密钥：
   - 进入 Dashboard
   - 点击 "Create Application"
   - 记录下 API Key、App ID 和 User ID

3. 配置项目：
   - 在项目根目录创建 config.js 文件
   - 填入你的 API 配置信息 