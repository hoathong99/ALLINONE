import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FormService {
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
    //     return this.configService.get<string>('N8N_BASE_URL', 'http://13.212.177.47:5678');
    // }

    async SubmitFormData(data: any, parentId: string, graphId: string, sender: any): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/saveSubmission`;
        const payload = {
            parentId: parentId,
            data: data,
            graphId: graphId
        }
        const header = {
            headers: {
              'x-user-id': sender?.name,
              'Content-Type': 'application/json'
            }
          }
        try {
            const response = await firstValueFrom(
                this.httpService.post(url, payload,header)
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

    async GetLatestSubmission(parentId: string): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/GetLatestSubmit`;
        const payload = {
            data: parentId,
        }
        console.log(payload);
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

    async DeleteSubmission(Id: string): Promise<any> {
        const url = `${this.n8nBaseUrl}/webhook/DeleteSubmission`;
        const payload = {
            data: Id,
        }
        console.log(payload);
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

    async GetAllSubmission(loader: string): Promise<any> {
        console.log("---------------------------GetSubmission----------------------------------")
        const url = `${this.n8nBaseUrl}/webhook/GetAllSubmit`;
        const payload = {
            data: loader,
        }
        console.log(payload);
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

    async GetSubmissionByLoader(loader: string): Promise<any> {
        console.log("---------------------------GetSubmission----------------------------------")
        const url = `${this.n8nBaseUrl}/webhook/GetSubmitByLoader`;
        const payload = {
            data: loader,
        }
        console.log(payload);
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

    async GetAllEmployee(loader: string): Promise<any> {
        console.log("---------------------------GetSubmission----------------------------------")
        const url = `${this.n8nBaseUrl}/webhook/GetAllEmployee`;
        const payload = {
            data: loader,
        }
        console.log(payload);
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

    async GenerateFormSchema(html: string, desc: string): Promise<any> {
        console.log("---------------------------GenerateFormSchema----------------------------------")
        const url = `${this.n8nBaseUrl}/webhook/generateSchema`;
        const payload = {
            html: html,
            describe: desc
        }
        console.log(payload);
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
}

