import * as winston from 'winston';
import { format, transports } from 'winston';
import { CONSTANTS } from './config';

export default class Logger
{
    name: string;

    private _logger: winston.Logger;
    private _date: string = new Date().toISOString();

    // This needs weird code to have uppercase level for some reason, even though the GitHub issue is closed
    // https://github.com/winstonjs/winston/issues/1345
    format: winston.Logform.Format = format.combine(
        format(info =>
        {
            info.level = info.level.toUpperCase()
            return info;
        })(),
        format.colorize(),
        format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
        format.printf(info => `[${info.timestamp}] [${this.name}] [${info.level}] ${info.message}`)
    );

    transports: winston.transport[] = [
        new transports.Console(),
        new transports.File({
            filename: `logs/${this._date}.log`,
            options: { flags: "w" },
            format: format.uncolorize()
        }),
        new transports.File({
            filename: `logs/${this._date}.json`,
            options: { flags: "w" },
            format: format.json()
        }),
        new transports.File({
            filename: "logs/latest.log",
            options: { flags: "w" },
            format: format.uncolorize()
        })
    ];

    constructor(name: string, options?: winston.LoggerOptions)
    {
        this._logger = winston.createLogger(options || { transports: this.transports, format: this.format, level: CONSTANTS.logLevel });
        this.name = name;
    }

    debug(message: string, ...args: any[])
    {
        this._logger.debug(message, ...args);
    }

    verbose(message: string, ...args: any[])
    {
        this._logger.verbose(message, ...args);
    }

    info(message: string, ...args: any[])
    {
        this._logger.info(message, ...args);
    }

    warn(message: string, ...args: any[])
    {
        this._logger.warn(message, ...args);
    }

    error(message: string, ...args: any[])
    {
        this._logger.error(message, ...args);
    }
}
