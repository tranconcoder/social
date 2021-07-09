const auther = require("../../models/auther");
const document = require("../../models/document");
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
      let fileNameError = await document.findOne({
        userId: req.user._id,
        name: req.body.fileName,
      });
      console.log(fileNameError);
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

    async upload (req, res, next) {
      console.log(req.body)
      console.log(req.files.file)
      res.json(req.files.file)
    },

    downloadOne(req, res, next) {
      document.findOne(
        { _id: req.params.documentId },
        ["userId", "locate"],
        function (err, result) {
          if (result.userId == req.user._id && !err) {
            res.download(result.locate);
          }
        }
      );
    },
  };
}

module.exports = new APIController();
