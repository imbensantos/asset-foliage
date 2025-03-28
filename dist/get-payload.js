"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayloadClient = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
var path_1 = __importDefault(require("path"));
var payload_1 = __importDefault(require("payload"));
var nodemailer_1 = __importDefault(require("nodemailer"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
var RESEND_API_KEY = process.env.RESEND_API_KEY;
var cached = global.payload;
if (!cached) {
    cached = global.payload = {
        client: null,
        promise: null,
    };
}
var transporter = nodemailer_1.default.createTransport({
    host: "smtp.resend.com",
    secure: true,
    port: 465,
    auth: {
        user: "resend",
        pass: RESEND_API_KEY,
    },
});
var getPayloadClient = function () {
    var args_1 = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args_1[_i] = arguments[_i];
    }
    return __awaiter(void 0, __spreadArray([], args_1, true), void 0, function (_a) {
        var _b, _c, error_1;
        var _d = _a === void 0 ? {} : _a, initOptions = _d.initOptions;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (cached.client) {
                        return [2 /*return*/, cached.client];
                    }
                    if (!!cached.promise) return [3 /*break*/, 2];
                    _b = cached;
                    return [4 /*yield*/, payload_1.default.init(__assign({ email: {
                                transport: transporter,
                                fromAddress: "assetfoliage@imbensantos.com",
                                fromName: "The AssetFoliage Team"
                            }, secret: "$2a$12$yV41jtJspVp5S7eRccYSNul5EPSPUVrbGWcbLoFUJwsLiwpQBH4f2", local: (initOptions === null || initOptions === void 0 ? void 0 : initOptions.express) ? false : true }, (initOptions || {})))];
                case 1:
                    _b.promise = _e.sent();
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 5]);
                    _c = cached;
                    return [4 /*yield*/, cached.promise];
                case 3:
                    _c.client = _e.sent();
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _e.sent();
                    cached.promise = null;
                    throw error_1;
                case 5: return [2 /*return*/, cached.client];
            }
        });
    });
};
exports.getPayloadClient = getPayloadClient;
