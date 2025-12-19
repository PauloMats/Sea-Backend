import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Req, 
  HttpCode, 
  HttpStatus,
  ParseArrayPipe 
} from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { CreateCheckinDto } from './dto/create-checkin.dto';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; 

@Controller('tracking')
// @UseGuards(JwtAuthGuard) // Descomentar quando tiver o Auth Module pronto
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * Recebe dados do Wearable.
   * Rota: POST /tracking/biometric
   * Body: Array de objetos CreateBiometricDto
   */
  @Post('biometric')
  @HttpCode(HttpStatus.OK) // Retorna 200 em vez de 201 (padrão do POST) pois é só sincronização
  async syncBiometrics(
    @Req() req: any,
    // ParseArrayPipe valida que o body é um Array e valida cada item dentro dele
    @Body(new ParseArrayPipe({ items: CreateBiometricDto })) data: CreateBiometricDto[],
  ) {
    // No futuro, pegaremos o ID do token JWT: const userId = req.user.id;
    // Por enquanto, simulamos um ID fixo para testes se não houver Auth
    const userId = req.user?.id || 'simulated-patient-uuid'; 
    
    return this.trackingService.processBiometricData(userId, data);
  }

  /**
   * Recebe o diário do paciente.
   * Rota: POST /tracking/checkin
   */
  @Post('checkin')
  async createCheckin(
    @Req() req: any,
    @Body() createCheckinDto: CreateCheckinDto
  ) {
    const userId = req.user?.id || 'simulated-patient-uuid';
    
    return this.trackingService.createDailyCheckin(userId, createCheckinDto);
  }
}