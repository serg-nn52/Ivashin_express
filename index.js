var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const cors = require("cors");
const path = require("path");
const jsonParser = express_1.default.json();
const app = (0, express_1.default)();
app.use(cors());
const filePath = "data.json";
const PORT = process.env.PORT || 5000;
const corsReq = cors();
// GET - request----------------------------------------------
app.get("/nodes", corsReq, (req, res) => {
  try {
    const content = fs_1.default.readFileSync(filePath, "utf-8");
    const nodes = JSON.parse(content);
    res.send(nodes);
  } catch (err) {
    res.status(400).send(err);
  }
});
// POST - request---------------------------------------------
app.post("/nodes", corsReq, jsonParser, (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send();
    }
    const {
      body: { id, text },
    } = req;
    const node = { id, text };
    const data = fs_1.default.readFileSync(filePath, "utf-8");
    const nodes = JSON.parse(data);
    nodes.push(node);
    const content = JSON.stringify(nodes);
    fs_1.default.writeFileSync(filePath, content);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});
// PUT
app.put("/nodes", corsReq, jsonParser, (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send();
    }
    const {
      body: { id, text },
    } = req;
    const node = { id, text };
    const data = fs_1.default.readFileSync(filePath, "utf-8");
    const nodes = JSON.parse(data);
    nodes.find((el) => el.id === node.id).text = node.text;
    const content = JSON.stringify(nodes);
    fs_1.default.writeFileSync(filePath, content);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});
//Delete
app.delete("/nodes/:id", corsReq, jsonParser, (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send();
    }
    const {
      params: { id },
    } = req;
    const data = fs_1.default.readFileSync(filePath, "utf-8");
    const nodes = JSON.parse(data);
    const newNodes = nodes.filter((el) => el.id !== id);
    const content = JSON.stringify(newNodes);
    fs_1.default.writeFileSync(filePath, content);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});
app.use(express_1.default.static(path.resolve(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});
app.listen(PORT, () => {
  console.log(`Start server port ${PORT} on http://localhost:${PORT}`);
});
