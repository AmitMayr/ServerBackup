"use strict";
// src/resources/kpis/KpiController.ts
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
exports.getHitchhikerMonthlyCountsByGender = exports.getRideAndTripCounts = exports.getPeopleAndTrempCounts = exports.getMostRequestedHours = exports.getTopDrivers = exports.getMostPopularRoutes = void 0;
const KpiDataAccess_1 = __importDefault(require("./KpiDataAccess"));
const kpiDataAccess = new KpiDataAccess_1.default();
function getMostPopularRoutes(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const routes = yield kpiDataAccess.getMostPopularRoutes();
            res.status(200).json({ status: true, data: routes });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getMostPopularRoutes = getMostPopularRoutes;
function getTopDrivers(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const drivers = yield kpiDataAccess.getTopDrivers();
            res.status(200).json({ status: true, data: drivers });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getTopDrivers = getTopDrivers;
function getMostRequestedHours(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hours = yield kpiDataAccess.getMostRequestedHours();
            res.status(200).json({ status: true, data: hours });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getMostRequestedHours = getMostRequestedHours;
function getPeopleAndTrempCounts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const peopleCounts = yield kpiDataAccess.getPeopleAndTrempCounts();
            res.status(200).json({ status: true, data: peopleCounts });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getPeopleAndTrempCounts = getPeopleAndTrempCounts;
function getRideAndTripCounts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const counts = yield kpiDataAccess.getRideAndTripCounts();
            res.status(200).json({ status: true, data: counts });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getRideAndTripCounts = getRideAndTripCounts;
function getHitchhikerMonthlyCountsByGender(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const hitchhikerMonthlyCountsByGender = yield kpiDataAccess.getHitchhikerMonthlyCountsByGender();
            res.status(200).json({ status: true, data: hitchhikerMonthlyCountsByGender });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.getHitchhikerMonthlyCountsByGender = getHitchhikerMonthlyCountsByGender;
//# sourceMappingURL=KpiController.js.map