import axios, { AxiosInstance } from 'axios';
import { getSession } from 'next-auth/react';
import qs from 'qs';

const host = process.env.NEXT_PUBLIC_API_HOST!;

const axiosInstance: AxiosInstance = axios.create({
    baseURL: host,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add an interceptor to set the Authorization header with the token on each request
axiosInstance.interceptors.request.use(
    async (config) => {
        const session = await getSession()
        
        if (session && session?.backendTokens?.accessToken) {
            config.headers.Authorization = `Bearer ${session.backendTokens.accessToken}`;
        }

        return config;
    },
    // (error) => Promise.reject(error),
    (error) => {
        console.error('Request interceptor error:', error.message);
        return Promise.reject(error);
      }
);

export class BaseService<T> {
    protected endpoint: string;
    protected axios: AxiosInstance;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
        this.axios = axiosInstance;
    }

    async create(values: T) {
        const response = await this.axios.post(`${this.endpoint}`, values);
        return response.data;
    }

    async update(id: string, values: Partial<T>) {
        const { id: _, ...rest } = values as any;
        const response = await this.axios.put(`${this.endpoint}/${id}`, rest);
        return response.data;
    }

    async list(query?: any) {

        let queryString = ''
        if (query) {
            queryString = qs.stringify(query, { encode: true })
        }

        const response = await this.axios.get(`${this.endpoint}${queryString ? '?' + queryString : ''}`);
        return response.data;
    }

    async delete(id: string) {
        const response = await this.axios.delete(`${this.endpoint}/${id}`);
        return response.data;
    }

    async get(id: string) {
        const response = await this.axios.get(`${this.endpoint}/${id}`);
        return response.data;
    }

    // setURI(query: any): string {
    //     return qs.stringify(query, { encode: true })
    // }
}
