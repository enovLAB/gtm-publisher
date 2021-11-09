#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var process_1 = require("process");
var fs = __importStar(require("@supercharge/fs"));
var yargs = __importStar(require("yargs"));
var scopes = [
    'https://www.googleapis.com/auth/tagmanager.edit.containers',
    'https://www.googleapis.com/auth/tagmanager.edit.containerversions',
    'https://www.googleapis.com/auth/tagmanager.publish'
];
var tagmanager = googleapis_1.google.tagmanager('v2');
var auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: './yoop-dev1-na-4dcd624a8fe9.json',
    scopes: scopes
});
var getAccountId = function () { return __awaiter(void 0, void 0, void 0, function () {
    var authClient, accounts;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, auth.getClient()];
            case 1:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.list({ auth: authClient })];
            case 2:
                accounts = _b.sent();
                return [2 /*return*/, (_a = (accounts.data.account || [])[0]) === null || _a === void 0 ? void 0 : _a.accountId];
        }
    });
}); };
var getContainerId = function (accountId) { return __awaiter(void 0, void 0, void 0, function () {
    var authClient, containers;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, auth.getClient()];
            case 1:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.list({
                        parent: "accounts/" + accountId, auth: authClient
                    })];
            case 2:
                containers = _b.sent();
                return [2 /*return*/, (_a = (containers.data.container || [])[0]) === null || _a === void 0 ? void 0 : _a.containerId];
        }
    });
}); };
var getWorkspaceId = function (accountId, containerId) { return __awaiter(void 0, void 0, void 0, function () {
    var authClient, workspaces;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, auth.getClient()];
            case 1:
                authClient = _a.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.list({
                        parent: "accounts/" + accountId + "/containers/" + containerId, auth: authClient
                    })];
            case 2:
                workspaces = _a.sent();
                return [2 /*return*/, (workspaces.data.workspace || [])[0].workspaceId];
        }
    });
}); };
function main() {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var argv, account, _b, container, _c, workspace, _d, _e, path, authClient, data, res, template, tempAvatar;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0: return [4 /*yield*/, yargs
                        .option('googleJWT', {
                        alias: 'j',
                        description: 'The path of the google service token in JSON format',
                        type: 'string',
                        demandOption: true,
                    })
                        .option('templateId', {
                        alias: 't',
                        description: 'The tag template Id',
                        type: 'string',
                        demandOption: true,
                    })
                        .option('templatePath', {
                        alias: 'p',
                        description: 'the path to the template file',
                        type: 'string',
                        demandOption: true,
                    })
                        .option('accountId', {
                        alias: 'a',
                        description: 'The GTM account Id',
                        type: 'string'
                    })
                        .option('containerId', {
                        alias: 'c',
                        description: 'The GTM container Id',
                        type: 'string'
                    })
                        .option('workspaceId', {
                        alias: 'w',
                        description: 'The GTM workspace Id',
                        type: 'string',
                    })
                        .help()
                        .alias('help', 'h')
                        .argv];
                case 1:
                    argv = _f.sent();
                    _b = argv.accountId;
                    if (_b) return [3 /*break*/, 3];
                    return [4 /*yield*/, getAccountId()];
                case 2:
                    _b = (_f.sent());
                    _f.label = 3;
                case 3:
                    account = _b;
                    if (!account) {
                        console.error("Account not found");
                        (0, process_1.exit)(1);
                    }
                    _c = argv.containerId;
                    if (_c) return [3 /*break*/, 5];
                    return [4 /*yield*/, getContainerId(account)];
                case 4:
                    _c = (_f.sent());
                    _f.label = 5;
                case 5:
                    container = _c;
                    if (!container) {
                        console.error("container not found");
                        (0, process_1.exit)(1);
                    }
                    _d = argv.workspaceId;
                    if (_d) return [3 /*break*/, 7];
                    return [4 /*yield*/, getWorkspaceId(account, container)];
                case 6:
                    _d = (_f.sent());
                    _f.label = 7;
                case 7:
                    workspace = _d;
                    if (!container) {
                        console.error("workspace not found");
                        (0, process_1.exit)(1);
                    }
                    if (!argv.templateId) {
                        console.error("missing template id");
                        (0, process_1.exit)(1);
                    }
                    _e = !argv.templatePath;
                    if (_e) return [3 /*break*/, 9];
                    return [4 /*yield*/, fs.exists(argv.templatePath)];
                case 8:
                    _e = !(_f.sent());
                    _f.label = 9;
                case 9:
                    if (_e) {
                        console.error("invalid path provided");
                        (0, process_1.exit)(1);
                    }
                    path = "accounts/" + account + "/containers/" + container + "/workspaces/" + workspace + "/templates/" + argv.templateId;
                    console.log("updating template at path " + path);
                    return [4 /*yield*/, auth.getClient()];
                case 10:
                    authClient = _f.sent();
                    return [4 /*yield*/, fs.content(argv.templatePath)];
                case 11:
                    data = _f.sent();
                    return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.update({
                            path: path, auth: authClient, requestBody: {
                                templateData: data
                            }
                        })];
                case 12:
                    res = _f.sent();
                    template = ((_a = res === null || res === void 0 ? void 0 : res.data) === null || _a === void 0 ? void 0 : _a.templateData) || "";
                    return [4 /*yield*/, fs.tempFile('test.tpl')];
                case 13:
                    tempAvatar = _f.sent();
                    return [4 /*yield*/, fs.writeFile(tempAvatar, template)];
                case 14:
                    _f.sent();
                    console.log("update completed with status code " + JSON.stringify(res.statusText));
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, main()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                console.error("Failed to update template: " + e_1);
                (0, process_1.exit)(2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map