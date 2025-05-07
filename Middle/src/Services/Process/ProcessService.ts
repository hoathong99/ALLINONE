import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProcessService {
    constructor(private readonly httpService: HttpService) { }

    private readonly n8nBaseUrl = 'http://13.212.177.47:5678'; // Replace with your n8n instance
    private readonly apiKey = 'your-n8n-api-key'; // Replace with your actual API key

    static currentUser = {};

    async getFlowChart(rqId: string, chartId: string): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );

            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async getAllChart(loader: string): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/GetGraphData`;
        const payload = {
            loader: loader,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );

            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async getFlowChartTemplate(rqId: string, chartId: string): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );

            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async CreateFlowChart(tId: string, c: any): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/InitProcess`;
        const payload = {
            templateId: tId,
            content: c
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );
            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async getNodeSchema(rqId: string, loader: string): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            schemaId: loader,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );

            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async triggerFormAction(rqId: string, data: any, sender: any): Promise<any> {
        const url =  `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            data: data,
        }
        const header = {
            headers: {
              'x-user-id': sender.employeeCode,
              'Content-Type': 'application/json'
            }
          }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload, header)
            );
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async getRowGraphData(rqId: string, loader: string, data: any, sender: any): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            loader: loader,
            data: data,
        }
        const header = {
            headers: {
              'x-user-id': sender.name,
              'Content-Type': 'application/json'
            }
          }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload, header)
            );
            // console.log("GOTTEN:");
            // console.log(response.data);
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async instanceGraph(loader: string, sender: any, data?: any){
        const url = `http://13.212.177.47:5678/webhook/instance-graph`;
        const payload = {
            loader: loader,
            data: data,
        }
        const header = {
            headers: {
              'x-user-id': sender.employeeCode,
              'Content-Type': 'application/json'
            }
          }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload, header)
            );
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async requestData(rqId: string, loader: string, sender?: any, data?: any){
        const url = `http://13.212.177.47:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            loader: loader,
            data: data
        }
        const header = {
            headers: {
              'x-user-id': sender.employeeCode,
              'Content-Type': 'application/json'
            }
          }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload, header)
            );
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async activateWorkflow(workflowId: string, sender: any): Promise<any> {
        const url = `${this.n8nBaseUrl}/rest/workflows/${workflowId}/activate`;
        try {
          const response = await firstValueFrom(
            this.httpService.post(url, null, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            }),
          );
          return {
            success: true,
            data: response.data,
            status: response.status,
          };
        } catch (error) {
          return {
            success: false,
            message: error?.response?.data || 'Activation failed',
            status: error?.response?.status || 500,
          };
        }
      }

      async deactivateWorkflow(workflowId: string, sender: any): Promise<any> {
        const url = `${this.n8nBaseUrl}/rest/workflows/${workflowId}/deactivate`;
    
        try {
          const response = await firstValueFrom(
            this.httpService.post(url, null, {
              headers: { Authorization: `Bearer ${this.apiKey}` },
            }),
          );
          return {
            success: true,
            data: response.data,
            status: response.status,
          };
        } catch (error) {
          return {
            success: false,
            message: error?.response?.data || 'Deactivation failed',
            status: error?.response?.status || 500,
          };
        }
      }
}

