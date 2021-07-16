const express = require("express");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const fs = require("fs");
const app = express();

app.use(express.json({ limit: `1000mb` }));

app.use(cors({ origin: `http://127.0.0.1:3001` }));

app.get(`/`, (_, res) => res.send(`API Running`));

app.get(`/templates`, async (_, res) => {
  fs.readFile("./templates.json", (err, data) => {
    res.json(JSON.parse(data));
  });
});

app.get(`/templates/uuidv4`, (_, res) => res.send(uuidv4()));

app.post(`/templates/:uuid`, async (req, res) => {
  const assets = req.body[`gjs-assets`];
  const components = req.body[`gjs-components`];
  const css = req.body[`gjs-css`];
  const html = req.body[`gjs-html`];
  const styles = req.body[`gjs-styles`];
  const { id, idx, template, thumbnail, _some_token } = req.body;

  fs.readFile("./templates.json", (err, data) => {
    const templates = JSON.parse(data);
    templates.push({
      [`gjs-assets`]: assets,
      [`gjs-components`]: components,
      [`gjs-css`]: css,
      [`gjs-html`]: html,
      [`gjs-styles`]: styles,
      id,
      idx,
      template,
      thumbnail,
      _some_token,
    });
    const newTemplates = JSON.stringify(templates);
    fs.writeFile("./templates.json", newTemplates, (err) => res.send(true));
  });
});

app.get(`/templates/:idx`, (req, res) => {
  const { idx } = req.params;
  fs.readFile("./templates.json", (err, data) => {
    const templates = JSON.parse(data);
    res.send(templates.find((template) => template.idx === idx));
  });
});

app.delete(`/templates/:idx`, (req, res) => {
  const { idx } = req.params;
  fs.readFile("./templates.json", (err, data) => {
    const templates = JSON.parse(data);
    const newTemplates = JSON.stringify(
      templates.filter((tem) => tem.idx !== idx)
    );
    fs.writeFile("./templates.json", newTemplates, (err) => {
      res.send(true);
    });
  });
});

const port = 2000;

app.listen({ port }, () => console.log(`Running on Port ${port}`));
