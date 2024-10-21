import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Price Monitoring API')
    .setDescription('APIs for monitoring Ethereum and Polygon prices, setting alerts, and checking price changes.')
    .setVersion('1.0')
    .addTag('Price Monitoring')  // Group the APIs under the 'Price Monitoring' tag
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // Set up Swagger UI at the /api route
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
