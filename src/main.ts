import morgan from 'morgan';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { GlobalFilter }
from './common/filters/http.filter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(
  new GlobalFilter(),
);

  app.use(
  morgan('combined'),
);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Vybe Driver Allocation')
    .setDescription('Ride Allocation APIs')
    .setVersion('1.0')
    .build();

  const document =
    SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(
    'api-docs',
    app,
    document,
  );

  await app.listen(
    process.env.PORT || 3000,
  );

  console.log(
    `Application Running`
  );
}

bootstrap();