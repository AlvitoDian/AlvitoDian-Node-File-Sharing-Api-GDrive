const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const { google } = require("googleapis");
const { Readable } = require("stream");
const qrcode = require("qrcode");
const multer = require("multer");
const downloadProcess = require("./downloadProcess.js");
const { authorize } = require("./googleAuth.js");
//? Configure Multer to handle file uploads
const upload = multer();

//? Configure Port
const app = express();
const port = process.env.PORT || 5000;

//? EJS Templating
app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

//? Server Start
app.listen(port, () => console.log(`Listening to port ${port}`));

app.use(bodyParser.urlencoded({ extended: true }));

//? GET Request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let uploadedFileId = null;

//? POST Request
app.post("/submit", upload.single("fileInput"), async (req, res) => {
  const file = req.file;

  // Check if file is present in the request
  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Upload Process
  try {
    const authClient = await authorize();
    const fileId = await uploadFileToDrive(authClient, file);

    uploadedFileId = fileId;

    // Response
    console.log("File uploaded. Redirecting to /fileId/:fileId");
    res.redirect(`/fileId/${encodeURIComponent(fileId)}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error uploading file to Google Drive Submit.");
  }
});

//? Fucntion Create in Google Drive
async function uploadFileToDrive(authClient, file) {
  const drive = google.drive({ version: "v3", auth: authClient });

  // Extracting file information
  const originalFileName = file.originalname;
  const mimeType = file.mimetype;

  // Create file metadata
  const fileMetadata = {
    name: originalFileName,
    parents: ["1EHyn2xko7_kkuyw_NsZg4P1vAYJHS_kh"], // ID Google Drive Folder
  };

  // Create media information
  const media = {
    mimeType: mimeType,
    body: Readable.from(file.buffer),
  };

  try {
    // Upload file to Google Drive
    const { data } = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: "id",
    });

    return data.id;
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    throw error;
  }
}

//? End Point Display Download Page
app.get("/fileId/:fileId", async (req, res) => {
  const requestedFileId = req.params.fileId;

  if (uploadedFileId && uploadedFileId === requestedFileId) {
    try {
      const authClient = await authorize();
      // const content = await fileContent(authClient, uploadedFileId);

      const qrCodeText = `https://node-file-sharing-api-g-drive.vercel.app/download/${requestedFileId}`;
      /* const qrCodeText = `http://localhost:5000//download/${requestedFileId}`; */
      const qrCodeDataURL = await qrcode.toDataURL(qrCodeText);

      res.render("download", { fileId: uploadedFileId, qrCodeDataURL });
    } catch (error) {
      console.error("Error:", error);
      res
        .status(500)
        .send(
          "Terjadi kesalahan saat mengambil konten file dari Google Drive."
        );
    }
  } else {
    res.status(404).send("File tidak ditemukan atau sudah dihapus.");
  }
});

// //? GET Download File
app.get("/download/:parameter", downloadProcess.getDownload);

app.get("/downloading/:parameter", downloadProcess.downloadingFile);
