const fs = require("fs");
const path = require("path");
const express = require("express");
const ip = require("ip");
const fileUpload = require("express-fileupload");
const config = require("./config.json");

const app = express();
const port = 8080;

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  Object.keys(req.files).forEach((fileKey) => {
    const file = req.files[fileKey];
    const filename = `${file.md5}${path.extname(file.name)}`;
    fs.writeFileSync(path.join(config.filesDir, filename), file.data);
  });
  res.send({ success: true });
});

app.listen(port, () => {
  console.log("Example app listening at http://" + ip.address() + ":" + port);
});
