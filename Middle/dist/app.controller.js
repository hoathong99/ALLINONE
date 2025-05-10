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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("./auth/auth.guard");
const ProcessService_1 = require("./services/ProcessService");
const FormService_1 = require("./services/FormService");
let AppController = class AppController {
    constructor(processService, formService) {
        this.processService = processService;
        this.formService = formService;
    }
    async ProtectedPortal(rq) {
        console.log(rq.body);
        switch (rq.body.type) {
            case 'GET_GRAPH': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChart(rqId, chartId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'CREATE_GRAPH': {
                let templateId = rq.body.data.templateId;
                let content = rq.body.data.content;
                try {
                    const respond = await this.processService.CreateFlowChart(templateId, content);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_GRAPH_TEMPLATE': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChartTemplate(rqId, chartId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_ALL_GRAPH': {
                ;
                let loader = rq.body.data.loader;
                try {
                    const respond = await this.processService.getAllChart(loader);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_NODE': {
                let rqId = rq.body.data.rqId;
                let nodeLoader = rq.body.data.loaderId;
                try {
                    const respond = await this.processService.getNodeSchema(rqId, nodeLoader);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'SUBMIT_FORM': {
                try {
                    let data = rq.body.data.data;
                    let parent = rq.body.data.parentId;
                    let graphId = rq.body.data.graphId;
                    const respond = await this.formService.SubmitFormData(data, parent, graphId, rq.user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_SUBMISSION': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetAllSubmission(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_SUBMISSION_BY_LOADER': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetSubmissionByLoader(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_LATEST_SUBMISSION': {
                console.log("---------------------------------------------------------GET_SUBMISSION---------------------------------------------------------");
                try {
                    let data = rq.body.data.parentId;
                    const respond = await this.formService.GetLatestSubmission(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'DELETE_SUBMISSION': {
                console.log("---------------------------------------------------------DELETE_SUBMIT---------------------------------------------------------");
                try {
                    // let data = rq.body.data.data;
                    let submissionId = rq.body.data.id;
                    const respond = await this.formService.DeleteSubmission(submissionId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_ALL_EMPLOYEE': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetAllEmployee(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GENERATE_FORMSCHEMA': {
                try {
                    let data = rq.body.data;
                    const respond = await this.formService.GenerateFormSchema(data.html, data.desc);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'FORM_ACTION_TRIGGER': {
                try {
                    let data = rq.body.data;
                    const respond = await this.processService.triggerFormAction(data.loader, data.data, rq.user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_RESOURCE': {
                try {
                    let data = rq.body.data;
                    let sender = rq.user;
                    const respond = await this.processService.requestData(data.rqId, data.loader, sender, data.data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch Data from external API' };
                }
            }
            case 'GET_ROW_GRAPH_DATA': {
                try {
                    console.log(rq);
                    let data = rq.body.data;
                    const respond = await this.processService.getRowGraphData(data.rqId, data.loader, data.data, rq.user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'START_GRAPH': {
                try {
                    console.log(rq);
                    let data = rq.body.data;
                    let user = rq.user;
                    const respond = await this.processService.instanceGraph(data.loader, user, data.data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'ACTIVATE_GRAPH': {
                try {
                    console.log(rq);
                    let data = rq.body.data;
                    let user = rq.user;
                    const respond = await this.processService.activateWorkflow(data.loader, user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'DEACTIVATE_GRAPH': {
                try {
                    console.log(rq);
                    let data = rq.body.data;
                    let user = rq.user;
                    const respond = await this.processService.deactivateWorkflow(data.loader, user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            default: {
                return { error: 'UNAVAILABLE TYPE' };
            }
        }
    }
    async PublicPortal(rq) {
        console.log(rq.body);
        switch (rq.body.type) {
            case 'GET_GRAPH': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChart(rqId, chartId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'CREATE_GRAPH': {
                let templateId = rq.body.data.templateId;
                let content = rq.body.data.content;
                try {
                    const respond = await this.processService.CreateFlowChart(templateId, content);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_GRAPH_TEMPLATE': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChartTemplate(rqId, chartId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_NODE': {
                let rqId = rq.body.data.rqId;
                let nodeLoader = rq.body.data.loaderId;
                try {
                    const respond = await this.processService.getNodeSchema(rqId, nodeLoader);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'SUBMIT_FORM': {
                try {
                    let data = rq.body.data.data;
                    let parent = rq.body.data.parentId;
                    let graphId = rq.body.data.graphId;
                    const respond = await this.formService.SubmitFormData(data, parent, graphId, rq.user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_SUBMISSION': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetAllSubmission(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_SUBMISSION_BY_LOADER': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetSubmissionByLoader(data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'DELETE_SUBMISSION': {
                console.log("---------------------------------------------------------DELETE_SUBMIT---------------------------------------------------------");
                try {
                    // let data = rq.body.data.data;
                    let submissionId = rq.body.data.id;
                    const respond = await this.formService.DeleteSubmission(submissionId);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_ROW_GRAPH_DATA': {
                try {
                    console.log(rq);
                    let data = rq.body.data;
                    const respond = await this.processService.getRowGraphData(data.rqId, data.loader, data.data, rq.user);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'START_GRAPH': {
                try {
                    console.log("FREEACCESS");
                    let data = rq.body.data;
                    let user = rq.user;
                    const respond = await this.processService.instanceGraph(data.loader, user, data.data);
                    return respond;
                }
                catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            default: {
                return { error: 'UNAVAILABLE TYPE' };
            }
        }
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)("/protected"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "ProtectedPortal", null);
__decorate([
    (0, common_1.Post)("/public"),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AppController.prototype, "PublicPortal", null);
exports.AppController = AppController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [ProcessService_1.ProcessService, FormService_1.FormService])
], AppController);
//# sourceMappingURL=app.controller.js.map