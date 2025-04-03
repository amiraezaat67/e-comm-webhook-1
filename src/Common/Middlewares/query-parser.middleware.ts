import { NextFunction, Request, Response } from "express";
import * as qs from 'qs'

export const RequestQueryParser = (req: Request, res: Response, next: NextFunction) => {
    req['parsedQuery'] = Object.assign({}, qs.parse(req.query));
    next();
}