"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var get_payload_1 = require("./get-payload");
var next_utils_1 = require("./next-utils");
var trpcExpress = __importStar(require("@trpc/server/adapters/express"));
var trpc_1 = require("./trpc");
var body_parser_1 = __importDefault(require("body-parser"));
var webhooks_1 = require("./webhooks");
var build_1 = __importDefault(require("next/dist/build"));
var path_1 = __importDefault(require("path"));
var url_1 = require("url");
var app = (0, express_1.default)();
var PORT = Number(process.env.PORT) || 3000;
var createContext = function (_a) {
    var req = _a.req, res = _a.res;
    return ({
        req: req,
        res: res,
    });
};
var start = function () { return __awaiter(void 0, void 0, void 0, function () {
    var webhookMiddleware, error_1, payload, cartRouter;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                webhookMiddleware = body_parser_1.default.json({
                    verify: function (req, _, buffer) {
                        req.rawBody = buffer;
                    },
                });
                app.post("/api/webhooks/stripe", webhookMiddleware, webhooks_1.stripeWebhookHandler);
                if (!process.env.NEXT_BUILD) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                console.log("📦 Building Next.js...");
                // @ts-expect-error
                return [4 /*yield*/, (0, build_1.default)(path_1.default.join(__dirname, "../"))];
            case 2:
                // @ts-expect-error
                _a.sent();
                console.log("✅ Next.js build complete");
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error("❌ Next.js build failed", error_1);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [4 /*yield*/, (0, get_payload_1.getPayloadClient)({
                    initOptions: {
                        express: app,
                        onInit: function (cms) { return __awaiter(void 0, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                cms.logger.info("Admin URL ".concat(cms.getAdminURL()));
                                return [2 /*return*/];
                            });
                        }); },
                    },
                })];
            case 5:
                payload = _a.sent();
                cartRouter = express_1.default.Router();
                cartRouter.use(payload.authenticate);
                cartRouter.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
                    var _a, user, url, parsedUrl;
                    return __generator(this, function (_b) {
                        _a = req, user = _a.user, url = _a.url;
                        if (!user) {
                            return [2 /*return*/, res.redirect("/login?origin=cart")];
                        }
                        parsedUrl = (0, url_1.parse)(url, true);
                        return [2 /*return*/, next_utils_1.nextApp.render(req, res, "/cart", parsedUrl.query)];
                    });
                }); });
                app.use("/cart", cartRouter);
                // 👉 TRPC Middleware
                app.use("/api/trpc", trpcExpress.createExpressMiddleware({
                    router: trpc_1.appRouter,
                    createContext: createContext,
                }));
                // 👉 Start Next.js server
                return [4 /*yield*/, next_utils_1.nextApp.prepare()];
            case 6:
                // 👉 Start Next.js server
                _a.sent();
                payload.logger.info("🚀 NextJS started");
                app.use(function (req, res) { return (0, next_utils_1.nextHandler)(req, res); });
                app.listen(PORT, function () {
                    payload.logger.info("\uD83C\uDF10 NextJS App URL: ".concat(process.env.NEXT_PUBLIC_SERVER_URL));
                });
                return [2 /*return*/];
        }
    });
}); };
start();
