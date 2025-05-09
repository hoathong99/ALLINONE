import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProcessService {
    private n8nBaseUrl;
    private apiKey;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.n8nBaseUrl = process.env.VITE_N8N_URL;
        console.log("n8n", process.env.VITE_N8N_URL)
        this.apiKey = process.env.GOOGLE_CLIENT_ID;
        console.log("apiKey", process.env.GOOGLE_CLIENT_ID)
     }

    // private get n8nBaseUrl(): string {
    //     return this.configService.get<string>('n8nUrl', 'http://13.212.177.47:5678');
    // }
    // n8nBaseUrl = process.env.N8N_BASE_URL;
    
    // private get apiKey(): string {
    //     return this.configService.get<string>('N8N_API_KEY', 'your-n8n-api-key');
    // }

    static currentUser = {};

    async getFlowChart(rqId: string, chartId: string): Promise<any> {
        
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
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

    async getAllChart(loader: string): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/GetGraphData`;
        const payload = {
            loader: loader,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
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

    async getFlowChartTemplate(rqId: string, chartId: string): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
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

    async CreateFlowChart(tId: string, c: any): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/InitProcess`;
        const payload = {
            templateId: tId,
            content: c
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
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

    async getNodeSchema(rqId: string, loader: string): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            schemaId: loader,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
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

    async triggerFormAction(rqId: string, data: any, sender: any): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
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
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
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
            return response.data;
        } catch (error: any) {
            console.error('FetchData error:', error?.response?.data || error.message);
            throw new HttpException(
                error?.response?.data || 'External API error',
                error?.response?.status || 500,
            );
        }
    }

    async instanceGraph(loader: string, sender?: any, data?: any){
        if(!data){
            data = null;
        }
        if(!sender){
            sender = {
                employeeCode:null
            }
        }
        const url = `${this.n8nBaseUrl}/webhook/instance-graph`;
        console.log("instanceGraph url", url);
        console.log("sender",sender);
        const payload = {
            loader: loader,
            data: data,
        };
        console.log("payload",payload);
        const header = {
            headers: {
              'x-user-id': sender.employeeCode,
              'Content-Type': 'application/json'
            }
          };
        try {
            console.log("header",header);
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
        const url = `${this.n8nBaseUrl}/webhook/${encodeURIComponent(rqId)}`;
        console.log("requestData",url);
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

