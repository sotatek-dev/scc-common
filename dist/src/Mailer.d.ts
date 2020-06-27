export interface IMailerOptions {
    from?: string;
    to: string;
    cc?: string;
    bcc?: string;
    subject: string;
    content: string;
    returnPath?: string;
}
export declare class Mailer {
    static getInstance(): Mailer;
    private from?;
    private options;
    private transporter;
    constructor();
    getOptions(): any;
    sendMail(options: IMailerOptions): Promise<any>;
    private config;
}
