"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../../middleware/auth");
const GroupController_1 = require("./GroupController");
const multer_1 = __importDefault(require("multer"));
const multerConfig_1 = __importDefault(require("../../config/multerConfig"));
const handleErrors_1 = require("../../middleware/handleErrors");
const upload = (0, multer_1.default)(multerConfig_1.default);
const groupRoutes = express_1.default.Router();
groupRoutes.get("/getById/:id", auth_1.authenticateToken, GroupController_1.getGroupById);
groupRoutes.post("/groups-user-not-connected", auth_1.authenticateToken, GroupController_1.getGroupsUserNotConnected); // הצגת כל הקבוצות שהוא לא התחבר אליהן
groupRoutes.get("/groups-user-connected/:user_id", auth_1.authenticateToken, GroupController_1.getConnectedGroups);
groupRoutes.put("/join-group-request", auth_1.authenticateToken, GroupController_1.addGroupToUser);
groupRoutes.put("/disconnect-from-group", auth_1.authenticateToken, GroupController_1.removeGroupFromUser);
groupRoutes.put("/add-admin-to-group", auth_1.authenticateToken, GroupController_1.addAdminToGroup);
groupRoutes.post("/all-groups-with-user-status", auth_1.authenticateToken, GroupController_1.allGroupsWithUserStatus);
groupRoutes.put("/update", auth_1.authenticateToken, GroupController_1.updateGroup);
groupRoutes.post("/upload-image/:id", auth_1.authenticateToken, upload.any(), GroupController_1.uploadGroupImage);
// admin
groupRoutes.get("/all", auth_1.authenticateToken, GroupController_1.getAllGroups);
groupRoutes.delete("/delete/:id", auth_1.authenticateToken, GroupController_1.deleteGroupById);
groupRoutes.put("/markDeleted/:id", auth_1.authenticateToken, GroupController_1.markGroupAsDeleted);
groupRoutes.post("/add-group", auth_1.authenticateToken, upload.single('image_URL'), GroupController_1.addGroup);
groupRoutes.put("/update-group/:id", auth_1.authenticateToken, upload.single('image_URL'), GroupController_1.updateGroupDetails);
// groupRoutes.post("/add-loction/:id", authenticateToken, addGroup);
// groupRoutes.post("/update-loction/:id", authenticateToken, addGroup);
groupRoutes.use(handleErrors_1.handleErrors);
exports.default = groupRoutes;
//# sourceMappingURL=GroupRoutes.js.map