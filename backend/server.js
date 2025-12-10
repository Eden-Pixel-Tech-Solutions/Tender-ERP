require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth");
const gemTendersRoutes = require("./routes/gemTenders");
const gemTenderInterest = require("./routes/gemTenderInterest");

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("ERP Backend Running...");
});

// MAIN API ROUTES
app.use("/api/gem-tenders", gemTendersRoutes);
app.use("/api/gem-tenders-interest", gemTenderInterest);  // ✅ FIXED

// Start Server
app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
