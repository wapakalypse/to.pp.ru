import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Render } from '@nestjs/common';
import { join } from 'path';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.render(join(__dirname, '/../../../views/partials/404.hbs'));
    }
}