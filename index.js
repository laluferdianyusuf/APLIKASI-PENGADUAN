const express = require("express");
const path = require("path");
const cors = require("cors");
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
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "BERHASIL",
  });
});

// Admin
app.get("/admin", middleware.authenticate, userController.listUser);
app.post("/admin/register", adminController.registerAdmin);
app.post("/admin/login", adminController.loginAdmin);
app.put(
  "/admin/update/:id",
  middleware.authenticate,
  adminController.updateAdmin
);
app.put("/admin/update/complaint/:id", adminController.complaintUpdate);
app.put("/admin/done/complaint/:id", adminController.complaintDone);

// CRUD user
app.post("/register/user", userController.registerUser);
app.post("/login/user", userController.loginUser);
app.put("/update/user/:id", middleware.authenticate, userController.updateUser);
app.delete(
  "/delete/user/:id",
  middleware.authenticate,
  userController.deleteUser
);
app.get("/getAll/user", userController.listUser);
app.get("/getUserById/user/:id", userController.getUserById);
app.get(
  "/getCurrent/user",
  middleware.authenticate,
  userController.currentUser
);

// Complaint form user / CRUD items
app.post(
  "/create",
  middleware.authenticate,
  pengaduanController.complaintClient
);
app.put(
  "/update/:id",
  middleware.authenticate,
  pengaduanController.updatePengaduan
);
app.put("/update/status/:id", pengaduanController.complaintClient);
app.delete(
  "/delete/:id",
  middleware.authenticate,
  pengaduanController.deletePengaduan
);
app.get("/getAll", pengaduanController.getAllCase);
app.get("/getCase", pengaduanController.getPengaduan);
app.get(
  "/getCaseByUserId",
  middleware.authenticate,
  pengaduanController.getPengaduanByUserId
);
app.get("/getGender", pengaduanController.getGender);
app.get("/getCase/:id", pengaduanController.getCasebyId);

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
