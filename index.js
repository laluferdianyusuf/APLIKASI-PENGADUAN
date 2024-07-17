const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const authController = require("./controller/authController");
const adminController = require("./controller/adminController");
const middleware = require("./middleware/auth");
const pengaduanController = require("./controller/pengaduanController");
const userController = require("./controller/userController");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BERHASIL",
  });
});

// Superadmin
app.post("");
// Admin
// app.get("/admin", authController.authorizeAdmin);
app.post("/admin/register", adminController.registerAdmin);
app.post("/admin/login", adminController.loginAdmin);
app.put(
  "/admin/update/:id",
  middleware.authenticate,
  authController.authorizeAdmin,
  adminController.updateAdmin
);
app.put("/admin/update/complaint/:id", adminController.complaintUpdate);
app.put("/admin/done/complaint/:id", adminController.complaintDone);

// CRUD user
app.post("/register/user", userController.registerUser);
app.post("/login/user", userController.loginUser);
app.put("/update/user/:id", middleware.authenticate, userController.updateUser);
app.delete("/delete/user/:id", userController.deleteUser);
app.get("/getAll/user/", userController.getAllUser);
app.get("/getUserById/user/:id", userController.getUserById);

// Complaint form user / CRUD items
app.post(
  "/create",
  middleware.authenticate,
  pengaduanController.complaintClient
);
app.put("/update/:id", pengaduanController.updatePengaduan);
app.put("/update/status/:id", pengaduanController.complaintClient);
app.delete("/delete/:id", pengaduanController.deletePengaduan);
app.get("/getAll", pengaduanController.getAllCase);
app.get("/getCase", pengaduanController.getPengaduan);
app.get("/getCaseByUserId/:id", pengaduanController.getPengaduanByUserId);
app.get("/getGender", pengaduanController.getGender);

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
