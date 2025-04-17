import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, retry } from 'rxjs';

@Injectable()
export class FormService {
    constructor(private readonly httpService: HttpService) { }

    // async SubmitFormData(formData: string, chartId: string): Promise<any> {
    //     const url = `http://localhost:5678/webhook/${encodeURIComponent(rqId)}`;
    //     try {
    //         const response = await this.httpService.post(url, chartId);
    //         console.log(response);
    //         return response;
    //     } catch (error: unknown) {
    //         // 👇 Check if the error is an AxiosError
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

    async SubmitFormData(data: any, id: string): Promise<any> {
        console.log("---------------------------SubmitFormData----------------------------------")
        const url = `http://localhost:5678/webhook/formsubmit`;
        const payload = {
            parent: id,
            data: data,
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

    async GetLatestSubmission(parentId: string): Promise<any> {
        const url = `http://localhost:5678/webhook/GetLatestSubmit`;
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
        const url = `http://localhost:5678/webhook/DeleteSubmission`;
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
        const url = `http://localhost:5678/webhook/GetAllSubmit`;
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
        const url = `http://localhost:5678/webhook/GetAllEmployee`;
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
        const url = `http://localhost:5678/webhook/generateSchema`;
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

