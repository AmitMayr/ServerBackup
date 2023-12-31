"use strict";
// src/resources/users/UserModel.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const TimeService_1 = require("../../services/TimeService");
class UserModel {
    constructor(userData) {
        this.email = userData.email;
        this.password = userData.password;
        this.phone_number = userData.phone_number;
        this.image_URL = userData.image_URL;
        this.first_name = userData.first_name;
        this.last_name = userData.last_name;
        this.gender = userData.gender;
        this.coins = userData.coins || 0;
        this.createdAt = userData.createdAt || (0, TimeService_1.getCurrentTimeInIsrael)();
        this.updatedAt = userData.updatedAt || (0, TimeService_1.getCurrentTimeInIsrael)();
        this.last_login_date = userData.last_login_date;
        this.groups = userData.groups || [];
        this.status = userData.status || "active";
        this.deleted = userData.deleted || false;
        this.notification_token = userData.notification_token || "";
    }
    validateUser() {
        const schema = joi_1.default.object({
            email: joi_1.default.string().email().max(50).required(),
            password: joi_1.default.string().min(8).required(),
        });
        // Only validate the email and password properties
        const { error } = schema.validate({
            email: this.email,
            password: this.password,
        });
        if (error) {
            throw new Error(error.details[0].message);
        }
    }
    static fromUserDocument(userDocument) {
        return new UserModel(userDocument);
    }
    isProfileComplete() {
        return (!!this.email &&
            !!this.password &&
            !!this.phone_number &&
            !!this.image_URL &&
            !!this.first_name &&
            !!this.last_name &&
            !!this.gender);
    }
}
exports.default = UserModel;
//# sourceMappingURL=UserModel.js.map