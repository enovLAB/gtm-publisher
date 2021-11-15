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
var fs = __importStar(require("@supercharge/fs"));
var googleapis_1 = require("googleapis");
var process_1 = require("process");
var yargs = __importStar(require("yargs"));
var accountHelper_1 = require("./accountHelper");
var pkj = require('../package.json');
var tagmanager = googleapis_1.google.tagmanager('v2');
var updateTagTemplate = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var templateId, templatePath, _a, googleAuth, auth, _b, accountId, containerId, workspaceId, parent, path, data, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                templateId = argv.templateId, templatePath = argv.templatePath;
                _a = !templatePath;
                if (_a) return [3 /*break*/, 2];
                return [4 /*yield*/, fs.exists(argv.templatePath)];
            case 1:
                _a = !(_d.sent());
                _d.label = 2;
            case 2:
                if (_a) {
                    console.error("invalid path provided");
                    (0, process_1.exit)(1);
                }
                googleAuth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, googleAuth.getClient()];
            case 3:
                auth = _d.sent();
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, googleAuth)];
            case 4:
                _b = _d.sent(), accountId = _b.accountId, containerId = _b.containerId, workspaceId = _b.workspaceId;
                parent = "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId;
                path = parent + "/templates/" + templateId;
                return [4 /*yield*/, fs.content(argv.templatePath)];
            case 5:
                data = _d.sent();
                _d.label = 6;
            case 6:
                _d.trys.push([6, 9, , 11]);
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.get({
                        path: path,
                        auth: auth
                    })];
            case 7:
                _d.sent();
                console.log("updating template at path " + path);
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.update({
                        path: path,
                        auth: auth,
                        requestBody: {
                            templateData: data
                        }
                    })];
            case 8: return [2 /*return*/, _d.sent()];
            case 9:
                _c = _d.sent();
                console.log("creating new template in " + parent);
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.create({
                        parent: parent,
                        auth: auth,
                        requestBody: {
                            templateData: data
                        }
                    })];
            case 10: return [2 /*return*/, _d.sent()];
            case 11: return [2 /*return*/];
        }
    });
}); };
var listVariables = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.variables.list({
                        parent: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId,
                        auth: authClient
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var createWorkspace = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var name, auth, _a, accountId, containerId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                name = argv.name;
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.create({
                        parent: "accounts/" + accountId + "/containers/" + containerId,
                        auth: authClient,
                        requestBody: { name: name }
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var createVersion = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var name, auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                name = argv.name;
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.create_version({
                        path: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId,
                        auth: authClient,
                        requestBody: { name: name }
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var listTags = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.tags.list({
                        parent: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId,
                        auth: authClient
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var listTriggers = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.triggers.list({
                        parent: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId,
                        auth: authClient
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var listTemplates = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.list({
                        parent: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId,
                        auth: authClient
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
var getTemplate = function (argv) { return __awaiter(void 0, void 0, void 0, function () {
    var auth, _a, accountId, containerId, workspaceId, authClient;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                auth = (0, accountHelper_1.createAuth)(argv);
                return [4 /*yield*/, (0, accountHelper_1.getAccountInfo)(argv, auth)];
            case 1:
                _a = _b.sent(), accountId = _a.accountId, containerId = _a.containerId, workspaceId = _a.workspaceId;
                return [4 /*yield*/, auth.getClient()];
            case 2:
                authClient = _b.sent();
                return [4 /*yield*/, tagmanager.accounts.containers.workspaces.templates.get({
                        path: "accounts/" + accountId + "/containers/" + containerId + "/workspaces/" + workspaceId + "/templates/" + argv.templateId,
                        auth: authClient
                    })];
            case 3: return [2 /*return*/, _b.sent()];
        }
    });
}); };
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var argv;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, yargs
                        .command('updateTagTemplate <templateId> <templatePath> [output]', 'make a get HTTP request', function () { }, function (argv) { return __awaiter(_this, void 0, void 0, function () {
                        var res, _a, templateId, name_1, fingerprint, templateData, outputData, e_1;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, updateTagTemplate(argv)];
                                case 1:
                                    res = _b.sent();
                                    _a = res.data, templateId = _a.templateId, name_1 = _a.name, fingerprint = _a.fingerprint, templateData = _a.templateData;
                                    outputData = JSON.stringify({ templateId: templateId, name: name_1, fingerprint: fingerprint, templateData: templateData }, null, 2);
                                    if (argv.output) {
                                        fs.writeFile(argv.output, outputData);
                                    }
                                    else {
                                        console.log(outputData);
                                    }
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_1 = _b.sent();
                                    console.error(e_1);
                                    (0, process_1.exit)(3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })
                        .command('getTemplate <templateId>', 'make a get HTTP request', function () { }, function (argv) { return __awaiter(_this, void 0, void 0, function () {
                        var res;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, getTemplate(argv)];
                                case 1:
                                    res = _a.sent();
                                    console.log(res.data.templateData);
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .command('createWorkspace <name>', 'lists the objects of the given type', function () { }, function (argv) { return __awaiter(_this, void 0, void 0, function () {
                        var res, e_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, createWorkspace(argv)];
                                case 1:
                                    res = _a.sent();
                                    console.log(res.data.workspaceId);
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_2 = _a.sent();
                                    console.error(e_2);
                                    (0, process_1.exit)(3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })
                        .command('stampVersion <name>', 'lists the objects of the given type', function () { }, function (argv) { return __awaiter(_this, void 0, void 0, function () {
                        var res, e_3;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, createVersion(argv)];
                                case 1:
                                    res = _a.sent();
                                    console.log(JSON.stringify(res.data.containerVersion));
                                    return [3 /*break*/, 3];
                                case 2:
                                    e_3 = _a.sent();
                                    console.error(e_3);
                                    (0, process_1.exit)(3);
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })
                        .command('list <type> [output]', 'lists the objects of the given type', function () { }, function (argv) { return __awaiter(_this, void 0, void 0, function () {
                        var output, data, _a, res, res, res, res, outputData;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    output = argv.output;
                                    _a = argv.type;
                                    switch (_a) {
                                        case 'variable': return [3 /*break*/, 1];
                                        case 'tag': return [3 /*break*/, 3];
                                        case 'trigger': return [3 /*break*/, 5];
                                        case 'templates': return [3 /*break*/, 7];
                                    }
                                    return [3 /*break*/, 9];
                                case 1: return [4 /*yield*/, listVariables(argv)];
                                case 2:
                                    res = _b.sent();
                                    data = res.data.variable;
                                    ;
                                    return [3 /*break*/, 10];
                                case 3: return [4 /*yield*/, listTags(argv)];
                                case 4:
                                    res = _b.sent();
                                    data = res.data.tag;
                                    ;
                                    return [3 /*break*/, 10];
                                case 5: return [4 /*yield*/, listTriggers(argv)];
                                case 6:
                                    res = _b.sent();
                                    data = res.data.trigger;
                                    return [3 /*break*/, 10];
                                case 7: return [4 /*yield*/, listTemplates(argv)];
                                case 8:
                                    res = _b.sent();
                                    data = res.data.template;
                                    return [3 /*break*/, 10];
                                case 9:
                                    console.error("invalid type " + argv.type);
                                    (0, process_1.exit)(3);
                                    _b.label = 10;
                                case 10:
                                    outputData = data ? JSON.stringify(data, null, 2) : "";
                                    if (output) {
                                        fs.writeFile(output, outputData);
                                    }
                                    else {
                                        console.log(outputData);
                                    }
                                    return [2 /*return*/];
                            }
                        });
                    }); })
                        .option('googleJWT', {
                        alias: 'j',
                        description: 'The path of the google service token in JSON format',
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
                    argv = _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, main()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                e_4 = _a.sent();
                console.error("Failed to update template: " + e_4);
                (0, process_1.exit)(2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map