import {
  AudioModelUncheckedCreateInput,
  LLMModelUncheckedCreateInput,
  UpstreamConfigUncheckedCreateInput,
} from '@prisma-main-client/models';
import { PrismaClient, UpstreamProvider } from '../generated/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

enum PriceUnit {
  KILO,
  MILLION,
}

const prisma = new PrismaClient();

const getPrice = (price: number, unit: PriceUnit = PriceUnit.MILLION) => {
  switch (unit) {
    case PriceUnit.KILO:
      return new Decimal(price).mul(1000);
    case PriceUnit.MILLION:
      return new Decimal(price);
    default:
      throw new Error();
  }
};

const aiModels: LLMModelUncheckedCreateInput[] = [
  {
    name: 'gpt-4o-mini',
    inputPrice: getPrice(0.15, PriceUnit.MILLION), // $0.15 per 1M tokens
    outputPrice: getPrice(0.6, PriceUnit.MILLION), // $0.60 per 1M tokens
    releaseDate: new Date(),
    description: '',
  },
  {
    name: 'gpt-4.1',
    inputPrice: getPrice(2, PriceUnit.MILLION), // $0.15 per 1M tokens
    outputPrice: getPrice(4, PriceUnit.MILLION), // $0.60 per 1M tokens
    releaseDate: new Date(),
    description: '',
  },
  {
    name: 'deepseek-r1',
    inputPrice: getPrice(1, PriceUnit.MILLION), // $1.00 per 1M tokens
    outputPrice: getPrice(3, PriceUnit.MILLION), // $3.00 per 1M tokens
    releaseDate: new Date(),
    description: '',
  },
];

const upstreamConfigs: UpstreamConfigUncheckedCreateInput[] = [
  {
    name: 'openai-next-error-apikey',
    weight: 20,
    baseUrl: 'https://api.openai-next.com',
    apiKey: 'sk-1234567890',
    type: UpstreamProvider.OPENAI,
  },
  {
    name: 'openai-next-ok',
    weight: 10,
    baseUrl: 'https://api.openai-next.com',
    apiKey: 'sk-muHpR82P4qyo8Frq0cCf8593C2Af448bA2CaE0143a169d39',
    type: UpstreamProvider.OPENAI,
  },
  {
    name: 'test-upstream',
    weight: 30,
    baseUrl: 'https://api.test-upstream.com',
    apiKey: 'sk-1234567890',
    type: UpstreamProvider.OPENAI,
  },
  {
    name: 'fish-audio-upstream',
    weight: 30,
    baseUrl: 'https://api.fish.audio',
    apiKey: '08701ed676144e30847046ef5e708d28',
    type: UpstreamProvider.FISH_AUDIO,
  },
];

const audioModels: AudioModelUncheckedCreateInput[] = [
  {
    name: 'fish-audio-speech-1.5',
    provider: UpstreamProvider.FISH_AUDIO,
    description: '',
    pricePerMillionBytes: new Decimal(15),
  },
  {
    name: 'fish-audio-speech-1.6',
    provider: UpstreamProvider.FISH_AUDIO,
    description: '',
    pricePerMillionBytes: new Decimal(15),
  },
  {
    name: 'fish-audio-s1',
    provider: UpstreamProvider.FISH_AUDIO,
    description: '',
    pricePerMillionBytes: new Decimal(15),
  },
  {
    name: 'fish-audio-transcribe-1',
    provider: UpstreamProvider.FISH_AUDIO,
    description: '',
    pricePerHour: new Decimal(0.36),
  },
];

async function main() {
  await Promise.all([
    aiModels.map(async (aiModel, index) => {
      console.log(`🔄 AI Model ${index + 1}/${aiModels.length}`);
      await prisma.lLMModel.upsert({
        where: { name: aiModel.name },
        update: aiModel,
        create: aiModel,
      });
    }),

    audioModels.map(async (audioModel, index) => {
      console.log(`🔄 Audio Model ${index + 1}/${audioModels.length}`);
      await prisma.audioModel.upsert({
        where: { name: audioModel.name },
        update: audioModel,
        create: audioModel,
      });
    }),

    upstreamConfigs.map(async (upstreamConfig, index) => {
      console.log(`🔄 Upstream Config ${index + 1}/${upstreamConfigs.length}`);
      await prisma.upstreamConfig.upsert({
        where: { name: upstreamConfig.name },
        update: upstreamConfig,
        create: upstreamConfig,
      });
    }),
  ]);

  console.log('✅ Seed data created successfully');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e.message);
    console.error(e.stack);
    await prisma.$disconnect();
    process.exit(1);
  });
