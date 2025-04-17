import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { json } from 'stream/consumers';
import { ProcessService } from 'src/Services/Process/ProcessService';
import { FormService } from 'src/Services/Process/FormService';

@Controller('process-controller')
export class ProcessControllerController {
    constructor(private readonly processService: ProcessService, private readonly formService: FormService) { }

    @Get()
    FindAll(): string {
        return 'This action returns all cats';
    }
    @Post("/Gateway")
    async Portal(@Req() rq: any): Promise<any> {
        console.log(rq.body);
        switch (rq.body.type) {
            case 'GET_GRAPH': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChart(rqId, chartId);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'CREATE_GRAPH': {
                let templateId = rq.body.data.templateId;
                let content = rq.body.data.content;
                try {
                    const respond = await this.processService.CreateFlowChart(templateId, content);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_GRAPH_TEMPLATE': {
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChartTemplate(rqId, chartId);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_ALL_GRAPH':{;
                let loader = rq.body.data.loader;
                try {
                    const respond = await this.processService.getAllChart(loader);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_NODE': {
                let rqId = rq.body.data.rqId;
                let nodeLoader = rq.body.data.loaderId;
                try {
                    const respond = await this.processService.getNodeSchema(rqId, nodeLoader);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'SUBMIT_FORM': {
                try {
                    let data = rq.body.data.data;
                    let parent = rq.body.data.parentId;
                    const respond = await this.formService.SubmitFormData(data, parent);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_SUBMISSION': {
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetAllSubmission(data);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_LATEST_SUBMISSION': {
                console.log("---------------------------------------------------------GET_SUBMISSION---------------------------------------------------------");
                try {
                    let data = rq.body.data.parentId;
                    const respond = await this.formService.GetLatestSubmission(data);
                    return respond;
                } catch (error) {
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
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GET_ALL_EMPLOYEE':{
                try {
                    let data = rq.body.data.loader;
                    const respond = await this.formService.GetAllEmployee(data);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            case 'GENERATE_FORMSCHEMA':{
                try {
                    let data = rq.body.data;
                    const respond = await this.formService.GenerateFormSchema(data.html, data.desc);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
            default: {
                return { error: 'UNAVAILABLE TYPE' };
            }
        }
    }
    @Post("/GetFlowChart")
    async getProcessFlow(@Req() rq: any): Promise<any> {
        // console.log(rq.body);
        switch (rq.body.type) {
            case 'GET_GRAPH': {
                console.log("---------------------------------------------------------GetFlowChart---------------------------------------------------------");
                let rqId = rq.body.data.rqId;
                let chartId = rq.body.data.grId;
                try {
                    const respond = await this.processService.getFlowChart(rqId, chartId);
                    return respond;
                } catch (error) {
                    return { error: 'Failed to fetch flow chart from external API' };
                }
            }
        }
    }
}
