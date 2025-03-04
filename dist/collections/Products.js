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
exports.Products = void 0;
var config_1 = require("../config");
var stripe_1 = __importDefault(require("stripe"));
var payload_utils_1 = require("../lib/payload-utils");
var isSuperOrAdminFieldAccess = function (_a) {
    var user = _a.req.user;
    return (0, payload_utils_1.isSuperOrAdmin)(user);
};
var isSuperOrAdminOrHasAccess = function () { return function (_a) {
    var _user = _a.req.user;
    var user = _user;
    if (!user)
        return false;
    if ((0, payload_utils_1.isSuperOrAdmin)(user))
        return true;
    var userProductIDs = (user.products || []).reduce(function (acc, product) {
        if (product)
            return acc;
        if (typeof product === "string") {
            acc.push(product);
        }
        else {
            acc.push(product.id);
        }
        return acc;
    }, []);
    return { id: { in: userProductIDs } };
}; };
var addUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var user;
    var req = _b.req, data = _b.data;
    return __generator(this, function (_c) {
        user = req.user;
        return [2 /*return*/, __assign(__assign({}, data), { user: user.id })];
    });
}); };
var syncUser = function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
    var fullUser, products, allIDs_1, createdProductIDs, dataToUpdate;
    var _c;
    var req = _b.req, doc = _b.doc;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, req.payload.findByID({
                    collection: "users",
                    id: req.user.id,
                })];
            case 1:
                fullUser = _d.sent();
                if (!(fullUser && typeof fullUser === "object")) return [3 /*break*/, 3];
                products = fullUser.products;
                allIDs_1 = __spreadArray([], ((_c = products === null || products === void 0 ? void 0 : products.map(function (product) {
                    return typeof product === "object" ? product.id : product;
                })) !== null && _c !== void 0 ? _c : []), true);
                createdProductIDs = allIDs_1.filter(function (id, index) { return allIDs_1.indexOf(id) === index; });
                dataToUpdate = __spreadArray(__spreadArray([], createdProductIDs, true), [doc.id], false);
                return [4 /*yield*/, req.payload.update({
                        collection: "users",
                        id: fullUser.id,
                        data: {
                            products: dataToUpdate,
                        },
                    })];
            case 2:
                _d.sent();
                _d.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.Products = {
    slug: "products",
    admin: {
        useAsTitle: "name",
    },
    access: {
        read: isSuperOrAdminOrHasAccess(),
        update: isSuperOrAdminOrHasAccess(),
        delete: isSuperOrAdminOrHasAccess(),
    },
    hooks: {
        beforeChange: [
            addUser,
            function (args) { return __awaiter(void 0, void 0, void 0, function () {
                var stripe, data, createdProduct, updated, data, updatedProduct, updated;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            stripe = new stripe_1.default((_a = process.env.STRIPE_SECRET_KEY) !== null && _a !== void 0 ? _a : "", {
                                apiVersion: "2025-02-24.acacia",
                                typescript: true,
                            });
                            if (!(args.operation === "create")) return [3 /*break*/, 2];
                            data = args.data;
                            return [4 /*yield*/, stripe.products.create({
                                    name: data.name,
                                    default_price_data: {
                                        currency: "USD",
                                        unit_amount: Math.round(data.price * 100), // product price in cents
                                    },
                                })];
                        case 1:
                            createdProduct = _b.sent();
                            updated = __assign(__assign({}, data), { stripeId: createdProduct.id, priceId: createdProduct.default_price });
                            return [2 /*return*/, updated];
                        case 2:
                            if (!(args.operation === "update")) return [3 /*break*/, 4];
                            data = args.data;
                            return [4 /*yield*/, stripe.products.update(data.stripeId, {
                                    name: data.name,
                                    default_price: data.priceId,
                                })];
                        case 3:
                            updatedProduct = _b.sent();
                            updated = __assign(__assign({}, data), { stripeId: updatedProduct.id, priceId: updatedProduct.default_price });
                            return [2 /*return*/, updated];
                        case 4: return [2 /*return*/];
                    }
                });
            }); },
        ],
        afterChange: [syncUser],
    },
    fields: [
        {
            name: "user",
            type: "relationship",
            relationTo: "users",
            required: true,
            hasMany: false,
            admin: {
                condition: function () { return false; },
            },
        },
        {
            name: "name",
            label: "Name",
            type: "text",
            required: true,
        },
        {
            name: "description",
            label: "Product Details",
            type: "textarea",
            // TODO: Implement richText editor and rendering
            // type: "richText",
            // editor: slateEditor({
            //   admin: {
            //     elements: [
            //       'link', 'ol', 'ul'
            //     ],
            //     leaves: ['bold', 'italic', 'code', 'strikethrough', 'underline']
            //   }
            // })
        },
        {
            name: "price",
            label: "Price in USD",
            min: 0,
            max: 1000,
            type: "number",
            required: true,
        },
        {
            name: "category",
            label: "Category",
            type: "select",
            options: config_1.PRODUCT_CATEGORIES.map(function (_a) {
                var label = _a.label, value = _a.value;
                return ({ label: label, value: value });
            }),
            required: true,
        },
        {
            name: "product_files",
            label: "Product File(s)",
            type: "relationship",
            required: true,
            relationTo: "product_files",
            hasMany: false,
        },
        {
            name: "approvedForSale",
            label: "Product Status",
            type: "select",
            defaultValue: "pending",
            options: [
                { label: "Pending verification", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Denied", value: "denied" },
            ],
            access: {
                create: isSuperOrAdminFieldAccess,
                read: isSuperOrAdminFieldAccess,
                update: isSuperOrAdminFieldAccess,
            },
        },
        {
            name: "priceId",
            type: "text",
            admin: { hidden: true },
            access: {
                create: function () { return false; },
                read: function () { return false; },
                update: function () { return false; },
            },
        },
        {
            name: "stripeId",
            type: "text",
            admin: { hidden: true },
            access: {
                create: function () { return false; },
                read: function () { return false; },
                update: function () { return false; },
            },
        },
        {
            name: "images",
            label: "Product Images",
            type: "array",
            minRows: 1,
            maxRows: 4,
            required: true,
            labels: {
                singular: "Image",
                plural: "Images",
            },
            fields: [
                {
                    name: "image",
                    type: "upload",
                    relationTo: "media",
                    required: true,
                },
            ],
        },
    ],
};
