const fs = require("fs");
const path = require("path");
const express = require("express");
const exec = require("child_process").exec;
const ip = require("ip");
const fileUpload = require("express-fileupload");
const config = require("./config.json");

const app = express();
const port = 8080;

const writeFile = async (filename, data) => {
  const tempPath = path.join(__dirname, "temp", filename);
  const permPath = path.join(config.filesDir, filename);

  fs.writeFile(tempPath, data, (err) => {
    exec("mv " + tempPath + " " + permPath, (err, stdout, stderr) => {
      if (err) {
        console.log("Error moving to volume");
        console.log(err);
        console.log(stderr);
      }
    });
  });
};

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
    const ext = path.extname(file.name);
    const newFilename = `${file.md5}${ext}`;

    if (ext.toLowerCase() === ".heic") {
      convert({
        buffer: file.data,
        format: "JPEG",
        quality: 1,
      }).then((output) => {
        writeFile(newFilename, output);
      });
    } else {
      writeFile(newFilename);
    }
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
