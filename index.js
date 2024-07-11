const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authController = require("./controller/authController");
const adminController = require("./controller/adminController");
const middleware = require("./middleware/auth");
const pengaduanController = require("./controller/pengaduanController");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BERHASIL",
  });
});

// Admin
// app.get("/admin", authController.authorizeAdmin);
app.post("/admin/register", adminController.registerAdmin);
app.post("/admin/login", adminController.loginAdmin);
// app.put(
//   "/admin/update/:id",
//   middleware.authenticate,
//   adminController.updateAdmin
app.put(
  "/admin/update/:id",
  authController.authorizeAdmin,
  adminController.updateAdmin
);

// Complaint form client
app.post("/klien/create", pengaduanController.complaintClient);
app.put("/klien/update/:id", pengaduanController.updatePengaduan);
app.delete("/klien/delete/:id", pengaduanController.deletePengaduan);
app.get("/klien/getAll", pengaduanController.getAllCase);
app.get("/klien/getCase", pengaduanController.getPengaduan);
app.get("/klien/getGender", pengaduanController.getGender);

// complaint form Admin

app.use(express.json());
app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
  console.log(`http://localhost:${this.address().port}`);
});
