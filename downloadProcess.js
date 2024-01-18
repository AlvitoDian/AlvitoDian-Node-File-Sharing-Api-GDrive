const { authorize } = require("./googleAuth.js");
const { google } = require("googleapis");
const express = require("express");
const {
  auth,
} = require("googleapis/build/src/apis/abusiveexperiencereport/index.js");
const app = express();

//? GET Download File
/* const getDownload = async (req, res) => {
  const fileId = req.params.parameter;
  const authClient = await authorize();
  

  try {
    await downloadFile(authClient, fileId, res);
  } catch (error) {
    return res.status(500).send(`Error downloading file: ${error.message}`);
  } finally {
    try {
      await deleteFile(authClient, fileId);
    } catch (deleteError) {
      console.error("Error deleting file:", deleteError);
      // Tangani kesalahan penghapusan seperti yang dibutuhkan, misalnya, log atau kirim respons
    }

    // Akhiri respons setelah file dikirim atau terjadi kesalahan
    res.end();
  }
};
 */
const getDownload = async (req, res) => {
  const fileId = req.params.parameter;
  const authClient = await authorize();

  const fileMetadata = await getFileMetadata(authClient, fileId);

  res.render("downloadedFile", {
    fileId: fileId,
    fileName: fileMetadata.name,
    fileFormat: fileMetadata.format,
  });
};

const downloadingFile = async (req, res) => {
  const fileId = req.params.parameter;
  const authClient = await authorize();

  try {
    await downloadFile(authClient, fileId, res);
  } catch (error) {
    return res.status(500).send(`Error downloading file: ${error.message}`);
  } finally {
    try {
      await deleteFile(authClient, fileId);
    } catch (deleteError) {
      console.error("Error deleting file:", deleteError);
      // Tangani kesalahan penghapusan seperti yang dibutuhkan, misalnya, log atau kirim respons
    }

    // Akhiri respons setelah file dikirim atau terjadi kesalahan
    res.end();
  }
};

//? Function Download File
async function downloadFile(authClient, fileId, res) {
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    const { data } = await drive.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    // Get file metadata to determine the file name and content type
    const fileMetadata = await drive.files.get({
      fileId: fileId,
      fields: "name, mimeType",
    });

    const fileName = fileMetadata.data.name;
    const contentType = fileMetadata.data.mimeType;

    // Set headers to suggest the filename and specify the default download directory
    const headers = {
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Type": contentType,
    };

    // Send the headers in the response
    res.set(headers);

    // Stream the file content directly to the response
    data.pipe(res);
  } catch (error) {
    console.error("Error downloading file from Google Drive:", error);
    res.status(500).send("Error downloading file from Google Drive.");
  }
}

//? Delte File in Google Drive
async function deleteFile(authClient, fileId) {
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    await drive.files.delete({
      fileId: fileId,
    });
    console.log(`File dengan ID ${fileId} berhasil dihapus dari Google Drive.`);
  } catch (error) {
    console.error(`Error deleting file from Google Drive: ${error}`);
    throw error;
  }
}

//? Get File MetaData
async function getFileMetadata(authClient, fileId) {
  const drive = google.drive({ version: "v3", auth: authClient });

  try {
    const { data } = await drive.files.get({
      fileId: fileId,
      fields: "name, mimeType", // Sesuaikan dengan properti yang Anda butuhkan
    });

    return {
      name: data.name,
      format: data.mimeType.split("/")[1], // Mendapatkan ekstensi format file
    };
  } catch (error) {
    console.error("Error getting file metadata from Google Drive:", error);
    throw error;
  }
}

module.exports = {
  getDownload,
  downloadingFile,
};
