"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuth = void 0;
var googleapis_1 = require("googleapis");
var createAuth = function (argv) {
    var scopes = [
        'https://www.googleapis.com/auth/tagmanager.edit.containers',
        'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
        'https://www.googleapis.com/auth/tagmanager.publish',
    ];
    var credentials = JSON.parse(argv.googleJWT);
    return new googleapis_1.google.auth.GoogleAuth({
        credentials: credentials,
        scopes: scopes
    });
};
exports.createAuth = createAuth;
//# sourceMappingURL=accountHelper.js.map