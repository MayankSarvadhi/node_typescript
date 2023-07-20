import { logger } from "../logger/logger";
import { ErrorType } from "../utils/ErrorType";
import { Response, Request, NextFunction } from "express";

function GenerateCustomError(err: any, statusCode: number, res: Response) {
    const ErrorObj = { statusCode, message: err.message};
    return res.status(statusCode).send(ErrorObj);
}

export function ErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    
    switch (err.ErrorName) {
        case ErrorType.Forbidden:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 403, res);
            break;

        case ErrorType.conflict:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 409, res);
            break;

        case ErrorType.invalid_request:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 400, res);
            break;

        case ErrorType.not_found:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 404, res);
            break;

        case ErrorType.unauthorized:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 401, res);
            break;

        case (ErrorType.validation_error):
            logger('error', `${err.message}`);
            GenerateCustomError(err, 400, res);
            break;

        default:
            logger('error', `${err.message}`);
            GenerateCustomError(err, 500, res);
            break;
    }
}

