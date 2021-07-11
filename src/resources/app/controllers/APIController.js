const auther = require("../../models/auther");
const document = require("../../models/document");
const base = require("../middleware/baseMiddleware");
const AdmZip = require("adm-zip");
const fs = require("fs");

class APIController {
  register = {
    // [POST] api/register/check-username
    checkUsername(req, res, next) {
      auther.findOne({ username: req.body.username }, (err, result) => {
        if (err) {
          res.json('"error": "error"');
        } else {
          if (result) {
            res.json(true);
          } else {
            res.json(false);
          }
        }
      });
    },
  };
  profile = {
    checkOldPassword(req, res, next) {
      auther.findById(req.user._id, function (err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.password === req.body.oldPassword) {
            res.json(true);
          } else {
            res.json(false);
          }
        }
      });
    },
  };

  myDocument = {
    async checkFileName(req, res, next) {
      let fileNameError = await document.findOne(
        {
          userId: req.user._id,
          name: req.body.fileName,
        },
        ["_id"]
      );
      if (fileNameError) {
        res.json(false);
      } else {
        res.json(true);
      }
    },

    getAll(req, res, next) {
      document.find(
        { userId: req.user._id },
        ["name", "application", "size", "uploadAt"],
        { sort: { uploadAt: -1 } },

        (err, documentList) => {
          res.json(documentList);
        }
      );
    },

    async upload(req, res, next) {
      // Authenticate
      if (!req.user || !req.body.fileName || !req.files.file) {
        res.json("Error authenticate!!!");
        return;
      }

      // Save file
      const file = await req.files.file;
      switch (file.name.split(".").pop()) {
        case "docx":
          const folderWordPath = `src/resources/file/document/word/${req.user._id}`;
          base.checkAndCreateDirectory(folderWordPath);
          file.mv(folderWordPath + `/${req.body.fileName}`);
          break;
        case "xlsx":
        case "xlsm":
          const folderExcelPath = `src/resources/file/document/excel/${req.user._id}`;
          base.checkAndCreateDirectory(folderExcelPath);
          file.mv(folderExcelPath + `/${req.body.fileName}`);
          break;
        case "pptx":
          const folderPowerPointPath = `src/resources/file/document/powerPoint/${req.user._id}`;
          base.checkAndCreateDirectory(folderPowerPointPath);
          file.mv(folderPowerPointPath + `/${req.body.fileName}`);
          break;
        default:
          const folderOthersPath = `src/resources/file/document/others/${req.user._id}`;
          base.checkAndCreateDirectory(folderOthersPath);
          file.mv(folderOthersPath + `/${req.body.fileName}`);
      }

      // Create file object to database
      const fileObject = await {
        userId: `${req.user._id}`,
        name: `${req.body.fileName}`,
        application: `${base.getDocumentApplicationWithFileName(file.name)}`,
        size: file.size,
        locate: `src/resources/file/document/${base.getDocumentApplicationWithFileName(
          file.name
        )}/${req.user._id}/${req.body.fileName}`,
        mode: req.body.fileOption,
      };

      await document.create(fileObject, (err) => {
        if (err) res.json("ERR: Lỗi lưu khi vào DB");
      });

      res.json("successfully!");
    },

    deletes(req, res, next) {
      console.log(req.body.documentIds[0]);
    },

    async download(req, res, next) {
      const documents = req.query.documents;
      const user = req.user;

      // Authenticate
      if (!req.user || !documents) {
        res.json("Error authenticate!!!");
        return;
      }

      if (documents.length === 1) {
        const file = await document.findById(documents[0], ["locate"]);

        res.download(file.locate);
        return;
      } else {
        const files = await document.find({ _id: documents }, ["locate"]);
        const zip = new AdmZip();
        const folderProcessPath = `src/resources/file/document/others/${user._id}`;
        const fileProcessPath = `${folderProcessPath}/fileProcess.zip`;

        await files.forEach((file) => {
          zip.addLocalFile(file.locate);
        });

        // create folder to contain the process file (zip)
        await base.checkAndCreateDirectory(folderProcessPath);
        await fs.writeFile(fileProcessPath, zip.toBuffer(), (err) => {
          if (err) {
            console.log(err);
          } else {
            // download file (zip)
            res.download(fileProcessPath, (err) => {
              if (err) {
                console.log(err);
              } else {
                // delete file after download
                fs.unlinkSync(fileProcessPath);
              }
            });
          }
        });
      }
    },
  };
}

module.exports = new APIController();
