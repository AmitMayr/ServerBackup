"use strict";
// src/resources/users/UserDataAccess.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../../utils/db"));
const GroupDataAccess_1 = __importDefault(require("../groups/GroupDataAccess"));
class UserDataAccess {
    FindAllUsers(query = {}, projection = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.FindAll(UserDataAccess.collection, query, projection);
        });
    }
    FindById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.FindByID(UserDataAccess.collection, id);
        });
    }
    DeleteUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.DeleteById(UserDataAccess.collection, id);
        });
    }
    InsertOne(user) {
        return __awaiter(this, void 0, void 0, function* () {
            user.validateUser();
            if (!user.groups || user.groups.length === 0) {
                const groupDataAccess = new GroupDataAccess_1.default();
                const generalGroup = yield groupDataAccess.getGeneralGroup();
                if (generalGroup) {
                    user.groups = [generalGroup._id];
                }
            }
            return yield db_1.default.Insert(UserDataAccess.collection, user);
        });
    }
    Update(id, updatedUser) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.Update(UserDataAccess.collection, id, updatedUser);
        });
    }
    UpdateUserDeletionStatus(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.default.Update(UserDataAccess.collection, id, {
                    deleted: true,
                    status: "inactive"
                });
            }
            catch (error) {
                return error;
            }
        });
    }
    UpdateUserDetails(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.Update(UserDataAccess.collection, id, updateData);
        });
    }
}
UserDataAccess.collection = 'Users';
exports.default = UserDataAccess;
//# sourceMappingURL=UserDataAccess.js.map