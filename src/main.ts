import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ATIVAR CORS
  // Permite que seu frontend (futuro) acesse esta API
  app.enableCors();

  // 2. ATIVAR VALIDAÇÃO GLOBAL (Crucial para os DTOs)
  // Se o frontend mandar dados errados, o Nest rejeita automaticamente antes de chegar no Controller
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // Converte tipos automaticamente (ex: string "10" vira number 10)
    whitelist: true, // Remove campos que não estão no DTO (limpa o lixo)
    forbidNonWhitelisted: true, // Dá erro se enviar campos não permitidos
  }));

  // 3. CONFIGURAÇÃO DO SWAGGER
  const config = new DocumentBuilder()
    .setTitle('SEA API - Saúde Emocional')
    .setDescription('API para monitoramento de saúde mental, integração com wearables e diários emocionais.')
    .setVersion('1.0')
    .addTag('tracking', 'Endpoints de coleta de dados biométricos e diários')
    .addBearerAuth() // Prepara para futura autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  // O Swagger ficará disponível em: http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  // Inicia o servidor
  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Application is running on: http://localhost:3000/api`);
}
bootstrap();