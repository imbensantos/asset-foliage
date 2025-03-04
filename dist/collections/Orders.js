"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orders = void 0;
var payload_utils_1 = require("../lib/payload-utils");
var isYourOwn = function (_a) {
    var user = _a.req.user;
    if (user.role === "admin")
        return true;
    return {
        user: { equals: user === null || user === void 0 ? void 0 : user.id },
    };
};
var isSuperOrAdminFieldAccess = function (_a) {
    var user = _a.req.user;
    return (0, payload_utils_1.isSuperOrAdmin)(user);
};
exports.Orders = {
    slug: "orders",
    admin: {
        useAsTitle: "Your Orders",
        description: "A summary of all your orders on AssetFoliage.",
    },
    access: {
        read: isYourOwn,
        create: payload_utils_1.isSuperOrAdminAccess,
        update: payload_utils_1.isSuperOrAdminAccess,
        delete: payload_utils_1.isSuperOrAdminAccess,
    },
    fields: [
        {
            name: "_isPaid",
            type: "checkbox",
            access: {
                read: isSuperOrAdminFieldAccess,
                create: function () { return false; },
                update: function () { return false; },
            },
            admin: { hidden: true },
            required: true,
        },
        {
            name: "user",
            type: "relationship",
            admin: { hidden: true },
            relationTo: "users",
            required: true,
        },
        {
            name: "products",
            type: "relationship",
            relationTo: "products",
            hasMany: true,
            required: true,
        },
    ],
};
