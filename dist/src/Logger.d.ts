import winston from 'winston';
export declare function getLogger(name: string): {
    debug(msg: any): winston.Logger;
    info(msg: any): winston.Logger;
    warn(msg: any): winston.Logger;
    error(msg: any): winston.Logger;
    fatal(msg: any): winston.Logger;
};
