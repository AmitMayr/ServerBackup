"use strict";
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
class OpenGroupDataAccess {
    FindAllGroups(query = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.FindAll(OpenGroupDataAccess.collection, query, {}, { group_name: 1 });
        });
    }
    FindById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.FindByID(OpenGroupDataAccess.collection, id);
        });
    }
    DeleteGroupById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.DeleteById(OpenGroupDataAccess.collection, id);
        });
    }
    InsertOne(group) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof group.locations === 'string') {
                try {
                    group.locations = JSON.parse(group.locations);
                }
                catch (error) {
                    console.error('Error parsing locations:', error);
                    // Handle the error appropriately for your application.
                }
            }
            group.validateOpenGroup();
            return yield db_1.default.Insert(OpenGroupDataAccess.collection, group);
        });
    }
    UpdateGroup(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.Update(OpenGroupDataAccess.collection, id, updateData);
        });
    }
}
OpenGroupDataAccess.collection = 'Groups';
exports.default = OpenGroupDataAccess;
//# sourceMappingURL=OpenGroupsDataAccess.js.map