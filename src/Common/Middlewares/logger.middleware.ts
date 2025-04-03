import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// export function logger(req: Request, res: Response, next: NextFunction) {
//     console.log(`Request log from loggerMiddleware...`);
//     next();
// };


@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log(`Request log from loggerMiddleware...`);
        next();
    }
}