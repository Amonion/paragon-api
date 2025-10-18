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
exports.News = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const NewsSchema = new mongoose_1.Schema({
    placeId: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    author: { type: String, default: '' },
    priority: { type: String, default: '' },
    priorityIndex: { type: Number, default: 1 },
    publishedAt: { type: Date },
    status: { type: String, default: 'Draft' },
    state: { type: String, default: '' },
    level: { type: String, default: '' },
    country: { type: String, default: '' },
    tags: { type: String, default: '' },
    continent: { type: String, default: '' },
    comments: { type: Number, default: 0 },
    interests: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    picture: { type: String, default: '' },
    video: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    category: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    source: { type: String, default: '' },
    isFeatured: { type: Boolean, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.News = mongoose_1.default.model('News', NewsSchema);
