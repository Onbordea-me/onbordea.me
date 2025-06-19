const express = require("express");
const router = express.Router();
const { getEmployees, addEmployee, removeEmployee } = require("../controllers/employeeController");

router.get("/", getEmployees);
router.post("/", addEmployee);
router.delete("/:id", removeEmployee);

module.exports = router;