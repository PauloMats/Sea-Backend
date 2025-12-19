import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global() permite que você não precise importar o PrismaModule 
// em cada módulo individualmente, mas é boa prática importar explicitamente
// se preferir arquitetura estrita. Aqui deixei Global para facilitar.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}