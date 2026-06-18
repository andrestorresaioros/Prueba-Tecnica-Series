"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const prisma_exception_filter_1 = require("./common/filters/prisma-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin) => origin.trim()) ?? true;
    app.enableCors({ origin: allowedOrigins });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalFilters(new prisma_exception_filter_1.PrismaExceptionFilter());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('OATI TV Series API')
        .setDescription('API REST para registrar series de televisión y directores con relación muchos a muchos.')
        .setVersion('1.0.0')
        .addTag('series')
        .addTag('directors')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = Number(process.env.PORT ?? 3000);
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map