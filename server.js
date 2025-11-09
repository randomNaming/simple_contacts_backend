const express = require("express");
const cors = require("cors");
const fs = require("fs-extra");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const DATA_FILE = process.env.DATA_FILE || "./data/contacts.json";
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, "uploads");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// 确保目录存在
const dataDir = path.dirname(DATA_FILE);
fs.ensureDirSync(dataDir);
fs.ensureDirSync(UPLOAD_DIR);

// 初始化数据文件（如果不存在）
if (!fs.existsSync(DATA_FILE)) {
  fs.writeJsonSync(DATA_FILE, [], { spaces: 2 });
}

// 配置头像上传
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// 获取联系人
app.get("/contacts", async (req, res) => {
  const contacts = await fs.readJson(DATA_FILE).catch(() => []);
  res.json(contacts);
});

// 添加联系人
app.post("/contacts", async (req, res) => {
  const contact = req.body;
  contact.id = Date.now();
  const contacts = await fs.readJson(DATA_FILE).catch(() => []);
  contacts.push(contact);
  await fs.writeJson(DATA_FILE, contacts, { spaces: 2 });
  res.json({ message: "Added" });
});

// 删除联系人
app.delete("/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  let contacts = await fs.readJson(DATA_FILE).catch(() => []);
  contacts = contacts.filter((c) => c.id !== id);
  await fs.writeJson(DATA_FILE, contacts, { spaces: 2 });
  res.json({ message: "Deleted" });
});

// 更新联系人（置顶）
app.put("/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updated = req.body;
  let contacts = await fs.readJson(DATA_FILE).catch(() => []);
  contacts = contacts.map((c) => (c.id === id ? updated : c));
  await fs.writeJson(DATA_FILE, contacts, { spaces: 2 });
  res.json({ message: "Updated" });
});

// 上传头像接口
app.post("/upload", upload.single("avatar"), (req, res) => {
  res.json({
    url: `${API_BASE_URL}/uploads/${req.file.filename}`,
  });
});

app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
