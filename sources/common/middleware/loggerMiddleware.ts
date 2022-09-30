export function loggerMiddleware(req: any, res: any, next: any) {
    console.log();
    console.log(req.originalUrl);

    next();
}
