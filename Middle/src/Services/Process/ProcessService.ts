import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProcessService {
    constructor(private readonly httpService: HttpService) { }

    static currentUser = {};

    async getFlowChart(rqId: string, chartId: string): Promise<any> {
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
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
        const url = `http://localhost:5678/webhook/GetGraphData`;
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
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
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
        const url = `http://localhost:5678/webhook/InitProcess`;
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
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
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
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
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

    async getRowGraphData(rqId: string, loader: string, data: any, sender: any): Promise<any> {
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
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
        const url = `http://localhost:5678/webhook/instance-graph`;
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
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
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
}

