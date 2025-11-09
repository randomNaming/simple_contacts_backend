# 联系人管理系统 - 后端

Node.js + Express 后端服务，提供联系人管理的 RESTful API。

## 📋 功能特性

- ✅ 联系人 CRUD 操作
- ✅ 头像上传
- ✅ 联系人置顶功能
- ✅ JSON 文件存储
- ✅ CORS 跨域支持

## 🚀 快速开始

### 本地开发

```bash
# 安装依赖
npm install

# 启动服务
npm start

# 服务运行在 http://localhost:3000
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| PORT | 服务端口 | 3000 |
| API_BASE_URL | API 基础 URL（用于文件上传返回地址） | http://localhost:3000 |
| DATA_FILE | 数据文件路径 | ./data/contacts.json |
| UPLOAD_DIR | 上传文件目录 | ./uploads |

## 📡 API 接口

### 联系人管理

#### 获取所有联系人
```http
GET /contacts
```

**响应示例**:
```json
[
  {
    "id": 1234567890,
    "name": "张三",
    "phone": "13800138000",
    "avatar": "http://localhost:3000/uploads/1234567890.jpg",
    "pinned": false
  }
]
```

#### 添加联系人
```http
POST /contacts
Content-Type: application/json

{
  "name": "张三",
  "phone": "13800138000",
  "avatar": ""
}
```

#### 更新联系人
```http
PUT /contacts/:id
Content-Type: application/json

{
  "id": 1234567890,
  "name": "张三",
  "phone": "13800138000",
  "avatar": "http://localhost:3000/uploads/1234567890.jpg",
  "pinned": true
}
```

#### 删除联系人
```http
DELETE /contacts/:id
```

### 文件上传

#### 上传头像
```http
POST /upload
Content-Type: multipart/form-data

avatar: [文件]
```

**响应示例**:
```json
{
  "url": "http://localhost:3000/uploads/1234567890.jpg"
}
```

#### 获取上传的文件
```http
GET /uploads/:filename
```

## 🐳 Docker 部署

### 构建镜像

```bash
docker build -t contacts-backend .
```

### 运行容器

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/uploads:/app/uploads \
  -e PORT=3000 \
  -e API_BASE_URL=http://your-ip:3000 \
  contacts-backend
```

## 📁 项目结构

```
contacts-backend/
├── server.js              # Express 服务器主文件
├── package.json           # 项目依赖配置
├── Dockerfile             # Docker 构建配置
├── .dockerignore          # Docker 忽略文件
├── data/                  # 数据目录（持久化）
│   └── contacts.json      # 联系人数据文件
└── uploads/               # 上传文件目录
```

## 📦 依赖

- **express**: Web 框架
- **cors**: 跨域支持
- **multer**: 文件上传处理
- **fs-extra**: 文件系统操作

## 🔧 开发说明

### 数据存储

数据存储在 `data/contacts.json` 文件中，格式为 JSON 数组。

### 文件上传

上传的文件保存在 `uploads/` 目录，文件名格式为：`时间戳.扩展名`

### 错误处理

- 如果数据文件不存在，会自动创建空数组
- 文件上传失败会返回错误信息
- API 错误会返回相应的 HTTP 状态码

## 📝 注意事项

1. **数据持久化**: 确保 `data/` 和 `uploads/` 目录有写入权限
2. **文件大小**: 默认没有限制上传文件大小，生产环境建议添加限制
3. **安全性**: 生产环境建议添加身份验证和请求验证
4. **备份**: 定期备份 `data/contacts.json` 文件

## 🔗 相关项目

- [前端项目](../contacts-frontend) - uni-app 前端应用

