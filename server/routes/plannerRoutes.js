const express = require("express");
const router = express.Router();
const { getTravelPlan } = require("../controllers/plannerController");

router.get("/", getTravelPlan);

module.exports = router;