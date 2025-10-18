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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = exports.Payment = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PaymentSchema = new mongoose_1.Schema({
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    logo: { type: String },
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    durationName: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    country: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Payment = mongoose_1.default.model('Payment', PaymentSchema);
const TransactionSchema = new mongoose_1.Schema({
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    logo: { type: String },
    username: { type: String, default: '' },
    status: { type: Boolean, default: false },
    received: { type: Boolean, default: false },
    email: { type: String, default: '' },
    picture: { type: String, default: '' },
    name: { type: String, default: '' },
    reference: { type: String, default: '' },
    title: { type: String, default: '' },
    country: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Transaction = mongoose_1.default.model('Transaction', TransactionSchema);
