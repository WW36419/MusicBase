import { HttpInterceptorFn } from "@angular/common/http";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    if (typeof window !== 'undefined') {
        const token = localStorage!.getItem('token');

        if (token) {
            const authReq = req.clone({
                setHeaders: {
                'x-auth-token': `Bearer ${token}`
                }
            });
            return next(authReq);
        } 
    }
    return next(req);
}