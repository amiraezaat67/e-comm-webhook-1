import { BadRequestException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { iif, map, Observable, retry } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                console.log(data);
                
                // This for success responses
                if (data && !data.name) {

                    const response = {
                        success: true,
                        timestamp: new Date().toISOString()
                    }

                    if (data.statusCode) {
                        response['statusCode'] = data.statusCode
                        delete data.statusCode
                        response['data'] = data
                    } else {
                        response['statusCode'] = context.switchToHttp().getResponse().statusCode
                        response['data'] = data
                    }

                    return response
                }

                // This for exception errors
                return data.response || data
            }),
        );
    }
}

@Injectable()
export class MeasurementInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const url = context.switchToHttp().getRequest().url;
        const method = context.switchToHttp().getRequest().method;

        const startTime = new Date().getTime() / 1000;
        console.log(`Request received at  url: ${url} method: ${method} ..... `, startTime);

        return next.handle().pipe(
            map((data) => {
                const EndTime = new Date().getTime() / 1000;

                console.log(`Response sent at url: ${url} method: ${method} ..... `, EndTime);
                console.log(`The time taken to process the url: ${url} method: ${method} ..... is `, Number(EndTime - startTime).toFixed(2));

                return data;
            })
        )
    }
}    
