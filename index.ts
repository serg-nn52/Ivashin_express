import express from "express";
import fs from "fs";
import cors = require("cors");
import path = require("path");

const jsonParser = express.json();
const app = express();
app.use(cors());
const filePath = "data.json";
const PORT = process.env.PORT || 5000;
const corsReq = cors();

type TNodesType = {
  id: string;
  text: string;
};

// GET - request----------------------------------------------

app.get("/nodes", corsReq, (req, res) => {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    const nodes: TNodesType[] = JSON.parse(content);
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

    const node: TNodesType = { id, text };
    const data = fs.readFileSync(filePath, "utf-8");
    const nodes: TNodesType[] = JSON.parse(data);
    nodes.push(node);
    const content = JSON.stringify(nodes);

    fs.writeFileSync(filePath, content);
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

    const node: TNodesType = { id, text };
    const data = fs.readFileSync(filePath, "utf-8");
    const nodes: TNodesType[] = JSON.parse(data);
    nodes.find((el) => el.id === node.id)!.text = node.text;
    const content = JSON.stringify(nodes);

    fs.writeFileSync(filePath, content);
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

    const data = fs.readFileSync(filePath, "utf-8");
    const nodes: TNodesType[] = JSON.parse(data);
    const newNodes = nodes.filter((el) => el.id !== id);
    const content = JSON.stringify(newNodes);

    fs.writeFileSync(filePath, content);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.use(express.static(path.resolve(__dirname, "./build")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./build/index.html"));
});

app.listen(PORT, () => {
  console.log(`Start server port ${PORT} on http://localhost:${PORT}`);
});
