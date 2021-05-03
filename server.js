const fs = require("fs");
const path = require("path");
const express = require("express");
const exec = require("child_process").exec;
const ip = require("ip");
const fileUpload = require("express-fileupload");
const config = require("./config.json");

const app = express();
const port = 8080;

app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.static("public"));
app.use("/file", express.static(config.filesDir));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", (req, res) => {
  Object.keys(req.files).forEach((fileKey) => {
    const file = req.files[fileKey];
    const filename = `${file.md5}${path.extname(file.name)}`;
    const tempPath = path.join(__dirname, "temp", filename);
    const permPath = path.join(config.filesDir, filename);
    fs.writeFileSync(tempPath, file.data);
    exec("mv " + tempPath + " " + permPath, (err, stdout, stderr) => {
      if (err) {
        console.log("Error moving to volume");
        console.log(err);
        console.log(stderr);
      }
    });
  });
  res.send({ success: true });
});

app.get("/list", (req, res) => {
  fs.readdir(config.filesDir, (err, files) => {
    res.send(files);
  });
});

app.listen(port, () => {
  console.log("Example app listening at http://" + ip.address() + ":" + port);
});
