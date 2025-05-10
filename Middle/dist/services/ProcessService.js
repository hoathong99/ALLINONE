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
exports.ProcessService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
let ProcessService = class ProcessService {
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        this.n8nBaseUrl = process.env.VITE_N8N_URL;
        console.log("n8n", process.env.VITE_N8N_URL);
        this.apiKey = process.env.GOOGLE_CLIENT_ID;
        console.log("apiKey", process.env.GOOGLE_CLIENT_ID);
    }
    async getFlowChart(rqId, chartId) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async getAllChart(loader) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/GetGraphData`;
        const payload = {
            loader: loader,
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async getFlowChartTemplate(rqId, chartId) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async CreateFlowChart(tId, c) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/InitProcess`;
        const payload = {
            templateId: tId,
            content: c
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async getNodeSchema(rqId, loader) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            schemaId: loader,
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async triggerFormAction(rqId, data, sender) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            data: data,
        };
        const header = {
            headers: {
                'x-user-id': sender.employeeCode,
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
    async getRowGraphData(rqId, loader, data, sender) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            loader: loader,
            data: data,
        };
        const header = {
            headers: {
                'x-user-id': sender.name,
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
    async instanceGraph(loader, sender, data) {
        var _a, _b, _c;
        if (!data) {
            data = null;
        }
        if (!sender) {
            sender = {
                employeeCode: null
            };
        }
        const url = `${this.n8nBaseUrl}/webhook/instance-graph`;
        console.log("instanceGraph url", url);
        console.log("sender", sender);
        const payload = {
            loader: loader,
            data: data,
        };
        console.log("payload", payload);
        const header = {
            headers: {
                'x-user-id': sender.employeeCode,
                'Content-Type': 'application/json'
            }
        };
        try {
            console.log("header", header);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post(url, payload, header));
            return response.data;
        }
        catch (error) {
            console.error('FetchData error:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            throw new common_1.HttpException(((_b = error === null || error === void 0 ? void 0 : error.response) === null || _b === void 0 ? void 0 : _b.data) || 'External API error', ((_c = error === null || error === void 0 ? void 0 : error.response) === null || _c === void 0 ? void 0 : _c.status) || 500);
        }
    }
    async requestData(rqId, loader, sender, data) {
        var _a, _b, _c;
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        console.log("requestData", url);
        const payload = {
            loader: loader,
            data: data
        };
        const header = {
            headers: {
                'x-user-id': sender.employeeCode,
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
    async activateWorkflow(workflowId, sender) {
        const url = `${this.n8nBaseUrl}/rest/workflows/${workflowId}/activate`;
        // try {
        //   const response = await firstValueFrom(
        //     this.httpService.post(url, null, {
        //       headers: { Authorization: `Bearer ${this.apiKey}` },
        //     }),
        //   );
        //   return {
        //     success: true,
        //     data: response.data,
        //     status: response.status,
        //   };
        // } catch (error) {
        //   return {
        //     success: false,
        //     message: error?.response?.data || 'Activation failed',
        //     status: error?.response?.status || 500,
        //   };
        // }
        return null;
    }
    async deactivateWorkflow(workflowId, sender) {
        const url = `${this.n8nBaseUrl}/rest/workflows/${workflowId}/deactivate`;
        // try {
        //   const response = await firstValueFrom(
        //     this.httpService.post(url, null, {
        //       headers: { Authorization: `Bearer ${this.apiKey}` },
        //     }),
        //   );
        //   return {
        //     success: true,
        //     data: response.data,
        //     status: response.status,
        //   };
        // } catch (error) {
        //   return {
        //     success: false,
        //     message: error?.response?.data || 'Deactivation failed',
        //     status: error?.response?.status || 500,
        //   };
        // }
        return null;
    }
};
exports.ProcessService = ProcessService;
// private get n8nBaseUrl(): string {
//     return this.configService.get<string>('n8nUrl', 'http://13.212.177.47:5678');
// }
// n8nBaseUrl = process.env.N8N_BASE_URL;
// private get apiKey(): string {
//     return this.configService.get<string>('N8N_API_KEY', 'your-n8n-api-key');
// }
ProcessService.currentUser = {};
exports.ProcessService = ProcessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], ProcessService);
//# sourceMappingURL=ProcessService.js.map