const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Add this after app.use(express.json());
app.use('/api/employees', require('./routes/employeeRoutes'));// Add similar routes for equipment, tickets, etc.

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
