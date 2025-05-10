"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let FormService = class FormService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.n8nBaseUrl = process.env.VITE_N8N_URL;
        this.apiKey = process.env.GOOGLE_CLIENT_ID;
    }
    // private get n8nBaseUrl(): string {
    //     return this.configService.get<string>('N8N_BASE_URL', 'http://13.212.177.47:5678');
    // }
    async SubmitFormData(data, parentId, graphId, sender) {
        var _a, _b, _c;
        if (!data) {
            data = null;
        }
        if (!sender) {
            sender = {
                employeeCode: null
            };
        }
        const url = `${this.n8nBaseUrl}/webhook/saveSubmission`;
        const payload = {
            parentId: parentId,
            data: data,
            graphId: graphId
        };
        const header = {
            headers: {
                'x-user-id': sender === null || sender === void 0 ? void 0 : sender.employeeCode,
                'Content-Type': 'application/json'
            }
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, header));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async GetLatestSubmission(parentId) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/GetLatestSubmit`;
        const payload = {
            data: parentId,
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async DeleteSubmission(Id) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/DeleteSubmission`;
        const payload = {
            data: Id,
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async GetAllSubmission(loader) {
        var _a, _b, _c;
        console.log("---------------------------GetSubmission----------------------------------");
        const url = `${this.n8nBaseUrl}/webhook/GetAllSubmit`;
        const payload = {
            data: loader,
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async GetSubmissionByLoader(loader) {
        var _a, _b, _c;
        console.log("---------------------------GetSubmission----------------------------------");
        const url = `${this.n8nBaseUrl}/webhook/GetSubmitByLoader`;
        const payload = {
            data: loader,
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async GetAllEmployee(loader) {
        var _a, _b, _c;
        console.log("---------------------------GetSubmission----------------------------------");
        const url = `${this.n8nBaseUrl}/webhook/GetAllEmployee`;
        const payload = {
            data: loader,
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async GenerateFormSchema(html, desc) {
        var _a, _b, _c;
        console.log("---------------------------GenerateFormSchema----------------------------------");
        const url = `${this.n8nBaseUrl}/webhook/generateSchema`;
        const payload = {
            html: html,
            describe: desc
        };
        console.log(payload);
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
};
exports.FormService = FormService;
exports.FormService = FormService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], FormService);
//# sourceMappingURL=FormService.js.map