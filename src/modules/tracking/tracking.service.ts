import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBiometricDto } from './dto/create-biometric.dto';
import { CreateCheckinDto } from './dto/create-checkin.dto';

@Injectable()
export class TrackingService {
  private readonly logger = new Logger(TrackingService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Recebe um lote de dados biométricos do Wearable
   * O App pode enviar um array de medições para economizar bateria/rede
   */
  async processBiometricData(patientId: string, data: CreateBiometricDto[]) {
    // 1. Busca o perfil do paciente para garantir que existe
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId: patientId }, // Assumindo que o ID vindo do Auth é o userId
    });

    if (!patient) {
      throw new Error('Patient profile not found');
    }

    // 2. Prepara os dados para inserção em massa (createMany é mais performático)
    const entries = data.map((entry) => ({
      patientId: patient.id,
      timestamp: new Date(entry.timestamp),
      heartRateAvg: entry.heartRateAvg,
      heartRateMax: entry.heartRateMax,
      stepCount: entry.stepCount,
      sleepMinutes: entry.sleepMinutes,
      stressLevel: entry.stressLevel,
      rawData: entry.rawData || {}, // Salva o JSON bruto se houver
    }));

    // 3. Salva no banco
    const result = await this.prisma.biometricEntry.createMany({
      data: entries,
      skipDuplicates: true, // Evita duplicar se o relógio reenviar o mesmo dado
    });

    this.logger.log(`Saved ${result.count} biometric entries for patient ${patient.id}`);

    // 4. (Futuro) Gatilho para verificação de alertas
    // await this.checkRiskPatterns(patient.id);

    return { success: true, count: result.count };
  }

  /**
   * Salva o diário do paciente e chama a IA para resumir (Simulado)
   */
  async createDailyCheckin(userId: string, data: CreateCheckinDto) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patient) {
      throw new Error('Patient profile not found');
    }


    return this.prisma.dailyCheckin.create({
      data: {
        patientId: patient.id,
        mood: data.mood,
        tags: data.tags,
        note: data.note,
        // audioUrl seria processado via upload antes
      },
    });
  }

  private async mockAnalyzeSentiment(text: string, mood: string): Promise<string> {
    // Aqui entraria a chamada para OpenAI/Gemini
    return `O paciente relata sentimentos compatíveis com humor ${mood}. Texto foca em cansaço.`;
  }
}