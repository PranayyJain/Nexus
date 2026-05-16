const express = require("express");
const { verifyToken } = require("../middleware/auth.middleware");
const { getDocuments } = require("../controllers/library.controller");

const router = express.Router();

router.use(verifyToken);
router.get("/", getDocuments);

module.exports = router;
