const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");
const courseRoutes = require("./courseRoutes");
const lectureRoutes = require("./lectureRoutes");
const sectionRoutes = require("./sectionRoutes");


router.use("",categoryRoutes);
router.use("",lectureRoutes);
router.use("", sectionRoutes);
router.use("",courseRoutes);
router.use("",authRoutes);


module.exports = router;