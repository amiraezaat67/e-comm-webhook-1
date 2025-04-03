


import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class CategoryResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((data) => {
                if (data?.result && Array.isArray(data.result)) {
                    data.result = data.result.map((categoryObject) => {
                        if (categoryObject.refToCategoryId) {
                            categoryObject.categoryData = categoryObject.refToCategoryId;
                            delete categoryObject.refToCategoryId;
                        }
                        return categoryObject;
                    });
                }
                return data;
            }),
        );
    }
}
