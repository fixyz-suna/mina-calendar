"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalendarContract = void 0;
var o1js_1 = require("o1js");
var CalendarContract = function () {
    var _a;
    var _classSuper = o1js_1.SmartContract;
    var _instanceExtraInitializers = [];
    var _initState_decorators;
    var _updateFreeTimes_decorators;
    return _a = /** @class */ (function (_super) {
            __extends(CalendarContract, _super);
            function CalendarContract(address) {
                var _this = _super.call(this, address) || this;
                _this.numFreeTimes = __runInitializers(_this, _instanceExtraInitializers);
                _this.numFreeTimes = o1js_1.State.init((0, o1js_1.Field)(0)); // 初期値を設定
                return _this;
            }
            CalendarContract.prototype.deploy = function (args) {
                _super.prototype.deploy.call(this, args);
                this.setPermissions(__assign(__assign({}, o1js_1.Permissions.default()), { editState: o1js_1.Permissions.proofOrSignature() }));
            };
            CalendarContract.prototype.initState = function (numFreeTimes) {
                this.numFreeTimes.set(numFreeTimes);
            };
            CalendarContract.prototype.updateFreeTimes = function (newNumFreeTimes) {
                var currentNumFreeTimes = this.numFreeTimes.get();
                this.numFreeTimes.assertEquals(currentNumFreeTimes);
                this.numFreeTimes.set(newNumFreeTimes);
            };
            return CalendarContract;
        }(_classSuper)),
        (function () {
            var _b;
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_b = _classSuper[Symbol.metadata]) !== null && _b !== void 0 ? _b : null) : void 0;
            _initState_decorators = [o1js_1.method];
            _updateFreeTimes_decorators = [o1js_1.method];
            __esDecorate(_a, null, _initState_decorators, { kind: "method", name: "initState", static: false, private: false, access: { has: function (obj) { return "initState" in obj; }, get: function (obj) { return obj.initState; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            __esDecorate(_a, null, _updateFreeTimes_decorators, { kind: "method", name: "updateFreeTimes", static: false, private: false, access: { has: function (obj) { return "updateFreeTimes" in obj; }, get: function (obj) { return obj.updateFreeTimes; } }, metadata: _metadata }, null, _instanceExtraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CalendarContract = CalendarContract;
