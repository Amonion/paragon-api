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
exports.getExistingUsername = exports.deleteUser = exports.getUsers = exports.deleteMyData = exports.searchAccounts = exports.updateUser = exports.getAUser = exports.createUser = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sendEmail_1 = require("../../utils/sendEmail");
const user_1 = require("../../models/users/user");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newUser = new user_1.User({
            email: req.body.email,
            username: req.body.username,
            phone: req.body.phone,
            fullName: req.body.fullName,
            password: yield bcryptjs_1.default.hash(req.body.password, 10),
        });
        yield newUser.save();
        yield (0, sendEmail_1.sendEmail)('', req.body.email, 'welcome');
        res.status(200).json({
            message: 'User created successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createUser = createUser;
const getAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAUser = getAUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield user_1.User.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'Your profile was updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUser = updateUser;
const searchAccounts = (req, res) => {
    return (0, query_1.search)(user_1.User, req, res);
};
exports.searchAccounts = searchAccounts;
///////////// NEW CONTROLLERS //////////////
const deleteMyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(req.params.id);
        yield socialNotificationModel_1.SocialNotification.deleteMany({ userId: req.params.id });
        yield user_1.User.findByIdAndDelete(req.params.id);
        return res
            .status(200)
            .json({ message: 'Your account has been deleted successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteMyData = deleteMyData;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(user_1.User, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteUser = deleteUser;
//-----------------INFO--------------------//
const getExistingUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ username: req.params.username });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExistingUsername = getExistingUsername;
