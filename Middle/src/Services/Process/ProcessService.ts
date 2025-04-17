import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProcessService {
    constructor(private readonly httpService: HttpService) { }

    // async GetFlowChart(rqId: string, chartId: string): Promise<any> {
    //     const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
    //     try {
    //         const response = await this.httpService.post(url, chartId);
    //         console.log(response);
    //         return response;
    //     } catch (error: unknown) {
    //         if (error && typeof error === 'object' && 'isAxiosError' in error) {
    //             const axiosError = error as AxiosError;

    //             const status = axiosError.response?.status || 500;
    //             const message = axiosError.response?.data || 'External API Error';

    //             console.error('Axios Error:', message);

    //             throw new HttpException(
    //                 {
    //                     statusCode: status,
    //                     message: 'Failed to call external API',
    //                     error: message,
    //                 },
    //                 status
    //             );
    //         }
    //     }
    // }

    async getFlowChart(rqId: string, chartId: string): Promise<any> {
        const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
        const payload = {
            graphId: chartId,
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );

            console.log("GOTTEN:");
            console.log(response.data);
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

            console.log("GOTTEN:");
            console.log(response.data);
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

            console.log("GOTTEN:");
            console.log(response.data);
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
        const url = `http://localhost:5678/webhook-test/InitProcess`;
        const payload = {
            templateId: tId,
            content: c
        }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload)
            );
            console.log("GOTTEN:");
            console.log(response.data);
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
        const url = `http://localhost:5678/webhook/${encodeURIComponent(loader)}`;
        // const payload = {
        //     schemaId: Id,
        // }
        try {
            const response = await firstValueFrom(
                this.httpService.get(url)
            );

            console.log("GOTTEN:");
            console.log(response.data);
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

