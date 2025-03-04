"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
var payload_utils_1 = require("../lib/payload-utils");
var PrimaryActionEmail_1 = require("../components/emails/PrimaryActionEmail");
exports.Users = {
    slug: "users",
    auth: {
        verify: {
            generateEmailHTML: function (_a) {
                var token = _a.token;
                return (0, PrimaryActionEmail_1.PrimaryActionEmailHtml)({
                    actionLabel: "verify your email and get started",
                    buttonText: "Verify Account",
                    href: "".concat(process.env.NEXT_PUBLIC_SERVER_URL, "/verify-email?token=").concat(token)
                });
            },
        },
    },
    access: {
        // READ ACESS
        read: function (_a) {
            var user = _a.req.user;
            // Deny access if no user is logged in
            if (!user)
                return false;
            // Super admins can read all users
            if ((0, payload_utils_1.isSuperAdmin)(user))
                return true;
            // Admins can read all users except super_admins
            if (user.role === "admin") {
                return {
                    role: { not_in: ["super_admin"] },
                    is_super_admin: { not_equals: true },
                };
            }
            // Normal users can only read their own data
            return {
                id: { equals: user.id },
            };
        },
        // CREATE ACCESS
        create: function () { return true; },
        // UPDATE ACCESS
        update: function (_a) {
            var user = _a.req.user;
            // Super admins can update anything
            if ((0, payload_utils_1.isSuperAdmin)(user))
                return true;
            // Admins can update non-super_admin users
            if (user.role === "admin") {
                return {
                    role: { not_in: ["super_admin"] },
                    is_super_admin: { not_equals: true },
                };
            }
            // Users can only update themselves
            return {
                id: { equals: user.id },
            };
        },
        // DELETE ACCESS
        delete: function (_a) {
            var user = _a.req.user;
            // Super admins can delete anything
            if ((0, payload_utils_1.isSuperAdmin)(user))
                return true;
            // Admins can delete non-super_admin users
            if (user.role === "admin") {
                return {
                    role: { not_in: ["super_admin"] },
                    is_super_admin: { not_equals: true },
                };
            }
            // Users can only delete themselves
            return {
                id: { equals: user.id },
            };
        },
    },
    admin: {
        hidden: function (_a) {
            var user = _a.user;
            return user.role === "user";
        },
        defaultColumns: ["id"]
    },
    fields: [
        {
            name: "products",
            label: "Products",
            admin: {
                condition: function () { return false; },
            },
            type: "relationship",
            relationTo: "products",
            hasMany: true,
        },
        {
            name: "product_files",
            label: "Products Files",
            admin: {
                condition: function () { return false; },
            },
            type: "relationship",
            relationTo: "product_files",
            hasMany: true,
        },
        {
            name: "role",
            admin: {
                // Condition will check if user is admin
                condition: function (_, __, _a) {
                    var user = _a.user;
                    return ((0, payload_utils_1.isSuperOrAdmin)(user));
                },
                components: {},
            },
            required: true,
            defaultValue: "user",
            type: "select",
            options: [
                { label: "Admin", value: "admin" },
                { label: "User", value: "user" },
                // Super Admin option should only be added through admin panel by super admins
            ],
        },
        {
            name: "is_super_admin",
            label: "Super Admin Privilege",
            type: "checkbox",
            defaultValue: false,
            admin: {
                condition: function (_, __, _a) {
                    var user = _a.user;
                    return (0, payload_utils_1.isSuperAdmin)(user);
                }
            }
        },
    ],
};
