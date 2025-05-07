import { HttpService } from '@nestjs/axios';
import { Body, HttpException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, retry } from 'rxjs';

@Injectable()
export class FormService {
    constructor(private readonly httpService: HttpService) { }

    async SubmitFormData(data: any, parentId: string, graphId: string, sender: any): Promise<any> {
        const url = `http://13.212.177.47:5678/webhook/saveSubmission`;
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
        const url = `http://13.212.177.47:5678/webhook/GetLatestSubmit`;
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
        const url = `http://13.212.177.47:5678/webhook/DeleteSubmission`;
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
        const url = `http://13.212.177.47:5678/webhook/GetAllSubmit`;
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
        const url = `http://13.212.177.47:5678/webhook/GetSubmitByLoader`;
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
        const url = `http://13.212.177.47:5678//webhook/GetAllEmployee`;
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
        const url = `http://13.212.177.47:5678/webhook/generateSchema`;
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

