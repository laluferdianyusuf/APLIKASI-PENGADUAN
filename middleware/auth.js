const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT } = require("../lib/const");
const adminController = require("../controller/adminController");

module.exports = {
  async authenticate(req, res) {
    const authHeader = req.get("Authorization");
    let token = " ";
    if (authHeader && authHeader.startsWith("Bearer"))
      token = authHeader.split(" ")[1];
    else
      return res.status(401).send({
        status: false,
        message: "You have to login to access this resource",
        data: null,
      });
    try {
      const { id } = jwt.verify(token, JWT.SECRET);
      const getAdmins = await adminController.updateAdmin(id);
      console.log(getAdmins);
      if (!getAdmins) {
        return res.status(401).send({
          status: false,
          message: "Admin not found",
          data: null,
        });
      }
      req.admin = getAdmins;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).send({
        status: false,
        message: "Your Session has expired" + error,
        data: null,
      });
    }
  },
};
