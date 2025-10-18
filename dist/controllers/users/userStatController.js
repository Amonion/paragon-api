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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSchoolStat = exports.getUsersStat = exports.updateVisit = void 0;
const usersStatMode_1 = require("../../models/users/usersStatMode");
const app_1 = require("../../app");
const chatModel_1 = require("../../models/message/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const date_fns_1 = require("date-fns");
const user_1 = require("../../models/users/user");
const schoolModel_1 = require("../../models/school/schoolModel");
const bioUserState_1 = require("../../models/users/bioUserState");
//-----------------USERS--------------------//
const updateVisit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!data.ip || data.ip === '') {
        return;
    }
    if (data.username) {
        let userStatus = yield usersStatMode_1.UserStatus.findOne({ username: data.username });
        // Step 2: Create new doc if not exists
        if (!userStatus) {
            userStatus = new usersStatMode_1.UserStatus({
                username: data.username,
                visitedAt: data.visitedAt,
                online: data.online,
                country: data.country,
                countryCode: data.countryCode,
                bioUserId: data.bioUserId,
                userId: data.userId,
                ips: [data.ip], // start with IP
            });
        }
        else {
            // Step 3: Normalize ips to an array
            if (!Array.isArray(userStatus.ips)) {
                userStatus.ips = userStatus.ips ? [String(userStatus.ips)] : [];
            }
            // Step 4: Add IP if not present
            if (!userStatus.ips.includes(data.ip)) {
                userStatus.ips.push(data.ip);
            }
            // Step 5: Update other fields
            userStatus.visitedAt = data.visitedAt;
            userStatus.online = data.online;
            userStatus.country = data.country;
            userStatus.countryCode = data.countryCode;
            userStatus.bioUserId = data.bioUserId;
            userStatus.userId = data.userId;
        }
        yield userStatus.save();
    }
    else {
        // Case where username is not provided
        let userStatus = yield usersStatMode_1.UserStatus.findOne({ ips: { $in: [data.ip] } });
        if (!userStatus) {
            userStatus = new usersStatMode_1.UserStatus({
                visitedAt: new Date(),
                online: true,
                country: data.country,
                countryCode: data.countryCode,
                username: data.username,
                bioUserId: data.bioUserId,
                userId: data.userId,
                ips: [data.ip],
            });
        }
        else {
            if (!Array.isArray(userStatus.ips)) {
                userStatus.ips = userStatus.ips ? [String(userStatus.ips)] : [];
            }
            if (!userStatus.ips.includes(data.ip)) {
                userStatus.ips.push(data.ip);
            }
            userStatus.visitedAt = new Date();
            userStatus.online = true;
            userStatus.country = data.country;
            userStatus.countryCode = data.countryCode;
            userStatus.username = data.username;
            userStatus.bioUserId = data.bioUserId;
            userStatus.userId = data.userId;
        }
        yield userStatus.save();
    }
    if (data.bioUserId) {
        updateOnlineStatus(data.bioUserId, data.visitedAt, bioUserState_1.BioUserState);
    }
    if (data.userId) {
        updateOnlineStatus(data.userId, data.visitedAt, user_1.User);
    }
    const visitors = yield usersStatMode_1.UserStatus.countDocuments({ online: true });
    const bioUserState = yield bioUserState_1.BioUserState.findOne({ bioUserId: data.bioUserId });
    if (bioUserState) {
        app_1.io.emit(`update_state_${bioUserState.bioUserUsername}`, { bioUserState });
    }
});
exports.updateVisit = updateVisit;
const updateOnlineStatus = (userId, visitedAt, model) => __awaiter(void 0, void 0, void 0, function* () {
    yield model.findOneAndUpdate({ _id: userId, online: false }, {
        visitedAt: visitedAt,
        online: true,
    });
    const chats = yield chatModel_1.Chat.find({
        connection: { $regex: userId },
    });
    for (let i = 0; i < chats.length; i++) {
        const el = chats[i];
        app_1.io.emit(el.connection, { action: 'visit' });
    }
});
const getUsersStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const currentMonthStart = (0, date_fns_1.startOfMonth)(now);
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const onlineUsers = yield usersStatMode_1.UserStatus.countDocuments({ online: true });
        const verifyingUsers = yield bioUserState_1.BioUserState.countDocuments({
            isOnVerification: true,
        });
        const verifiedUsers = yield user_1.User.countDocuments({
            isVerified: true,
        });
        const totalUsers = yield user_1.User.countDocuments();
        const thisMonthOnline = yield usersStatMode_1.UserStatus.countDocuments({
            online: true,
            createdAt: { $gte: currentMonthStart },
        });
        const thisMonthOnVerification = yield user_1.User.countDocuments({
            isOnVerification: true,
            verifyingAt: { $gte: currentMonthStart },
        });
        const thisMonthUsers = yield user_1.User.countDocuments({
            createdAt: { $gte: currentMonthStart },
        });
        const thisMonthVerifiedUsers = yield user_1.User.countDocuments({
            isVerified: true,
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthOnline = yield usersStatMode_1.UserStatus.countDocuments({
            online: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const lastMonthOnVerification = yield user_1.User.countDocuments({
            isOnVerification: true,
            verifyingAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const lastMonthUsers = yield user_1.User.countDocuments({
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const lastMonthVerifiedUsers = yield user_1.User.countDocuments({
            isVerified: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        let onlineIncrease = 0;
        if (lastMonthOnline > 0) {
            onlineIncrease =
                ((thisMonthOnline - lastMonthOnline) / lastMonthOnline) * 100;
        }
        else if (thisMonthOnline > 0) {
            onlineIncrease = 100;
        }
        let verificationIncrease = 0;
        if (lastMonthOnVerification > 0) {
            verificationIncrease =
                ((thisMonthOnVerification - lastMonthOnVerification) /
                    lastMonthOnVerification) *
                    100;
        }
        else if (thisMonthOnVerification > 0) {
            verificationIncrease = 100;
        }
        let totalUsersIncrease = 0;
        if (lastMonthUsers > 0) {
            totalUsersIncrease =
                ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
        }
        else if (thisMonthUsers > 0) {
            totalUsersIncrease = 100;
        }
        let verifiedUsersIncrease = 0;
        if (lastMonthVerifiedUsers > 0) {
            verifiedUsersIncrease =
                ((thisMonthVerifiedUsers - lastMonthVerifiedUsers) /
                    lastMonthVerifiedUsers) *
                    100;
        }
        else if (thisMonthVerifiedUsers > 0) {
            verifiedUsersIncrease = 100;
        }
        res.status(200).json({
            onlineUsers,
            onlineIncrease,
            verifiedUsers,
            verifiedUsersIncrease,
            verifyingUsers,
            verificationIncrease,
            totalUsers,
            totalUsersIncrease,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUsersStat = getUsersStat;
//-----------------Schools--------------------//
const getSchoolStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const currentMonthStart = (0, date_fns_1.startOfMonth)(now);
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const totalSchools = yield schoolModel_1.School.countDocuments();
        const thisMonthTotalSchools = yield schoolModel_1.School.countDocuments({
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthTotalSchools = yield schoolModel_1.School.countDocuments({
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const verifiedSchools = yield schoolModel_1.School.countDocuments({
            isVerified: true,
        });
        const thisMonthVerifiedSchools = yield schoolModel_1.School.countDocuments({
            isVerified: true,
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthVerifiedSchools = yield schoolModel_1.School.countDocuments({
            isVerified: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const newSchools = yield schoolModel_1.School.countDocuments({ isNew: true });
        const thisMonthNewSchools = yield schoolModel_1.School.countDocuments({
            isNew: true,
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthNewSchools = yield schoolModel_1.School.countDocuments({
            isNew: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const recordedSchools = yield schoolModel_1.School.countDocuments({ isRecorded: true });
        const thisMonthRecordedSchools = yield schoolModel_1.School.countDocuments({
            isRecorded: true,
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthRecordedSchools = yield schoolModel_1.School.countDocuments({
            isRecorded: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        let totalSchoolIncrease = 0;
        if (lastMonthTotalSchools > 0) {
            totalSchoolIncrease =
                ((thisMonthTotalSchools - lastMonthTotalSchools) /
                    lastMonthTotalSchools) *
                    100;
        }
        else if (thisMonthTotalSchools > 0) {
            totalSchoolIncrease = 100;
        }
        let verifiedSchoolIncrease = 0;
        if (lastMonthVerifiedSchools > 0) {
            verifiedSchoolIncrease =
                ((thisMonthVerifiedSchools - lastMonthVerifiedSchools) /
                    lastMonthVerifiedSchools) *
                    100;
        }
        else if (thisMonthVerifiedSchools > 0) {
            verifiedSchoolIncrease = 100;
        }
        let newSchoolIncrease = 0;
        if (lastMonthNewSchools > 0) {
            newSchoolIncrease =
                ((thisMonthNewSchools - lastMonthNewSchools) / lastMonthNewSchools) *
                    100;
        }
        else if (thisMonthNewSchools > 0) {
            newSchoolIncrease = 100;
        }
        let recordedSchoolIncrease = 0;
        if (lastMonthRecordedSchools > 0) {
            recordedSchoolIncrease =
                ((thisMonthRecordedSchools - lastMonthRecordedSchools) /
                    lastMonthRecordedSchools) *
                    100;
        }
        else if (thisMonthRecordedSchools > 0) {
            recordedSchoolIncrease = 100;
        }
        res.status(200).json({
            totalSchools,
            totalSchoolIncrease,
            verifiedSchools,
            verifiedSchoolIncrease,
            newSchools,
            newSchoolIncrease,
            recordedSchools,
            recordedSchoolIncrease,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolStat = getSchoolStat;
