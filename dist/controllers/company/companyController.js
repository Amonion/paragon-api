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
exports.updatePosition = exports.getPositions = exports.getPositionById = exports.createPosition = exports.updateExpenses = exports.getExpenses = exports.getExpensesById = exports.createExpenses = exports.deletePolicy = exports.updatePolicy = exports.getPolcies = exports.getPolicyById = exports.createPolicy = exports.getCompany = exports.getCompanyById = exports.updateCompany = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const companyModel_1 = require("../../models/company/companyModel");
const query_1 = require("../../utils/query");
const updateCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.id) {
            const company = yield companyModel_1.Company.findByIdAndUpdate(req.body.id, req.body, {
                upsert: true,
                new: true,
            });
            res.status(200).json({ company });
        }
        else {
            const company = yield companyModel_1.Company.create(req.body);
            res.status(200).json({ company });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateCompany = updateCompany;
const getCompanyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield companyModel_1.Company.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getCompanyById = getCompanyById;
const getCompany = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield companyModel_1.Company.findOne();
        res.status(200).json({ company });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getCompany = getCompany;
//-----------------TERMS & CONDITIONS--------------------//
const createPolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, companyModel_1.Policy, 'Policy was created successfully');
});
exports.createPolicy = createPolicy;
const getPolicyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield companyModel_1.Policy.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPolicyById = getPolicyById;
const getPolcies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(companyModel_1.Policy, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPolcies = getPolcies;
const updatePolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, companyModel_1.Policy, [], ['Policy not found', 'Policy was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePolicy = updatePolicy;
const deletePolicy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.deleteItem)(req, res, companyModel_1.Policy, [], 'Policy was updated successfully');
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deletePolicy = deletePolicy;
//-----------------EXPENSES--------------------//
const createExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, companyModel_1.Expenses, 'Expenses was created successfully');
});
exports.createExpenses = createExpenses;
const getExpensesById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield companyModel_1.Expenses.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Expenses not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExpensesById = getExpensesById;
const getExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(companyModel_1.Expenses, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExpenses = getExpenses;
const updateExpenses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, companyModel_1.Expenses, ['receipt'], ['Expenses not found', 'Expenses was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateExpenses = updateExpenses;
//-----------------POSITION--------------------//
const createPosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, companyModel_1.Position, 'Position was created successfully');
});
exports.createPosition = createPosition;
const getPositionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield companyModel_1.Position.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Position not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPositionById = getPositionById;
const getPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(companyModel_1.Position, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPositions = getPositions;
const updatePosition = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, companyModel_1.Position, [], ['Position not found', 'Position was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePosition = updatePosition;
