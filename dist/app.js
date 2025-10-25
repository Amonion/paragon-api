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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./utils/errorHandler");
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const faqRoutes_1 = __importDefault(require("./routes/faqRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const userRoutes_1 = __importDefault(require("./routes/users/userRoutes"));
// import { geoipMiddleware } from './middlewares/geoipMiddleware'
const usersSocket_1 = require("./routes/socket/usersSocket");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
// app.use(geoipMiddleware)
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.country}`);
    next();
};
app.use(requestLogger);
app.use((0, cors_1.default)({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'https://paragonfarmsltd.netlify.app',
        'https://paragonfarmsltd.com',
        'https://schooling-client-v1.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://schoolingsocial.netlify.app',
            'https://schoolingsocial.com',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});
exports.io = io;
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        switch (data.to) {
            case 'users':
                yield (0, usersSocket_1.UsersSocket)(data);
                break;
            default:
                break;
        }
    }));
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected.: ${socket.id}`);
    });
});
app.use(body_parser_1.default.json());
app.use('/api/v1/blogs', blogRoutes_1.default);
app.use('/api/v1/company', companyRoutes_1.default);
app.use('/api/v1/faqs', faqRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/reviews', reviewRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use((req, res, next) => {
    (0, errorHandler_1.handleError)(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
    next();
});
