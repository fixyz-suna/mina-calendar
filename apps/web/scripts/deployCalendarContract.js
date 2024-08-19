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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
Object.defineProperty(exports, "__esModule", { value: true });
var o1js_1 = require("o1js");
var CalendarContract_1 = require("../lib/CalendarContract");
var deploy = function () { return __awaiter(void 0, void 0, void 0, function () {
    var localChain, fee, _a, deployer, owner, contract, calendarContract, deployTx, deployTxResult;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, o1js_1.Mina.LocalBlockchain({
                    proofsEnabled: false,
                    enforceTransactionLimits: false,
                })];
            case 1:
                localChain = _b.sent();
                o1js_1.Mina.setActiveInstance(localChain);
                fee = 1e8;
                _a = localChain.testAccounts, deployer = _a[0], owner = _a[1];
                contract = o1js_1.PrivateKey.randomKeypair();
                calendarContract = new CalendarContract_1.CalendarContract(contract.publicKey);
                console.log("Deploying Calendar contract.");
                return [4 /*yield*/, o1js_1.Mina.transaction({
                        sender: deployer,
                        fee: fee,
                    }, function () { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            o1js_1.AccountUpdate.fundNewAccount(deployer, 3);
                            calendarContract.deploy({});
                            return [2 /*return*/];
                        });
                    }); })];
            case 2:
                deployTx = _b.sent();
                return [4 /*yield*/, deployTx.prove()];
            case 3:
                _b.sent();
                deployTx.sign([deployer.key, contract.privateKey]);
                return [4 /*yield*/, deployTx.send().then(function (v) { return v.wait(); })];
            case 4:
                deployTxResult = _b.sent();
                console.log("Deploy tx result:", deployTxResult.toPretty());
                return [2 /*return*/];
        }
    });
}); };
deploy().catch(console.error);
