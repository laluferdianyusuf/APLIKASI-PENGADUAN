const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
// const adminController = require("./controller/adminController");
const middleware = require("./middleware/auth");
const pengaduanController = require("./controller/pengaduanController");
const userController = require("./controller/userController");
const infoController = require("./controller/infoController");
const messageController = require("./controller/messageController");
// const notifikasiController = require("./controller/notifikasiController");
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

// CRUD Admin
app.post("/admin/register", userController.registerAdmin);
app.post("/admin/login", userController.loginAdmin);
app.put(
  "/admin/update/:id",
  middleware.authenticate,
  userController.updateAdmin
);
app.put(
  "/admin/update/complaint/:id",
  middleware.authenticate,
  middleware.roles,
  userController.adminUpdateComplaint
);
app.put(
  "/admin/done/complaint/:id",
  middleware.authenticate,
  middleware.roles,
  userController.adminComplaintDone
);

// CRUD user
app.post("/register/user", userController.registerUser);
app.post("/login/user", userController.loginUser);
app.put("/update/user/:id", middleware.authenticate, userController.updateUser);
app.delete(
  "/delete/user/:id",
  middleware.authenticate,
  userController.deleteUser
);
app.get("/list/user", userController.listUser);
app.get("/user/:id", userController.getUserById);
app.get("/current/user", middleware.authenticate, userController.currentUser);
app.get(
  "/api/user/chat",
  middleware.authenticate,
  userController.getUserByChat
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
app.get("/list/case", pengaduanController.listComplaint);
app.get("/case/violence", pengaduanController.getCaseViolence);
app.get("/case/gender", pengaduanController.getGender);
app.get("/case/education", pengaduanController.getCaseByEducation);
app.get(
  "/case/wait/admin/id",
  middleware.authenticate,
  pengaduanController.getWaitComplaintByUserId
);
app.get(
  "/case/proccess/admin/id",
  middleware.authenticate,
  pengaduanController.getProccessComplaintByUserId
);
app.get(
  "/case/done/admin/id",
  middleware.authenticate,
  pengaduanController.getDoneComplaintByUserId
);
app.get("/case/:id", pengaduanController.getComplaintbyId);
app.get(
  "complaint/update/status",
  middleware.roles,
  pengaduanController.getComplaintUpdate
);
app.get(
  "complaint/done/status",
  middleware.roles,
  pengaduanController.getComplaintDone
);

// CRUD Informasi
app.post("/create/info", infoController.createInfo);
app.put("/update/Info", infoController.updateInfo);
app.delete("/deleted/Info/:id", infoController.deleteInfo);
app.get("/list/Info", infoController.listInfo);

// message api
app.get("/api/message", middleware.authenticate, messageController.getMessage);
app.get(
  "/api/list/message/user",
  middleware.authenticate,
  messageController.getMessageById
);
app.post(
  "/api/create/message",
  middleware.authenticate,
  messageController.createMessage
);
app.delete(
  "/api/delete/message/:id",
  middleware.authenticate,
  messageController.deleteMessage
);

app.use(express.json());
app.listen(process.env.PORT || 5000, function () {
  console.log(
    "Express server listening on port %d in %s mode",
    this.address().port,
    app.settings.env
  );
  console.log(`http://localhost:${this.address().port}`);
});
