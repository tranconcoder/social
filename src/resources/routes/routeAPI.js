const express = require("express");
const router = express.Router();
const APIController = require("../app/controllers/APIController");
// const uploadMiddleware = require("../app/middleware/uploadDocument");

router.get("/my-documents/download", APIController.myDocument.download);
router.get("/my-documents/get-all", APIController.myDocument.getAll);
router.post("/register/checkUsername", APIController.register.checkUsername);
router.post("/profile/change-password", APIController.profile.checkOldPassword);
router.post(
  "/my-documents/check-file-name",
  APIController.myDocument.checkFileName
);
router.post(
  "/my-documents/upload/:id/:name/:size",
  APIController.myDocument.upload
);
router.delete("/my-documents/delete", APIController.myDocument.delete);

module.exports = router;
