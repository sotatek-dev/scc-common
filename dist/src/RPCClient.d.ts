import { AxiosRequestConfig } from 'axios';
interface IRpcConfig {
    protocol: string;
    host: string;
    port: string;
    user: string;
    pass: string;
}
export declare class RPCClient {
    protected _config: IRpcConfig;
    constructor(config: IRpcConfig);
    call<T>(method: string, params?: any[], id?: number | string): Promise<T>;
    protected _getEndpoint(): string;
    protected _getRequestConfig(): AxiosRequestConfig;
}
export default RPCClient;
